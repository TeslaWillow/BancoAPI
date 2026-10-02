// ./src/main/java/com/banco/api/repository/ClienteRepository.java
package com.banco.api.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.banco.api.model.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    //  Spring Data JPA automatically derives the SQL query from the method name
    Optional<Cliente> findByClienteId(String clienteId);

    // Return only active customer by clienteId (username)
    Optional<Cliente> findByClienteIdAndEstadoTrue(String clienteId);

    // Return ALL active client
    List<Cliente> findByEstadoTrue();

    // Return only active customer by id
    Optional<Cliente> findByIdAndEstadoTrue(Long id);

    // Check if clienteId (username) exists
    boolean existsByClienteId(String clienteId);

    // Check if identificacion exists
    boolean existsByIdentificacion(String identificacion);

    // Disable all accounts of a customer
    @Modifying
    @Query("UPDATE Cuenta c SET c.estado = false WHERE c.cliente.clienteId = :clienteId")
    void disableCuentasByClienteId(@Param("clienteId") String clienteId);
}