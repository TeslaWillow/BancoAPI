package com.banco.api.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banco.api.dto.WithdrawalRequestDto;
import com.banco.api.exception.DailyLimitExceededException;
import com.banco.api.exception.InsufficientBalanceException;
import com.banco.api.model.entity.Cuenta;
import com.banco.api.repository.CuentaRepository;

@Service
public class CuentaService {

    private final CuentaRepository cuentaRepository;

    public CuentaService(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    @Transactional
    public void procesarRetiro(WithdrawalRequestDto request) {
        // Search account by number account
        Cuenta cuenta = cuentaRepository
            .findById(request.numeroCuenta())
            .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada con el número: " + request.numeroCuenta()));

        // Insufficient balance (using saldoInicial)
        if (cuenta.getSaldoInicial().compareTo(request.monto()) < 0) {
            throw new InsufficientBalanceException("Saldo insuficiente en la cuenta: " + request.numeroCuenta());
        }

        // Daily limit exceeded
        BigDecimal projectedDailyTotal = cuenta.getSaldoInicial().subtract(request.monto());
        if (projectedDailyTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new DailyLimitExceededException("Cupo diario excedido para la cuenta: " + request.numeroCuenta());
        }

        // Update balance
        cuenta.setSaldoInicial(projectedDailyTotal);

        cuentaRepository.save(cuenta);
    }
}