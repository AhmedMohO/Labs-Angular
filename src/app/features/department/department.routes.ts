import { Routes } from '@angular/router';

export const departmentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./department').then((m) => m.Department),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./department-list/department-list').then((m) => m.DepartmentList),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./department-details/department-details').then((m) => m.DepartmentDetails),
      },
    ],
  },
];