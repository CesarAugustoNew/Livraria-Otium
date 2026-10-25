package com.otium.livraria.repository;

import com.otium.livraria.entity.Favorite;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    @EntityGraph(attributePaths = "book")
    List<Favorite> findByUserEmailOrderByCreatedAtDesc(String email);

    boolean existsByUserEmailAndBookId(String email, UUID bookId);

    void deleteByUserEmailAndBookId(String email, UUID bookId);
}
