package com.otium.livraria.service;

import com.otium.livraria.dto.CategoryResponse;
import com.otium.livraria.mapper.BookMapper;
import com.otium.livraria.repository.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository repository;
    private final BookMapper mapper;

    public CategoryService(CategoryRepository repository, BookMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<CategoryResponse> findAll() {
        return repository.findAllByOrderByNameAsc().stream().map(mapper::toCategory).toList();
    }
}
