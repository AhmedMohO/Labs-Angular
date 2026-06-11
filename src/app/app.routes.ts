import { Routes } from '@angular/router';
import { Notfound } from './features/notfound/notfound';
import { Home } from './features/home/home';
import { Contact } from './features/contact/contact';
import { About } from './features/about/about';

export const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home', component: Home
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./features/student/student.routes').then((m) => m.studentRoutes),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./features/department/department.routes').then((m) => m.departmentRoutes),
  },
  {
    path: "contact", component: Contact
  },
  {
    path: "about", component: About
  },
  {
    path: '**', component: Notfound
  }
];
