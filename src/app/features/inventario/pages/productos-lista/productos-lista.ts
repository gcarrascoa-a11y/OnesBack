import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InventarioService } from '../../../../core/services/inventario';

/** Tipo de UI con campos opcionales para no chocar con el tipo del servicio */
type UiProducto = {
  id: number;
  nombre: string;
  stock: number;
  min?: number;
  categoria?: string;
  precio?: number;
  descripcion?: string;
};

@Component({
  standalone: true,
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.html',
  styleUrls: ['./productos-lista.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductosListaComponent implements OnDestroy {
  private inv = inject(InventarioService);
  private fb = inject(FormBuilder);

  /** Fuente de verdad local (clonada del servicio) */
  productos: UiProducto[] = this.inv.all().map(p => ({ ...p }));

  /** Filtro actual */
  filtro: 'todos' | 'disponibles' | 'bajo' | 'agotados' = 'todos';

  /** Lista visible según filtro */
  get lista(): UiProducto[] {
    switch (this.filtro) {
      case 'disponibles':
        return this.productos.filter(p => (p.stock ?? 0) > (p.min ?? 0));
      case 'bajo':
        return this.productos.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= (p.min ?? 0));
      case 'agotados':
        return this.productos.filter(p => (p.stock ?? 0) <= 0);
      default:
        return this.productos;
    }
  }

  /** KPIs */
  get total()    { return this.productos.length; }
  get enStock()  { return this.productos.filter(p => (p.stock ?? 0) > (p.min ?? 0)).length; }
  get bajos()    { return this.productos.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= (p.min ?? 0)).length; }
  get agotados() { return this.productos.filter(p => (p.stock ?? 0) <= 0).length; }

  /** Badges de estado */
  estado(p: UiProducto) {
    const min = p.min ?? 0;
    if ((p.stock ?? 0) <= 0) return { label: 'Agotado', cls: 'badge-danger' };
    if ((p.stock ?? 0) <= min) return { label: 'Bajo', cls: 'badge-warning' };
    return { label: 'Disponible', cls: 'badge-success' };
  }

  /** Modal */
  isOpen = false;
  selected: UiProducto | null = null;

  // SIN "proveedor": coincide con el HTML del modal
  form = this.fb.group({
    nombre: [{ value: '', disabled: true }],
    categoria: ['', [Validators.maxLength(48)]],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    precio: [0, [Validators.min(0)]],
    descripcion: [''],
  });

  openModal(p: UiProducto) {
    this.selected = p;
    this.form.reset({
      nombre: p.nombre,
      categoria: p.categoria ?? '',
      cantidad: p.stock ?? 0,
      precio: p.precio ?? 0,
      descripcion: p.descripcion ?? '',
    });
    this.isOpen = true;
    document.body.classList.add('modal-open'); // bloquea scroll del fondo
  }

  closeModal() {
    this.isOpen = false;
    this.selected = null;
    document.body.classList.remove('modal-open');
  }

  ngOnDestroy() {
    // limpieza por si se navega con el modal abierto
    document.body.classList.remove('modal-open');
  }

  save() {
    if (!this.selected || this.form.invalid) return;
    const v = this.form.getRawValue();

    // 1) actualiza stock con el método existente
    this.inv.setStock(this.selected.id, v.cantidad ?? 0);

    // 2) si el servicio tiene update(...), úsalo; si no, no rompe
    const maybeUpdate = (this.inv as any).update as
      | ((id: number, patch: Partial<UiProducto>) => void)
      | undefined;

    if (typeof maybeUpdate === 'function') {
      maybeUpdate(this.selected.id, {
        categoria: v.categoria ?? '',
        precio: v.precio ?? 0,
        descripcion: v.descripcion ?? '',
      });
    }

    // refresca datos y cierra
    this.productos = this.inv.all().map(p => ({ ...p }));
    this.closeModal();
  }

  /** trackBy para evitar re-render innecesario */
  trackById(_index: number, p: UiProducto) {
    return p.id;
  }
}
