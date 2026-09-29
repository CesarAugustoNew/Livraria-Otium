package com.otium.livraria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

@Entity
@Table(name = "authors", indexes = @Index(name = "idx_authors_name", columnList = "name"))
@BatchSize(size = 50)
@Getter
@Setter
@NoArgsConstructor
public class Author extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 170)
    private String slug;

    @Column(columnDefinition = "text")
    private String bio;

    @Column(length = 500)
    private String photoUrl;
}
