package com.otium.livraria.repository;

import com.otium.livraria.entity.Banner;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BannerRepository extends JpaRepository<Banner, UUID> {

    @Query("""
            select b from Banner b
            where b.active = true
              and (b.startsAt is null or b.startsAt <= :now)
              and (b.endsAt is null or b.endsAt >= :now)
            order by b.displayOrder asc
            """)
    List<Banner> findVisible(@Param("now") Instant now);
}
