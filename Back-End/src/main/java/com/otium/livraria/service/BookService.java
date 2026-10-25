package com.otium.livraria.service;

import com.otium.livraria.dto.BookDetailResponse;
import com.otium.livraria.dto.BookFilter;
import com.otium.livraria.dto.BookSummaryResponse;
import com.otium.livraria.dto.PageResponse;
import com.otium.livraria.entity.Book;
import com.otium.livraria.exception.ResourceNotFoundException;
import com.otium.livraria.mapper.BookMapper;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.RatingSummary;
import com.otium.livraria.repository.ReviewRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BookService {

    private static final int MAX_PAGE_SIZE = 50;

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final BookMapper mapper;

    public BookService(BookRepository bookRepository, ReviewRepository reviewRepository, BookMapper mapper) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.mapper = mapper;
    }

    public PageResponse<BookSummaryResponse> search(BookFilter filter, int page, int size, BookSort sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        Page<Book> books = bookRepository.findAll(
                BookSpecifications.from(filter), PageRequest.of(safePage, safeSize, sort.toSort()));

        Map<UUID, RatingSummary> ratings = ratingsOf(books.getContent());
        return PageResponse.from(books.map(b -> mapper.toSummary(b, ratings.get(b.getId()))));
    }

    /** Resumos com a nota média de cada livro, numa única consulta de avaliações. Mantém a ordem recebida. */
    public List<BookSummaryResponse> toSummaries(List<Book> books) {
        Map<UUID, RatingSummary> ratings = ratingsOf(books);
        return books.stream().map(b -> mapper.toSummary(b, ratings.get(b.getId()))).toList();
    }

    private Map<UUID, RatingSummary> ratingsOf(List<Book> books) {
        List<UUID> ids = books.stream().map(Book::getId).toList();
        return ids.isEmpty() ? Map.of()
                : reviewRepository.summarize(ids).stream()
                        .collect(Collectors.toMap(RatingSummary::getBookId, Function.identity()));
    }

    public BookDetailResponse findById(UUID id) {
        Book book = bookRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));
        RatingSummary rating = reviewRepository.summarize(List.of(id)).stream().findFirst().orElse(null);
        return mapper.toDetail(book, rating);
    }
}
