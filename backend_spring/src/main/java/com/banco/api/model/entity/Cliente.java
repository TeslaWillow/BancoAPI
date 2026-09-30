// ./src/main/java/com/banco/api/model/entity/Cliente.java
package com.banco.api.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "cliente")
@PrimaryKeyJoinColumn(name = "id")
public class Cliente extends Persona {

    @Column(name = "cliente_id", nullable = false, unique = true, length = 50)
    private String clienteId;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false)
    private Boolean estado;
}