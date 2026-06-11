import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { StudentService, DepartmentService, CourseService } from '../../../services/student-service';
import { IDepartment } from '../../../models/idepartment';
import { ICourse } from '../../../models/icourse';

@Component({
  selector: 'app-student-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-add.html',
  styleUrl: './student-add.css',
})
export class StudentAdd implements OnInit {
  private router = inject(Router);
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);

  name = '';
  age = 0;
  degree = 0;
  selectedDepartmentId: number | null = null;
  selectedCourseId: number | null = null;

  departments: IDepartment[] = [];
  courses: ICourse[] = [];

  saving = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (depts) => {
        this.departments = depts;
      },
      error: () => {
        this.errorMessage = 'Unable to load departments.';
      },
    });
  }

  onDepartmentChange(): void {
    this.selectedCourseId = null;
    this.courses = [];
    if (this.selectedDepartmentId) {
      this.loadCourses(this.selectedDepartmentId);
    }
  }

  loadCourses(departmentId: number): void {
    this.courseService.getCoursesByDepartment(departmentId).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: () => {
        this.errorMessage = 'Unable to load courses.';
      },
    });
  }

  submit(): void {
    const trimmedName = this.name.trim();

    if (!trimmedName || this.age <= 0 || !this.selectedDepartmentId || !this.selectedCourseId || this.degree < 0) {
      this.errorMessage = 'Please provide all required fields.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.studentService
      .addStudent({
        name: trimmedName,
        age: this.age,
        departmentId: this.selectedDepartmentId,
        courseId: this.selectedCourseId,
        degree: this.degree,
      })
      .subscribe({
        next: (response) => {
          this.saving = false;
          void this.router.navigate(['/students/details', response.student.id]);
        },
        error: () => {
          this.saving = false;
          this.errorMessage = 'Unable to add student.';
        },
      });
  }
}
