import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IStudent } from '../models/istudent';
import { StudentDetails } from '../student-details/student-details';
import { StudentEdit } from '../student-edit/student-edit';
import { StudentList } from '../student-list/student-list';

@Component({
  selector: 'app-student',
  imports: [CommonModule, FormsModule, StudentDetails, StudentEdit, StudentList],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student {
  students: IStudent[] = [
    { id: 1, name: 'Mona Ali', age: 20 },
    { id: 2, name: 'Omar Adel', age: 22 },
    { id: 3, name: 'Sara Nabil', age: 19 },
    { id: 4, name: 'Youssef Ahmed', age: 21 },
  ];

  newStudent: IStudent = { id: 0, name: '', age: 0 };
  showAlert = false;
  selectedStudent: IStudent | null = null;
  editStudent: IStudent | null = null;
  editAlert = false;
  editingStudentId: number | null = null;

  addStudent(): void {
    const id = this.newStudent.id;
    const name = this.newStudent.name.trim();

    if (!id || !name || this.newStudent.age <= 0) {
      this.showAlert = false;
      return;
    }

    const isIdExists = this.students.some((student) => student.id === id);
    if (isIdExists) {
      this.showAlert = true;
      return;
    }

    this.showAlert = false;

    this.students.push({
      id,
      name,
      age: this.newStudent.age,
    });

    this.newStudent = { id: 0, name: '', age: 0 };
  }

  onStudentSelected(student: IStudent): void {
    this.selectedStudent = student;
  }

  onEditRequested(student: IStudent): void {
    this.editAlert = false;
    this.editingStudentId = student.id;
    this.editStudent = { ...student };
  }

  onEditSave(updated: IStudent): void {
    if (!this.editingStudentId) {
      return;
    }

    const name = updated.name.trim();
    const isInvalid = !updated.id || !name || updated.age <= 0;

    const isIdExists = this.students.some(
      (student) => student.id === updated.id && student.id !== this.editingStudentId,
    );

    if (isInvalid || isIdExists) {
      this.editAlert = true;
      return;
    }

    const index = this.students.findIndex(
      (student) => student.id === this.editingStudentId,
    );

    if (index === -1) {
      return;
    }

    this.students[index] = {
      id: updated.id,
      name,
      age: updated.age,
    };

    if (this.selectedStudent?.id === this.editingStudentId) {
      this.selectedStudent = { ...this.students[index] };
    }

    this.editAlert = false;
    this.editStudent = null;
    this.editingStudentId = null;
  }

  onEditCancel(): void {
    this.editAlert = false;
    this.editStudent = null;
    this.editingStudentId = null;
  }
}
