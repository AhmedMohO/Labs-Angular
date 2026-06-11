import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { DepartmentService } from '../../../services/student-service';

@Component({
  selector: 'app-department-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './department-add.html',
  styleUrl: './department-add.css',
})
export class DepartmentAdd {
  private router = inject(Router);
  private departmentService = inject(DepartmentService);

  name = '';
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submit(): void {
    const trimmed = this.name.trim();

    if (!trimmed) {
      this.errorMessage.set('Department name is required.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.departmentService.addDepartment(trimmed).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Department added successfully.');
        setTimeout(() => {
          void this.router.navigate(['/departments/list']);
        }, 1500);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'Unable to add department.');
      },
    });
  }
}