package com.otium.livraria.repository;

import com.otium.livraria.entity.Review;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query("""
            select r.book.id as bookId, avg(r.rating) as average, count(r) as total
            from Review r
            where r.book.id in :ids
            group by r.book.id
            """)
    List<RatingSummary> summarize(@Param("ids") Collection<UUID> ids);
}
