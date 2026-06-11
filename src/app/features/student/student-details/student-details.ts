import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { IDepartment } from '../../../models/idepartment';
import { ICourse } from '../../../models/icourse';
import { StudentService, DepartmentService, CourseService } from '../../../services/student-service';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);

  student = signal<IStudent | null>(null);
  department = signal<IDepartment | null>(null);
  course = signal<ICourse | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage.set('Invalid student id.');
      this.loading.set(false);
      return;
    }

    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.student.set(student);
        this.loading.set(false);
        this.loadDepartment(student.departmentId);
        this.loadCourse(student.courseId);
      },
      error: () => {
        this.errorMessage.set('Student not found.');
        this.loading.set(false);
      },
    });
  }

  loadDepartment(departmentId: number): void {
    this.departmentService.getDepartmentById(departmentId).subscribe({
      next: (dept) => this.department.set(dept),
      error: () => {},
    });
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => this.course.set(course),
      error: () => {},
    });
  }
}
