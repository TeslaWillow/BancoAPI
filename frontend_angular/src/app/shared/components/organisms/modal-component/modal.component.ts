// ./frontend_angular/src/app/shared/components/organisms/modal/modal.component.ts
import { Component, input, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  public isOpen = input.required<boolean>();
  public title = input.required<string>();
  public closeOnBackdropClick = input<boolean>(false);

  public closeModal = output<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isOpen()) {
      event.preventDefault();
      this.closeModal.emit();
    }
  }

  public onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdropClick()) return;

    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal.emit();
    }
  }
}
