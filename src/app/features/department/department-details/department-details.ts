import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IDepartment } from '../../../models/idepartment';
import { ICourse } from '../../../models/icourse';
import { IStudent } from '../../../models/istudent';
import { DepartmentService, CourseService, StudentService } from '../../../services/student-service';

@Component({
  selector: 'app-department-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
})
export class DepartmentDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);

  department = signal<IDepartment | null>(null);
  courses = signal<ICourse[]>([]);
  studentCount = signal(0);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage.set('Invalid department id.');
      this.loading.set(false);
      return;
    }

    this.departmentService.getDepartmentById(id).subscribe({
      next: (dept: IDepartment) => {
        this.department.set(dept);
        this.loading.set(false);
        this.loadCourses(id);
        this.loadStudentCount(id);
      },
      error: () => {
        this.errorMessage.set('Department not found.');
        this.loading.set(false);
      },
    });
  }

  loadCourses(departmentId: number): void {
    this.courseService.getCoursesByDepartment(departmentId).subscribe({
      next: (courses: ICourse[]) => {
        this.courses.set(courses);
      },
      error: () => {},
    });
  }

  loadStudentCount(departmentId: number): void {
    this.studentService.getAllStudents().subscribe({
      next: (students: IStudent[]) => {
        this.studentCount.set(students.filter((s: IStudent) => s.departmentId === departmentId).length);
      },
      error: () => {},
    });
  }
}