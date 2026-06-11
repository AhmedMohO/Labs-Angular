import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-department',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department {}