// ./src/app/features/reportes/adapters/reporte.adapter.ts
import { MovimientoReporte, ReporteBackendResponseDTO } from '../models/reporte.model';

export class ReporteAdapter {
  static toDomainList(response: ReporteBackendResponseDTO): MovimientoReporte[] {
    if (!response || !response.cuentas) {
      return [];
    }

    return response.cuentas.flatMap((cuenta) =>
      cuenta.movimientos.map((mov) => ({
        date: mov.fecha,
        clientName: response.clienteNombre,
        accountNumber: mov.numeroCuenta || cuenta.numeroCuenta,
        accountType: mov.tipoCuenta || cuenta.tipoCuenta,
        initialBalance: mov.saldoInicial ?? cuenta.saldoInicial,
        status: mov.estado ?? cuenta.estado,
        movementValue: mov.valor,
        availableBalance: mov.saldoDisponible,
      })),
    );
  }
}
