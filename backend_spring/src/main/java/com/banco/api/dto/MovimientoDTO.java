// ./src/main/java/com/banco/api/dto/MovimientoDTO.java
package com.banco.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.banco.api.model.enums.TipoMovimiento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoDTO {

    private Long id;
    private LocalDateTime fecha;
    private TipoMovimiento tipoMovimiento;

    @NotNull(message = "El valor es obligatorio")
    private BigDecimal valor;

    private BigDecimal saldo;

    @NotBlank(message = "El número de cuenta es obligatorio")
    private String numeroCuenta;

}