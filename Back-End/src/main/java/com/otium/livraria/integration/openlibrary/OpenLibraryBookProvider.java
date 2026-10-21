package com.otium.livraria.integration.openlibrary;

import com.otium.livraria.exception.ExternalServiceException;
import com.otium.livraria.integration.BookMetadataProvider;
import com.otium.livraria.integration.ExternalBook;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;

/** Traduz edições do Open Library para {@link ExternalBook}, normalizando os campos que vêm em texto livre. */
@Component
public class OpenLibraryBookProvider implements BookMetadataProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenLibraryBookProvider.class);

    /** Lotes pequenos mantêm a URL curta. */
    private static final int BATCH_SIZE = 20;
    private static final Pattern YEAR = Pattern.compile("(?<!\\d)(\\d{4})(?!\\d)");
    private static final Map<String, String> LANGUAGES = Map.of(
            "por", "Português", "eng", "Inglês", "spa", "Espanhol",
            "fre", "Francês", "ger", "Alemão", "ita", "Italiano");

    private final OpenLibraryClient client;

    public OpenLibraryBookProvider(OpenLibraryClient client) {
        this.client = client;
    }

    @Override
    public Map<String, ExternalBook> findByIsbn(Collection<String> isbns) {
        List<String> all = List.copyOf(isbns);
        Map<String, ExternalBook> books = new LinkedHashMap<>();
        for (int from = 0; from < all.size(); from += BATCH_SIZE) {
            List<String> batch = all.subList(from, Math.min(from + BATCH_SIZE, all.size()));
            Map<String, OpenLibraryBookData> data;
            Map<String, OpenLibraryEdition> editions;
            try {
                data = client.findBookData(batch);
                editions = client.findEditions(batch);
            } catch (RestClientException e) {
                throw new ExternalServiceException("Open Library indisponível: " + e.getMessage(), e);
            }
            data.forEach((isbn, d) -> books.put(isbn, toExternalBook(isbn, d, editions.get(isbn))));
        }
        return books;
    }

    /** {@code edition} pode faltar: a visão "details" é complementar e o livro existe sem ela. */
    private ExternalBook toExternalBook(String isbn, OpenLibraryBookData d, OpenLibraryEdition edition) {
        return new ExternalBook(
                isbn,
                d.title() == null ? null : d.title().trim(),
                names(d.authors()),
                names(d.publishers()).stream().findFirst().orElse(null),
                d.numberOfPages(),
                parseYear(d.publishDate()),
                d.cover() == null ? null : d.cover().large(),
                edition == null ? null : language(edition.languages()),
                edition == null ? null : cleanDescription(description(edition)));
    }

    private static List<String> names(List<OpenLibraryBookData.Named> named) {
        if (named == null) {
            return List.of();
        }
        return named.stream().map(OpenLibraryBookData.Named::name)
                .filter(Objects::nonNull).map(String::trim).filter(n -> !n.isEmpty()).toList();
    }

    /** A sinopse da edição tem prioridade; sem ela, usa a da obra. Falha nessa busca extra não derruba o livro. */
    private String description(OpenLibraryEdition e) {
        String own = OpenLibraryEdition.text(e.description());
        if (own != null && !own.isBlank()) {
            return own;
        }
        if (e.works() == null || e.works().isEmpty() || e.works().getFirst().key() == null) {
            return null;
        }
        String workKey = e.works().getFirst().key();
        try {
            return client.findWorkDescription(workKey).orElse(null);
        } catch (RestClientException ex) {
            log.warn("Sem sinopse para {}: {}", workKey, ex.getMessage());
            return null;
        }
    }

    private static String language(List<OpenLibraryEdition.Ref> languages) {
        if (languages == null || languages.isEmpty() || languages.getFirst().key() == null) {
            return null;
        }
        String key = languages.getFirst().key();
        String code = key.substring(key.lastIndexOf('/') + 1);
        return LANGUAGES.get(code);
    }

    /** "3 dezembro 2019", "May 30, 2011", "27/01/2015"... o Open Library guarda a data como texto livre. */
    static Integer parseYear(String publishDate) {
        if (publishDate == null) {
            return null;
        }
        Matcher m = YEAR.matcher(publishDate);
        while (m.find()) {
            int year = Integer.parseInt(m.group(1));
            if (year >= 1450 && year <= 2100) {
                return year;
            }
        }
        return null;
    }

    /** Sinopses do Open Library usam markdown e costumam terminar com "----------" seguido de links "veja também". */
    static String cleanDescription(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String text = raw.replace("\r\n", "\n");
        int separator = text.indexOf("\n----");
        if (separator >= 0) {
            text = text.substring(0, separator);
        }
        text = text
                .replaceAll("(?m)^\\s*\\[\\d+]:.*$", "")          // definição de referência: [1]: http://...
                .replaceAll("\\[([^\\]]+)]\\([^)]*\\)", "$1")     // [texto](url) -> texto
                .replaceAll("\\[([^\\]]+)]\\[\\d+]", "$1")        // [texto][1]   -> texto
                .replace("**", "")
                .replace("__", "")
                .replaceAll("\n{3,}", "\n\n")
                .trim();
        return text.isEmpty() ? null : text;
    }
}
