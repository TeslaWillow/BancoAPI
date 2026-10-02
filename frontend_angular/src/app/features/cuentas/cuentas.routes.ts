// ./frontend_angular/src/app/features/cuentas/cuentas.routes.ts
import { Routes } from '@angular/router';

export const CUENTAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cuentas-page-component/cuentas-page.component').then(
        (m) => m.CuentasPageComponent,
      ),
  },
];
