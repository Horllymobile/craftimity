import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { STORAGE_VARIABLES } from "../constants/storage";
import { AuthService } from "../services/auth/auth.service";

export const AuthGuard: CanActivateFn = async () => {
  const app = localStorage.getItem(STORAGE_VARIABLES.APP);
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.isAuth()) {
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    localStorage.removeItem(STORAGE_VARIABLES.REGISTERATION_TOKEN);
    if (app === STORAGE_VARIABLES.CRAFTIMITY) {
      router.navigate(["/craftimity/page/login"]);
    } else {
      router.navigate(["/craftivity/auth/login"]);
    }
    return false;
  }
  return true;
};
