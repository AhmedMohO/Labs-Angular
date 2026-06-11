import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { StudentService, DepartmentService } from '../../../services/student-service';
import { IDepartment } from '../../../models/idepartment';

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

  name = '';
  age = 0;
  selectedDepartmentId: number | null = null;

  departments = signal<IDepartment[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.departmentService.getAllDepartments().subscribe({
      next: (depts) => {
        this.departments.set(depts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    const trimmedName = this.name.trim();

    if (!trimmedName || this.age <= 0) {
      this.errorMessage.set('Please provide valid name and age.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.studentService.addStudent({
      name: trimmedName,
      age: this.age,
      departmentId: this.selectedDepartmentId ?? undefined
    }).subscribe({
      next: (response) => {
        this.saving.set(false);
        void this.router.navigate(['/students/details', response.student.id]);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Unable to add student.');
      },
    });
  }
}