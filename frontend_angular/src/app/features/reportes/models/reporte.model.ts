// ./src/app/features/reportes/models/reporte.model.ts

export interface MovimientoBackendDTO {
  fecha: string;
  tipoMovimiento: string;
  valor: number;
  numeroCuenta: string;
  saldoInicial: number;
  tipoCuenta: string;
  saldoDisponible: number;
  estado?: boolean;
}

export interface CuentaReporteBackendDTO {
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  estado: boolean;
  movimientos: MovimientoBackendDTO[];
}

export interface ReporteBackendResponseDTO {
  clienteNombre: string;
  clienteIdentificacion: string;
  cuentas: CuentaReporteBackendDTO[];
}

export interface MovimientoReporte {
  date: string;
  clientName: string;
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  status: boolean;
  movementValue: number;
  availableBalance: number;
}

export interface ReporteFilterParams {
  startDate: string;
  endDate: string;
  clientId: string;
}
