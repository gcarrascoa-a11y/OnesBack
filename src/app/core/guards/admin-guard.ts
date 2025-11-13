import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (auth.currentRole() === 'admin') {
    return true;
  }

  // Si no es admin, lo mandamos al dashboard
  return inject(Router).parseUrl('/dashboard');
};
