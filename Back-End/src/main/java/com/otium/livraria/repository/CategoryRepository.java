package com.otium.livraria.repository;

import com.otium.livraria.entity.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findAllByOrderByNameAsc();

    Optional<Category> findBySlug(String slug);
}
