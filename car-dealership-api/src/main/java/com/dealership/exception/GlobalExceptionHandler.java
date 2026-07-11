package com.dealership.exception;

import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<String> handleMalformedJwt(MalformedJwtException ex) {
        return new ResponseEntity<>("Invalid token format", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<String> handleInvalidToken(InvalidTokenException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(org.springframework.security.authentication.BadCredentialsException ex) {
        return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }
}