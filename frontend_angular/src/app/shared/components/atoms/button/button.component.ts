// ./frontend_angular/src/app/shared/components/atoms/button/button.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  public type = input<ButtonType>('button');
  public variant = input<ButtonVariant>('primary');
  public disabled = input<boolean>(false);
  public isLoading = input<boolean>(false);
  public ariaLabel = input<string | undefined>(undefined);

  public clicked = output<MouseEvent>();

  public handleClick(event: MouseEvent): void {
    if (this.disabled() || this.isLoading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
