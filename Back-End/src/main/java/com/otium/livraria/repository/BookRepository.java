package com.otium.livraria.repository;

import com.otium.livraria.entity.Book;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {

    @EntityGraph(attributePaths = "category")
    Optional<Book> findByIdAndActiveTrue(UUID id);

    Optional<Book> findByIsbn(String isbn);

    boolean existsBySlug(String slug);
}
