package com.otium.livraria.exception;

/** Violação de regra de negócio (mapeada para 422). */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
