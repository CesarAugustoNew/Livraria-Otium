package com.otium.livraria.service;

import com.otium.livraria.dto.AuthorResponse;
import com.otium.livraria.repository.AuthorRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Listas simples que alimentam os filtros laterais (autores). */
@Service
@Transactional(readOnly = true)
public class CatalogOptionsService {

    private final AuthorRepository authors;

    public CatalogOptionsService(AuthorRepository authors) {
        this.authors = authors;
    }

    public List<AuthorResponse> authors() {
        return authors.findAllByOrderByNameAsc().stream()
                .map(a -> new AuthorResponse(a.getId(), a.getName(), a.getSlug())).toList();
    }
}
