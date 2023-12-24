import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { STORAGE_VARIABLES } from '../../constants/storage';

export const AuthGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    localStorage.removeItem(STORAGE_VARIABLES.REGISTERATION_TOKEN);
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
