import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const validateWorkshopGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router)

  const strId = route.paramMap.get('id') as string;
    const proceed = /^\d+$/.test(strId);

    if (!proceed) {
      _router.navigateByUrl('/workshops');
      return false;
    } else {
      return true;
    }
};