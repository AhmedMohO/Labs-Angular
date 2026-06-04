import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IStudent } from '../models/istudent';

interface StudentApiResponse {
  message: string;
  student: IStudent;
}

export type StudentPayload = Pick<IStudent, 'name' | 'age'>;

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/students';

  getAllStudents(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.apiUrl}/${id}`);
  }

  addStudent(student: StudentPayload): Observable<StudentApiResponse> {
    return this.http.post<StudentApiResponse>(this.apiUrl, student);
  }

  updateStudent(id: number, student: StudentPayload): Observable<StudentApiResponse> {
    return this.http.put<StudentApiResponse>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<StudentApiResponse> {
    return this.http.delete<StudentApiResponse>(`${this.apiUrl}/${id}`);
  }
}
