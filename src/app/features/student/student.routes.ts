import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./student').then((m) => m.Student),
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full',
			},
			{
				path: 'list',
				loadComponent: () =>
					import('./student-list/student-list').then((m) => m.StudentList),
			},
			{
				path: 'add',
				loadComponent: () =>
					import('./student-add/student-add').then((m) => m.StudentAdd),
			},
			{
				path: 'details/:id',
				loadComponent: () =>
					import('./student-details/student-details').then((m) => m.StudentDetails),
			},
			{
				path: 'update/:id',
				loadComponent: () =>
					import('./student-update/student-update').then((m) => m.StudentUpdate),
			},
			{
				path: 'delete/:id',
				loadComponent: () =>
					import('./student-delete/student-delete').then((m) => m.StudentDelete),
			},
		],
	},
];
