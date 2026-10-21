package com.otium.livraria.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/** O que a loja vende: ISBNs escolhidos por categoria (resources/catalog/curated-books.json). */
@Component
public class CuratedCatalog {

    private final Map<String, List<String>> isbnsByCategory;

    @Autowired
    public CuratedCatalog(JsonMapper json, @Value("classpath:catalog/curated-books.json") Resource file) {
        this(read(json, file));
    }

    public CuratedCatalog(Map<String, List<String>> isbnsByCategory) {
        this.isbnsByCategory = isbnsByCategory;
    }

    /** ISBN → nome da categoria, na ordem do arquivo. */
    public Map<String, String> categoryByIsbn() {
        Map<String, String> result = new LinkedHashMap<>();
        isbnsByCategory.forEach((category, isbns) -> isbns.forEach(isbn -> result.put(isbn, category)));
        return result;
    }

    private static Map<String, List<String>> read(JsonMapper json, Resource file) {
        try (InputStream in = file.getInputStream()) {
            return json.readValue(in, new TypeReference<LinkedHashMap<String, List<String>>>() {
            });
        } catch (IOException e) {
            throw new UncheckedIOException("Não foi possível ler " + file.getDescription(), e);
        }
    }
}
