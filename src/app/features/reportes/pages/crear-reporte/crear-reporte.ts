import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventarioService } from '../../../../core/services/inventario';

@Component({
  standalone: true,
  selector: 'app-crear-reporte',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './crear-reporte.html',
  styleUrls: ['./crear-reporte.scss']
})
export class CrearReporteComponent {
  private inv = inject(InventarioService);

  desde: string = '';
  hasta: string = '';
  formato: 'csv'|'json' = 'csv';

  linkDescarga = '';
  nombreArchivo = '';

  generar() {
    const data = this.inv.all(); // TODO: filtrar por fechas si aplicara.
    let content = '';
    let mime = '';
    if (this.formato === 'csv') {
      const header = 'id,nombre,stock,min\n';
      const rows = data.map(d => `${d.id},${d.nombre},${d.stock},${d.min ?? 0}`).join('\n');
      content = header + rows + '\n';
      mime = 'text/csv';
      this.nombreArchivo = 'reporte_inventario.csv';
    } else {
      content = JSON.stringify({ desde: this.desde, hasta: this.hasta, items: data }, null, 2);
      mime = 'application/json';
      this.nombreArchivo = 'reporte_inventario.json';
    }
    const blob = new Blob([content], { type: mime });
    this.linkDescarga = URL.createObjectURL(blob);
  }
}