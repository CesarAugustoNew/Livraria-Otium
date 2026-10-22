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

    /** Tipo da promoção exibido como etiqueta (ex.: "Cupom", "Ofertas"). */
    @Column(length = 40)
    private String badge;

    /** Texto do botão que leva a {@code linkUrl}. */
    @Column(length = 40)
    private String ctaLabel;

    /** Código de cupom em destaque; deve existir no carrinho. */
    @Column(length = 30)
    private String couponCode;

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
