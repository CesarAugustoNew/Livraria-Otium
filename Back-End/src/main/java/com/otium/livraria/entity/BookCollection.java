package com.otium.livraria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Coleção editorial (ex.: "Série Mitos"). Não usa o nome Collection para não colidir com java.util.Collection. */
@Entity
@Table(name = "collections")
@Getter
@Setter
@NoArgsConstructor
public class BookCollection extends BaseEntity {

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 140)
    private String slug;

    @Column(length = 1000)
    private String description;
}
