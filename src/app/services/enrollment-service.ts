import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IEnrollment } from '../models/ienrollment';
import { IDepartment } from '../models/idepartment';
import { ICourse } from '../models/icourse';
import { IStudent } from '../models/istudent';

export interface EnrollmentApiResponse {
  message: string;
  enrollment: IEnrollment;
}

export type EnrollmentPayload = Pick<IEnrollment, 'studentId' | 'courseId' | 'degree'>;

export type EnrollmentUpdatePayload = Partial<Pick<IEnrollment, 'degree'>> & { degree?: number | undefined };

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/enrollments';
  private studentUrl = '/api/students';
  private courseUrl = '/api/courses';
  private departmentUrl = '/api/departments';

  getAllEnrollments(): Observable<IEnrollment[]> {
    return this.http.get<IEnrollment[]>(this.apiUrl);
  }

  getEnrollmentById(id: number): Observable<IEnrollment> {
    return this.http.get<IEnrollment>(`${this.apiUrl}/${id}`);
  }

  getEnrollmentsByStudent(studentId: number): Observable<IEnrollment[]> {
    return this.http.get<IEnrollment[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getEnrollmentsByCourse(courseId: number): Observable<IEnrollment[]> {
    return this.http.get<IEnrollment[]>((`${this.apiUrl}/course/${courseId}`));
  }

  getStudentEnrollments(studentId: number): Observable<IEnrollment[]> {
    return this.http.get<IEnrollment[]>(`${this.studentUrl}/${studentId}/enrollments`);
  }

  addEnrollment(enrollment: EnrollmentPayload): Observable<EnrollmentApiResponse> {
    return this.http.post<EnrollmentApiResponse>(this.apiUrl, enrollment);
  }

  updateEnrollment(id: number, enrollment: Partial<EnrollmentPayload>): Observable<EnrollmentApiResponse> {
    return this.http.put<EnrollmentApiResponse>(`${this.apiUrl}/${id}`, enrollment);
  }

  deleteEnrollment(id: number): Observable<EnrollmentApiResponse> {
    return this.http.delete<EnrollmentApiResponse>(`${this.apiUrl}/${id}`);
  }

  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(this.courseUrl);
  }

  getCourseById(id: number): Observable<ICourse> {
    return this.http.get<ICourse>(`${this.courseUrl}/${id}`);
  }

  getStudentById(id: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.studentUrl}/${id}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StudentEnrollmentService {
  private http = inject(HttpClient);
  private studentUrl = '/api/students';
  private departmentUrl = '/api/departments';

  getAllStudents(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(this.studentUrl);
  }

  getStudentById(id: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.studentUrl}/${id}`);
  }

  getAllDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.departmentUrl);
  }

  getCoursesByDepartment(departmentId: number): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.departmentUrl}/${departmentId}/courses`);
  }
}