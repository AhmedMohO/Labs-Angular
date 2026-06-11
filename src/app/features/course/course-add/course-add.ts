import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ICourse } from '../../../models/icourse';
import { IDepartment } from '../../../models/idepartment';
import { CourseService } from '../../../services/student-service';

@Component({
  selector: 'app-course-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-add.html',
  styleUrl: './course-add.css',
})
export class CourseAdd implements OnInit {
  private router = inject(Router);
  private courseService = inject(CourseService);

  name = '';
  selectedDepartmentId: number | null = null;

  departments = signal<IDepartment[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.saving.set(false);
    this.courseService.getAllDepartments().subscribe({
      next: (depts) => {
        this.departments.set(depts);
      },
      error: () => {
        this.errorMessage.set('Unable to load departments.');
      },
    });
  }

  submit(): void {
    const trimmed = this.name.trim();

    if (!trimmed || !this.selectedDepartmentId) {
      this.errorMessage.set('Please provide course name and select department.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.courseService.addCourse(trimmed, this.selectedDepartmentId!).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Course added successfully.');
        setTimeout(() => {
          void this.router.navigate(['/courses/list']);
        }, 1500);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'Unable to add course.');
      },
    });
  }
}