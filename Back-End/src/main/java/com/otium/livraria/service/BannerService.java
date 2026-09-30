package com.otium.livraria.service;

import com.otium.livraria.dto.BannerResponse;
import com.otium.livraria.repository.BannerRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BannerService {

    private final BannerRepository repository;

    public BannerService(BannerRepository repository) {
        this.repository = repository;
    }

    public List<BannerResponse> findVisible() {
        return repository.findVisible(Instant.now()).stream()
                .map(b -> new BannerResponse(b.getId(), b.getTitle(), b.getSubtitle(), b.getImageUrl(), b.getLinkUrl()))
                .toList();
    }
}
