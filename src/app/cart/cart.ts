import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [],
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
}
