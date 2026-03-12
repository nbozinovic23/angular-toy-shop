import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Utils } from '../utils';
import { AuthService } from '../../services/auth.service';
import { ToyService } from '../../services/toy.service';


@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public authService = AuthService
  toys = signal<ToyModel[]>([])

  constructor(public utils: Utils) {
    ToyService.getToys()
      .then(rsp => {
        this.toys.set(rsp.data)
      })
  }
}