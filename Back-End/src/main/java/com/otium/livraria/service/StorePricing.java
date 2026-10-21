package com.otium.livraria.service;

import java.math.BigDecimal;
import java.util.Random;

/**
 * Oferta da loja fictícia: preço, desconto, estoque, lançamento e vendas. O Open Library só tem dados
 * bibliográficos, então esses números são sorteados com o ISBN como semente: reimportar gera sempre os mesmos.
 */
public final class StorePricing {

    private static final BigDecimal CENTS = new BigDecimal("0.90");

    public record Offer(BigDecimal price, BigDecimal originalPrice, int stockQuantity, boolean release,
                        int salesCount) {
    }

    private StorePricing() {
    }

    public static Offer forIsbn(String isbn) {
        Random random = new Random(isbn.hashCode());
        int reais = 24 + random.nextInt(66); // R$ 24,90 a R$ 89,90
        BigDecimal price = BigDecimal.valueOf(reais).add(CENTS);
        BigDecimal originalPrice = chance(random, 30)
                ? BigDecimal.valueOf(reais + 5 + random.nextInt(16)).add(CENTS)
                : null;
        int stock = chance(random, 10) ? 0 : 1 + random.nextInt(30);
        boolean release = chance(random, 30);
        int sales = random.nextInt(501);
        return new Offer(price, originalPrice, stock, release, sales);
    }

    private static boolean chance(Random random, int percent) {
        return random.nextInt(100) < percent;
    }
}
