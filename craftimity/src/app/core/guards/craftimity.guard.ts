import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_VARIABLES } from '../constants/storage';

export const CraftimiyGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const app = localStorage.getItem(STORAGE_VARIABLES.APP);
  if (app && app === STORAGE_VARIABLES.CRAFTIMITY) {
    return router.navigate(['/', 'craftimity']);
  }
  return router.navigate(['/', 'select-app']);
};
