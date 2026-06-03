import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IStudent } from '../../models/istudent';
import { StudentDetails } from './student-details/student-details';
import { StudentEdit } from './student-edit/student-edit';
import { StudentList } from './student-list/student-list';
import { StudentService } from '../../services/student-service';

@Component({
  selector: 'app-student',
  imports: [CommonModule, FormsModule, StudentDetails, StudentEdit, StudentList],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student {
  private studentService = inject(StudentService);

  students = this.studentService.getStudents();

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

    const added = this.studentService.addStudentService({
      id,
      name,
      age: this.newStudent.age,
    });

    this.showAlert = !added;

    if (!added) {
      return;
    }

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

    if (isInvalid) {
      this.editAlert = true;
      return;
    }

    const saved = this.studentService.updateStudentService(this.editingStudentId, {
      id: updated.id,
      name,
      age: updated.age,
    });

    if (!saved) {
      this.editAlert = true;
      return;
    }

    if (this.selectedStudent?.id === this.editingStudentId) {
      this.selectedStudent = { id: updated.id, name, age: updated.age };
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
