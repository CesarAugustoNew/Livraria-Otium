package com.otium.livraria.integration;

import java.util.List;

/** Dados bibliográficos vindos de um catálogo externo. Não tem nada comercial (preço, estoque): isso é da loja. */
public record ExternalBook(
        String isbn,
        String title,
        List<String> authors,
        String publisher,
        Integer pages,
        Integer publishedYear,
        String coverUrl,
        String language,
        String description) {
}
