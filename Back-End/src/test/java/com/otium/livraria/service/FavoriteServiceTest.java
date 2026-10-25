package com.otium.livraria.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.otium.livraria.dto.BookSummaryResponse;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.Favorite;
import com.otium.livraria.entity.User;
import com.otium.livraria.exception.ResourceNotFoundException;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.FavoriteRepository;
import com.otium.livraria.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class FavoriteServiceTest {

    private static final String EMAIL = "leitor@otium.com";
    private static final UUID BOOK_ID = UUID.randomUUID();

    @Mock
    private FavoriteRepository favorites;
    @Mock
    private UserRepository users;
    @Mock
    private BookRepository books;
    @Mock
    private BookService bookService;

    private FavoriteService service;
    private final User user = new User();
    private final Book book = new Book();

    @BeforeEach
    void setUp() {
        service = new FavoriteService(favorites, users, books, bookService);
        user.setEmail(EMAIL);
        book.setTitle("Vidas secas");
        book.setPrice(new BigDecimal("45.90"));
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(books.findByIdAndActiveTrue(BOOK_ID)).thenReturn(Optional.of(book));
    }

    @Test
    void favoritarGravaOVinculoEntreUsuarioELivro() {
        when(favorites.existsByUserEmailAndBookId(EMAIL, BOOK_ID)).thenReturn(false);

        service.add(EMAIL, BOOK_ID);

        ArgumentCaptor<Favorite> saved = ArgumentCaptor.forClass(Favorite.class);
        verify(favorites).save(saved.capture());
        assertThat(saved.getValue().getUser()).isSameAs(user);
        assertThat(saved.getValue().getBook()).isSameAs(book);
    }

    @Test
    void favoritarDeNovoNaoDuplica() {
        when(favorites.existsByUserEmailAndBookId(EMAIL, BOOK_ID)).thenReturn(true);

        service.add(EMAIL, BOOK_ID);

        verify(favorites, never()).save(any());
    }

    @Test
    void livroInexistenteResponde404() {
        UUID missing = UUID.randomUUID();
        when(books.findByIdAndActiveTrue(missing)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.add(EMAIL, missing)).isInstanceOf(ResourceNotFoundException.class);
        verify(favorites, never()).save(any());
    }

    @Test
    void desfavoritarRemoveSoODoUsuario() {
        service.remove(EMAIL, BOOK_ID);

        verify(favorites).deleteByUserEmailAndBookId(EMAIL, BOOK_ID);
    }

    @Test
    void listaOsLivrosNaOrdemDosFavoritos() {
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setBook(book);
        BookSummaryResponse summary = new BookSummaryResponse(BOOK_ID, "Vidas secas", "vidas-secas", null,
                new BigDecimal("45.90"), null, 0, true, false, List.of("Graciliano Ramos"), 0, 0);
        when(favorites.findByUserEmailOrderByCreatedAtDesc(EMAIL)).thenReturn(List.of(favorite));
        when(bookService.toSummaries(List.of(book))).thenReturn(List.of(summary));

        assertThat(service.list(EMAIL)).containsExactly(summary);
    }
}
