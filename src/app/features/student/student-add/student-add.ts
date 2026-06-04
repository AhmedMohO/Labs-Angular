import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { StudentService } from '../../../services/student-service';

@Component({
  selector: 'app-student-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-add.html',
  styleUrl: './student-add.css',
})
export class StudentAdd {
  private router = inject(Router);
  private studentService = inject(StudentService);

  name = '';
  age = 0;
  saving = false;
  errorMessage = '';

  submit(): void {
    const trimmedName = this.name.trim();

    if (!trimmedName || this.age <= 0) {
      this.errorMessage = 'Please provide valid name and age.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.studentService.addStudent({ name: trimmedName, age: this.age }).subscribe({
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
