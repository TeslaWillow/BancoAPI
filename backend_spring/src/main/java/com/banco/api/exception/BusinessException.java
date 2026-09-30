// ./src/main/java/com/banco/api/exception/BusinessException.java
package com.banco.api.exception;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}