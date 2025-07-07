import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ValidateWorkshopGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const strId = route.paramMap.get('id') as string;
    const proceed = /^\d+$/.test(strId);

    if (!proceed) {
      this._router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
  }
}
