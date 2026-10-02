// ./src/main/java/com/banco/api/service/MovimientoService.java
package com.banco.api.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banco.api.dto.MovimientoDTO;
import com.banco.api.exception.BusinessException;
import com.banco.api.exception.DailyLimitExceededException;
import com.banco.api.exception.InsufficientBalanceException;
import com.banco.api.exception.ResourceNotFoundException;
import com.banco.api.model.entity.Cuenta;
import com.banco.api.model.entity.Movimiento;
import com.banco.api.repository.CuentaRepository;
import com.banco.api.repository.MovimientoRepository;

@Service
public class MovimientoService {

    private static final BigDecimal DAILY_LIMIT = new BigDecimal("1000");
    private final MovimientoRepository movimientoRepository;
    private final CuentaRepository cuentaRepository;

    public MovimientoService(MovimientoRepository movimientoRepository, CuentaRepository cuentaRepository) {
        this.movimientoRepository = movimientoRepository;
        this.cuentaRepository = cuentaRepository;
    }

    @Transactional(readOnly = true)
    public List<MovimientoDTO> findAll() {
        return movimientoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public MovimientoDTO findById(Long id) {
        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento no encontrado con el ID: " + id));
        return mapToDTO(movimiento);
    }

    @Transactional(readOnly = true)
    public List<MovimientoDTO> findByNumeroCuenta(String numeroCuenta) {
        return movimientoRepository.findByCuentaNumeroCuenta(numeroCuenta)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public MovimientoDTO registrarMovimiento(MovimientoDTO movimientoDTO) {
        Cuenta cuenta = cuentaRepository.findById(movimientoDTO.getNumeroCuenta())
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada con el número: " + movimientoDTO.getNumeroCuenta()));

        // verificar estado de la Cuenta
        if (Boolean.FALSE.equals(cuenta.getEstado())) {
            throw new BusinessException("La cuenta se encuentra inactiva");
        }

        BigDecimal monto = movimientoDTO.getValor();

        if (monto.compareTo(BigDecimal.ZERO) == 0) {
            throw new BusinessException("El valor del movimiento no puede ser cero");
        }

        BigDecimal saldoActual = cuenta.getSaldoInicial();

        // Lógica de Débitos / Retiros (Monto negativo)
        if (monto.compareTo(BigDecimal.ZERO) < 0) {
            BigDecimal montoAbsoluto = monto.abs();

            // Saldo insuficiente o saldo en cero
            if (saldoActual.compareTo(BigDecimal.ZERO) <= 0 || saldoActual.compareTo(montoAbsoluto) < 0) {
                throw new InsufficientBalanceException("Saldo no disponible");
            }

            // Validación del límite diario ($1000)
            LocalDateTime inicioHoy = LocalDate.now().atStartOfDay();
            LocalDateTime finHoy = LocalDate.now().atTime(LocalTime.MAX);

            BigDecimal retiradoHoy = movimientoRepository
                    .findTotalRetiradoHoy(cuenta.getNumeroCuenta(), inicioHoy, finHoy)
                    .orElse(BigDecimal.ZERO)
                    .abs();

            BigDecimal totalConNuevoRetiro = retiradoHoy.add(montoAbsoluto);

            if (totalConNuevoRetiro.compareTo(DAILY_LIMIT) > 0) {
                throw new DailyLimitExceededException("Cupo diario Excedido");
            }
        }

        BigDecimal nuevoSaldo = saldoActual.add(monto);
        cuenta.setSaldoInicial(nuevoSaldo);
        cuentaRepository.save(cuenta);

        Movimiento movimiento = Movimiento.builder()
                .fecha(movimientoDTO.getFecha() != null ? movimientoDTO.getFecha() : LocalDateTime.now())
                .tipoMovimiento(movimientoDTO.getTipoMovimiento())
                .valor(monto)
                .saldo(nuevoSaldo)
                .cuenta(cuenta)
                .build();

        Movimiento savedMovimiento = movimientoRepository.save(movimiento);
        return mapToDTO(savedMovimiento);
    }

    // --- Mapper Methods ---
    private MovimientoDTO mapToDTO(Movimiento movimiento) {
        return MovimientoDTO.builder()
                .id(movimiento.getId())
                .fecha(movimiento.getFecha())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .valor(movimiento.getValor())
                .saldo(movimiento.getSaldo())
                .numeroCuenta(movimiento.getCuenta().getNumeroCuenta())
                .build();
    }

}