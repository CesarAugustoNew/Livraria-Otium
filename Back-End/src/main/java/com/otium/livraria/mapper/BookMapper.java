package com.otium.livraria.mapper;

import com.otium.livraria.dto.BookDetailResponse;
import com.otium.livraria.dto.BookSummaryResponse;
import com.otium.livraria.dto.CategoryResponse;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.Category;
import com.otium.livraria.repository.RatingSummary;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public BookSummaryResponse toSummary(Book book, RatingSummary rating) {
        return new BookSummaryResponse(
                book.getId(), book.getTitle(), book.getSlug(), book.getCoverUrl(), book.getPrice(),
                book.getOriginalPrice(), book.getDiscountPercent(),
                book.isAvailable(), book.isRelease(), authorNames(book),
                average(rating), total(rating));
    }

    public BookDetailResponse toDetail(Book book, RatingSummary rating) {
        return new BookDetailResponse(
                book.getId(), book.getTitle(), book.getSlug(), book.getIsbn(), book.getDescription(),
                book.getCoverUrl(), book.getPrice(), book.getOriginalPrice(), book.getDiscountPercent(),
                book.getStockQuantity(), book.isAvailable(), book.isRelease(),
                book.getPages(), book.getPublisher(), book.getPublishedAt(),
                book.getLanguage(), book.getEdition(), book.getDimensions(), summaryLines(book),
                toCategory(book.getCategory()), authorNames(book), average(rating), total(rating));
    }

    private List<String> summaryLines(Book book) {
        String raw = book.getSummary();
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split("\\R")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    public CategoryResponse toCategory(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug());
    }

    private List<String> authorNames(Book book) {
        return book.getAuthors().stream().map(link -> link.getAuthor().getName()).toList();
    }

    private double average(RatingSummary r) {
        return r == null || r.getAverage() == null ? 0 : Math.round(r.getAverage() * 10.0) / 10.0;
    }

    private long total(RatingSummary r) {
        return r == null || r.getTotal() == null ? 0 : r.getTotal();
    }
}
