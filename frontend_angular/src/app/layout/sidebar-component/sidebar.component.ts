// ./frontend_angular/src/app/layout/components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { label: 'Clientes', route: '/clientes' },
    { label: 'Cuentas', route: '/cuentas' },
    { label: 'Movimientos', route: '/movimientos' },
    { label: 'Reportes', route: '/reportes' },
  ];
}
