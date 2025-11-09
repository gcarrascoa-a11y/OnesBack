import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss'],
})
export class ShellComponent {
  theme = signal<'light' | 'dark'>('light');
  readonly currentYear = new Date().getFullYear();

  constructor(public auth: AuthService) {
    // Init theme
    const stored = (localStorage.getItem('theme') as 'light'|'dark'|null);
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(stored ?? (prefersDark ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  isAuthRoute(): boolean {
    return location.pathname.startsWith('/auth/');
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  logout(): void {
    this.auth.logout();
  }
}