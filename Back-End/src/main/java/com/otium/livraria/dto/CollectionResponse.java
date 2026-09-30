package com.otium.livraria.dto;

import java.util.UUID;

public record CollectionResponse(UUID id, String name, String slug) {
}
