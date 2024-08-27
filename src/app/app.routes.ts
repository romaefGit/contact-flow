import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'contacts',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/contacts/contacts-list/contacts-list.component').then(
            (c) => c.ContactsListComponent
          ),
      },
      // { path: 'detail/:something', component: DetailComponent },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./pages/contacts/detail/detail.component').then(
            (c) => c.DetailComponent
          ),
      },
    ],
  },
  // {
  //   path: 'contacts',
  //   loadComponent: () =>
  //     import('./pages/contacts/contacts-list/contacts-list.component').then(
  //       (c) => c.ContactsListComponent
  //     ),
  // },
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
];
