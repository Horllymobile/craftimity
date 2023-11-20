import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { STORAGE_VARIABLES } from '../../constants/storage';

export const AuthGuard: CanActivateFn = () => {
  const app = localStorage.getItem(STORAGE_VARIABLES.APP);
  const router = inject(Router);
  const authService = inject(AuthService);
  console.log(authService.isAuthenticated());
  if (!authService.isAuthenticated()) {
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    localStorage.removeItem(STORAGE_VARIABLES.REGISTERATION_TOKEN);
    if (app === STORAGE_VARIABLES.CRAFTIMITY) {
      router.navigate(['/craftimity/page/login']);
    } else {
      router.navigate(['/craftivity/auth/login']);
    }
    return false;
  }
  return true;
};
