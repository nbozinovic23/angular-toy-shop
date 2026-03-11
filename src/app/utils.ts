import { Injectable } from '@angular/core';
import { ToyModel } from '../models/toy.model';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  getImageUrl(toy: ToyModel) {
    return 'https://toy.pequla.com' + toy.imageUrl
  }
}