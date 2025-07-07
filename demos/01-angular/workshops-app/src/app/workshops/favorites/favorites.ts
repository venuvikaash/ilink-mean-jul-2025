import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Favorites as FavoritesService } from '../favorites';
import IWorkshop from '../models/IWorkshop';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  // favorites!: IWorkshop[];

  constructor(public favoritesService: FavoritesService) {}

  ngOnInit() {
    // this.favoritesService.favorites$.subscribe({
    //   next: (favorites) => {
    //     this.favorites = favorites;
    //   }
    // })
  }
}