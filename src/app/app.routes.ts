import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./products/pages/products-list/products-list.component'),
    title: 'Listado de Productos financieros',
  },
  {
    path: 'new-product',
    loadComponent: () =>
      import('./products/pages/new-product/new-product.component'),
    title: 'Crear Producto financiero',
  },
  {
    path: 'edit-product/:productId',
    loadComponent: () =>
      import('./products/pages/new-product/new-product.component'),
    title: 'Editar Producto financiero',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
