import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// this gives the individual icons we want to use
import {
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';

import { LoadingSpinner } from '../../common/loading-spinner/loading-spinner';
import { ErrorAlert } from '../../common/error-alert/error-alert';

import { LocationPipe } from '../../common/location/location-pipe';

import { WorkshopsService } from '../workshops';
import IWorkshop from '../models/IWorkshop';

@Component({
  selector: 'app-workshop-details',
  imports: [
    LoadingSpinner,
    ErrorAlert,
    DatePipe,
    LocationPipe,
    FontAwesomeModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './workshop-details.html',
  styleUrl: './workshop-details.scss'
})
export class WorkshopDetails implements OnInit {
  loading = true;
  error : Error | null = null;
  workshop!: IWorkshop;
  workshopId!: number;

  // icons = {
  //   faCheckCircle: faCheckCircle,
  //   faTimesCircle: faTimesCircle
  // };
  icons = {
    faCheckCircle,
    faTimesCircle
  };

  constructor(
      private workshopsService: WorkshopsService,
      private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;

    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const idStr = params.get('id');
        this.workshopId = +(idStr as string);

        this.workshopsService
            .getWorkshopById(this.workshopId)
            .subscribe({
                next: (workshop) => {
                    this.workshop = workshop;
                    this.loading = false;
                },
                error: (error) => {
                    this.error = error;
                    this.loading = false;
                },
            });
      }
    });

  }
}
