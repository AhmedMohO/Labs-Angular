import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { IDepartment } from '../../../models/idepartment';
import { StudentService, DepartmentService } from '../../../services/student-service';

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

  id = 0;
  name = '';
  age = 0;
  selectedDepartmentId: number | null = null;

  departments = signal<IDepartment[]>([]);

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
        this.selectedDepartmentId = student.departmentId ?? null;
        this.loading.set(false);
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
        this.departments.set(depts);
      },
      error: () => {},
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

    this.studentService.updateStudent(this.id, {
      name: trimmedName,
      age: this.age,
      departmentId: this.selectedDepartmentId ?? undefined
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