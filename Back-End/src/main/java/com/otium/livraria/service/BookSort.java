package com.otium.livraria.service;

import com.otium.livraria.exception.BusinessException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

/** Whitelist de ordenações aceitas: impede que o cliente ordene por propriedades arbitrárias. */
public enum BookSort {
    /** Padrão: lançamentos primeiro, depois os mais vendidos, depois os mais novos. */
    RELEVANCE(Sort.by(Direction.DESC, "release").and(Sort.by(Direction.DESC, "salesCount"))
            .and(Sort.by(Direction.DESC, "createdAt"))),
    BEST_SELLERS(Sort.by(Direction.DESC, "salesCount").and(Sort.by(Direction.DESC, "createdAt"))),
    NEWEST(Sort.by(Direction.DESC, "createdAt")),
    DISCOUNT(Sort.by(Direction.DESC, "discountPercent").and(Sort.by(Direction.DESC, "salesCount"))),
    PRICE_DESC(Sort.by(Direction.DESC, "price")),
    PRICE_ASC(Sort.by(Direction.ASC, "price")),
    TITLE_ASC(Sort.by(Direction.ASC, "title")),
    TITLE_DESC(Sort.by(Direction.DESC, "title"));

    private final Sort sort;

    BookSort(Sort sort) {
        this.sort = sort;
    }

    /** Desempate por id mantém a paginação estável. */
    public Sort toSort() {
        return sort.and(Sort.by("id"));
    }

    public static BookSort parse(String value) {
        if (value == null || value.isBlank()) {
            return RELEVANCE;
        }
        try {
            return valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Ordenação inválida. Use: relevance, best_sellers, newest, discount, "
                    + "price_desc, price_asc, title_asc ou title_desc.");
        }
    }
}
