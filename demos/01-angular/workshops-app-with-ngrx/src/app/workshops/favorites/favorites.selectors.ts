import { createFeatureSelector, createSelector } from '@ngrx/store';
import IWorkshop from '../models/IWorkshop';

export const selectFavorites = createFeatureSelector<ReadonlyArray<IWorkshop>>('favorites');

export const isFavorite = (workshopId: number) =>
  createSelector(selectFavorites, favorites => favorites.some(w => w.id === workshopId));
