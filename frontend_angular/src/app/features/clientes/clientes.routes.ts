// ./frontend_angular/src/app/features/clientes/clientes.routes.ts
import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/clientes-page-component/clientes-page.component').then(
        (m) => m.ClientesPageComponent,
      ),
  },
];
