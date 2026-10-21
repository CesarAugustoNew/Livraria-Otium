package com.otium.livraria.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.otium.livraria.dto.CatalogImportReport;
import com.otium.livraria.entity.Author;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.BookAuthor;
import com.otium.livraria.exception.ExternalServiceException;
import com.otium.livraria.integration.BookMetadataProvider;
import com.otium.livraria.integration.ExternalBook;
import com.otium.livraria.repository.AuthorRepository;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.CategoryRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.transaction.PlatformTransactionManager;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CatalogImportServiceTest {

    private static final ExternalBook DOM_CASMURRO = new ExternalBook("111", "Dom Casmurro",
            List.of("Machado de Assis"), "Ática", 232, 2019, "https://covers/1-L.jpg", "Português", "Sinopse.");

    @Mock
    private BookMetadataProvider provider;
    @Mock
    private BookRepository books;
    @Mock
    private AuthorRepository authors;
    @Mock
    private CategoryRepository categories;

    private CatalogImportService service;

    @BeforeEach
    void setUp() {
        Map<String, List<String>> curated = new LinkedHashMap<>();
        curated.put("Literatura", List.of("111", "222"));
        service = new CatalogImportService(new CuratedCatalog(curated), provider, books, authors, categories,
                mock(PlatformTransactionManager.class));

        when(categories.findBySlug(anyString())).thenReturn(Optional.empty());
        when(categories.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(authors.findBySlug(anyString())).thenReturn(Optional.empty());
        when(authors.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(books.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(books.findByIsbn(anyString())).thenReturn(Optional.empty());
    }

    @Test
    void criaLivroComDadosDaApiEOfertaDaLojaEReportaIsbnsNaoEncontrados() {
        when(provider.findByIsbn(anyCollection())).thenReturn(Map.of("111", DOM_CASMURRO));

        CatalogImportReport report = service.importCatalog();

        assertThat(report.created()).isEqualTo(1);
        assertThat(report.updated()).isZero();
        assertThat(report.notFound()).containsExactly("222");

        ArgumentCaptor<Book> saved = ArgumentCaptor.forClass(Book.class);
        verify(books).save(saved.capture());
        Book book = saved.getValue();
        assertThat(book.getIsbn()).isEqualTo("111");
        assertThat(book.getTitle()).isEqualTo("Dom Casmurro");
        assertThat(book.getSlug()).isEqualTo("dom-casmurro");
        assertThat(book.getCoverUrl()).isEqualTo("https://covers/1-L.jpg");
        assertThat(book.getPublisher()).isEqualTo("Ática");
        assertThat(book.getPages()).isEqualTo(232);
        assertThat(book.getPublishedAt()).isEqualTo(LocalDate.of(2019, 1, 1));
        assertThat(book.getLanguage()).isEqualTo("Português");
        assertThat(book.getDescription()).isEqualTo("Sinopse.");
        assertThat(book.getCategory().getName()).isEqualTo("Literatura");
        assertThat(book.getAuthors()).extracting(link -> link.getAuthor().getName()).containsExactly("Machado de Assis");

        StorePricing.Offer offer = StorePricing.forIsbn("111");
        assertThat(book.getPrice()).isEqualByComparingTo(offer.price());
        assertThat(book.getStockQuantity()).isEqualTo(offer.stockQuantity());
    }

    @Test
    void reimportarAtualizaMetadadosMasPreservaPrecoEEstoqueDaLoja() {
        Author machado = new Author();
        machado.setName("Machado de Assis");
        machado.setSlug("machado-de-assis");
        Book existing = new Book();
        existing.setIsbn("111");
        existing.setTitle("Título antigo");
        existing.setSlug("titulo-antigo");
        existing.setPrice(new BigDecimal("10.00"));
        existing.setStockQuantity(3);
        existing.addAuthor(machado, 0);
        BookAuthor originalLink = existing.getAuthors().getFirst();

        when(books.findByIsbn("111")).thenReturn(Optional.of(existing));
        when(provider.findByIsbn(anyCollection())).thenReturn(Map.of("111", DOM_CASMURRO));

        CatalogImportReport report = service.importCatalog();

        assertThat(report.created()).isZero();
        assertThat(report.updated()).isEqualTo(1);
        assertThat(existing.getTitle()).isEqualTo("Dom Casmurro");
        assertThat(existing.getCoverUrl()).isEqualTo("https://covers/1-L.jpg");
        assertThat(existing.getPrice()).isEqualByComparingTo("10.00");
        assertThat(existing.getStockQuantity()).isEqualTo(3);
        // mesmos autores: o vínculo não é recriado (evita violar a unique de book_authors no flush)
        assertThat(existing.getAuthors()).containsExactly(originalLink);
    }

    @Test
    void slugJaUsadoPorOutroLivroRecebeOIsbnComoSufixo() {
        when(provider.findByIsbn(anyCollection())).thenReturn(Map.of("111", DOM_CASMURRO));
        when(books.existsBySlug("dom-casmurro")).thenReturn(true);

        service.importCatalog();

        ArgumentCaptor<Book> saved = ArgumentCaptor.forClass(Book.class);
        verify(books).save(saved.capture());
        assertThat(saved.getValue().getSlug()).isEqualTo("dom-casmurro-111");
    }

    @Test
    void falhaNaApiExternaNaoGravaNada() {
        when(provider.findByIsbn(anyCollection())).thenThrow(new ExternalServiceException("fora do ar", null));

        assertThatThrownBy(() -> service.importCatalog()).isInstanceOf(ExternalServiceException.class);
        verify(books, never()).save(any());
    }
}
