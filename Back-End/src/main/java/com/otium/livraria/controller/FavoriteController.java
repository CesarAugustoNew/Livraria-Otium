package com.otium.livraria.controller;

import com.otium.livraria.dto.BookSummaryResponse;
import com.otium.livraria.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favorites")
@Tag(name = "Favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @Operation(summary = "Livros favoritos do usuário autenticado, mais recentes primeiro")
    @GetMapping
    public List<BookSummaryResponse> list(Authentication authentication) {
        return favoriteService.list(authentication.getName());
    }

    @Operation(summary = "Favorita um livro (idempotente)")
    @PutMapping("/{bookId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void add(@PathVariable UUID bookId, Authentication authentication) {
        favoriteService.add(authentication.getName(), bookId);
    }

    @Operation(summary = "Remove um livro dos favoritos (idempotente)")
    @DeleteMapping("/{bookId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable UUID bookId, Authentication authentication) {
        favoriteService.remove(authentication.getName(), bookId);
    }
}
