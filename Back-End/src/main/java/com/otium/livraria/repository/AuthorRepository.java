package com.otium.livraria.repository;

import com.otium.livraria.entity.Author;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, UUID> {

    List<Author> findAllByOrderByNameAsc();

    Optional<Author> findBySlug(String slug);
}
