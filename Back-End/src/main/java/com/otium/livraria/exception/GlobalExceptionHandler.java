package com.otium.livraria.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> notFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "ResourceNotFound", ex.getMessage(), req);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> noResource(NoResourceFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "ResourceNotFound", "Recurso não encontrado.", req);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> business(BusinessException ex, HttpServletRequest req) {
        return build(HttpStatus.UNPROCESSABLE_ENTITY, "BusinessRuleViolation", ex.getMessage(), req);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> invalidCredentials(InvalidCredentialsException ex, HttpServletRequest req) {
        return build(HttpStatus.UNAUTHORIZED, "InvalidCredentials", ex.getMessage(), req);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> emailExists(EmailAlreadyExistsException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "EmailAlreadyExists", ex.getMessage(), req);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> externalService(ExternalServiceException ex, HttpServletRequest req) {
        log.warn("Falha em serviço externo: {}", ex.getMessage());
        return build(HttpStatus.BAD_GATEWAY, "ExternalServiceUnavailable",
                "Serviço externo indisponível. Tente novamente mais tarde.", req);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<ErrorResponse.FieldViolation> details = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> new ErrorResponse.FieldViolation(f.getField(), f.getDefaultMessage()))
                .toList();
        ErrorResponse body = new ErrorResponse(java.time.Instant.now(), 400, "ValidationError",
                "Dados inválidos.", req.getRequestURI(), details);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErrorResponse> malformed(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, "MalformedRequest", "Requisição malformada.", req);
    }

    /** Última barreira: registra o detalhe no log e devolve uma mensagem genérica, sem stack trace. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> unexpected(Exception ex, HttpServletRequest req) {
        log.error("Erro inesperado em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "InternalError",
                "Ocorreu um erro inesperado. Tente novamente mais tarde.", req);
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String error, String message,
                                                HttpServletRequest req) {
        return ResponseEntity.status(status)
                .body(ErrorResponse.of(status.value(), error, message, req.getRequestURI()));
    }
}
