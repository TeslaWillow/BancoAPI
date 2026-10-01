// ./src/main/java/com/banco/api/dto/EstadoCuentaDTO.java
package com.banco.api.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadoCuentaDTO {
    private String clienteNombre;
    private String clienteIdentificacion;
    private List<CuentaReporteDTO> cuentas;
}