package com.otium.livraria.controller;

import com.otium.livraria.dto.AuthorResponse;
import com.otium.livraria.service.CatalogOptionsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Catalog filters")
@SecurityRequirements
public class CatalogOptionsController {

    private final CatalogOptionsService service;

    public CatalogOptionsController(CatalogOptionsService service) {
        this.service = service;
    }

    @Operation(summary = "Autores, em ordem alfabética (filtro lateral)")
    @GetMapping("/authors")
    public List<AuthorResponse> authors() {
        return service.authors();
    }
}
