import { UsersService } from 'src/app/core/services/users/users.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ERole } from '../../enums/role';

export const RoleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usersService = inject(UsersService);
  if (!(usersService.userProfile?.role === ERole.CRAFTMAN)) {
    router.navigate(['/craftimity']);
    return false;
  }
  return true;
};
