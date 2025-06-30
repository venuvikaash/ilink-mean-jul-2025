import { Routes } from '@angular/router';
import { Home } from './home/home';
import { WorkshopsList } from './workshops/workshops-list/workshops-list';
import { AddWorkshop } from './workshops/add-workshop/add-workshop';
import { Favorites } from './workshops/favorites/favorites';


export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Workshops App',
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
    },
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
