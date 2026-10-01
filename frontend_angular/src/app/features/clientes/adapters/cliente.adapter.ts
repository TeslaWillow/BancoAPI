import { Cliente } from '../models/cliente.model';

// ./frontend_angular/src/app/features/clientes/adapters/cliente.adapter.ts
export interface ClienteV1Response {
  cliente_id: string;
  nombres: string;
  apellidos: string;
  identificacion: string;
  estado: boolean;
}

export class ClienteAdapter {
  static fromV1ToDomain(dto: ClienteV1Response): Cliente {
    if (!dto) {
      throw new Error('DTO invalido para ClienteAdapter');
    }

    return {
      id: dto.cliente_id ?? '',
      fullName: `${dto.nombres ?? ''} ${dto.apellidos ?? ''}`.trim(),
      documentId: dto.identificacion ?? 'N/A',
      isActive: Boolean(dto.estado),
    };
  }
}
