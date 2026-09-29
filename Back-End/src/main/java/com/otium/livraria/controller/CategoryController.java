package com.otium.livraria.controller;

import com.otium.livraria.dto.CategoryResponse;
import com.otium.livraria.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories")
@SecurityRequirements
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Lista todas as categorias (assuntos)")
    @GetMapping
    public List<CategoryResponse> list() {
        return categoryService.findAll();
    }
}
