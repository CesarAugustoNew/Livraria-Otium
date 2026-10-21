package com.otium.livraria.exception;

/** Serviço externo (ex.: Open Library) indisponível ou respondendo com erro (mapeada para 502). */
public class ExternalServiceException extends RuntimeException {

    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
