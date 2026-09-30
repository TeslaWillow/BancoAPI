// ./src/main/java/com/banco/api/service/ClienteService.java
package com.banco.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.banco.api.dto.ClienteDTO;
import com.banco.api.exception.BusinessException;
import com.banco.api.exception.ResourceNotFoundException;
import com.banco.api.model.entity.Cliente;
import com.banco.api.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteDTO findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el ID: " + id));
        return mapToDTO(cliente);
    }

    @Transactional(readOnly = true)
    public ClienteDTO findByClienteId(String clienteId) {
        Cliente cliente = clienteRepository.findByClienteId(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el clienteId: " + clienteId));
        return mapToDTO(cliente);
    }

    @Transactional
    public ClienteDTO save(ClienteDTO clienteDTO) {
        // Guard Clause: Unicidad de clienteId
        if (clienteRepository.existsByClienteId(clienteDTO.getClienteId())) {
            throw new BusinessException("El clienteId '" + clienteDTO.getClienteId() + "' ya se encuentra registrado");
        }

        // Guard Clause: Unicidad de identificación (Cédula/DNI)
        if (clienteRepository.existsByIdentificacion(clienteDTO.getIdentificacion())) {
            throw new BusinessException("La identificación '" + clienteDTO.getIdentificacion() + "' ya se encuentra registrada");
        }

        Cliente cliente = mapToEntity(clienteDTO);
        Cliente savedCliente = clienteRepository.save(cliente);
        return mapToDTO(savedCliente);
    }

    @Transactional
    public ClienteDTO update(Long id, ClienteDTO clienteDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el ID: " + id));

        // Actualización de campos de Persona y Cliente
        clienteExistente.setNombre(clienteDTO.getNombre());
        clienteExistente.setGenero(clienteDTO.getGenero());
        clienteExistente.setEdad(clienteDTO.getEdad());
        clienteExistente.setDireccion(clienteDTO.getDireccion());
        clienteExistente.setTelefono(clienteDTO.getTelefono());
        clienteExistente.setContrasena(clienteDTO.getContrasena());
        clienteExistente.setEstado(clienteDTO.getEstado());

        Cliente updatedCliente = clienteRepository.save(clienteExistente);
        return mapToDTO(updatedCliente);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con el ID: " + id);
        }
        clienteRepository.deleteById(id);
    }

    // --- Mapper Methods ---

    private ClienteDTO mapToDTO(Cliente cliente) {
        return ClienteDTO.builder()
                .id(cliente.getId())
                .nombre(cliente.getNombre())
                .genero(cliente.getGenero())
                .edad(cliente.getEdad())
                .identificacion(cliente.getIdentificacion())
                .direccion(cliente.getDireccion())
                .telefono(cliente.getTelefono())
                .clienteId(cliente.getClienteId())
                .contrasena(cliente.getContrasena())
                .estado(cliente.getEstado())
                .build();
    }

    private Cliente mapToEntity(ClienteDTO dto) {
        return Cliente.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .genero(dto.getGenero())
                .edad(dto.getEdad())
                .identificacion(dto.getIdentificacion())
                .direccion(dto.getDireccion())
                .telefono(dto.getTelefono())
                .clienteId(dto.getClienteId())
                .contrasena(dto.getContrasena())
                .estado(dto.getEstado())
                .build();
    }
}