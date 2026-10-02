// ./src/app/features/cuentas/models/cuenta.model.ts

export type TipoCuenta = 'AHORROS' | 'CORRIENTE';

export interface CuentaBackendDTO {
  id?: number;
  numeroCuenta: string;
  tipoCuenta: TipoCuenta;
  saldoInicial: number;
  estado: boolean;
  clienteId: string;
}

export interface Cuenta {
  id?: number;
  accountNumber: string;
  accountType: TipoCuenta;
  initialBalance: number;
  status: boolean;
  clientId: string;
}

export interface CreateCuentaFormPayload {
  accountNumber: string;
  accountType: TipoCuenta;
  initialBalance: number;
  status: boolean;
  clientId: string;
}
