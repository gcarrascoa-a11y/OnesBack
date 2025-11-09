import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'reportes/crear',
        loadComponent: () => import('./features/reportes/pages/crear-reporte/crear-reporte').then(m => m.CrearReporteComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'inventario',
        loadComponent: () => import('./features/inventario/pages/productos-lista/productos-lista')
          .then(m => m.ProductosListaComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/usuarios/pages/usuarios-lista/usuarios-lista')
          .then(m => m.UsuariosListaComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];