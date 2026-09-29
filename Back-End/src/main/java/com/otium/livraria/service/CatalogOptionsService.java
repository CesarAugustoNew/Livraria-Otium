package com.otium.livraria.service;

import com.otium.livraria.dto.AuthorResponse;
import com.otium.livraria.dto.CollectionResponse;
import com.otium.livraria.repository.AuthorRepository;
import com.otium.livraria.repository.BookCollectionRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Listas simples que alimentam os filtros laterais (autores e coleções). */
@Service
@Transactional(readOnly = true)
public class CatalogOptionsService {

    private final AuthorRepository authors;
    private final BookCollectionRepository collections;

    public CatalogOptionsService(AuthorRepository authors, BookCollectionRepository collections) {
        this.authors = authors;
        this.collections = collections;
    }

    public List<AuthorResponse> authors() {
        return authors.findAllByOrderByNameAsc().stream()
                .map(a -> new AuthorResponse(a.getId(), a.getName(), a.getSlug())).toList();
    }

    public List<CollectionResponse> collections() {
        return collections.findAllByOrderByNameAsc().stream()
                .map(c -> new CollectionResponse(c.getId(), c.getName(), c.getSlug())).toList();
    }
}
