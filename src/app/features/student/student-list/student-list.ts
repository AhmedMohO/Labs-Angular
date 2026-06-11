import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { StudentService, DepartmentService, CourseService } from '../../../services/student-service';
import { IDepartment } from '../../../models/idepartment';
import { ICourse } from '../../../models/icourse';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);

  students = signal<IStudent[]>([]);
  departments = signal<IDepartment[]>([]);
  courses = signal<ICourse[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCourses();
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load students from API.');
        this.loading.set(false);
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (depts) => {
        this.departments.set(depts);
      },
      error: () => {
        console.error('Unable to load departments');
      },
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
      },
      error: () => {
        console.error('Unable to load courses');
      },
    });
  }

  getDepartmentName(departmentId: number): string {
    const dept = this.departments().find((d) => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  }

  getCourseName(courseId: number): string {
    const course = this.courses().find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  }
}
