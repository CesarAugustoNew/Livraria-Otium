package com.otium.livraria.controller;

import com.otium.livraria.dto.BookDetailResponse;
import com.otium.livraria.dto.BookFilter;
import com.otium.livraria.dto.BookSummaryResponse;
import com.otium.livraria.dto.PageResponse;
import com.otium.livraria.service.BookService;
import com.otium.livraria.service.BookSort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books")
@SecurityRequirements
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Lista/busca livros com filtros, paginação e ordenação",
            description = "Filtros de grupo (categoryIds, authorIds) aceitam vários ids separados por vírgula: "
                    + "dentro do grupo vale OU, entre grupos vale E. sort: relevance (padrão), best_sellers, newest, "
                    + "discount, price_desc, price_asc, title_asc, title_desc. size máximo: 50.")
    @GetMapping
    public PageResponse<BookSummaryResponse> list(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) List<UUID> categoryIds,
            @RequestParam(required = false) List<UUID> authorIds,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Boolean release,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort) {
        BookFilter filter = new BookFilter(title, categoryIds, authorIds, minPrice, maxPrice, available, release);
        return bookService.search(filter, page, size, BookSort.parse(sort));
    }

    @Operation(summary = "Detalhes de um livro")
    @GetMapping("/{id}")
    public BookDetailResponse get(@PathVariable UUID id) {
        return bookService.findById(id);
    }
}
