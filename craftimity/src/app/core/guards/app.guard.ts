import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_VARIABLES } from '../constants/storage';

export const AppGuard = async () => {
  const router = inject(Router);
  const app = localStorage.getItem(STORAGE_VARIABLES.APP);
  if (app) {
    router.navigate([`/${app}`]);
    return false;
  }
  router.navigate([`/select-app`]);
  return true;
};
