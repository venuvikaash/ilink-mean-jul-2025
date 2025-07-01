import { Routes } from '@angular/router';
import { Home } from './home/home';
import { PageNotFound } from './page-not-found/page-not-found';

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
        path: '**',
        component: PageNotFound,
        title: 'Page Not Found | Workshops App'
    }
];
