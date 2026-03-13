import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(public router: Router) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
      return
    }
  }

  getCartItems() {
    return AuthService.getCartItems()
  }
}
