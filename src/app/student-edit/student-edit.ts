import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IStudent } from '../models/istudent';

@Component({
  selector: 'app-student-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css',
})
export class StudentEdit {
  student = input<IStudent | null>(null);
  showAlert = input(false);
  saveRequested = output<IStudent>();
  cancelRequested = output<void>();

  onSubmit(): void {
    const current = this.student();
    if (!current) {
      return;
    }

    this.saveRequested.emit({ ...current });
  }

  onCancel(): void {
    this.cancelRequested.emit();
  }
}
