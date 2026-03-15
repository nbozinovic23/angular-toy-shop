import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Alerts } from '../alerts';
import { UserModel } from '../../models/user.model';
import { ToyService } from '../../services/toy.service';
import { ToyTypeModel } from '../../models/toy.model';

@Component({
  selector: 'app-signup',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  user: Partial<UserModel> = {
    favoriteToyTypes: []
  }
  password2 = ''
  toyTypes = signal<ToyTypeModel[]>([])

  constructor(private router: Router) {
    if (AuthService.getActiveUser()) {
      router.navigate(['/'])
    }

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data))
  }

  doSignup() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      Alerts.error('Sva obavezna polja moraju biti popunjena')
      return
    }

    if (!this.user.phone || !this.user.address) {
      Alerts.error('Sva obavezna polja moraju biti popunjena')
      return
    }

    if (this.user.password.length < 6) {
      Alerts.error('Lozinka mora imati najmanje 6 karaktera')
      return
    }

    if (this.user.password !== this.password2) {
      Alerts.error('Lozinke se ne poklapaju')
      return
    }

    if (AuthService.existsByEmail(this.user.email)) {
      Alerts.error('Korisnik sa tim emailom već postoji')
      return
    }

    AuthService.createUser(this.user)
    Alerts.success('Registracija uspešna')
    this.router.navigate(['/login'])
  }
}