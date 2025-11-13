import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuarios, Usuario } from '../../../../core/services/usuarios';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-lista.html',
  styleUrls: ['./usuarios-lista.scss'],
})
export class UsuariosListaComponent implements OnInit {
  usuarios: Usuario[] = [];

  totalUsuarios = 0;
  totalAdmins = 0;
  totalNormales = 0;

  constructor(private usuariosService: Usuarios) {}

  ngOnInit(): void {
    this.usuarios = this.usuariosService.all();
    this.totalUsuarios = this.usuarios.length;
    this.totalAdmins = this.usuarios.filter(u => u.role === 'admin').length;
    this.totalNormales = this.usuarios.filter(u => u.role === 'user').length;
  }

  onAgregarUsuario(): void {
    // De momento solo un placeholder
    alert('Aquí irá el formulario para agregar usuario 🙂');
  }

  onEditar(usuario: Usuario): void {
    // Placeholder para editar
    alert(`Editar usuario: ${usuario.username}`);
  }

  onEliminar(usuario: Usuario): void {
    const ok = confirm(`¿Eliminar usuario "${usuario.username}"?`);
    if (ok) {
      // Por ahora solo lo sacamos de la lista local
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
      this.totalUsuarios = this.usuarios.length;
      this.totalAdmins = this.usuarios.filter(u => u.role === 'admin').length;
      this.totalNormales = this.usuarios.filter(u => u.role === 'user').length;
    }
  }
}
