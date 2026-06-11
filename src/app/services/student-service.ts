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

export type StudentPayload = {
  name: string;
  age: number;
  departmentId?: number;
};

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/students';

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
  private apiUrl = '/api/departments';

  getAllDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.apiUrl);
  }

  getDepartmentById(id: number): Observable<IDepartment> {
    return this.http.get<IDepartment>(`${this.apiUrl}/${id}`);
  }

  addDepartment(name: string): Observable<{ message: string; department: IDepartment }> {
    return this.http.post<{ message: string; department: IDepartment }>(this.apiUrl, { name });
  }

  updateDepartment(id: number, name: string): Observable<{ message: string; department: IDepartment }> {
    return this.http.put<{ message: string; department: IDepartment }>(`${this.apiUrl}/${id}`, { name });
  }

  deleteDepartment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = '/api/courses';
  private departmentUrl = '/api/departments';

  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.apiUrl}/${id}`);
  }

  getCoursesByDepartment(departmentId: number): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.departmentUrl}/${departmentId}/courses`);
  }

  getAllDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.departmentUrl);
  }

  addCourse(name: string, departmentId: number): Observable<{ message: string; course: ICourse }> {
    return this.http.post<{ message: string; course: ICourse }>(this.apiUrl, { name, departmentId });
  }

  updateCourse(id: number, name: string, departmentId: number): Observable<{ message: string; course: ICourse }> {
    return this.http.put<{ message: string; course: ICourse }>(`${this.apiUrl}/${id}`, { name, departmentId });
  }

  deleteCourse(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}