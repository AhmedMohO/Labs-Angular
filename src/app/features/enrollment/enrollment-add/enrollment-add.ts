import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { ICourse } from '../../../models/icourse';
import { IEnrollment } from '../../../models/ienrollment';
import { EnrollmentService, StudentEnrollmentService } from '../../../services/enrollment-service';

@Component({
  selector: 'app-enrollment-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './enrollment-add.html',
  styleUrl: './enrollment-add.css',
})
export class EnrollmentAdd implements OnInit {
  private router = inject(Router);
  private enrollmentService = inject(EnrollmentService);
  private studentEnrollmentService = inject(StudentEnrollmentService);

  students = signal<IStudent[]>([]);
  courses = signal<ICourse[]>([]);
  enrollments = signal<IEnrollment[]>([]);

  selectedStudentId: string | null = null;
  selectedCourseId: string | null = null;
  degree: number | null = null;

  loading = signal(false);
  loadingCourses = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadStudents();
    this.loadEnrollments();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.studentEnrollmentService.getAllStudents().subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.errorMessage.set('Unable to load students.');
        this.loading.set(false);
      },
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments) => this.enrollments.set(enrollments),
      error: (err) => {
        console.error('Error loading enrollments:', err);
      },
    });
  }

  onStudentChange(): void {
    this.selectedCourseId = '';
    const studentId = this.selectedStudentId ? Number(this.selectedStudentId) : null;
    const student = this.students().find((s) => s.id === studentId);
    if (student?.departmentId) {
      this.loadCourses(student.departmentId);
    } else {
      this.courses.set([]);
    }
  }

  loadCourses(departmentId: number): void {
    this.loadingCourses.set(true);
    this.errorMessage.set('');
    this.studentEnrollmentService.getCoursesByDepartment(departmentId).subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loadingCourses.set(false);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.errorMessage.set(err.error?.message || err.message || 'Unable to load courses for this department.');
        this.courses.set([]);
        this.loadingCourses.set(false);
      },
    });
  }

  isStudentEnrolledInCourse(): boolean {
    if (!this.selectedStudentId || !this.selectedCourseId) return false;
    return this.enrollments().some(
      (e) => e.studentId === Number(this.selectedStudentId) && e.courseId === Number(this.selectedCourseId)
    );
  }

  submit(): void {
    if (!this.selectedStudentId || !this.selectedCourseId) {
      this.errorMessage.set('Please select both student and course.');
      return;
    }

    if (this.isStudentEnrolledInCourse()) {
      this.errorMessage.set('Student is already enrolled in this course.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      studentId: Number(this.selectedStudentId),
      courseId: Number(this.selectedCourseId),
      degree: this.degree ?? undefined,
    };

    this.enrollmentService.addEnrollment(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Enrollment added successfully.');
        setTimeout(() => {
          void this.router.navigate(['/enrollments/list']);
        }, 1500);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'Unable to add enrollment. Please try again.');
      },
    });
  }
}