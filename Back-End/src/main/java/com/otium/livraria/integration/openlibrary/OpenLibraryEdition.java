package com.otium.livraria.integration.openlibrary;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;

/**
 * Campos usados de /api/books?jscmd=details: o que só essa visão tem (obra, idioma, sinopse da edição).
 * Os autores daqui não são usados: vêm só da edição e às vezes incluem tradutores.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenLibraryEdition(
        List<Ref> languages,
        List<Ref> works,
        /** Texto simples ou objeto {"type", "value"}, conforme o registro. */
        Object description) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Ref(String key) {
    }

    /** Envelope da resposta: { "ISBN:...": { "details": {...} } }. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Envelope(OpenLibraryEdition details) {
    }

    /** Obra (/works/{id}.json): agrupa as edições e costuma ter a sinopse. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Work(Object description) {
    }

    static String text(Object description) {
        if (description instanceof Map<?, ?> map) {
            Object value = map.get("value");
            return value == null ? null : value.toString();
        }
        return description == null ? null : description.toString();
    }
}
