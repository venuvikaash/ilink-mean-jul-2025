import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IWorkshop from './models/IWorkshop';

@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private favorites: {
    [workshopId: string]: IWorkshop;
  } = {}; // { 1: { id: 1, name: 'Angular JS' }, 2 : { id: 2, name: 'React JS' } }

  private eventSource = new BehaviorSubject<IWorkshop[]>(
    // initial value - []
    Object.values(this.favorites) // later value -> [ { id: 1, name: 'Angular JS' }, { id: 2, name: 'React JS' } ]
  );

  public favorites$ = this.eventSource.asObservable();

  public addToFavorites(workshop: IWorkshop) {
    if (this.isFavorite(workshop._id)) {
      return;
    }

    // { 1: { id: 1, name: 'Angular JS' }, 2 : { id: 2, name: 'React JS' } } -> { 1: { id: 1, name: 'Angular JS' }, 2 : { id: 2, name: 'React JS' }, 3: { id: 3, name: 'MongoDB' } }
    this.favorites[workshop._id] = workshop;

    // boroadcast the list of favorites to ALL observers ->  [ { id: 1, name: 'Angular JS' }, { id: 2, name: 'React JS' }, { id: 3, name: 'MongoDB' } ]
    this.eventSource.next(Object.values(this.favorites));
  }

  public removeFromFavorites(workshopId: string) {
    // {  2 : { id: 2, name: 'React JS' }, 3: { id: 3, name: 'MongoDB' } }
    delete this.favorites[workshopId];

    // broadcast this -> [ { id: 2, name: 'React JS' }, { id: 3, name: 'MongoDB' } ]
    this.eventSource.next(Object.values(this.favorites));
  }

  public toggleFavorite(workshop: IWorkshop) {
    if (this.isFavorite(workshop?._id)) {
      this.removeFromFavorites(workshop?._id);
    } else {
      this.addToFavorites(workshop);
    }
  }

  public isFavorite(workshopId: string) {
    return !!this.favorites[workshopId];
  }

  constructor() {}
}