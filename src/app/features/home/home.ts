import { Component } from '@angular/core';
import { Student } from '../student/student';

@Component({
  selector: 'app-home',
  imports: [Student],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
