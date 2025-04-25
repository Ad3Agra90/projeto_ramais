package com.example.ramaisapi.exception;

public class GlobalExceptionHandler {
    
        @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
        public org.springframework.http.ResponseEntity<String> handleAllExceptions(Exception ex) {
            return new org.springframework.http.ResponseEntity<>(ex.getMessage(), org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
        public org.springframework.http.ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
            return new org.springframework.http.ResponseEntity<>(ex.getMessage(), org.springframework.http.HttpStatus.BAD_REQUEST);
        }
    
        @org.springframework.web.bind.annotation.ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
        public org.springframework.http.ResponseEntity<String> handleDataIntegrityViolationException(org.springframework.dao.DataIntegrityViolationException ex) {
            return new org.springframework.http.ResponseEntity<>("Data integrity violation: " + ex.getMessage(), org.springframework.http.HttpStatus.CONFLICT);
        }
}
