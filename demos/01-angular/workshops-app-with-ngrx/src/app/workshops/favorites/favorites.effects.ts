import { inject } from '@angular/core';
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects';
import { FavoritesActions } from './favorites.actions';
import { withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectFavorites } from './favorites.selectors';

export class FavoritesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  persistFavorites$ = createEffect(
    () => this.actions$.pipe(
      ofType(FavoritesActions.addWorkshop, FavoritesActions.removeWorkshop),
      withLatestFrom(this.store.select(selectFavorites)),
      tap(([_, favorites]) => {
        localStorage.setItem('favorite-workshops', JSON.stringify(favorites));
      })
    ),
    { dispatch: false }
  );
}

export const provideFavoritesEffects = provideEffects(FavoritesEffects);
