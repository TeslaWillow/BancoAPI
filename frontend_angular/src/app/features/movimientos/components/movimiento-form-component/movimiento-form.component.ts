// ./src/app/features/movimientos/components/movimiento-form/movimiento-form.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateMovimientoFormPayload, TipoMovimiento } from '../../models/movimiento.model';
import { Cuenta } from '../../../cuentas/models/cuenta.model';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movimiento-form.component.html',
  styleUrl: './movimiento-form.component.scss',
})
export class MovimientoFormComponent {
  private readonly _fb = inject(FormBuilder);

  @Input() cuentas: Cuenta[] = [];
  @Input() errorMessage: string | null = null;
  @Output() submitForm = new EventEmitter<CreateMovimientoFormPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this._fb.nonNullable.group({
    accountNumber: ['', [Validators.required]],
    movementType: ['DEPOSITO' as TipoMovimiento, [Validators.required]],
    value: [0, [Validators.required, Validators.min(0.01)]],
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
