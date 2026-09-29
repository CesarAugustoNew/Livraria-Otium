package com.otium.livraria.config;

import com.otium.livraria.entity.Author;
import com.otium.livraria.entity.Banner;
import com.otium.livraria.entity.Book;
import com.otium.livraria.entity.BookCollection;
import com.otium.livraria.entity.Category;
import com.otium.livraria.entity.Role;
import com.otium.livraria.entity.User;
import com.otium.livraria.repository.AuthorRepository;
import com.otium.livraria.repository.BannerRepository;
import com.otium.livraria.repository.BookCollectionRepository;
import com.otium.livraria.repository.BookRepository;
import com.otium.livraria.repository.CategoryRepository;
import com.otium.livraria.repository.UserRepository;
import com.otium.livraria.util.SlugUtil;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dados de exemplo (obras em domínio público) para desenvolvimento. Roda só no profile "dev" e só com banco vazio.
 * As capas são SVGs servidos pelo front (Front-End/public/covers/{slug}.svg).
 */
@Component
@Profile("dev")
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final UserRepository users;
    private final CategoryRepository categories;
    private final BookCollectionRepository collections;
    private final AuthorRepository authors;
    private final BookRepository books;
    private final BannerRepository banners;
    private final PasswordEncoder encoder;
    private final String adminEmail;
    private final String adminPassword;

    public DevDataSeeder(UserRepository users, CategoryRepository categories, BookCollectionRepository collections,
                         AuthorRepository authors, BookRepository books, BannerRepository banners,
                         PasswordEncoder encoder,
                         @Value("${app.seed.admin-email}") String adminEmail,
                         @Value("${app.seed.admin-password}") String adminPassword) {
        this.users = users;
        this.categories = categories;
        this.collections = collections;
        this.authors = authors;
        this.books = books;
        this.banners = banners;
        this.encoder = encoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (books.count() > 0) {
            return;
        }
        if (!users.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(encoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            users.save(admin);
        }

        Map<String, Category> cat = new HashMap<>();
        for (String name : new String[]{"Literatura", "Filosofia", "Poesia", "História"}) {
            Category c = new Category();
            c.setName(name);
            c.setSlug(SlugUtil.slugify(name));
            cat.put(name, categories.save(c));
        }
        Map<String, BookCollection> col = new HashMap<>();
        for (String name : new String[]{"Clássicos da Literatura Brasileira", "Clássicos Universais",
                "Clássicos da Filosofia", "Clássicos da Literatura Portuguesa"}) {
            BookCollection c = new BookCollection();
            c.setName(name);
            c.setSlug(SlugUtil.slugify(name));
            col.put(name, collections.save(c));
        }

        Seed s = new Seed(cat, col);
        // título, autor, assunto, coleção, preço, preço "de", estoque, lançamento, vendas, ano
        s.book("Dom Casmurro", "Machado de Assis", "Literatura", "Clássicos da Literatura Brasileira", "39.90", "49.90", 12, true, 320, 1899, "Bento Santiago revisita a juventude e a dúvida sobre Capitu.");
        s.book("Memórias Póstumas de Brás Cubas", "Machado de Assis", "Literatura", "Clássicos da Literatura Brasileira", "42.90", null, 8, true, 210, 1881, "O defunto-autor narra a própria vida com ironia.");
        s.book("O Alienista", "Machado de Assis", "Literatura", "Clássicos da Literatura Brasileira", "24.90", "29.90", 20, false, 150, 1882, "Em Itaguaí, o Dr. Bacamarte decide internar meio mundo.");
        s.book("O Cortiço", "Aluísio Azevedo", "Literatura", "Clássicos da Literatura Brasileira", "32.90", null, 10, false, 90, 1890, "A vida num cortiço carioca do século XIX.");
        s.book("Iracema", "José de Alencar", "Literatura", "Clássicos da Literatura Brasileira", "27.90", null, 14, true, 60, 1865, "Lenda do Ceará, romance fundador do indianismo.");
        s.book("A Metamorfose", "Franz Kafka", "Literatura", "Clássicos Universais", "29.90", null, 0, true, 180, 1915, "Gregor Samsa acorda transformado em um inseto monstruoso.");
        s.book("Crime e Castigo", "Fiódor Dostoiévski", "Literatura", "Clássicos Universais", "64.90", "79.90", 7, true, 140, 1866, "Raskólnikov e o peso de um crime aparentemente justificado.");
        s.book("Meditações", "Marco Aurélio", "Filosofia", "Clássicos da Filosofia", "54.90", null, 15, true, 400, 180, "Anotações pessoais de um imperador sobre virtude e serenidade.");
        s.book("A República", "Platão", "Filosofia", "Clássicos da Filosofia", "59.90", null, 4, false, 130, 375, "Diálogo sobre a justiça e a cidade ideal.");
        s.book("Assim Falou Zaratustra", "Friedrich Nietzsche", "Filosofia", "Clássicos da Filosofia", "49.90", "62.90", 9, false, 110, 1883, "Um livro para todos e para ninguém.");
        s.book("O Príncipe", "Nicolau Maquiavel", "História", null, "34.90", null, 9, false, 170, 1532, "Tratado sobre a conquista e a manutenção do poder.");
        s.book("A Arte da Guerra", "Sun Tzu", "História", null, "26.90", null, 18, true, 260, 500, "Estratégia, disciplina e o valor de vencer sem lutar.");
        s.book("Poemas Escolhidos", "Fernando Pessoa", "Poesia", "Clássicos da Literatura Portuguesa", "37.90", null, 6, true, 75, 1934, "Seleção de poemas do autor e de seus heterônimos.");

        int order = 1;
        for (String[] b : new String[][]{
                {"Otium: tempo para ler", "Sua próxima leitura está a um clique", "/livros"},
                {"Lançamentos da semana", "Descubra o que acabou de chegar", "/livros?lancamentos=true"},
                {"Clássicos em destaque", "Machado, Kafka, Pessoa e mais", "/livros"}}) {
            Banner banner = new Banner();
            banner.setTitle(b[0]);
            banner.setSubtitle(b[1]);
            banner.setLinkUrl(b[2]);
            banner.setDisplayOrder(order++);
            banners.save(banner);
        }
        log.info("Dados de desenvolvimento criados. Admin: {}", adminEmail);
    }

    private class Seed {
        private final Map<String, Category> cat;
        private final Map<String, BookCollection> col;
        private final Map<String, Author> authorCache = new HashMap<>();

        Seed(Map<String, Category> cat, Map<String, BookCollection> col) {
            this.cat = cat;
            this.col = col;
        }

        void book(String title, String authorName, String category, String collection, String price,
                  String originalPrice, int stock, boolean release, int sales, int year, String description) {
            Author author = authorCache.computeIfAbsent(authorName, n -> {
                Author a = new Author();
                a.setName(n);
                a.setSlug(SlugUtil.slugify(n));
                return authors.save(a);
            });

            Book book = new Book();
            book.setTitle(title);
            book.setSlug(SlugUtil.slugify(title));
            book.setCoverUrl("/covers/" + SlugUtil.slugify(title) + ".svg");
            book.setDescription(description);
            book.setPrice(new BigDecimal(price));
            book.setOriginalPrice(originalPrice == null ? null : new BigDecimal(originalPrice));
            book.setStockQuantity(stock);
            book.setRelease(release);
            book.setSalesCount(sales);
            book.setCategory(cat.get(category));
            book.setCollection(collection == null ? null : col.get(collection));
            book.setPublishedAt(LocalDate.of(year, 1, 1));
            book.addAuthor(author, 0);
            books.save(book);
        }
    }
}
