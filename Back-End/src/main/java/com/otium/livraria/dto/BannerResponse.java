package com.otium.livraria.dto;

import java.util.UUID;

public record BannerResponse(UUID id, String title, String subtitle, String imageUrl, String linkUrl) {
}
