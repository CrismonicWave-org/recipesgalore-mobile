import { Routes } from '@angular/router';
import { authRedirectGuard } from './guards/auth-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authRedirectGuard],
    children: []
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then((m) => m.SignupPage),
  },
];
