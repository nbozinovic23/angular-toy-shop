import { Injectable } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { CartItemModel } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  getImageUrl(toy: ToyModel) {
    return 'https://toy.pequla.com' + toy.imageUrl
  }

  calculateTotal(item: CartItemModel) {
    return item.totalPrice
  }
}