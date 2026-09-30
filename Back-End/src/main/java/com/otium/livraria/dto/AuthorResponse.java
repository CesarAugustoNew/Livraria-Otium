package com.otium.livraria.dto;

import java.util.UUID;

public record AuthorResponse(UUID id, String name, String slug) {
}
