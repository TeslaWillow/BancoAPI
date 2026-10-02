// ./src/app/features/movimientos/adapters/movimiento.adapter.ts
import {
  Movimiento,
  MovimientoBackendDTO,
  CreateMovimientoFormPayload,
} from '../models/movimiento.model';

export class MovimientoAdapter {
  static toDomain(dto: MovimientoBackendDTO): Movimiento {
    return {
      id: dto.id,
      date: dto.fecha,
      movementType: dto.tipoMovimiento,
      value: dto.valor,
      balance: dto.saldo,
      accountNumber: dto.numeroCuenta,
    };
  }

  static toDomainList(dtos: MovimientoBackendDTO[]): Movimiento[] {
    return dtos.map(MovimientoAdapter.toDomain);
  }

  static toApiCreate(payload: CreateMovimientoFormPayload): Partial<MovimientoBackendDTO> {
    // securing that value is negative if movementType is RETIRO
    const signedValue =
      payload.movementType === 'RETIRO' && payload.value > 0 ? -payload.value : payload.value;

    return {
      numeroCuenta: payload.accountNumber,
      tipoMovimiento: payload.movementType,
      valor: signedValue,
    };
  }
}
