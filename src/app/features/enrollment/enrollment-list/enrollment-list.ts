import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IEnrollment } from '../../../models/ienrollment';
import { IStudent } from '../../../models/istudent';
import { ICourse } from '../../../models/icourse';
import { EnrollmentService, StudentEnrollmentService } from '../../../services/enrollment-service';

@Component({
  selector: 'app-enrollment-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.css',
})
export class EnrollmentList implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private studentEnrollmentService = inject(StudentEnrollmentService);

  enrollments = signal<IEnrollment[]>([]);
  students = signal<IStudent[]>([]);
  courses = signal<ICourse[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments.set(enrollments);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load enrollments.');
        this.loading.set(false);
      },
    });
  }

  loadStudents(): void {
    this.studentEnrollmentService.getAllStudents().subscribe({
      next: (students) => this.students.set(students),
      error: (err) => {
        console.error('Error loading students:', err);
      },
    });
  }

  loadCourses(): void {
    this.enrollmentService.getAllCourses().subscribe({
      next: (courses) => this.courses.set(courses),
      error: (err) => {
        console.error('Error loading courses:', err);
      },
    });
  }

  getStudentName(studentId: number): string {
    const student = this.students().find((s) => s.id === studentId);
    return student ? student.name : 'Unknown';
  }

  getCourseName(courseId: number): string {
    const course = this.courses().find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  }
}