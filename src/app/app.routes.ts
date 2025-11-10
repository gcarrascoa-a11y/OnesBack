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
      // RUTA BASE ORIGINAL DE INVENTARIO: La hacemos el índice.
      {
        path: 'inventario',
        children: [
            // Sub-ruta por defecto (para /inventario)
            { 
                path: '', 
                loadComponent: () => import('./features/inventario/pages/productos-lista/productos-lista')
                .then(m => m.ProductosListaComponent)
            },
            // Sub-ruta: Lista de Productos (Para la opción "Lista de Productos")
            { 
                path: 'productos-lista', 
                loadComponent: () => import('./features/inventario/pages/productos-lista/productos-lista')
                .then(m => m.ProductosListaComponent)
            },
            // NUEVA RUTA: Resumen General
            {
                path: 'resumen',
                loadComponent: () => import('./features/inventario/pages/productos-lista/productos-lista') // REEMPLAZAR con ResumenComponent real
                .then(m => m.ProductosListaComponent),
                title: 'Resumen de Inventario'
            },
            // NUEVA RUTA: Stock Bajo
            {
                path: 'stock-bajo',
                loadComponent: () => import('./features/inventario/pages/productos-lista/productos-lista') // Reemplazar con StockBajoComponent
                .then(m => m.ProductosListaComponent),
                title: 'Productos con Stock Bajo'
            },
            // NUEVA RUTA: Productos Agotados
            {
                path: 'agotados',
                loadComponent: () => import('./features/inventario/pages/productos-lista/productos-lista') // Reemplazar con AgotadosComponent
                .then(m => m.ProductosListaComponent),
                title: 'Productos Agotados'
            },
        ]
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