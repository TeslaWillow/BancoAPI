// ./frontend_angular/src/app/layout/components/header/header.component.ts
import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/organisms/navbar-component/navbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
