// ./src/main/java/com/banco/api/model/entity/Movimiento.java
package com.banco.api.model.entity;

import com.banco.api.model.enums.TipoMovimiento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "movimientos")
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal saldo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero_cuenta", nullable = false)
    private Cuenta cuenta;
}