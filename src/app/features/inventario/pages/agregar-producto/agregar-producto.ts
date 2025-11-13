import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InventarioService } from '../../../../core/services/inventario';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agregar-producto.html',
  styleUrls: ['./agregar-producto.scss'],
})
export class AgregarProductoPage {
  private fb = inject(FormBuilder);
  private inv = inject(InventarioService);
  private router = inject(Router);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(64)]],
    categoria: ['', [Validators.required, Validators.maxLength(48)]],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    descripcion: [''],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;

    this.inv.add(v.nombre!, v.cantidad ?? 0, 0, {
      categoria: v.categoria ?? '',
      precio: v.precio ?? 0,
      descripcion: v.descripcion ?? '',
    });

    this.router.navigate(['/inventario/productos-lista'], { queryParams: { added: v.nombre } });
  }

  limpiar() {
    this.form.reset({ cantidad: 0, precio: 0 });
  }
}
