import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_VARIABLES } from '../constants/storage';
import { inject } from '@angular/core';
import { UsersService } from '../services/users/users.service';
import { ERole } from '../enums/role';

export const CraftiviyGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const usersService = inject(UsersService);
  if (usersService.userData()?.role === ERole.CRAFTMAN) {
    localStorage.setItem(STORAGE_VARIABLES.APP, STORAGE_VARIABLES.CRAFTIVITY);
    return true;
  }
  return router.navigate(['/', 'admin']);
};
