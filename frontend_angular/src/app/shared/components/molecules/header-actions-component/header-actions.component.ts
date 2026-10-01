// ./frontend_angular/src/app/shared/components/molecules/header-actions/header-actions.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../atoms/button/button.component';
import { SearchBarComponent } from '../search-bar-component/search-bar.component';

@Component({
  selector: 'app-header-actions',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ButtonComponent],
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
})
export class HeaderActionsComponent {
  public searchPlaceholder = input<string>('Buscar');
  public buttonText = input<string>('Nuevo');

  public search = output<string>();
  public actionClick = output<void>();
}
