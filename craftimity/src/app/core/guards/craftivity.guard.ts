import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_VARIABLES } from '../constants/storage';
import { inject } from '@angular/core';

export const CraftiviyGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const app = localStorage.getItem(STORAGE_VARIABLES.APP);
  if (app && app === STORAGE_VARIABLES.CRAFTIVITY) {
    return router.navigate(['/', 'craftivity']);
  }
  return router.navigate(['/', 'select-app']);
};
