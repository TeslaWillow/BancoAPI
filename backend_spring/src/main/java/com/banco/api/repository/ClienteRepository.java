// ./src/main/java/com/banco/api/repository/ClienteRepository.java
package com.banco.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banco.api.model.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    //  Spring Data JPA automatically derives the SQL query from the method name
    Optional<Cliente> findByClienteId(String clienteId);

    boolean existsByClienteId(String clienteId);

    boolean existsByIdentificacion(String identificacion);
}