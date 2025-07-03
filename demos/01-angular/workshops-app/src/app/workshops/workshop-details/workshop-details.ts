import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

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
    LocationPipe
  ],
  templateUrl: './workshop-details.html',
  styleUrl: './workshop-details.scss'
})
export class WorkshopDetails implements OnInit {
  loading = true;
  error : Error | null = null;
  workshop!: IWorkshop;
  workshopId!: number;

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
