package com.otium.livraria.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException() {
        super("Já existe uma conta com este e-mail.");
    }
}
