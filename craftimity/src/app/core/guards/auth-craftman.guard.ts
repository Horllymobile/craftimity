import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { UsersService } from '../services/users/users.service';
import { ERole } from '../enums/role';

@Injectable({
  providedIn: 'root',
})
export class AuthCraftmanGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.authService.isAuthenticated() &&
      this.usersService.userProfile?.role === ERole.CRAFTMAN
    ) {
      this.router.navigate(['/craftivity']);
      return true;
    }
    return false;
  }
}
