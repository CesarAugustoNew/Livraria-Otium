package com.otium.livraria.controller;

import com.otium.livraria.dto.BannerResponse;
import com.otium.livraria.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/banners")
@Tag(name = "Banners")
@SecurityRequirements
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @Operation(summary = "Banners ativos e dentro da janela de exibição, em ordem")
    @GetMapping
    public List<BannerResponse> list() {
        return bannerService.findVisible();
    }
}
