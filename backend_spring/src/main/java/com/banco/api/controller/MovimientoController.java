// ./src/main/java/com/banco/api/controller/MovimientoController.java
package com.banco.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banco.api.dto.MovimientoDTO;
import com.banco.api.service.MovimientoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/movimientos")
public class MovimientoController {

    private final MovimientoService movimientoService;

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    @GetMapping
    public ResponseEntity<List<MovimientoDTO>> getAll() {
        return ResponseEntity.ok(movimientoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(movimientoService.findById(id));
    }

    @GetMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<List<MovimientoDTO>> getByNumeroCuenta(@PathVariable String numeroCuenta) {
        return ResponseEntity.ok(movimientoService.findByNumeroCuenta(numeroCuenta));
    }

    @PostMapping
    public ResponseEntity<MovimientoDTO> registrar(@Valid @RequestBody MovimientoDTO movimientoDTO) {
        MovimientoDTO nuevoMovimiento = movimientoService.registrarMovimiento(movimientoDTO);
        return new ResponseEntity<>(nuevoMovimiento, HttpStatus.CREATED);
    }
}