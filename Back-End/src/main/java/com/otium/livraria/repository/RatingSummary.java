package com.otium.livraria.repository;

import java.util.UUID;

/** Projeção com média e quantidade de avaliações por livro. */
public interface RatingSummary {

    UUID getBookId();

    Double getAverage();

    Long getTotal();
}
