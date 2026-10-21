package com.otium.livraria.service;

import com.otium.livraria.dto.CatalogImportReport;
import com.otium.livraria.entity.Author;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.Category;
import com.otium.livraria.integration.BookMetadataProvider;
import com.otium.livraria.integration.ExternalBook;
import com.otium.livraria.repository.AuthorRepository;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.CategoryRepository;
import com.otium.livraria.util.SlugUtil;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Monta o catálogo: a lista curada diz QUAIS livros a loja vende, o {@link BookMetadataProvider} fornece os dados
 * bibliográficos e o {@link StorePricing} define a oferta. Idempotente: o ISBN é a chave, então reimportar atualiza.
 */
@Service
public class CatalogImportService {

    private static final Logger log = LoggerFactory.getLogger(CatalogImportService.class);

    private final CuratedCatalog curated;
    private final BookMetadataProvider provider;
    private final BookRepository books;
    private final AuthorRepository authors;
    private final CategoryRepository categories;
    private final TransactionTemplate tx;

    public CatalogImportService(CuratedCatalog curated, BookMetadataProvider provider, BookRepository books,
                                AuthorRepository authors, CategoryRepository categories,
                                PlatformTransactionManager txManager) {
        this.curated = curated;
        this.provider = provider;
        this.books = books;
        this.authors = authors;
        this.categories = categories;
        this.tx = new TransactionTemplate(txManager);
    }

    /** As chamadas HTTP acontecem antes e fora da transação: não seguramos conexão do banco esperando a rede. */
    public CatalogImportReport importCatalog() {
        Map<String, String> categoryByIsbn = curated.categoryByIsbn();
        Map<String, ExternalBook> found = provider.findByIsbn(categoryByIsbn.keySet());
        CatalogImportReport report = tx.execute(status -> persist(categoryByIsbn, found));
        log.info("Catálogo importado: {} novos, {} atualizados, não encontrados: {}",
                report.created(), report.updated(), report.notFound());
        return report;
    }

    private CatalogImportReport persist(Map<String, String> categoryByIsbn, Map<String, ExternalBook> found) {
        Map<String, Category> categoryCache = new HashMap<>();
        Map<String, Author> authorCache = new HashMap<>();
        int created = 0;
        int updated = 0;
        List<String> notFound = new ArrayList<>();

        for (Map.Entry<String, String> entry : categoryByIsbn.entrySet()) {
            ExternalBook data = found.get(entry.getKey());
            if (data == null || data.title() == null) {
                notFound.add(entry.getKey());
                continue;
            }
            Category category = categoryCache.computeIfAbsent(entry.getValue(), this::category);
            Optional<Book> existing = books.findByIsbn(data.isbn());

            Book book = existing.orElseGet(() -> newBook(data));
            applyMetadata(book, data, category);
            syncAuthors(book, data.authors(), authorCache);

            if (existing.isPresent()) {
                updated++; // entidade gerenciada: o dirty checking grava no commit
            } else {
                books.save(book);
                created++;
            }
        }
        return new CatalogImportReport(created, updated, notFound);
    }

    /** Preço e estoque só são definidos na criação: depois disso pertencem à loja e a reimportação não mexe. */
    private Book newBook(ExternalBook data) {
        StorePricing.Offer offer = StorePricing.forIsbn(data.isbn());
        Book book = new Book();
        book.setIsbn(data.isbn());
        book.setSlug(uniqueSlug(data));
        book.setPrice(offer.price());
        book.setOriginalPrice(offer.originalPrice());
        book.setStockQuantity(offer.stockQuantity());
        book.setRelease(offer.release());
        book.setSalesCount(offer.salesCount());
        return book;
    }

    private String uniqueSlug(ExternalBook data) {
        String slug = SlugUtil.slugify(data.title());
        return books.existsBySlug(slug) ? slug + "-" + data.isbn() : slug;
    }

    private void applyMetadata(Book book, ExternalBook data, Category category) {
        book.setTitle(data.title());
        book.setCoverUrl(data.coverUrl());
        book.setDescription(data.description());
        book.setPublisher(data.publisher());
        book.setPages(data.pages());
        book.setPublishedAt(data.publishedYear() == null ? null : LocalDate.of(data.publishedYear(), 1, 1));
        if (data.language() != null) {
            book.setLanguage(data.language());
        }
        book.setCategory(category);
    }

    /**
     * Só recria os vínculos se os autores mudaram. Ao recriar, apaga e grava os antigos primeiro: o Hibernate
     * executa INSERTs antes de DELETEs no flush e o mesmo autor violaria a unique (book_id, author_id).
     */
    private void syncAuthors(Book book, List<String> names, Map<String, Author> cache) {
        List<String> wanted = names.stream().map(SlugUtil::slugify).distinct().toList();
        List<String> current = book.getAuthors().stream().map(link -> link.getAuthor().getSlug()).toList();
        if (wanted.equals(current)) {
            return;
        }
        if (!book.getAuthors().isEmpty()) {
            book.getAuthors().clear();
            books.saveAndFlush(book);
        }
        int position = 0;
        for (String name : names) {
            String slug = SlugUtil.slugify(name);
            if (book.getAuthors().stream().anyMatch(link -> link.getAuthor().getSlug().equals(slug))) {
                continue; // mesmo autor com grafias diferentes ("Assis"/"Assís")
            }
            Author author = cache.computeIfAbsent(slug, s -> authors.findBySlug(s).orElseGet(() -> {
                Author a = new Author();
                a.setName(name);
                a.setSlug(s);
                return authors.save(a);
            }));
            book.addAuthor(author, position++);
        }
    }

    private Category category(String name) {
        String slug = SlugUtil.slugify(name);
        return categories.findBySlug(slug).orElseGet(() -> {
            Category c = new Category();
            c.setName(name);
            c.setSlug(slug);
            return categories.save(c);
        });
    }
}
