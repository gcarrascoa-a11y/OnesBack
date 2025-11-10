import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';

// Tipo para mayor claridad
type Theme = 'light' | 'dark';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss'],
})
export class ShellComponent {
  // Inicialización usando Signals
  theme = signal<Theme>('light');
  readonly currentYear = new Date().getFullYear();

  constructor(public auth: AuthService) {
    // 1. Inicializar el tema desde localStorage o preferencias del sistema
    const stored = (localStorage.getItem('theme') as Theme | null);
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Establece el valor inicial de la señal
    const initialTheme = stored ?? (prefersDark ? 'dark' : 'light');
    this.theme.set(initialTheme);
    
    // 2. Aplicar la clase al inicializar, utilizando el mismo patrón que la lógica de toggle
    this.applyThemeClass(initialTheme);
  }

  isAuthRoute(): boolean {
    return location.pathname.startsWith('/auth/');
  }

  // LÓGICA MODIFICADA PARA QUE FUNCIONE EL MODO NOCHE
  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('theme', next);

    // LLAMA A LA FUNCIÓN PARA APLICAR LAS CLASES AL BODY
    this.applyThemeClass(next);
  }

  // Función auxiliar para aplicar o remover la clase 'dark-mode'
  private applyThemeClass(currentTheme: Theme): void {
    if (currentTheme === 'dark') {
        // Agrega la clase 'dark-mode' al BODY, donde aplicamos los estilos
        document.body.classList.add('dark-mode');
    } else {
        // Remueve la clase 'dark-mode'
        document.body.classList.remove('dark-mode');
    }
  }

  logout(): void {
    this.auth.logout();
  }
}