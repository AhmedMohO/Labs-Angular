import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { IStudent } from '../../../models/istudent';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails {
  student = input<IStudent | null>(null);
}
