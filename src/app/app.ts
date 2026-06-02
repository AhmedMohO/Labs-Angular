import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Student } from './student/student';
import { Product } from './product/product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Student, Product, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Day2');
}
