import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { IEnrollment } from '../../../models/ienrollment';
import { IStudent } from '../../../models/istudent';
import { ICourse } from '../../../models/icourse';
import { EnrollmentService } from '../../../services/enrollment-service';

@Component({
  selector: 'app-enrollment-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './enrollment-edit.html',
  styleUrl: './enrollment-edit.css',
})
export class EnrollmentEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private enrollmentService = inject(EnrollmentService);

  enrollment = signal<IEnrollment | null>(null);
  student = signal<IStudent | null>(null);
  course = signal<ICourse | null>(null);

  degree: number | null = null;
  degreeInput: string = '';

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage.set('Invalid enrollment id.');
      this.loading.set(false);
      return;
    }

    this.enrollmentService.getEnrollmentById(id).subscribe({
      next: (enrollment) => {
        this.enrollment.set(enrollment);
        this.degree = enrollment.degree ?? null;
        this.degreeInput = enrollment.degree !== undefined ? String(enrollment.degree) : '';
        this.loading.set(false);

        this.enrollmentService.getStudentById(enrollment.studentId).subscribe({
          next: (student) => this.student.set(student),
          error: () => {},
        });

        this.enrollmentService.getCourseById(enrollment.courseId).subscribe({
          next: (course) => this.course.set(course),
          error: () => {},
        });
      },
      error: () => {
        this.errorMessage.set('Enrollment not found.');
        this.loading.set(false);
      },
    });
  }

  updateDegree(): void {
    if (!this.enrollment()) return;

    const trimmed = this.degreeInput.trim();
    if (trimmed !== '') {
      const newDegree = Number(trimmed);
      if (newDegree < 0 || newDegree > 100) {
        this.errorMessage.set('Degree must be between 0 and 100.');
        return;
      }
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const payload: { degree?: number } = {
      degree: trimmed === '' ? undefined : Number(trimmed)
    };

    this.enrollmentService.updateEnrollment(this.enrollment()!.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Degree updated successfully.');
        setTimeout(() => {
          void this.router.navigate(['/enrollments/list']);
        }, 1500);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Unable to update degree.');
      },
    });
  }
}