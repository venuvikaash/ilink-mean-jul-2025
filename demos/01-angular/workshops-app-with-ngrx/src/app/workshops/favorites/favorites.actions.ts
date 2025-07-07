import { createActionGroup, props } from '@ngrx/store';
import IWorkshop from '../models/IWorkshop';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Add Workshop': props<{ workshop: IWorkshop }>(),
    'Remove Workshop': props<{ workshopId: number }>(),
    'Load Favorites': props<{ favorites: IWorkshop[] }>()
  }
});
