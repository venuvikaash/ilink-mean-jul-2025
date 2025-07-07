import { createReducer, on } from '@ngrx/store';
import { FavoritesActions } from './favorites.actions';
import IWorkshop from '../models/IWorkshop';

export const initialState: ReadonlyArray<IWorkshop> = [];

export const favoritesReducer = createReducer(
  initialState,
  on(
    FavoritesActions.addWorkshop,
    (state, { workshop }) => state.some(w => w.id === workshop.id) ? state : [...state, workshop]
  ),
  on(
    FavoritesActions.removeWorkshop,
    (state, { workshopId }) => state.filter(w => w.id !== workshopId)
  ),
  on(FavoritesActions.loadFavorites, (_, { favorites }) => favorites)
);
