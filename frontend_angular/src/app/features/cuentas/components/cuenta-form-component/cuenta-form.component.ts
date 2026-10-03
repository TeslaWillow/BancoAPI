// ./src/app/features/cuentas/components/cuenta-form/cuenta-form.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuenta, CreateCuentaFormPayload, TipoCuenta } from '../../models/cuenta.model';
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

  private currentCuenta: Cuenta | null = null;

  @Input() clientes: Cliente[] = [];

  /**
   * Cuenta a editar. Si es null, el formulario funciona en modo creación.
   */
  @Input()
  set cuenta(value: Cuenta | null) {
    this.currentCuenta = value;
    this.configureMode();
  }
  get cuenta(): Cuenta | null {
    return this.currentCuenta;
  }

  /** Modo creación: emite el payload completo. */
  @Output() submitForm = new EventEmitter<CreateCuentaFormPayload>();
  /** Modo edición: emite únicamente los campos que cambiaron. */
  @Output() updateForm = new EventEmitter<Partial<CreateCuentaFormPayload>>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    accountNumber: ['', [Validators.required]],
    accountType: ['AHORROS' as TipoCuenta, [Validators.required]],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
    clientId: ['', [Validators.required]],
    status: [true, [Validators.required]],
  });

  get isEditMode(): boolean {
    return this.currentCuenta !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.updateForm.emit(this.getChanges());
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

  /**
   * Compara el formulario con la cuenta original y devuelve solo lo modificado.
   * accountNumber y clientId están bloqueados en edición, por lo que no se comparan.
   */
  private getChanges(): Partial<CreateCuentaFormPayload> {
    const original = this.currentCuenta;
    if (!original) {
      return {};
    }

    const raw = this.form.getRawValue();
    const changes: Partial<CreateCuentaFormPayload> = {};

    if (raw.accountType !== original.accountType) {
      changes.accountType = raw.accountType;
    }
    if (Number(raw.initialBalance) !== original.initialBalance) {
      changes.initialBalance = Number(raw.initialBalance);
    }
    if (raw.status !== original.status) {
      changes.status = raw.status;
    }

    return changes;
  }

  /**
   * Edición: precarga los datos y bloquea número de cuenta y cliente.
   * Creación: restablece los valores por defecto y habilita todos los campos.
   */
  private configureMode(): void {
    const { accountNumber, clientId } = this.form.controls;
    const cuenta = this.currentCuenta;

    if (cuenta) {
      this.form.patchValue({
        accountNumber: cuenta.accountNumber,
        accountType: cuenta.accountType,
        initialBalance: cuenta.initialBalance,
        clientId: cuenta.clientId,
        status: cuenta.status,
      });
      accountNumber.disable();
      clientId.disable();
    } else {
      this.form.reset();
      accountNumber.enable();
      clientId.enable();
    }
  }
}
