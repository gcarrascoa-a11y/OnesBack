import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria?: string;
  stock: number;
  min: number;
  precio?: number;
  proveedor?: string;
  descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private data: Producto[] = [
    {
      id: 1,
      nombre: 'Rosa roja',
      categoria: 'Flores',
      stock: 12,
      min: 5,
      precio: 1200,
      proveedor: 'Proveedor A',
      descripcion: 'Rosa roja de tallo largo',
    },
    {
      id: 2,
      nombre: 'Clavel blanco',
      categoria: 'Flores',
      stock: 3,
      min: 5,
      precio: 800,
      proveedor: 'Proveedor B',
      descripcion: 'Clavel blanco estándar',
    },
    {
      id: 3,
      nombre: 'Lirio',
      categoria: 'Flores',
      stock: 0,
      min: 2,
      precio: 1500,
      proveedor: 'Proveedor C',
      descripcion: 'Lirio blanco',
    },
  ];

  private nextId = 4;

  all(): Producto[] {
    return [...this.data];
  }

  add(
    nombre: string,
    stock: number,
    min: number,
    extra?: Partial<Producto>
  ): void {
    const nuevo: Producto = {
      id: this.nextId++,
      nombre,
      stock,
      min,
      categoria: extra?.categoria,
      precio: extra?.precio,
      proveedor: extra?.proveedor,
      descripcion: extra?.descripcion,
    };

    this.data.push(nuevo);
  }

  setStock(id: number, stock: number): void {
    const p = this.data.find(x => x.id === id);
    if (p) p.stock = stock;
  }

  rename(id: number, nombre: string): void {
    const p = this.data.find(x => x.id === id);
    if (p) p.nombre = nombre;
  }

  remove(id: number): void {
    this.data = this.data.filter(p => p.id !== id);
  }
}
