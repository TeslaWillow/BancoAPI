// ./src/app/features/clientes/components/cliente-form/cliente-form.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente, CreateClienteFormPayload } from '../../models/cliente.model';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { InputComponent } from '../../../../shared/components/atoms/input/input.component';
import { FormFieldComponent } from '../../../../shared/components/molecules/form-field-component/form-field.component';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, FormFieldComponent],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss',
})
export class ClienteFormComponent {
  private readonly fb = inject(FormBuilder);

  private currentCliente: Cliente | null = null;

  /**
   * Cliente a editar. Si es null, el formulario funciona en modo creación.
   */
  @Input()
  set cliente(value: Cliente | null) {
    this.currentCliente = value;
    this.configureMode();
  }
  get cliente(): Cliente | null {
    return this.currentCliente;
  }

  @Output() submitForm = new EventEmitter<CreateClienteFormPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    documentId: ['', [Validators.required]],
    clientId: ['', [Validators.required]],
    password: ['', [Validators.required]],
    gender: ['MASCULINO', [Validators.required]],
    age: [18, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    status: [true, [Validators.required]],
  });

  get isEditMode(): boolean {
    return this.currentCliente !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue incluye clientId aunque esté deshabilitado en modo edición
    this.submitForm.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private hasFieldError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isInvalid(field: string): boolean {
    return this.hasFieldError(field);
  }

  /**
   * Edición: precarga los datos, el clientId queda de solo lectura y la
   * contraseña deja de ser obligatoria (la actualización no la envía).
   * Creación: restablece validaciones y valores por defecto.
   */
  private configureMode(): void {
    const { password, clientId } = this.form.controls;
    const cliente = this.currentCliente;

    if (cliente) {
      this.form.patchValue({
        fullName: cliente.fullName,
        documentId: cliente.documentId,
        clientId: cliente.clientId,
        gender: cliente.gender,
        age: cliente.age,
        address: cliente.address,
        phone: cliente.phone,
        status: cliente.status,
      });
      password.clearValidators();
      clientId.disable();
    } else {
      this.form.reset();
      password.setValidators([Validators.required]);
      clientId.enable();
    }

    password.updateValueAndValidity();
  }
}
