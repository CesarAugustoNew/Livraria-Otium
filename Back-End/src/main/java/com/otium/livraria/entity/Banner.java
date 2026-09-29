package com.otium.livraria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
public class Banner extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 250)
    private String subtitle;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String linkUrl;

    @Column(nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active = true;

    private Instant startsAt;

    private Instant endsAt;
}
