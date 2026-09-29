package com.otium.livraria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Snapshot do endereço no momento da compra: editar o perfil depois não altera pedidos antigos. */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class ShippingAddress {

    @Column(name = "shipping_recipient", length = 120)
    private String recipient;

    @Column(name = "shipping_street", length = 200)
    private String street;

    @Column(name = "shipping_number", length = 20)
    private String number;

    @Column(name = "shipping_complement", length = 100)
    private String complement;

    @Column(name = "shipping_district", length = 100)
    private String district;

    @Column(name = "shipping_city", length = 100)
    private String city;

    @Column(name = "shipping_state", length = 2)
    private String state;

    @Column(name = "shipping_zip_code", length = 9)
    private String zipCode;
}
