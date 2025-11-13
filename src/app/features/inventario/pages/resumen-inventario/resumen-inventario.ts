// src/app/features/inventario/pages/resumen-inventario/resumen-inventario.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventarioService, Producto } from '../../../../core/services/inventario';

@Component({
  selector: 'app-resumen-inventario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resumen-inventario.html'
})

export class ResumenInventarioComponent implements OnInit {

  // Lista completa y lista filtrada
  lista: Producto[] = [];
  listaFiltrada: Producto[] = [];

  // Filtros
  filtro: 'todos' | 'disponibles' | 'bajo' | 'agotados' = 'todos';
  filtroEtiqueta = 'Todos los productos';

  // Stats
  total = 0;
  enStock = 0;
  disponibles = 0;
  bajos = 0;
  agotados = 0;

  // Modal / formulario
  isOpen = false;
  form!: FormGroup;
  productoActual: Producto | null = null;

  constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService
  ) {
    this.form = this.fb.group({
      id: [''],
      nombre: [{ value: '', disabled: false }, [Validators.required]],
      categoria: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.min(0)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    // Tu servicio es síncrono
    this.lista = this.inventarioService.all();
    this.aplicarFiltro();
    this.recalcularStats();
  }

  /** Aplica el filtro actual a la lista */
  private aplicarFiltro(): void {
    switch (this.filtro) {
      case 'disponibles':
        this.listaFiltrada = this.lista.filter(p => p.stock > 0);
        this.filtroEtiqueta = 'Productos disponibles';
        break;
      case 'bajo':
        this.listaFiltrada = this.lista.filter(p => p.stock > 0 && p.stock <= p.min);
        this.filtroEtiqueta = 'Productos con stock bajo';
        break;
      case 'agotados':
        this.listaFiltrada = this.lista.filter(p => p.stock <= 0);
        this.filtroEtiqueta = 'Productos agotados';
        break;
      default:
        this.listaFiltrada = [...this.lista];
        this.filtroEtiqueta = 'Todos los productos';
        break;
    }
  }

  /** Recalcula totales para los chips y las estadísticas */
  private recalcularStats(): void {
    this.total = this.lista.length;
    this.enStock = this.lista.filter(p => p.stock > 0).length;
    this.disponibles = this.enStock;
    this.agotados = this.lista.filter(p => p.stock <= 0).length;
    this.bajos = this.lista.filter(p => p.stock > 0 && p.stock <= p.min).length;
  }

  setFiltro(f: 'todos' | 'disponibles' | 'bajo' | 'agotados'): void {
    this.filtro = f;
    this.aplicarFiltro();
  }

  estado(p: Producto): { cls: string; label: string } {
    if (p.stock <= 0) {
      return { cls: 'badge-danger', label: 'Agotado' };
    }
    if (p.stock <= p.min) {
      return { cls: 'badge-warning', label: 'Stock bajo' };
    }
    return { cls: 'badge-success', label: 'Disponible' };
  }

  trackById = (_: number, p: Producto) => p.id;

  // ---------- Modal ----------

  openModal(p: Producto): void {
    this.productoActual = p;
    this.isOpen = true;

    this.form.reset({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria ?? '',
      stock: p.stock ?? 0,
      precio: p.precio ?? 0,
      descripcion: p.descripcion ?? ''
    });

    // Nombre solo lectura en el modal
    this.form.get('nombre')?.disable();
  }

  closeModal(): void {
    this.isOpen = false;
    this.productoActual = null;
    this.form.enable();
  }

  save(): void {
    if (!this.form.valid || !this.productoActual) {
      return;
    }

    const raw = this.form.getRawValue() as Partial<Producto>;

    const valores: Producto = {
      ...this.productoActual,
      ...raw,
      id: this.productoActual.id,
      stock: Number(raw.stock ?? this.productoActual.stock),
      nombre: this.productoActual.nombre  // no se edita nombre desde el modal
    };

    // Actualiza la copia local
    const idx = this.lista.findIndex(p => p.id === valores.id);
    if (idx >= 0) {
      this.lista[idx] = valores;
    }

    // Actualiza el stock en el servicio
    this.inventarioService.setStock(valores.id, valores.stock);

    this.aplicarFiltro();
    this.recalcularStats();
    this.closeModal();
  }
}
