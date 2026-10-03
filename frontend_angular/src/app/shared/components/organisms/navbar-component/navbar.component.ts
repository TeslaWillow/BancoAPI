// ./frontend_angular/src/app/shared/components/organisms/navbar/navbar.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../../atoms/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  title = input<string>('BANCO');
}
