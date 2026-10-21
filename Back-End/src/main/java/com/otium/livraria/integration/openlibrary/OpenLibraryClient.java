package com.otium.livraria.integration.openlibrary;

import com.otium.livraria.integration.openlibrary.OpenLibraryEdition.Envelope;
import com.otium.livraria.integration.openlibrary.OpenLibraryEdition.Work;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

/** Acesso HTTP ao Open Library (https://openlibrary.org/dev/docs/api/books). Só transporte: não conhece a loja. */
public class OpenLibraryClient {

    private static final String ISBN_PREFIX = "ISBN:";

    private final RestClient http;

    public OpenLibraryClient(RestClient http) {
        this.http = http;
    }

    /** Dados de exibição por ISBN, numa única chamada. ISBNs desconhecidos não aparecem no mapa. */
    public Map<String, OpenLibraryBookData> findBookData(Collection<String> isbns) {
        return findBooks(isbns, "data", new ParameterizedTypeReference<Map<String, OpenLibraryBookData>>() {
        }, Function.identity());
    }

    /** Detalhes da edição por ISBN, numa única chamada. ISBNs desconhecidos não aparecem no mapa. */
    public Map<String, OpenLibraryEdition> findEditions(Collection<String> isbns) {
        return findBooks(isbns, "details", new ParameterizedTypeReference<Map<String, Envelope>>() {
        }, Envelope::details);
    }

    /** Sinopse da obra. {@code workKey} vem no formato "/works/OL123W". */
    public Optional<String> findWorkDescription(String workKey) {
        Work work = http.get().uri(workKey + ".json").retrieve().body(Work.class);
        return Optional.ofNullable(work).map(w -> OpenLibraryEdition.text(w.description()));
    }

    private <R, T> Map<String, T> findBooks(Collection<String> isbns, String view,
                                            ParameterizedTypeReference<Map<String, R>> type, Function<R, T> unwrap) {
        String bibkeys = isbns.stream().map(isbn -> ISBN_PREFIX + isbn).collect(Collectors.joining(","));
        Map<String, R> body = http.get()
                .uri(uri -> uri.path("/api/books")
                        .queryParam("bibkeys", bibkeys)
                        .queryParam("jscmd", view)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .body(type);

        Map<String, T> result = new LinkedHashMap<>();
        if (body != null) {
            body.forEach((key, raw) -> {
                T value = raw == null ? null : unwrap.apply(raw);
                if (value != null) {
                    result.put(key.substring(ISBN_PREFIX.length()), value);
                }
            });
        }
        return result;
    }
}
