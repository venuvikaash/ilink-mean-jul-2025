import { provideState } from '@ngrx/store';
import { favoritesReducer } from './favorites.reducer';

export const provideFavoritesStore = provideState({
  name: 'favorites',
  reducer: favoritesReducer
});
