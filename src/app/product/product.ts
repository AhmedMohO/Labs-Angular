import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';

import { ICategory } from '../models/icategory';
import { IProduct } from '../models/iproduct';
import { ProductFilter } from '../product-filter/product-filter';

@Component({
  selector: 'app-product',
  imports: [
    BadgeModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ProductFilter,
    RatingModule,
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
    products: IProduct[] = [
      {
        id: 1,
        name: "Laptop",
        imgUrl: "https://fastly.picsum.photos/id/842/200/200.jpg?hmac=RW9iEgAYLKwoinQWSz_zrZHyOwmVEgqvoZTPebkRGMM",
        price: 1200,
        quantity: 10,
        catId: 1,
        rating: 5
      },
      {
        id: 2,
        name: "Mouse",
        imgUrl: "https://picsum.photos/200?random=2",
        price: 25,
        quantity: 0,
        catId: 1,
        rating: 3
      },

      {
        id: 3,
        name: "T-Shirt",
        imgUrl: "https://picsum.photos/200?random=3",
        price: 30,
        quantity: 1,
        catId: 2,
        rating: 4
      },
      {
        id: 4,
        name: "Jeans",
        imgUrl: "https://picsum.photos/200?random=4",
        price: 70,
        quantity: 25,
        catId: 2,
        rating: 4
      },

      {
        id: 5,
        name: "Coffee Mug",
        imgUrl: "https://picsum.photos/200?random=5",
        price: 12,
        quantity: 0,
        catId: 3,
        rating: 2
      },
      {
        id: 6,
        name: "Notebook",
        imgUrl: "https://picsum.photos/200?random=6",
        price: 8,
        quantity: 100,
        catId: 3,
        rating: 5
      }
    ];
    categories: ICategory[] = [
      {
        id: 1,
        name: "Electronics"
      },
      {
        id: 2,
        name: "Clothing"
      },
      {
        id: 3,
        name: "Stationery"
      }
    ];

    selectedCategoryId: number | null = null;
    cart: Record<number, number> = {};

    get cartItemCount(): number {
      return Object.values(this.cart).reduce((total, count) => total + count, 0);
    }

    get filteredProducts(): IProduct[] {
      if (!this.selectedCategoryId) {
        return this.products;
      }

      return this.products.filter(
        (product) => product.catId === this.selectedCategoryId,
      );
    }

    getCategoryName(catId: number): string {
      return this.categories.find((category) => category.id === catId)?.name ?? 'Unknown';
    }

    getStockLabel(quantity: number): string {
      return quantity > 0 ? 'In Stock' : 'Out of Stock';
    }

    getCartQuantity(productId: number): number {
      return this.cart[productId] ?? 0;
    }

    addToCart(product: IProduct): void {
      if (product.quantity <= 0) {
        return;
      }

      const currentCount = this.getCartQuantity(product.id);
      if (currentCount >= product.quantity) {
        return;
      }

      this.cart[product.id] = currentCount + 1;
    }

    onCategoryChanged(categoryId: number | null): void {
      this.selectedCategoryId = categoryId;
    }
}
