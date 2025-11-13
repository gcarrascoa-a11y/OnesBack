import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // Login (fuera del shell)
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(m => m.LoginComponent),
    title: 'Iniciar sesión',
  },

  // App protegida
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard')
            .then(m => m.DashboardComponent),
        title: 'Panel',
      },

      // INVENTARIO
      {
        path: 'inventario',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'resumen',
          },
          {
            path: 'resumen',
            loadComponent: () =>
              import('./features/inventario/pages/resumen-inventario/resumen-inventario')
                .then(m => m.ResumenInventarioComponent),
            title: 'Resumen de inventario',
          },
          {
            path: 'agregar',
            loadComponent: () =>
              import('./features/inventario/pages/agregar-producto/agregar-producto')
                .then(m => m.AgregarProductoPage),
            title: 'Agregar producto',
          },
        ],
      },

      // REPORTES
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reportes/pages/reportes-resumen/reportes-resumen')
            .then(m => m.ReportesResumenComponent),
        title: 'Reportes',
      },

      // USUARIOS (solo admin)
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/usuarios/pages/usuarios-lista/usuarios-lista')
            .then(m => m.UsuariosListaComponent),
        title: 'Usuarios',
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
