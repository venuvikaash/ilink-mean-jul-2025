import { Routes } from '@angular/router';
import { WorkshopsList } from './workshops-list/workshops-list';
import { AddWorkshop } from './add-workshop/add-workshop';
import { Favorites } from './favorites/favorites';

// no static importing from outside the lazy loaded parts for the lazy loaded parts
// import { WorkshopDetails } from './workshop-details/workshop-details';
// import { SessionsList } from './workshop-details/sessions-list/sessions-list';
// import { AddSession } from './workshop-details/add-session/add-session';

import { validateWorkshopGuard } from './validate-workshop-guard';

export const routes: Routes = [
    {
        path: 'workshops',
        component: WorkshopsList,
        title: 'List of workshops'
    },
    {
        path: 'workshops/add',
        component: AddWorkshop,
        title: 'Add a workshop'
    },
    {
        path: 'workshops/favorites',
        component: Favorites,
        title: 'Favorite workshops'
    },
    {
        path: 'workshops/:id',
        title: 'Details of workshop',
        // canActivate: [validateWorkshopGuard],
        loadComponent: () =>
            import('./workshop-details/workshop-details').then(
                (m) => m.WorkshopDetails
            ),
        children: [
            {
                path: '',
                loadChildren: () =>
                import('./workshop-details.routes').then((m) => m.parentRoutes),
            },
        ],
    },
];
