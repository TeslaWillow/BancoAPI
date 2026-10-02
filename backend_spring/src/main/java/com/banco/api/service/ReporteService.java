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
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.kernel.colors.ColorConstants;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.itextpdf.io.source.ByteArrayOutputStream;

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

    @Transactional(readOnly = true)
    public ByteArrayInputStream generarEstadoCuentaPdf(String clienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        EstadoCuentaDTO estadoCuenta = generarEstadoCuenta(clienteId, fechaInicio, fechaFin);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(out)) {
            PdfDocument pdf = new PdfDocument(writer);
            try (Document document = new Document(pdf)) {
                Paragraph title = new Paragraph("Estado de Cuenta")
                        .setFontSize(18)
                        .setBold()
                        .setTextAlignment(TextAlignment.LEFT)
                        .setMarginBottom(10);
                document.add(title);
                
                document.add(new Paragraph("Cliente: " + estadoCuenta.getClienteNombre()).setBold());
                document.add(new Paragraph("Identificación: " + estadoCuenta.getClienteIdentificacion()));
                document.add(new Paragraph("Rango: " + fechaInicio + " a " + fechaFin).setMarginBottom(15));
                
                Table table = new Table(UnitValue.createPercentArray(new float[]{16, 14, 12, 14, 12, 14, 18}))
                        .useAllAvailableWidth();
                
                String[] headers = {"Fecha", "Número Cuenta", "Tipo", "Saldo Inicial", "Estado", "Movimiento", "Saldo Disponible"};
                for (String header : headers) {
                    Cell headerCell = new Cell()
                            .add(new Paragraph(header).setBold().setFontSize(9))
                            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
                    table.addHeaderCell(headerCell);
                }
                
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
                
                if (estadoCuenta.getCuentas() != null) {
                    for (CuentaReporteDTO cuenta : estadoCuenta.getCuentas()) {
                        if (cuenta.getMovimientos() != null) {
                            for (MovimientoReporteDTO mov : cuenta.getMovimientos()) {
                                table.addCell(new Cell().add(new Paragraph(mov.getFecha() != null ? mov.getFecha().format(formatter) : "").setFontSize(8)));
                                table.addCell(new Cell().add(new Paragraph(cuenta.getNumeroCuenta()).setFontSize(8)));
                                table.addCell(new Cell().add(new Paragraph(cuenta.getTipoCuenta()).setFontSize(8)));
                                table.addCell(new Cell().add(new Paragraph("$" + cuenta.getSaldoInicial()).setFontSize(8)));
                                table.addCell(new Cell().add(new Paragraph(cuenta.getEstado() ? "Activo" : "Inactivo").setFontSize(8)));
                                table.addCell(new Cell().add(new Paragraph("$" + mov.getValor()).setFontSize(8)));
                                table.addCell(new Cell().add(new Paragraph("$" + mov.getSaldoDisponible()).setFontSize(8)));
                            }
                        }
                    }
                }
                
                document.add(table);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF de Estado de Cuenta", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    
}