import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { STORAGE_VARIABLES } from "../constants/storage";

export const SessionGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const app = localStorage.getItem(STORAGE_VARIABLES.APP);
  if (authService.isAuthenticated()) {
    if (app === STORAGE_VARIABLES.CRAFTIMITY) {
      router.navigate([`/craftimity/admin/home`]);
    } else {
      router.navigate([`/craftivity/pages`]);
    }
    return false;
  }
  return true;
};
