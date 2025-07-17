import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocationPipe } from '../../../common/location/location-pipe';
import { RouterLink } from '@angular/router';
import IWorkshop from '../../models/IWorkshop';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

import { Favorites as FavoritesService } from '../../favorites';

@Component({
  selector: 'app-item',
  imports: [
    RouterLink,
    DatePipe,
    LocationPipe,
    FontAwesomeModule
  ],
  templateUrl: './item.html',
  styleUrl: './item.scss',
  providers: [DatePipe]
})
export class Item {
  @Input()
  workshop!: IWorkshop;

  @Output()
  delete = new EventEmitter();

  icons = {
    faPencil,
    faTrash,
    faStar,
    faStarEmpty
  };

  constructor(
    private datePipe: DatePipe,
    public favoritesService: FavoritesService
  ) {
    console.log( this.datePipe.transform( "2025-07-02", "medium" ) );
  }

  // formatDate( dateStr : string ) {
  //   const date = new Date( dateStr );
  //   return date.getDate() + '-' + ( date.getMonth() + 1 ) + '-' + date.getFullYear();
  // }

  onDeleteWorkshop() {
    this.delete.emit();
  }
}
