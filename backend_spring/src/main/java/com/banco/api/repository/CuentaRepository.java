// ./src/main/java/com/banco/api/repository/CuentaRepository.java
package com.banco.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banco.api.model.entity.Cuenta;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, String> {

    // Search for all accounts belonging to a client using the Person/Client ID
    List<Cuenta> findByClienteId(Long clienteId);

    // Search for accounts associated with the business 'clienteId' (e.g., 'jlema')
    List<Cuenta> findByClienteClienteId(String clienteId);
}