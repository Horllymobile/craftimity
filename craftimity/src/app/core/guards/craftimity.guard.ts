import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_VARIABLES } from '../constants/storage';
import { UsersService } from '../services/users/users.service';
import { ERole } from '../enums/role';

export const CraftimiyGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const usersService = inject(UsersService);
  if (usersService.userData()?.role === ERole.USER) {
    localStorage.setItem(STORAGE_VARIABLES.APP, STORAGE_VARIABLES.CRAFTIMITY);
    return true;
  }
  return router.navigate(['/', 'craftivity']);
};
