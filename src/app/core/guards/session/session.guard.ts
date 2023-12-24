import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { STORAGE_VARIABLES } from '../../constants/storage';

export const SessionGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    router.navigate([`/`]);
    return false;
  }
  return true;
};
