import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  if (!authenticationService.isLoggedIn()) {
    router.navigateByUrl('/forbidden');
    return false;
  } else {
    return true;
  }
};
