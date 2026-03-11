import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToyModel } from '../../models/toy.model';
import { Utils } from '../utils';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import axios from 'axios';

@Component({
  selector: 'app-details',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  toy = signal<ToyModel | null>(null)

  constructor(route: ActivatedRoute, public utils: Utils) {
    route.params.subscribe(params => {
      const id = params['id']
      axios.get<ToyModel>(`https://toy.pequla.com/api/toy/${id}`)
        .then(rsp => this.toy.set(rsp.data))
    })
  }
}