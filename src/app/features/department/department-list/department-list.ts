import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IDepartment } from '../../../models/idepartment';
import { ICourse } from '../../../models/icourse';
import { DepartmentService, CourseService } from '../../../services/student-service';

@Component({
  selector: 'app-department-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
})
export class DepartmentList implements OnInit {
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);

  departments = signal<IDepartment[]>([]);
  courseCounts = signal<Record<number, number>>({});
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.departmentService.getAllDepartments().subscribe({
      next: (depts: IDepartment[]) => {
        this.departments.set(depts);
        this.loadCourseCounts(depts);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load departments from API.');
        this.loading.set(false);
      },
    });
  }

  loadCourseCounts(depts: IDepartment[]): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses: ICourse[]) => {
        const counts: Record<number, number> = {};
        depts.forEach((dept: IDepartment) => {
          counts[dept.id] = courses.filter((c: ICourse) => c.departmentId === dept.id).length;
        });
        this.courseCounts.set(counts);
      },
      error: () => {},
    });
  }
}