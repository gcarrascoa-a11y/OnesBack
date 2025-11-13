// src/app/features/reportes/pages/reportes-resumen/reportes-resumen.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService, Producto } from '../../../../core/services/inventario';

@Component({
  selector: 'app-reportes-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-resumen.html',
  styleUrls: ['./reportes-resumen.css']
})
export class ReportesResumenComponent implements OnInit {

  totalProductos = 0;
  valorTotalInventario = 0;
  cantidadTotal = 0;
  precioPromedio = 0;

  constructor(private inv: InventarioService) {}

  ngOnInit(): void {
    const productos: Producto[] = this.inv.all();

    this.totalProductos = productos.length;
    this.cantidadTotal = productos.reduce((sum, p) => sum + (p.stock ?? 0), 0);
    this.valorTotalInventario = productos.reduce(
      (sum, p) => sum + (p.stock ?? 0) * (p.precio ?? 0),
      0
    );

    const conPrecio = productos.filter(p => (p.precio ?? 0) > 0);
    const totalValorConPrecio = conPrecio.reduce(
      (sum, p) => sum + (p.stock ?? 0) * (p.precio ?? 0),
      0
    );

    this.precioPromedio =
      conPrecio.length > 0 ? Math.round(totalValorConPrecio / conPrecio.length) : 0;
  }
}
