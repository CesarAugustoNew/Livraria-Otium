package com.otium.livraria.integration.openlibrary;

import java.net.http.HttpClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(OpenLibraryProperties.class)
public class OpenLibraryConfig {

    @Bean
    OpenLibraryClient openLibraryClient(OpenLibraryProperties props) {
        // as capas e algumas respostas redirecionam (ex.: para archive.org)
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(props.connectTimeout())
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(props.readTimeout());

        RestClient http = RestClient.builder()
                .baseUrl(props.baseUrl())
                .requestFactory(requestFactory)
                // o Open Library pede um User-Agent identificável para clientes automatizados
                .defaultHeader(HttpHeaders.USER_AGENT, "LivrariaOtium/0.1 (projeto de portfolio)")
                .build();
        return new OpenLibraryClient(http);
    }
}
