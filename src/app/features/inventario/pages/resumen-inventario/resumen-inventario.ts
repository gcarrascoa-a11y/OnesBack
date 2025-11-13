import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService, Producto } from '../../../../core/services/inventario';

type Filtro = 'todos' | 'disponibles' | 'bajo' | 'agotados';

@Component({
  selector: 'app-resumen-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-inventario.html',
  styleUrls: ['./resumen-inventario.scss'],
})
export class ResumenInventarioComponent implements OnInit {
  productos: Producto[] = [];
  filtro: Filtro = 'disponibles';

  constructor(private inventario: InventarioService) {}

  ngOnInit(): void {
    this.refrescar();
  }

  private refrescar(): void {
    this.productos = this.inventario.all();
  }

  // Productos filtrados según el botón seleccionado
  get productosFiltrados(): Producto[] {
    switch (this.filtro) {
      case 'disponibles':
        return this.productos.filter(p => p.stock > 0 && p.stock > (p.min ?? 0));
      case 'bajo':
        return this.productos.filter(p => p.stock > 0 && p.stock <= (p.min ?? 0));
      case 'agotados':
        return this.productos.filter(p => p.stock === 0);
      case 'todos':
      default:
        return this.productos;
    }
  }

  // Totales para la tarjeta de abajo
  get totalProductos(): number {
    return this.productos.length;
  }

  get totalEnStock(): number {
    return this.productos.filter(p => p.stock > 0).length;
  }

  get totalStockBajo(): number {
    return this.productos.filter(p => p.stock > 0 && p.stock <= (p.min ?? 0)).length;
  }

  get totalAgotados(): number {
    return this.productos.filter(p => p.stock === 0).length;
  }

  cambiarFiltro(filtro: Filtro): void {
    this.filtro = filtro;
  }

  // === ACCIONES ===

  editarProducto(prod: Producto): void {
    const nuevoNombre = prompt('Nuevo nombre del producto:', prod.nombre);
    if (nuevoNombre === null || nuevoNombre.trim() === '') {
      return;
    }

    const nuevoStockStr = prompt('Nueva cantidad en stock:', String(prod.stock));
    if (nuevoStockStr === null) {
      return;
    }

    const nuevoStock = Number(nuevoStockStr);
    if (Number.isNaN(nuevoStock) || nuevoStock < 0) {
      alert('Cantidad inválida.');
      return;
    }

    // Usamos los métodos del servicio
    this.inventario.rename(prod.id, nuevoNombre.trim());
    this.inventario.setStock(prod.id, nuevoStock);
    this.refrescar();
  }

  eliminarProducto(prod: Producto): void {
    const ok = confirm(`¿Eliminar el producto "${prod.nombre}"?`);
    if (!ok) return;

    this.inventario.remove(prod.id);
    this.refrescar();
  }
}
