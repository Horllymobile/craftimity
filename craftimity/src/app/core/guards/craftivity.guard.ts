import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { STORAGE_VARIABLES } from '../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class CraftiviyGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const app = localStorage.getItem(STORAGE_VARIABLES.APP);
    if (app && app === STORAGE_VARIABLES.CRAFTIVITY) {
      this.router.navigate(['/', 'craftivity']);
      return false;
    }
    this.router.navigate(['/', 'craftivity']);
    return true;
  }
}
