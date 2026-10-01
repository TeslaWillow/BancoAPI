// ./src/app/features/clientes/components/cliente-form/cliente-form.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateClienteFormPayload } from '../../models/cliente.model';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss',
})
export class ClienteFormComponent {
  private readonly fb = inject(FormBuilder);

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

  private hasFieldError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isInvalid(field: string): boolean {
    return this.hasFieldError(field);
  }
}
