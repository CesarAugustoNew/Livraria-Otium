package com.otium.livraria.dto;

public record AuthResponse(String token, String tokenType, long expiresInSeconds, UserResponse user) {
}
