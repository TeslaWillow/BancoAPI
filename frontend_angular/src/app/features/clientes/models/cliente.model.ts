// ./src/app/features/clientes/models/cliente.model.ts

export interface ClienteBackendDTO {
  id?: number;
  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  contrasena: string;
  estado: boolean;
  genero: string;
  edad: number;
  clienteId: string;
}

export interface Cliente {
  id?: number;
  fullName: string;
  documentId: string;
  address: string;
  phone: string;
  password?: string;
  status: boolean;
  gender: string;
  age: number;
  clientId: string;
}

export interface CreateClienteFormPayload {
  fullName: string;
  documentId: string;
  address: string;
  phone: string;
  password: string;
  status: boolean;
  gender: string;
  age: number;
  clientId: string;
}
