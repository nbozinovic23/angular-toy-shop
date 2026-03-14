import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToyModel } from '../../models/toy.model';
import { ReviewModel } from '../../models/cart-item.model';
import { Utils } from '../utils';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { ToyService } from '../../services/toy.service';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-details',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    Loading
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  public authService = AuthService
  toy = signal<ToyModel | null>(null)
  reviews = signal<ReviewModel[]>([])

  constructor(route: ActivatedRoute, public utils: Utils) {
    route.params.subscribe(params => {
      const id = params['id']
      ToyService.getToyById(id)
        .then(rsp => {
          this.toy.set(rsp.data)
          this.reviews.set(AuthService.getReviewsForToy(rsp.data.toyId))
        })
    })
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }
}