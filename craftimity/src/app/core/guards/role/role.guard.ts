import { AlertService } from 'src/app/core/services/alert.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ERole } from 'src/app/core/enums/role';
import { STORAGE_VARIABLES } from '../../constants/storage';

export const RoleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usersService = inject(UsersService);
  const alertService = inject(AlertService);
  if (usersService.userData()?.role === ERole.CRAFTMAN) {
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    localStorage.removeItem(STORAGE_VARIABLES.REGISTERATION_TOKEN);
    router.navigate(['/pages']);
    alertService.error('You are not authroized');
    return false;
  }
  return true;
};
