import { Routes } from '@angular/router';

export const courseRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./course').then((m) => m.Course),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./course-list/course-list').then((m) => m.CourseList),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./course-add/course-add').then((m) => m.CourseAdd),
      },
    ],
  },
];