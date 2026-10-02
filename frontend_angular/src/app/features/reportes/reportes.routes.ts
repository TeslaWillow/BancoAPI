// ./frontend_angular/src/app/features/cuentas/cuentas.routes.ts
import { Routes } from '@angular/router';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reportes-page-component/reportes-page.component').then(
        (m) => m.ReportesPageComponent,
      ),
  },
];
