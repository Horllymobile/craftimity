import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { STORAGE_VARIABLES } from '../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const app = localStorage.getItem(STORAGE_VARIABLES.APP);
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem(STORAGE_VARIABLES.USER);
      localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
      localStorage.removeItem(STORAGE_VARIABLES.REGISTERATION_TOKEN);
      if (app === STORAGE_VARIABLES.CRAFTIMITY) {
        this.router.navigate(['/craftimity/page/login'], {
          queryParams: { returnUrl: state.url },
        });
      } else {
        this.router.navigate(['/craftivity/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
      }
      return false;
    }
    return true;
  }
}
