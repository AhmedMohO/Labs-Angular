import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { ICategory } from '../models/icategory';

@Component({
  selector: 'app-product-filter',
  imports: [CommonModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilter {
  categories = input<ICategory[]>([]);
  prices = input<number[]>([]);
  selectedId = input<number | null>(null);
  selectionChanged = output<number | null>();

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target) {
      return;
    }

    const value = Number(target.value);
    this.selectionChanged.emit(value === 0 ? null : value);
  }
  getTotalPrice(): number {
    return this.prices().reduce((total, price) => total + price, 0);
  }
}
