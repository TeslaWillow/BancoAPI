// ./src/app/features/cuentas/components/cuenta-form/cuenta-form.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCuentaFormPayload, TipoCuenta } from '../../models/cuenta.model';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { InputComponent } from '../../../../shared/components/atoms/input/input.component';
import { FormFieldComponent } from '../../../../shared/components/molecules/form-field-component/form-field.component';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, FormFieldComponent],
  templateUrl: './cuenta-form.component.html',
  styleUrl: './cuenta-form.component.scss',
})
export class CuentaFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() clientes: Cliente[] = [];
  @Output() submitForm = new EventEmitter<CreateCuentaFormPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required]],
    accountType: ['AHORROS' as TipoCuenta, [Validators.required]],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
    clientId: ['', [Validators.required]],
    status: [true, [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
