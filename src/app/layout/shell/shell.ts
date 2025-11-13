import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss'],
})
export class ShellComponent {
  theme = signal<Theme>('light');
  readonly currentYear = new Date().getFullYear();

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    this.theme.set(initialTheme);
    this.applyThemeClass(initialTheme);
  }

  // === helpers de rol/usuario ===
  get role(): string {
    return this.auth.currentRole() || '';
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get username(): string {
    return this.auth.currentUsername();
  }

  isAuthRoute(): boolean {
    return location.pathname.startsWith('/auth/');
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('theme', next);
    this.applyThemeClass(next);
  }

  private applyThemeClass(currentTheme: Theme): void {
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
