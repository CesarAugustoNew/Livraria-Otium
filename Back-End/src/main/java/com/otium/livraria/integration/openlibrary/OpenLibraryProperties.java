package com.otium.livraria.integration.openlibrary;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.open-library")
public record OpenLibraryProperties(String baseUrl, Duration connectTimeout, Duration readTimeout) {
}
