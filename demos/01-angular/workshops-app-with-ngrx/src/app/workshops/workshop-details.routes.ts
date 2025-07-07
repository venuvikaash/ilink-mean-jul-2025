import { Routes } from '@angular/router';

import { SessionsListComponent } from './workshop-details/sessions-list/sessions-list.component';
import { AddSessionComponent } from './workshop-details/add-session/add-session.component';

// Define child routes for ParentComponent
export const parentRoutes: Routes = [
  {
    path: '',
    component: SessionsListComponent,
  },
  {
    path: 'add',
    component: AddSessionComponent,
  },
];
