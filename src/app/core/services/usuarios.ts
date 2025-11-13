import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  role: 'admin' | 'user';
  creadoEn: string; // para mostrar fecha tipo 14-01-2024
}

@Injectable({ providedIn: 'root' })
export class Usuarios {
  private data: Usuario[] = [
    {
      id: 1,
      username: 'admin',
      nombreCompleto: 'Administrador Principal',
      email: 'admin@floreria.cl',
      role: 'admin',
      creadoEn: '14-01-2024',
    },
    {
      id: 2,
      username: 'usuario',
      nombreCompleto: 'Usuario de Consulta',
      email: 'usuario@floreria.cl',
      role: 'user',
      creadoEn: '19-01-2024',
    },
  ];

  all(): Usuario[] {
    return [...this.data];
  }
}
