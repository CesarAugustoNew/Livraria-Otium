package com.otium.livraria.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;

class StorePricingTest {

    @Test
    void mesmoIsbnSempreGeraAMesmaOferta() {
        assertThat(StorePricing.forIsbn("9788508145607")).isEqualTo(StorePricing.forIsbn("9788508145607"));
    }

    @Test
    void ofertasFicamDentroDasRegrasDaLoja() {
        IntStream.range(0, 500).mapToObj(i -> String.valueOf(9788500000000L + i)).map(StorePricing::forIsbn)
                .forEach(offer -> {
                    assertThat(offer.price()).isBetween(new BigDecimal("24.90"), new BigDecimal("89.90"));
                    assertThat(offer.price().remainder(BigDecimal.ONE)).isEqualByComparingTo("0.90");
                    if (offer.originalPrice() != null) {
                        assertThat(offer.originalPrice()).isGreaterThan(offer.price());
                        assertThat(offer.originalPrice().remainder(BigDecimal.ONE)).isEqualByComparingTo("0.90");
                    }
                    assertThat(offer.stockQuantity()).isBetween(0, 30);
                    assertThat(offer.salesCount()).isBetween(0, 500);
                });
    }

    @Test
    void parteDoCatalogoTemDescontoParteEstaEsgotada() {
        var offers = IntStream.range(0, 500).mapToObj(i -> StorePricing.forIsbn(String.valueOf(9788500000000L + i)))
                .toList();
        assertThat(offers).anyMatch(o -> o.originalPrice() != null).anyMatch(o -> o.originalPrice() == null);
        assertThat(offers).anyMatch(o -> o.stockQuantity() == 0).anyMatch(o -> o.stockQuantity() > 0);
        assertThat(offers).anyMatch(StorePricing.Offer::release).anyMatch(o -> !o.release());
    }
}
