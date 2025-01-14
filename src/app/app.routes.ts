import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { authGuard } from '../auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home-page',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'nomenclature',
        loadComponent: () =>
          import('./pages/nomenclature-page/nomenclature-page.component').then(
            (m) => m.NomenclaturePageComponent
          ),
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile-page/profile-page.component').then(
            (m) => m.ProfilePageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
