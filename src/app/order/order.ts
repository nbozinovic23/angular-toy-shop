import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Loading } from '../loading/loading';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ToyModel } from '../../models/toy.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../utils';
import { AuthService } from '../../services/auth.service';
import { ToyService } from '../../services/toy.service';
import { Alerts } from '../alerts';
import { CartItemModel } from '../../models/cart-item.model';

@Component({
  selector: 'app-order',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    Loading,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  toy = signal<ToyModel | null>(null)

  item: Partial<CartItemModel> = {
    quantity: 1
  }

  constructor(private route: ActivatedRoute, private router: Router, public utils: Utils) {
    if (!AuthService.getActiveUser()) {
      this.router.navigate(['/login'])
      return
    }

    this.route.params.subscribe(params => {
      const id = Number(params['id'])
      ToyService.getToyById(id)
        .then(rsp => this.toy.set(rsp.data))
    })
  }

  calculateTotal() {
    return (this.toy()?.price ?? 0) * (this.item.quantity ?? 1)
  }

  placeOrder() {
    Alerts.confirm(`Da li ste sigurni da želite da rezervišete ${this.item.quantity} komada za ${this.calculateTotal()} RSD?`, () => {
      AuthService.addToCart({ quantity: this.item.quantity, totalPrice: this.calculateTotal() }, this.toy()!.toyId)
      this.router.navigate(['/cart'])
    })
  }
}
