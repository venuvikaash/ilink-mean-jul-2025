import { Routes } from '@angular/router';
import { WorkshopsList } from './workshops-list/workshops-list';
import { AddWorkshop } from './add-workshop/add-workshop';
import { Favorites } from './favorites/favorites';

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
];
