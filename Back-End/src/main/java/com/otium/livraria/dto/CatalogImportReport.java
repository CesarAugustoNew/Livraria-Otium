package com.otium.livraria.dto;

import java.util.List;

/** Resultado de uma importação: livros novos, livros atualizados e ISBNs que a fonte externa não conhece. */
public record CatalogImportReport(int created, int updated, List<String> notFound) {
}
