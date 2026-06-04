import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { StudentService } from '../../../services/student-service';

@Component({
  selector: 'app-student-delete',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-delete.html',
  styleUrl: './student-delete.css',
})
export class StudentDelete implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  student = signal<IStudent | null>(null);
  loading = signal(true);
  deleting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage.set('Invalid student id.');
      this.loading.set(false);
      return;
    }

    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.student.set(student);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Student not found.');
        this.loading.set(false);
      },
    });
  }

  confirmDelete(): void {
    const currentStudent = this.student();
    if (!currentStudent) {
      return;
    }

    this.deleting.set(true);
    this.errorMessage.set('');

    this.studentService.deleteStudent(currentStudent.id).subscribe({
      next: () => {
        this.deleting.set(false);
        void this.router.navigate(['/students/list']);
      },
      error: () => {
        this.deleting.set(false);
        this.errorMessage.set('Unable to delete student.');
      },
    });
  }
}
