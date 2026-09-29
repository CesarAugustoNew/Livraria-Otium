package com.otium.livraria.service;

import com.otium.livraria.dto.BookFilter;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.BookAuthor;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class BookSpecifications {

    private BookSpecifications() {
    }

    public static Specification<Book> from(BookFilter f) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (f.title() != null && !f.title().isBlank()) {
                String term = f.title().trim().toLowerCase(Locale.ROOT)
                        .replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + term + "%", '\\'));
            }
            if (notEmpty(f.categoryIds())) {
                predicates.add(root.get("category").get("id").in(f.categoryIds()));
            }
            if (notEmpty(f.collectionIds())) {
                predicates.add(root.get("collection").get("id").in(f.collectionIds()));
            }
            if (notEmpty(f.authorIds())) {
                // subquery evita duplicar linhas (join) e quebrar a paginação
                Subquery<UUID> sub = query.subquery(UUID.class);
                Root<BookAuthor> link = sub.from(BookAuthor.class);
                sub.select(link.get("book").<UUID>get("id"))
                        .where(link.get("author").get("id").in(f.authorIds()));
                predicates.add(root.get("id").in(sub));
            }
            if (f.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.<BigDecimal>get("price"), f.minPrice()));
            }
            if (f.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.<BigDecimal>get("price"), f.maxPrice()));
            }
            if (Boolean.TRUE.equals(f.available())) {
                predicates.add(cb.greaterThan(root.<Integer>get("stockQuantity"), 0));
            }
            if (f.release() != null) {
                predicates.add(cb.equal(root.get("release"), f.release()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean notEmpty(List<?> list) {
        return list != null && !list.isEmpty();
    }
}
