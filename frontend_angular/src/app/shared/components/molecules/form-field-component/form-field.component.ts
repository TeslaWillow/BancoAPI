// ./frontend_angular/src/app/shared/components/molecules/form-field/form-field.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent {
  public label = input.required<string>();
  public forId = input.required<string>();
  public required = input<boolean>(false);
  public errorMessage = input<string | null>(null);
}
