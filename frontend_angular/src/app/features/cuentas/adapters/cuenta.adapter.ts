// ./src/app/features/cuentas/adapters/cuenta.adapter.ts
import { Cuenta, CuentaBackendDTO, CreateCuentaFormPayload } from '../models/cuenta.model';

export class CuentaAdapter {
  static toDomain(dto: CuentaBackendDTO): Cuenta {
    return {
      id: dto.id,
      accountNumber: dto.numeroCuenta,
      accountType: dto.tipoCuenta,
      initialBalance: dto.saldoInicial,
      status: dto.estado,
      clientId: dto.clienteId,
    };
  }

  static toDomainList(dtos: CuentaBackendDTO[]): Cuenta[] {
    return dtos.map(CuentaAdapter.toDomain);
  }

  static toApiCreate(payload: CreateCuentaFormPayload): CuentaBackendDTO {
    return {
      numeroCuenta: payload.accountNumber,
      tipoCuenta: payload.accountType,
      saldoInicial: Number(payload.initialBalance),
      estado: payload.status,
      clienteId: payload.clientId,
    };
  }

  static toApiUpdate(payload: Partial<CreateCuentaFormPayload>, cuenta: Cuenta): CuentaBackendDTO {
    return {
      numeroCuenta: cuenta.accountNumber,
      tipoCuenta: payload.accountType ?? cuenta.accountType,
      saldoInicial: Number(payload.initialBalance ?? cuenta.initialBalance),
      estado: payload.status ?? cuenta.status,
      clienteId: cuenta.clientId,
    };
  }
}
