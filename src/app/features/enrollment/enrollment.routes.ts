import { Routes } from '@angular/router';

export const enrollmentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./enrollment').then((m) => m.Enrollment),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./enrollment-list/enrollment-list').then((m) => m.EnrollmentList),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./enrollment-add/enrollment-add').then((m) => m.EnrollmentAdd),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./enrollment-edit/enrollment-edit').then((m) => m.EnrollmentEdit),
      },
    ],
  },
];