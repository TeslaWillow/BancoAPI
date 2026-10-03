// ./src/main/java/com/banco/api/service/CuentaService.java
package com.banco.api.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banco.api.dto.CuentaDTO;
import com.banco.api.dto.WithdrawalRequestDto;
import com.banco.api.exception.DailyLimitExceededException;
import com.banco.api.exception.InsufficientBalanceException;
import com.banco.api.exception.ResourceNotFoundException;
import com.banco.api.model.entity.Cliente;
import com.banco.api.model.entity.Cuenta;
import com.banco.api.repository.ClienteRepository;
import com.banco.api.repository.CuentaRepository;

@Service
public class CuentaService {

    private final CuentaRepository cuentaRepository;
    private final ClienteRepository clienteRepository;

    public CuentaService(CuentaRepository cuentaRepository, ClienteRepository clienteRepository) {
        this.cuentaRepository = cuentaRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<CuentaDTO> findAll() {
        return cuentaRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CuentaDTO findByNumeroCuenta(String numeroCuenta) {
        Cuenta cuenta = cuentaRepository.findById(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada con el número: " + numeroCuenta));
        return mapToDTO(cuenta);
    }

    @Transactional
    public CuentaDTO save(CuentaDTO cuentaDTO) {
        Cliente cliente = clienteRepository.findByClienteId(cuentaDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con clienteId: " + cuentaDTO.getClienteId()));

        Cuenta cuenta = Cuenta.builder()
                .numeroCuenta(cuentaDTO.getNumeroCuenta())
                .tipoCuenta(cuentaDTO.getTipoCuenta())
                .saldoInicial(cuentaDTO.getSaldoInicial())
                .estado(cuentaDTO.getEstado())
                .cliente(cliente)
                .build();

        Cuenta savedCuenta = cuentaRepository.save(cuenta);
        return mapToDTO(savedCuenta);
    }

    @Transactional
    public CuentaDTO update(String numeroCuenta, CuentaDTO cuentaDTO) {
        Cuenta cuenta = cuentaRepository.findById(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada con el número: " + numeroCuenta));

        Cliente cliente = clienteRepository.findByClienteId(cuentaDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con clienteId: " + cuentaDTO.getClienteId()));

        cuenta.setTipoCuenta(cuentaDTO.getTipoCuenta());
        cuenta.setSaldoInicial(cuentaDTO.getSaldoInicial());
        cuenta.setEstado(cuentaDTO.getEstado());
        cuenta.setCliente(cliente); // Same clienteId

        Cuenta updatedCuenta = cuentaRepository.save(cuenta);
        return mapToDTO(updatedCuenta);
    }

    @Transactional
    public void deleteByNumeroCuenta(String numeroCuenta) {
        Cuenta cuenta = cuentaRepository.findByNumeroCuentaAndEstadoTrue(numeroCuenta)
            .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada (o inactiva) con el número: " + numeroCuenta));

        // Disable account
        cuenta.setEstado(false);
        cuentaRepository.save(cuenta);
    }

    @Transactional
    public void procesarRetiro(WithdrawalRequestDto request) {
        Cuenta cuenta = cuentaRepository.findById(request.numeroCuenta())
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada con el número: " + request.numeroCuenta()));

        if (cuenta.getSaldoInicial().compareTo(request.monto()) < 0) {
            throw new InsufficientBalanceException("Saldo insuficiente en la cuenta: " + request.numeroCuenta());
        }

        BigDecimal projectedDailyTotal = cuenta.getSaldoInicial().subtract(request.monto());
        if (projectedDailyTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new DailyLimitExceededException("Cupo diario excedido para la cuenta: " + request.numeroCuenta());
        }

        cuenta.setSaldoInicial(projectedDailyTotal);
        cuentaRepository.save(cuenta);
    }

    // --- Mapper Methods ---

    private CuentaDTO mapToDTO(Cuenta cuenta) {
        return CuentaDTO.builder()
                .numeroCuenta(cuenta.getNumeroCuenta())
                .tipoCuenta(cuenta.getTipoCuenta())
                .saldoInicial(cuenta.getSaldoInicial())
                .estado(cuenta.getEstado())
                .clienteId(cuenta.getCliente() != null ? cuenta.getCliente().getClienteId() : null)
                .build();
    }
}