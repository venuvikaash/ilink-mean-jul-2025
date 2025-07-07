import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

import { LoadingComponent } from 'app/common/loading/loading.component';

import { WorskhopsService } from '../worskhops.service';

import IWorkshop from '../models/IWorkshop';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-workshop-details',
  standalone: true,
  imports: [
    NgbAlert,
    DatePipe,
    RouterModule,
    FontAwesomeModule,
    LoadingComponent,
  ],
  templateUrl: './workshop-details.component.html',
  styleUrl: './workshop-details.component.scss',
})
export class WorkshopDetailsComponent {
  loading = true;
  error: Error | null = null;
  workshop!: IWorkshop;
  id!: number;

  isOpen = true;

  icons = {
    faCheckCircle,
    faTimesCircle,
    faStar,
    faStarEmpty,
  };

  getWorkshopById(id: number) {
    this.loading = true;

    // https://rxjs.dev/deprecations/subscribe-arguments
    this.workshopsService.getWorkshopById(id).subscribe({
      next: (fetchedWorkshop) => {
        this.workshop = fetchedWorkshop;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workshopsService: WorskhopsService,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    // approach 1: subscribing to 'id' changes
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.id = +(paramMap.get('id') as string);
        this.getWorkshopById(this.id);
      },
    });

    // approach 2: pre-fetching using resolver
    this.loading = false;
    this.workshop = this.activatedRoute.snapshot.data['items'].workshop;
    this.error = this.activatedRoute.snapshot.data['items'].error;

    console.log(this.activatedRoute.snapshot.data);
  }
}
