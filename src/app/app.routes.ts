import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loggedOutGuard } from './core/guards/loggedout.guard';

export const routes: Routes = [
  {
    path: 'contacts',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/contacts/contacts-list/contacts-list.component').then(
            (c) => c.ContactsListComponent,
          ),
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [loggedOutGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (c) => c.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
      },
    ],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];
