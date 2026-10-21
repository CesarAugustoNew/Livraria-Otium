package com.otium.livraria.integration;

import java.util.Collection;
import java.util.Map;

/** Fonte de dados bibliográficos. A loja depende só desta interface, não do Open Library em si. */
public interface BookMetadataProvider {

    /**
     * Busca os livros pelo ISBN. ISBNs não encontrados ficam de fora do mapa.
     *
     * @throws com.otium.livraria.exception.ExternalServiceException se a fonte estiver indisponível
     */
    Map<String, ExternalBook> findByIsbn(Collection<String> isbns);
}
