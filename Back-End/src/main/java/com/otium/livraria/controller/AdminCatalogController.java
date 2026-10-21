package com.otium.livraria.controller;

import com.otium.livraria.dto.CatalogImportReport;
import com.otium.livraria.service.CatalogImportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/catalog")
@Tag(name = "Admin")
public class AdminCatalogController {

    private final CatalogImportService importService;

    public AdminCatalogController(CatalogImportService importService) {
        this.importService = importService;
    }

    @Operation(summary = "Importa ou atualiza o catálogo curado a partir do Open Library",
            description = "Idempotente: livros já existentes (mesmo ISBN) têm só os dados bibliográficos atualizados; "
                    + "preço e estoque são preservados. Responde 502 se o Open Library estiver indisponível.")
    @PostMapping("/import")
    public CatalogImportReport importCatalog() {
        return importService.importCatalog();
    }
}
