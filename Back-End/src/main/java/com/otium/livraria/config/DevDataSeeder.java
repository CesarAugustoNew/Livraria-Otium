package com.otium.livraria.config;

import com.otium.livraria.dto.CatalogImportReport;
import com.otium.livraria.entity.Banner;
import com.otium.livraria.entity.Role;
import com.otium.livraria.entity.User;
import com.otium.livraria.exception.ExternalServiceException;
import com.otium.livraria.repository.BannerRepository;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.UserRepository;
import com.otium.livraria.service.CatalogImportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Dados de desenvolvimento: admin, banners e o catálogo importado do Open Library. Roda só no profile "dev"
 * e só com o catálogo vazio. Sem rede, a aplicação sobe mesmo assim e o import pode ser refeito pelo endpoint admin.
 */
@Component
@Profile("dev")
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final UserRepository users;
    private final BookRepository books;
    private final BannerRepository banners;
    private final CatalogImportService catalogImport;
    private final PasswordEncoder encoder;
    private final String adminEmail;
    private final String adminPassword;

    public DevDataSeeder(UserRepository users, BookRepository books, BannerRepository banners,
                         CatalogImportService catalogImport, PasswordEncoder encoder,
                         @Value("${app.seed.admin-email}") String adminEmail,
                         @Value("${app.seed.admin-password}") String adminPassword) {
        this.users = users;
        this.books = books;
        this.banners = banners;
        this.catalogImport = catalogImport;
        this.encoder = encoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (books.count() > 0) {
            return;
        }
        createAdmin();
        createBanners();
        try {
            CatalogImportReport report = catalogImport.importCatalog();
            log.info("Dados de desenvolvimento criados ({} livros). Admin: {}", report.created(), adminEmail);
        } catch (ExternalServiceException e) {
            log.warn("Catálogo não importado ({}). A loja sobe vazia; tente POST /api/admin/catalog/import.",
                    e.getMessage());
        }
    }

    private void createAdmin() {
        if (users.existsByEmail(adminEmail)) {
            return;
        }
        User admin = new User();
        admin.setName("Administrador");
        admin.setEmail(adminEmail);
        admin.setPasswordHash(encoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        users.save(admin);
    }

    /** Verifica antes de criar: se o import falhar, o próximo start passa por aqui de novo. */
    private void createBanners() {
        if (banners.count() > 0) {
            return;
        }
        int order = 1;
        for (String[] b : new String[][]{
                {"Otium: tempo para ler", "Sua próxima leitura está a um clique", "/livros"},
                {"Lançamentos da semana", "Descubra o que acabou de chegar", "/livros?lancamentos=true"},
                {"Clássicos em destaque", "Machado, Clarice, Pessoa e mais", "/livros"}}) {
            Banner banner = new Banner();
            banner.setTitle(b[0]);
            banner.setSubtitle(b[1]);
            banner.setLinkUrl(b[2]);
            banner.setDisplayOrder(order++);
            banners.save(banner);
        }
    }
}
