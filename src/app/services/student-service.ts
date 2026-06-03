import { Injectable } from '@angular/core';
import { IStudent } from '../models/istudent';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private students: IStudent[] = [
    { id: 1, name: 'Mona Ali', age: 20 },
    { id: 2, name: 'Omar Adel', age: 22 },
    { id: 3, name: 'Sara Nabil', age: 19 },
    { id: 4, name: 'Youssef Ahmed', age: 21 },
  ];

  getStudents(): IStudent[] {
    return this.students;
  }

  addStudentService(student: IStudent): boolean {
    const exists = this.students.some((s) => s.id === student.id);

    if (exists) {
      return false;
    }

    this.students.push(student);
    return true;
  }

  updateStudentService(oldId: number, updated: IStudent): boolean {
    const duplicateId = this.students.some(
      (s) => s.id === updated.id && s.id !== oldId,
    );

    if (duplicateId) {
      return false;
    }

    const index = this.students.findIndex((s) => s.id === oldId);

    if (index === -1) {
      return false;
    }

    this.students[index] = updated;
    return true;
  }
}
