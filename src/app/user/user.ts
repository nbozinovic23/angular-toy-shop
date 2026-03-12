import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-user',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  public activeUser = AuthService.getActiveUser()
  toyTypes = signal<string[]>([])

  constructor(private router: Router) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
      return
    }

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data.map((t: any) => t.name)))
  }

  updateUser() {
    AuthService.updateActiveUser(this.activeUser!)
    alert('User updated successfully')
  }
}
