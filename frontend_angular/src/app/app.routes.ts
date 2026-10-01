// ./frontend_angular/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout-component/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full',
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/components/clientes-page-component/clientes-page.component').then(
            (m) => m.ClientesPageComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'clientes',
  },
];
