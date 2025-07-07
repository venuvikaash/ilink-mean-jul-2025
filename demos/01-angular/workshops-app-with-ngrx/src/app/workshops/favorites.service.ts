import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IWorkshop from './models/IWorkshop';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: {
    [workshopId: number]: IWorkshop;
  } = {};

  private eventSource = new BehaviorSubject<IWorkshop[]>(
    Object.values(this.favorites)
  );

  public favorites$ = this.eventSource.asObservable();

  public addToFavorites(workshop: IWorkshop) {
    if (this.isFavorite(workshop.id)) {
      return;
    }

    this.favorites[workshop.id] = workshop;
    this.eventSource.next(Object.values(this.favorites));
  }

  public removeFromFavorites(workshopId: number) {
    delete this.favorites[workshopId];
    this.eventSource.next(Object.values(this.favorites));
  }

  public toggleFavorite(workshop: IWorkshop) {
    if (this.isFavorite(workshop?.id)) {
      this.removeFromFavorites(workshop?.id);
    } else {
      this.addToFavorites(workshop);
    }
  }

  public isFavorite(workshopId: number) {
    return !!this.favorites[workshopId];
  }

  constructor() {}
}
