// ./src/main/java/com/banco/api/controller/ReporteController.java
package com.banco.api.controller;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.banco.api.dto.EstadoCuentaDTO;
import com.banco.api.service.ReporteService;

@RestController
@RequestMapping("/api/v1/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping
    public ResponseEntity<EstadoCuentaDTO> getEstadoCuenta(
            @RequestParam("cliente") String clienteId,
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        EstadoCuentaDTO reporte = reporteService.generarEstadoCuenta(clienteId, fechaInicio, fechaFin);
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/pdf")
    public ResponseEntity<InputStreamResource> descargarPdf(
            @RequestParam("clienteId") String clienteId,
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        ByteArrayInputStream bis = reporteService.generarEstadoCuentaPdf(clienteId, fechaInicio, fechaFin);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Estado_de_Cuenta_" + clienteId + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}