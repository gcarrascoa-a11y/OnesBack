import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService, Producto } from '../../../../core/services/inventario';
import jsPDF from 'jspdf';

interface CategoriaResumen {
  categoria: string;
  cantidad: number;
  valor: number;
}

@Component({
  selector: 'app-reportes-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-resumen.html',
  styleUrls: [], // <--- IMPORTANTE: SIN SCSS AQUÍ
})
export class ReportesResumenComponent implements OnInit {
  productos: Producto[] = [];

  // Métricas generales
  totalProductos = 0;
  totalUnidades = 0;
  valorTotal = 0;
  precioPromedio = 0;

  // Por categoría
  resumenCategorias: CategoriaResumen[] = [];
  maxCantidadCategoria = 0;

  // Por estado de stock (porcentaje del valor total)
  estadoPorcentaje = {
    disponible: 0,
    bajo: 0,
    agotado: 0,
  };

  constructor(private inventario: InventarioService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.productos = this.inventario.all();

    this.totalProductos = this.productos.length;
    this.totalUnidades = this.productos.reduce((sum, p) => sum + p.stock, 0);
    this.valorTotal = this.productos.reduce(
      (sum, p) => sum + (p.precio ?? 0) * p.stock,
      0
    );
    this.precioPromedio =
      this.totalProductos > 0
        ? Math.round(this.valorTotal / this.totalProductos)
        : 0;

    this.calcularPorCategoria();
    this.calcularPorEstado();
  }

  private calcularPorCategoria(): void {
    const mapa = new Map<string, { cantidad: number; valor: number }>();

    for (const p of this.productos) {
      const key = p.categoria || 'Sin categoría';
      const actual = mapa.get(key) ?? { cantidad: 0, valor: 0 };
      actual.cantidad += p.stock;
      actual.valor += (p.precio ?? 0) * p.stock;
      mapa.set(key, actual);
    }

    this.resumenCategorias = Array.from(mapa.entries()).map(
      ([categoria, v]) => ({
        categoria,
        cantidad: v.cantidad,
        valor: v.valor,
      })
    );

    this.maxCantidadCategoria =
      this.resumenCategorias.length > 0
        ? Math.max(...this.resumenCategorias.map(c => c.cantidad))
        : 0;
  }

  private calcularPorEstado(): void {
    let valorDisponible = 0;
    let valorBajo = 0;
    let valorAgotado = 0;

    for (const p of this.productos) {
      const valorProducto = (p.precio ?? 0) * p.stock;
      if (p.stock === 0) {
        valorAgotado += (p.precio ?? 0) * (p.min || 0); // valor teórico
      } else if (p.stock <= (p.min ?? 0)) {
        valorBajo += valorProducto;
      } else {
        valorDisponible += valorProducto;
      }
    }

    const totalValorEstados = valorDisponible + valorBajo + valorAgotado;

    if (totalValorEstados === 0) {
      this.estadoPorcentaje = { disponible: 0, bajo: 0, agotado: 0 };
    } else {
      this.estadoPorcentaje = {
        disponible: Math.round((valorDisponible * 100) / totalValorEstados),
        bajo: Math.round((valorBajo * 100) / totalValorEstados),
        agotado: Math.round((valorAgotado * 100) / totalValorEstados),
      };
    }
  }

  generarPdf(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const ahora = new Date();
    const fechaStr = new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(ahora);

    let y = 20;

    doc.setFontSize(16);
    doc.text('Reporte de Inventario - FloriCoop', 14, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Generado el ${fechaStr}`, 14, y);
    y += 6;
    doc.text(
      'Resumen del comportamiento del inventario durante el último periodo (aprox. mes actual).',
      14,
      y
    );
    y += 10;

    doc.setFontSize(13);
    doc.text('Resumen general', 14, y);
    y += 7;

    doc.setFontSize(10);
    doc.text(`• Total de productos: ${this.totalProductos}`, 14, y);
    y += 6;
    doc.text(
      `• Cantidad total en stock: ${this.totalUnidades} unidades`,
      14,
      y
    );
    y += 6;
    doc.text(
      `• Valor total inventario: CLP ${this.valorTotal.toLocaleString('es-CL')}`,
      14,
      y
    );
    y += 6;
    doc.text(
      `• Precio promedio por producto: CLP ${this.precioPromedio.toLocaleString('es-CL')}`,
      14,
      y
    );
    y += 10;

    doc.setFontSize(13);
    doc.text('Distribución por estado de stock', 14, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(
      `• Disponible: ${this.estadoPorcentaje.disponible}% del valor total`,
      14,
      y
    );
    y += 6;
    doc.text(
      `• Stock bajo: ${this.estadoPorcentaje.bajo}% del valor total`,
      14,
      y
    );
    y += 6;
    doc.text(
      `• Agotados: ${this.estadoPorcentaje.agotado}% del valor total`,
      14,
      y
    );
    y += 10;

    doc.setFontSize(13);
    doc.text('Detalle por categoría', 14, y);
    y += 7;
    doc.setFontSize(10);

    for (const c of this.resumenCategorias) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `- ${c.categoria}: ${c.cantidad} unidades, CLP ${c.valor.toLocaleString(
          'es-CL'
        )}`,
        14,
        y
      );
      y += 6;
    }

    y += 6;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.text('Listado de productos', 14, y);
    y += 7;
    doc.setFontSize(9);

    for (const p of this.productos) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const estado =
        p.stock === 0
          ? 'Agotado'
          : p.stock <= (p.min ?? 0)
          ? 'Stock bajo'
          : 'Disponible';

      doc.text(
        `• ${p.nombre} (${p.categoria || 'Sin categoría'}) - Stock: ${
          p.stock
        } / Mín: ${p.min}, Precio: CLP ${(p.precio ?? 0).toLocaleString(
          'es-CL'
        )} [${estado}]`,
        14,
        y
      );
      y += 5;
    }

    doc.save(
      `reporte-inventario-${ahora.getFullYear()}-${(ahora.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.pdf`
    );
  }
}
