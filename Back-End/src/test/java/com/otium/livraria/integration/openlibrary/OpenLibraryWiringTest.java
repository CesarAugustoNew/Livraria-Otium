package com.otium.livraria.integration.openlibrary;

import static org.assertj.core.api.Assertions.assertThat;

import com.otium.livraria.service.CuratedCatalog;
import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.jackson.autoconfigure.JacksonAutoConfiguration;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

/** Sobe só a parte do contexto ligada ao catálogo (sem banco), com o application.yml real. */
class OpenLibraryWiringTest {

    private final ApplicationContextRunner runner = new ApplicationContextRunner()
            .withInitializer(new ConfigDataApplicationContextInitializer())
            .withConfiguration(AutoConfigurations.of(JacksonAutoConfiguration.class))
            .withUserConfiguration(OpenLibraryConfig.class, OpenLibraryBookProvider.class, CuratedCatalog.class);

    @Test
    void ligaPropriedadesClienteEListaCurada() {
        runner.run(context -> {
            assertThat(context).hasNotFailed().hasSingleBean(OpenLibraryBookProvider.class);

            OpenLibraryProperties props = context.getBean(OpenLibraryProperties.class);
            assertThat(props.baseUrl()).isEqualTo("https://openlibrary.org");
            assertThat(props.readTimeout()).isEqualTo(Duration.ofSeconds(20));

            assertThat(context.getBean(CuratedCatalog.class).categoryByIsbn())
                    .hasSizeGreaterThan(20)
                    .containsValues("Literatura", "Filosofia", "Poesia", "História");
        });
    }
}
