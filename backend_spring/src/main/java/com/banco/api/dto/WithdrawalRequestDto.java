// ./src/main/java/com/banco/api/dto/WithdrawalRequestDto.java
package com.banco.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WithdrawalRequestDto(
    @NotBlank(message = "El número de cuenta es obligatorio")
    String numeroCuenta,

    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser mayor a cero")
    BigDecimal monto
) {}