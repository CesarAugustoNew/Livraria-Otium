package com.otium.livraria.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

/** 401/403 emitidos pela cadeia de filtros (antes do MVC) seguem o mesmo formato de erro da API. */
@Component
public class SecurityErrorHandlers {

    public AuthenticationEntryPoint entryPoint() {
        return (request, response, ex) ->
                write(request, response, 401, "Unauthorized", "Autenticação necessária ou token inválido.");
    }

    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, ex) ->
                write(request, response, 403, "Forbidden", "Você não tem permissão para acessar este recurso.");
    }

    private void write(HttpServletRequest request, HttpServletResponse response, int status, String error,
                       String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String json = "{\"timestamp\":\"" + Instant.now() + "\",\"status\":" + status
                + ",\"error\":\"" + error + "\",\"message\":\"" + message
                + "\",\"path\":\"" + escape(request.getRequestURI()) + "\",\"details\":[]}";
        response.getWriter().write(json);
    }

    private String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
