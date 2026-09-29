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
        CategoryResponse category,
        List<String> authors,
        double averageRating,
        long reviewCount) {
}
