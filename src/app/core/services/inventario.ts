// src/app/core/services/inventario.ts
import { Injectable } from '@angular/core';

export type Producto = {
  id: number;
  nombre: string;
  stock: number;
  min: number;
  // Campos opcionales para el formulario de “Agregar Producto”
  categoria?: string;
  precio?: number;
  proveedor?: string;
  descripcion?: string;
  creadoEn?: Date;
};

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private _data: Producto[] = [
    { id: 1, nombre: 'Rosa',   stock: 10, min: 2, categoria: 'Flores', proveedor: 'Flores del Valle' },
    { id: 2, nombre: 'Clavel', stock: 25, min: 3, categoria: 'Flores' },
  ];
  private nextId = 3;

  all(): Producto[] {
    // Devolvemos copia para evitar mutaciones externas
    return this._data.map(p => ({ ...p }));
  }

  setStock(id: number, stock: number): void {
    const p = this._data.find(x => x.id === id);
    if (p) p.stock = stock;
  }

  rename(id: number, nombre: string): void {
    const p = this._data.find(x => x.id === id);
    if (p) p.nombre = nombre;
  }

  /**
   * Agrega un producto nuevo.
   * - Compatibilidad hacia atrás: puedes seguir llamando add(nombre, stock, min)
   * - Extensión: acepta un cuarto parámetro "extra" con los campos opcionales
   */
  add(
    nombre: string,
    stock: number = 0,
    min: number = 0,
    extra: Partial<Omit<Producto, 'id' | 'nombre' | 'stock' | 'min'>> = {}
  ): void {
    this._data.push({
      id: this.nextId++,
      nombre,
      stock,
      min,
      creadoEn: new Date(),
      ...extra
    });
  }

  remove(id: number): void {
    this._data = this._data.filter(p => p.id !== id);
  }

  // Helpers opcionales si luego quieres filtrar vistas
  lowStock(): Producto[] {
    return this._data.filter(p => p.stock <= (p.min ?? 0));
  }

  outOfStock(): Producto[] {
    return this._data.filter(p => p.stock <= 0);
  }
}
