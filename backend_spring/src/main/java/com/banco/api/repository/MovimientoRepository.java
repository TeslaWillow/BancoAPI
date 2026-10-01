// ./src/main/java/com/banco/api/repository/MovimientoRepository.java
package com.banco.api.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.banco.api.model.entity.Movimiento;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    // Find all movements of an account
    List<Movimiento> findByCuentaNumeroCuenta(String numeroCuenta);

    // Obtain last movement 
    Optional<Movimiento> findTopByCuentaNumeroCuentaOrderByFechaDescIdDesc(String numeroCuenta);

    // Obtain movements of an account within a date range (used for the Report)
    List<Movimiento> findByCuentaNumeroCuentaAndFechaBetweenOrderByFechaAsc(
            String numeroCuenta, 
            LocalDateTime fechaInicio, 
            LocalDateTime fechaFin
    );

    // Obtain movements of an account within a date range (used for the Report)
    List<Movimiento> findByCuentaNumeroCuentaAndFechaBetweenOrderByFechaDesc(
            String numeroCuenta, 
            LocalDateTime fechaInicio, 
            LocalDateTime fechaFin
    );

    // Query the movements of all accounts of a client in a date range
    List<Movimiento> findByCuentaClienteClienteIdAndFechaBetweenOrderByFechaAsc(
            String clienteId, 
            LocalDateTime fechaInicio, 
            LocalDateTime fechaFin
    );

    // Sum the accumulated debits (withdrawals) of the day for control of the daily limit of $1,000
    @Query("SELECT COALESCE(SUM(ABS(m.valor)), 0) FROM Movimiento m " +
           "WHERE m.cuenta.numeroCuenta = :numeroCuenta " +
           "AND m.valor < 0 " +
           "AND m.fecha BETWEEN :inicioDia AND :finDia")
    BigDecimal sumDebitosDelDia(
            @Param("numeroCuenta") String numeroCuenta,
            @Param("inicioDia") LocalDateTime inicioDia,
            @Param("finDia") LocalDateTime finDia);
}