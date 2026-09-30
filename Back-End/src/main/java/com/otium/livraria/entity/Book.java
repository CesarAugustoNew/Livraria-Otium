package com.otium.livraria.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "books", indexes = {
        @Index(name = "idx_books_category", columnList = "category_id"),
        @Index(name = "idx_books_collection", columnList = "collection_id"),
        @Index(name = "idx_books_title", columnList = "title"),
        @Index(name = "idx_books_published_at", columnList = "published_at")
})
@Check(name = "ck_books_values", constraints = "price >= 0 AND stock_quantity >= 0")
@Getter
@Setter
@NoArgsConstructor
public class Book extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 280)
    private String slug;

    @Column(unique = true, length = 20)
    private String isbn;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 500)
    private String coverUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Preço "de" (antes da promoção). Null quando não há desconto. */
    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;

    /** Derivado de originalPrice x price; persistido para permitir ordenar por desconto no banco. */
    @ColumnDefault("0")
    @Column(nullable = false)
    private int discountPercent;

    /** Contador de vendas (atualizado ao concluir pedidos); base de "Mais vendidos". */
    @ColumnDefault("0")
    @Column(nullable = false)
    private int salesCount;

    @Column(nullable = false)
    private int stockQuantity;

    private Integer pages;

    @Column(length = 150)
    private String publisher;

    private LocalDate publishedAt;

    @ColumnDefault("'Português'")
    @Column(nullable = false, length = 40)
    private String language = "Português";

    @ColumnDefault("1")
    @Column(nullable = false)
    private int edition = 1;

    /** Ex.: "13.7 x 21.0 x 1.3 cm". Texto livre para não travar em uma unidade só. */
    @Column(length = 40)
    private String dimensions;

    /** Sumário (uma linha por item, ex.: "Prefácio", "Capítulo 1 – ..."), exibido na página do livro. */
    @Column(columnDefinition = "text")
    private String summary;

    /** Marca o livro como "lançamento" para a vitrine da home. */
    @Column(name = "is_release", nullable = false)
    private boolean release;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private BookCollection collection;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    @BatchSize(size = 50)
    private List<BookAuthor> authors = new ArrayList<>();

    @PrePersist
    @PreUpdate
    void computeDiscount() {
        if (originalPrice != null && price != null && originalPrice.signum() > 0
                && originalPrice.compareTo(price) > 0) {
            discountPercent = originalPrice.subtract(price).multiply(BigDecimal.valueOf(100))
                    .divide(originalPrice, 0, java.math.RoundingMode.HALF_UP).intValue();
        } else {
            discountPercent = 0;
        }
    }

    /** Disponibilidade é derivada; não existe coluna própria. */
    public boolean isAvailable() {
        return active && stockQuantity > 0;
    }

    public void addAuthor(Author author, int position) {
        BookAuthor link = new BookAuthor();
        link.setBook(this);
        link.setAuthor(author);
        link.setPosition(position);
        authors.add(link);
    }
}
