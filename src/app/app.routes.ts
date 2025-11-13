import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';
import { authGuard } from './core/guards/auth-guard';

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
          // índice: /inventario  -> va al resumen
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'resumen',
          },

          // /inventario/resumen  (vista principal: tabla + KPIs + modal de edición)
          {
            path: 'resumen',
            loadComponent: () =>
              import('./features/inventario/pages/resumen-inventario/resumen-inventario')
                .then(m => m.ResumenInventarioComponent),
            title: 'Resumen de inventario',
          },

          // /inventario/agregar
          {
            path: 'agregar',
            loadComponent: () =>
              import('./features/inventario/pages/agregar-producto/agregar-producto')
                .then(m => m.AgregarProductoPage),
            title: 'Agregar producto',
          },
        ],
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/pages/usuarios-lista/usuarios-lista')
            .then(m => m.UsuariosListaComponent),
        title: 'Usuarios',
      },

      // por defecto dentro del shell
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  // cualquier otra ruta
  { path: '**', redirectTo: '' },
];
