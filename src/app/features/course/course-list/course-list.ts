import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { ICourse } from '../../../models/icourse';
import { IDepartment } from '../../../models/idepartment';
import { CourseService } from '../../../services/student-service';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);

  courses = signal<ICourse[]>([]);
  departments = signal<IDepartment[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCourses();
  }

  loadDepartments(): void {
    this.courseService.getAllDepartments().subscribe({
      next: (depts) => this.departments.set(depts),
      error: () => {},
    });
  }

  loadCourses(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load courses.');
        this.loading.set(false);
      },
    });
  }

  getDepartmentName(departmentId: number): string {
    const dept = this.departments().find((d) => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  }
}