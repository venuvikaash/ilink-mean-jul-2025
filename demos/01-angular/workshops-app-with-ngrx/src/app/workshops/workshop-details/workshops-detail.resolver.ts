import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { WorskhopsService } from '../worskhops.service';
import IWorkshop from '../models/IWorkshop';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkshopDetailsResolver implements Resolve<IWorkshop[]> {
  constructor(private workshopsService: WorskhopsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');

    if (id === null) {
      return of({});
    }

    return this.workshopsService.getWorkshopById(+id).pipe(
      map((workshop) => ({ workshop, error: null })),
      catchError((error) => {
        const message = `Retrieval error: ${error}`;
        console.error(message);

        return of({
          workshop: null,
          error: new Error(message),
        });
      })
    );
  }
}
