package com.otium.livraria.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record BookDetailResponse(
        UUID id,
        String title,
        String slug,
        String isbn,
        String description,
        String coverUrl,
        BigDecimal price,
        BigDecimal originalPrice,
        int discountPercent,
        int stockQuantity,
        boolean available,
        boolean release,
        Integer pages,
        String publisher,
        LocalDate publishedAt,
        String language,
        int edition,
        String dimensions,
        /** Uma linha por item do sumário (o front divide por quebra de linha). */
        List<String> summary,
        CategoryResponse category,
        List<String> authors,
        double averageRating,
        long reviewCount) {
}
