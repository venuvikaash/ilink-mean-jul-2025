import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login-page' },
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    data: { animation: 'home-page' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
