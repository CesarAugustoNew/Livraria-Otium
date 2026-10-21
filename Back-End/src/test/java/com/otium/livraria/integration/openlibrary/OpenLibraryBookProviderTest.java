package com.otium.livraria.integration.openlibrary;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.otium.livraria.exception.ExternalServiceException;
import com.otium.livraria.integration.ExternalBook;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class OpenLibraryBookProviderTest {

    private static final OpenLibraryProperties PROPS = new OpenLibraryProperties(
            "https://openlibrary.org", Duration.ofSeconds(1), Duration.ofSeconds(1));

    private MockRestServiceServer server;
    private OpenLibraryBookProvider provider;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl(PROPS.baseUrl());
        server = MockRestServiceServer.bindTo(builder).build();
        provider = new OpenLibraryBookProvider(new OpenLibraryClient(builder.build()));
    }

    @Test
    void buscaEdicoesEmLoteEMapeiaOsCampos() {
        // "data" resolve os autores pela obra; "details" traz obra, idioma e sinopse
        server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://openlibrary.org/api/books")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(queryParam("bibkeys", "ISBN:9788508145607,ISBN:0000000000000"))
                .andExpect(queryParam("jscmd", "data"))
                .andRespond(withSuccess("""
                        {"ISBN:9788508145607": {
                            "title": "Dom Casmurro",
                            "authors": [{"url": "https://openlibrary.org/authors/OL1A", "name": "Machado de Assis"}],
                            "publishers": [{"name": "Ática"}, {"name": "Outra"}],
                            "number_of_pages": 232,
                            "publish_date": "3 dezembro 2019",
                            "cover": {"small": "https://covers.openlibrary.org/b/id/15231557-S.jpg",
                                      "large": "https://covers.openlibrary.org/b/id/15231557-L.jpg"},
                            "campo_desconhecido": true
                        }}
                        """, MediaType.APPLICATION_JSON));
        server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://openlibrary.org/api/books")))
                .andExpect(queryParam("bibkeys", "ISBN:9788508145607,ISBN:0000000000000"))
                .andExpect(queryParam("jscmd", "details"))
                .andRespond(withSuccess("""
                        {"ISBN:9788508145607": {"details": {
                            "title": "Dom Casmurro",
                            "authors": [{"key": "/authors/OL9A", "name": "Tradutor que não é autor"}],
                            "languages": [{"key": "/languages/por"}],
                            "works": [{"key": "/works/OL39781935W"}]
                        }}}
                        """, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://openlibrary.org/works/OL39781935W.json"))
                .andRespond(withSuccess("""
                        {"description": {"type": "/type/text", "value": "**Dom Casmurro** é um romance."}}
                        """, MediaType.APPLICATION_JSON));

        Map<String, ExternalBook> books = provider.findByIsbn(List.of("9788508145607", "0000000000000"));

        server.verify();
        assertThat(books).containsOnlyKeys("9788508145607");
        ExternalBook book = books.get("9788508145607");
        assertThat(book.title()).isEqualTo("Dom Casmurro");
        assertThat(book.authors()).containsExactly("Machado de Assis");
        assertThat(book.publisher()).isEqualTo("Ática");
        assertThat(book.pages()).isEqualTo(232);
        assertThat(book.publishedYear()).isEqualTo(2019);
        assertThat(book.coverUrl()).isEqualTo("https://covers.openlibrary.org/b/id/15231557-L.jpg");
        assertThat(book.language()).isEqualTo("Português");
        assertThat(book.description()).isEqualTo("Dom Casmurro é um romance.");
    }

    @Test
    void descricaoDaEdicaoDispensaABuscaNaObraEFalhaNaObraNaoDerrubaOLivro() {
        server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://openlibrary.org/api/books")))
                .andExpect(queryParam("jscmd", "data"))
                .andRespond(withSuccess("""
                        {"ISBN:1": {"title": "Com sinopse"}, "ISBN:2": {"title": "Sem sinopse"}}
                        """, MediaType.APPLICATION_JSON));
        server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://openlibrary.org/api/books")))
                .andExpect(queryParam("jscmd", "details"))
                .andRespond(withSuccess("""
                        {"ISBN:1": {"details": {"description": "Texto da edição.", "works": [{"key": "/works/OL1W"}]}},
                         "ISBN:2": {"details": {"works": [{"key": "/works/OL2W"}]}}}
                        """, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://openlibrary.org/works/OL2W.json")).andRespond(withServerError());

        Map<String, ExternalBook> books = provider.findByIsbn(List.of("1", "2"));

        server.verify();
        assertThat(books.get("1").description()).isEqualTo("Texto da edição.");
        assertThat(books.get("2").description()).isNull();
        assertThat(books.get("2").coverUrl()).isNull();
        assertThat(books.get("2").publishedYear()).isNull();
    }

    @Test
    void servicoForaDoArViraExternalServiceException() {
        server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://openlibrary.org/api/books")))
                .andRespond(withServerError());

        assertThatThrownBy(() -> provider.findByIsbn(List.of("1")))
                .isInstanceOf(ExternalServiceException.class);
    }

    @Test
    void extraiOAnoDeDatasEmTextoLivre() {
        assertThat(OpenLibraryBookProvider.parseYear("3 dezembro 2019")).isEqualTo(2019);
        assertThat(OpenLibraryBookProvider.parseYear("May 30, 2011")).isEqualTo(2011);
        assertThat(OpenLibraryBookProvider.parseYear("27/01/2015")).isEqualTo(2015);
        assertThat(OpenLibraryBookProvider.parseYear("2007-11-22?")).isEqualTo(2007);
        assertThat(OpenLibraryBookProvider.parseYear("s.d.")).isNull();
        assertThat(OpenLibraryBookProvider.parseYear(null)).isNull();
    }

    @Test
    void limpaMarkdownELinksDaSinopse() {
        String raw = """
                From [wikipedia](https://en.wikipedia.org/wiki/X):

                **Livro** narra a [história][1] de alguém.



                Segundo parágrafo.

                ----------
                See also: [outra edição](https://openlibrary.org/x)

                [1]: https://example.com
                """;
        assertThat(OpenLibraryBookProvider.cleanDescription(raw))
                .isEqualTo("From wikipedia:\n\nLivro narra a história de alguém.\n\nSegundo parágrafo.");
        assertThat(OpenLibraryBookProvider.cleanDescription("   ")).isNull();
    }
}
