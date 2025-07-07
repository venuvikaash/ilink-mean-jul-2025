import { Routes } from '@angular/router';

import { WorkshopsListComponent } from './workshops-list/workshops-list.component';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
// import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
// import { SessionsListComponent } from './workshop-details/sessions-list/sessions-list.component';
// import { AddSessionComponent } from './workshop-details/add-session/add-session.component';
import { FavoritesComponent } from './favorites/favorites.component';

import { authGuard } from 'app/common/auth/auth.guard';
import { ValidateWorkshopGuard } from './workshop-details/validate-workshop.guard';
import { WorkshopDetailsResolver } from './workshop-details/workshops-detail.resolver';

export const routes: Routes = [
  {
    path: 'workshops',
    // pathMatch: 'full',
    component: WorkshopsListComponent,
    title: 'List of Workshops',
    canActivate: [authGuard],
    data: { animation: 'workshops-list-page' },
  },
  {
    path: 'workshops/add',
    component: AddWorkshopComponent,
    title: 'Add a new workshop',
    canActivate: [authGuard],
    data: { animation: 'add-workshop-page' },
  },
  {
    path: 'workshops/edit/:id',
    component: AddWorkshopComponent,
    title: 'Edit workshop details',
    canActivate: [authGuard],
    data: { animation: 'edit-workshop-page' },
  },
  {
    path: 'workshops/favorites',
    component: FavoritesComponent,
    title: 'Favorite workshop',
    canActivate: [authGuard],
    data: { animation: 'favorites-page' },
  },
  // {
  //   path: 'workshops/:id',
  //   component: WorkshopDetailsComponent,
  //   title: 'Details of workshop',
  //   canActivate: [authGuard],
  //   children: [
  //     {
  //       path: '',
  //       component: SessionsListComponent,
  //     },
  //     {
  //       path: 'add',
  //       component: AddSessionComponent,
  //     },
  //   ],
  // },
  {
    path: 'workshops/:id',
    resolve: {
      items: WorkshopDetailsResolver,
    },
    loadComponent: () =>
      import('./workshop-details/workshop-details.component').then(
        (m) => m.WorkshopDetailsComponent
      ),
    title: 'Details of workshop',
    canActivate: [authGuard, ValidateWorkshopGuard],
    data: { animation: 'workshop-details-page' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./workshop-details.routes').then((m) => m.parentRoutes),
      },
    ],
  },
];
