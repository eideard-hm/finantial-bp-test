import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/products-list/products-list.component'),
    title: 'Listado de Productos financieros',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
