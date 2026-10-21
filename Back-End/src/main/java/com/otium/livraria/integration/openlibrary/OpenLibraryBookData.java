package com.otium.livraria.integration.openlibrary;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/** Campos usados de /api/books?jscmd=data: os dados de exibição, com autores já resolvidos pela obra. */
@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenLibraryBookData(
        String title,
        List<Named> authors,
        List<Named> publishers,
        @JsonProperty("number_of_pages") Integer numberOfPages,
        @JsonProperty("publish_date") String publishDate,
        Cover cover) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Named(String name) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Cover(String large) {
    }
}
