// ./src/app/features/clientes/adapters/cliente.adapter.ts
import { Cliente, ClienteBackendDTO, CreateClienteFormPayload } from '../models/cliente.model';

export class ClienteAdapter {
  static toDomain(dto: ClienteBackendDTO): Cliente {
    return {
      id: dto.id,
      fullName: dto.nombre,
      documentId: dto.identificacion,
      address: dto.direccion,
      phone: dto.telefono,
      status: dto.estado,
      gender: dto.genero,
      age: dto.edad,
      password: dto.contrasena,
      clientId: dto.clienteId,
    };
  }

  static toDomainList(dtos: ClienteBackendDTO[]): Cliente[] {
    return dtos.map(ClienteAdapter.toDomain);
  }

  static toApiCreate(payload: CreateClienteFormPayload): ClienteBackendDTO {
    return {
      nombre: payload.fullName,
      identificacion: payload.documentId,
      direccion: payload.address,
      telefono: payload.phone,
      contrasena: payload.password,
      estado: payload.status,
      genero: payload.gender,
      edad: Number(payload.age),
      clienteId: payload.clientId,
    };
  }

  static toApiUpdate(
    payload: Partial<CreateClienteFormPayload>,
    cliente: Cliente,
  ): Partial<ClienteBackendDTO> {
    return {
      nombre: payload.fullName ?? cliente.fullName,
      identificacion: payload.documentId ?? cliente.documentId,
      direccion: payload.address ?? cliente.address,
      telefono: payload.phone ?? cliente.phone,
      estado: payload.status ?? cliente.status,
      genero: payload.gender ?? cliente.gender,
      edad: Number(payload.age ?? cliente.age),
      contrasena: cliente.password,
      clienteId: cliente.clientId,
    };
  }
}
