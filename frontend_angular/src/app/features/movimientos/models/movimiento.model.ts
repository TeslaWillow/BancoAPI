// ./src/app/features/movimientos/models/movimiento.model.ts

export type TipoMovimiento = 'DEPOSITO' | 'RETIRO';

export interface MovimientoBackendDTO {
  id?: number;
  fecha?: string;
  tipoMovimiento: TipoMovimiento;
  valor: number;
  saldo: number;
  numeroCuenta: string;
}

export interface Movimiento {
  id?: number;
  date?: string;
  movementType: TipoMovimiento;
  value: number;
  balance: number;
  accountNumber: string;
}

export interface CreateMovimientoFormPayload {
  accountNumber: string;
  movementType: TipoMovimiento;
  value: number;
}
