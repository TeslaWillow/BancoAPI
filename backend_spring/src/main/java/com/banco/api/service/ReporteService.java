// ./src/main/java/com/banco/api/service/ReporteService.java
package com.banco.api.service;

import com.banco.api.dto.CuentaReporteDTO;
import com.banco.api.dto.EstadoCuentaDTO;
import com.banco.api.dto.MovimientoReporteDTO;
import com.banco.api.exception.ResourceNotFoundException;
import com.banco.api.model.entity.Cliente;
import com.banco.api.model.entity.Cuenta;
import com.banco.api.repository.ClienteRepository;
import com.banco.api.repository.CuentaRepository;
import com.banco.api.repository.MovimientoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReporteService {

    private final ClienteRepository clienteRepository;
    private final CuentaRepository cuentaRepository;
    private final MovimientoRepository movimientoRepository;

    public ReporteService(ClienteRepository clienteRepository,
                          CuentaRepository cuentaRepository,
                          MovimientoRepository movimientoRepository) {
        this.clienteRepository = clienteRepository;
        this.cuentaRepository = cuentaRepository;
        this.movimientoRepository = movimientoRepository;
    }

    @Transactional(readOnly = true)
    public EstadoCuentaDTO generarEstadoCuenta(String clienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        Cliente cliente = clienteRepository.findByClienteId(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con clienteId: " + clienteId));

        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.atTime(LocalTime.MAX);

        List<Cuenta> cuentas = cuentaRepository.findByClienteClienteId(clienteId);

        List<CuentaReporteDTO> cuentasReporte = cuentas.stream().map(cuenta -> {
            List<MovimientoReporteDTO> movimientos = movimientoRepository
                    .findByCuentaNumeroCuentaAndFechaBetweenOrderByFechaDesc(cuenta.getNumeroCuenta(), inicio, fin)
                    .stream()
                    .map(m -> MovimientoReporteDTO.builder()
                            .fecha(m.getFecha())
                            .tipoMovimiento(m.getTipoMovimiento() != null ? m.getTipoMovimiento().name() : null)
                            .valor(m.getValor())
                            .saldoDisponible(m.getSaldo())
                            .build())
                    .toList();

            return CuentaReporteDTO.builder()
                    .numeroCuenta(cuenta.getNumeroCuenta())
                    .tipoCuenta(cuenta.getTipoCuenta() != null ? cuenta.getTipoCuenta().name() : null)
                    .saldoInicial(cuenta.getSaldoInicial())
                    .estado(cuenta.getEstado())
                    .movimientos(movimientos)
                    .build();
        }).toList();

        return EstadoCuentaDTO.builder()
                .clienteNombre(cliente.getNombre())
                .clienteIdentificacion(cliente.getIdentificacion())
                .cuentas(cuentasReporte)
                .build();
    }
}