import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventarioService, Producto } from '../../../../core/services/inventario';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-productos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIf, NgFor],
  templateUrl: './productos-lista.html',
  styleUrls: ['./productos-lista.scss'],
})
export class ProductosListaComponent {
  // Tipados para evitar “Object is of type 'unknown'”
  private inv: InventarioService = inject(InventarioService);
  private auth: AuthService = inject(AuthService);

  // Estado
  productos = signal<Producto[]>(this.inv.all());
  isAdmin = computed(() => this.auth.currentRole() === 'admin');

  editingId = signal<number | null>(null);
  draftName = signal<string>('');

  // UI
  isLow = (p: Producto) => (p.stock ?? 0) <= (p.min ?? 0);

  // Acciones
  setStock(p: Producto, value: number | null) {
    if (!this.isAdmin()) return;
    const v = Math.max(0, Math.floor(value ?? p.stock ?? 0));
    this.inv.setStock(p.id, v);
    this.productos.set(this.inv.all());
  }

  startRename(p: Producto) {
    if (!this.isAdmin()) return;
    this.editingId.set(p.id);
    this.draftName.set(p.nombre);
  }
  saveRename(p: Producto) {
    if (!this.isAdmin()) return;
    const name = (this.draftName() || '').trim();
    if (!name) return;
    this.inv.rename(p.id, name);
    this.productos.set(this.inv.all());
    this.editingId.set(null);
  }
  cancelRename() {
    this.editingId.set(null);
  }

  add() {
    if (!this.isAdmin()) return;
    this.inv.add('Nuevo', 0, 0);
    this.productos.set(this.inv.all());
  }
  remove(p: Producto) {
    if (!this.isAdmin()) return;
    if (confirm(`Eliminar "${p.nombre}"?`)) {
      this.inv.remove(p.id);
      this.productos.set(this.inv.all());
    }
  }
}