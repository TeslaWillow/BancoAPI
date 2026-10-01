// ./src/main/java/com/banco/api/controller/CuentaController.java
package com.banco.api.controller;

import com.banco.api.dto.CuentaDTO;
import com.banco.api.dto.WithdrawalRequestDto;
import com.banco.api.service.CuentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
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