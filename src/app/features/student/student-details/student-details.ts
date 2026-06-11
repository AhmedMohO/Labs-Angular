import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IStudent } from '../../../models/istudent';
import { StudentService } from '../../../services/student-service';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  student = signal<IStudent | null>(null);
  loading = signal(true);
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
}