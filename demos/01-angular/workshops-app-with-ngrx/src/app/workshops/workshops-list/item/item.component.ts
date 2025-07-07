import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

import IWorkshop from '../../models/IWorkshop';
import { FavoritesService } from 'app/workshops/favorites.service';

@Component({
  selector: 'app-workshop-item',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, DatePipe],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input()
  workshop!: IWorkshop;

  @Output()
  delete: EventEmitter<undefined> = new EventEmitter();

  icons = {
    faPencil,
    faTrash,
    faStar,
    faStarEmpty,
  };

  constructor(public favoritesService: FavoritesService) {}

  deleteWorkshop() {
    this.delete.emit();
  }
}
