import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../favorites.service';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFavorites } from '../favorites/favorites.selectors';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);
  favoriteWorkshops = toSignal(this.store.select(selectFavorites));

  constructor(public favoritesService: FavoritesService) {}

  ngOnInit() {}
}
