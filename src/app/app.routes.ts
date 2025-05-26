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
        path: 'rules',
        loadComponent: () =>
          import('./pages/rules-page/rules-page.component').then(
            (m) => m.RulesPageComponent
          ),
      },
      {
        path: 'calculations',
        loadComponent: () =>
          import('./pages/calculations-page/calculations-page.component').then(
            (m) => m.CalculationsPageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
