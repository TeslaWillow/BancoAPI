// ./src/main/java/com/banco/api/controller/CuentaController.java
package com.banco.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banco.api.dto.CuentaDTO;
import com.banco.api.dto.WithdrawalRequestDto;
import com.banco.api.service.CuentaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/cuentas")
public class CuentaController {

    private final CuentaService cuentaService;

    public CuentaController(CuentaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @GetMapping
    public ResponseEntity<List<CuentaDTO>> getAll() {
        return ResponseEntity.ok(cuentaService.findAll());
    }

    @GetMapping("/{numeroCuenta}")
    public ResponseEntity<CuentaDTO> getByNumeroCuenta(@PathVariable String numeroCuenta) {
        return ResponseEntity.ok(cuentaService.findByNumeroCuenta(numeroCuenta));
    }

    @PostMapping
    public ResponseEntity<CuentaDTO> create(@Valid @RequestBody CuentaDTO cuentaDTO) {
        CuentaDTO nuevaCuenta = cuentaService.save(cuentaDTO);
        return new ResponseEntity<>(nuevaCuenta, HttpStatus.CREATED);
    }

    @PutMapping("/{numeroCuenta}")
    public ResponseEntity<CuentaDTO> update(@PathVariable String numeroCuenta, @Valid @RequestBody CuentaDTO cuentaDTO) {
        return ResponseEntity.ok(cuentaService.update(numeroCuenta, cuentaDTO));
    }

    @DeleteMapping("/{numeroCuenta}")
    public ResponseEntity<Void> delete(@PathVariable String numeroCuenta) {
        cuentaService.deleteByNumeroCuenta(numeroCuenta);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/retiro")
    public ResponseEntity<Void> procesarRetiro(@Valid @RequestBody WithdrawalRequestDto request) {
        cuentaService.procesarRetiro(request);
        return ResponseEntity.ok().build();
    }
}