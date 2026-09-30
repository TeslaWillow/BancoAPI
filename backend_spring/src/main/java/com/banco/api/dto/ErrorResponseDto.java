// ./src/main/java/com/banco/api/dto/ErrorResponseDto.java
package com.banco.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponseDto(
    int status,
    String error,
    String message,
    List<String> details,
    LocalDateTime timestamp
) {
    public ErrorResponseDto(int status, String error, String message) {
        this(status, error, message, List.of(), LocalDateTime.now());
    }

    public ErrorResponseDto(int status, String error, String message, List<String> details) {
        this(status, error, message, details, LocalDateTime.now());
    }
}