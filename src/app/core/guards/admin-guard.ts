import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  // Solo permite pasar si el rol es admin
  if (auth.currentRole() === 'admin') {
    return true;
  }

  // Si NO es admin, lo mandamos al dashboard (o donde quieras)
  return inject(Router).parseUrl('/dashboard');
};
