// ./src/app/features/reportes/pages/reportes-page/reportes-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReporteApiService } from '../../services/reporte-api.service';
import { ClienteApiService } from '../../../clientes/services/cliente-api.service';
import { MovimientoReporte } from '../../models/reporte.model';
import { Cliente } from '../../../clientes/models/cliente.model';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.scss',
})
export class ReportesPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reporteApi = inject(ReporteApiService);
  private readonly clienteApi = inject(ClienteApiService);

  readonly reportData = signal<MovimientoReporte[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isPdfDownloading = signal<boolean>(false);

  readonly filterForm = this.fb.nonNullable.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    clientId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteApi.getAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  onFilter(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const params = this.filterForm.getRawValue();

    this.reporteApi.getReportData(params).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al generar reporte', err);
        this.isLoading.set(false);
      },
    });
  }

  onExportPdf(): void {
    if (this.filterForm.invalid) return;

    this.isPdfDownloading.set(true);
    const params = this.filterForm.getRawValue();

    this.reporteApi.downloadPdf(params).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Estado_de_Cuenta_${params.clientId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isPdfDownloading.set(false);
      },
      error: (err) => {
        console.error('Error al descargar PDF', err);
        this.isPdfDownloading.set(false);
      },
    });
  }
}
