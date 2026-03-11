import { Component, signal } from '@angular/core';
import axios from 'axios';
import { ToyModel } from '../../models/toy.model';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Utils } from '../utils';
import { AuthService } from '../../services/auth.service';


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
    axios.get<ToyModel[]>('https://toy.pequla.com/api/toy')
      .then(rsp => {
        this.toys.set(rsp.data)
      })
  }
}