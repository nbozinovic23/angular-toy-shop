import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToyModel } from '../../models/toy.model';
import axios from 'axios';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  toy = signal<ToyModel | null>(null)

  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => {
      const id = params['id']
      axios.get(`https://toy.pequla.com/api/toy/${id}`)
        .then(rsp => this.toy.set(rsp.data))
    })
  }
}