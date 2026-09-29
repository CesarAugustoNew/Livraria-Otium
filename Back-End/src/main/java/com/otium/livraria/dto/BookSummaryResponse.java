package com.otium.livraria.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record BookSummaryResponse(
        UUID id,
        String title,
        String slug,
        String coverUrl,
        BigDecimal price,
        BigDecimal originalPrice,
        int discountPercent,
        boolean available,
        boolean release,
        List<String> authors,
        double averageRating,
        long reviewCount) {
}
