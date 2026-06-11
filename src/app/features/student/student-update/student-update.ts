import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { IDepartment } from '../../../models/idepartment';
import { ICourse } from '../../../models/icourse';
import { StudentService, DepartmentService, CourseService } from '../../../services/student-service';

@Component({
  selector: 'app-student-update',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-update.html',
  styleUrl: './student-update.css',
})
export class StudentUpdate implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);

  id = 0;
  name = '';
  age = 0;
  degree = 0;
  selectedDepartmentId: number | null = null;
  selectedCourseId: number | null = null;

  departments: IDepartment[] = [];
  courses: ICourse[] = [];

  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      this.errorMessage.set('Invalid student id.');
      this.loading.set(false);
      return;
    }

    this.loadDepartments();

    this.studentService.getStudentById(this.id).subscribe({
      next: (student) => {
        this.name = student.name;
        this.age = student.age;
        this.degree = student.degree;
        this.selectedDepartmentId = student.departmentId;
        this.selectedCourseId = student.courseId;
        this.loading.set(false);
        if (this.selectedDepartmentId) {
          this.loadCourses(this.selectedDepartmentId);
        }
      },
      error: () => {
        this.errorMessage.set('Student not found.');
        this.loading.set(false);
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (depts) => {
        this.departments = depts;
      },
      error: () => {},
    });
  }

  loadCourses(departmentId: number): void {
    this.courseService.getCoursesByDepartment(departmentId).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: () => {},
    });
  }

  onDepartmentChange(): void {
    this.selectedCourseId = null;
    this.courses = [];
    if (this.selectedDepartmentId) {
      this.loadCourses(this.selectedDepartmentId);
    }
  }

  submit(): void {
    const trimmedName = this.name.trim();

    if (!trimmedName || this.age <= 0 || !this.selectedDepartmentId || !this.selectedCourseId || this.degree < 0) {
      this.errorMessage.set('Please provide all required fields.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.studentService.updateStudent(this.id, {
      name: trimmedName,
      age: this.age,
      departmentId: this.selectedDepartmentId,
      courseId: this.selectedCourseId,
      degree: this.degree
    }).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/students/details', this.id]);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Unable to update student.');
      },
    });
  }
}
