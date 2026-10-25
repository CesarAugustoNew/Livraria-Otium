package com.otium.livraria.service;

import com.otium.livraria.dto.BookSummaryResponse;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.Favorite;
import com.otium.livraria.entity.User;
import com.otium.livraria.exception.ResourceNotFoundException;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.FavoriteRepository;
import com.otium.livraria.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Livros salvos pelo usuário. Adicionar e remover são idempotentes: repetir a operação não muda o resultado. */
@Service
@Transactional
public class FavoriteService {

    private final FavoriteRepository favorites;
    private final UserRepository users;
    private final BookRepository books;
    private final BookService bookService;

    public FavoriteService(FavoriteRepository favorites, UserRepository users, BookRepository books,
                           BookService bookService) {
        this.favorites = favorites;
        this.users = users;
        this.books = books;
        this.bookService = bookService;
    }

    /** Mais recentes primeiro. */
    @Transactional(readOnly = true)
    public List<BookSummaryResponse> list(String email) {
        List<Book> saved = favorites.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(Favorite::getBook).toList();
        return bookService.toSummaries(saved);
    }

    public void add(String email, UUID bookId) {
        Book book = books.findByIdAndActiveTrue(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));
        if (favorites.existsByUserEmailAndBookId(email, bookId)) {
            return;
        }
        User user = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setBook(book);
        favorites.save(favorite);
    }

    public void remove(String email, UUID bookId) {
        favorites.deleteByUserEmailAndBookId(email, bookId);
    }
}
