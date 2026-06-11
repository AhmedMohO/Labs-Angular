import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IStudent } from '../models/istudent';
import { IDepartment } from '../models/idepartment';
import { ICourse } from '../models/icourse';

interface StudentApiResponse {
  message: string;
  student: IStudent;
}

export type StudentPayload = Pick<IStudent, 'name' | 'age' | 'departmentId' | 'courseId' | 'degree'>;

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

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/departments';

  getAllDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.apiUrl);
  }

  getDepartmentById(id: number): Observable<IDepartment> {
    return this.http.get<IDepartment>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/courses';

  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.apiUrl}/${id}`);
  }

  getCoursesByDepartment(departmentId: number): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`http://localhost:3000/api/departments/${departmentId}/courses`);
  }
}
