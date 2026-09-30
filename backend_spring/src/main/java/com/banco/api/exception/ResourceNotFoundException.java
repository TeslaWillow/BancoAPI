// ./src/main/java/com/banco/api/exception/ResourceNotFoundException.java
package com.banco.api.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}