// ./src/main/java/com/banco/api/repository/CuentaRepository.java
package com.banco.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banco.api.model.entity.Cuenta;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, String> {

    // Search for all accounts belonging to a client using the Person/Client ID
    // clienteId (Long)
    List<Cuenta> findByClienteId(Long clienteId);

    // Search for all accounts belonging to a client using the Person/Client ID
    // clienteId (String)
    List<Cuenta> findByClienteClienteId(String clienteId);

    // Return only active accounts belonging to a client using the Person/Client
    // numeroCuenta (String)
    Optional<Cuenta> findByNumeroCuentaAndEstadoTrue(String numeroCuenta);
}