package com.otium.livraria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "order_items")
@Check(name = "ck_order_items_values", constraints = "quantity > 0 AND unit_price >= 0")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    /** Snapshot: reajustes futuros de preço/título não alteram pedidos antigos. */
    @Column(nullable = false, length = 255)
    private String bookTitle;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    private int quantity;
}
