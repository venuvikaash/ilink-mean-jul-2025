import { Routes } from '@angular/router';

import { SessionsList } from './workshop-details/sessions-list/sessions-list';
import { AddSession } from './workshop-details/add-session/add-session';

// Define child routes for ParentComponent
export const parentRoutes: Routes = [
  {
    path: '',
    component: SessionsList,
  },
  {
    path: 'add-session',
    component: AddSession,
  },
];