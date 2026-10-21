package com.otium.livraria.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Listas vazias ou nulas significam "sem filtro". Dentro de um mesmo grupo vale OU; entre grupos vale E. */
public record BookFilter(
        String title,
        List<UUID> categoryIds,
        List<UUID> authorIds,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Boolean available,
        Boolean release) {
}
