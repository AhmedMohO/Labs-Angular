import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { IStudent } from '../models/istudent';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList {
  students = input<IStudent[]>([]);
  studentSelected = output<IStudent>();
  editRequested = output<IStudent>();
}
