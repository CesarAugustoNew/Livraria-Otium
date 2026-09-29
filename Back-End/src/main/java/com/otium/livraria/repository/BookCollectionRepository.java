package com.otium.livraria.repository;

import com.otium.livraria.entity.BookCollection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCollectionRepository extends JpaRepository<BookCollection, UUID> {

    List<BookCollection> findAllByOrderByNameAsc();
}
