import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Utils } from '../utils';
import { AuthService } from '../../services/auth.service';
import { ToyService } from '../../services/toy.service';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AgeGroupModel, ToyTypeModel } from '../../models/toy.model';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    Loading,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  search = ''
  selectedType = ''
  selectedAgeGroup = ''
  selectedTargetGroup = ''
  minPrice: number | null = null
  maxPrice: number | null = null
  minDate = ''
  maxDate = ''
  minRating: number | null = null
  public authService = AuthService
  toys = signal<ToyModel[]>([])
  filteredToys = signal<ToyModel[]>([])
  toyTypes = signal<ToyTypeModel[]>([])
  ageGroups = signal<AgeGroupModel[]>([])

  constructor(public utils: Utils) {
    ToyService.getToys()
      .then(rsp => {
        const sorted = rsp.data.sort((a, b) => a.name.localeCompare(b.name))
        this.toys.set(sorted)
        this.filteredToys.set(sorted)
      })

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data))

    ToyService.getAgeGroups()
      .then(rsp => this.ageGroups.set(rsp.data))
  }

  getAverageRating(toy: ToyModel): number {
    const reviews = AuthService.getReviewsForToy(toy.toyId)
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }

  filter() {
    const filtered = this.toys()
      .filter(t => {
        if (this.search == '') return true
        const q = this.search.toLowerCase()
        return t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      })
      .filter(t => {
        if (this.selectedType == '') return true
        return t.type.name == this.selectedType
      })
      .filter(t => {
        if (this.selectedAgeGroup == '') return true
        return t.ageGroup.name == this.selectedAgeGroup
      })
      .filter(t => {
        if (this.selectedTargetGroup == '') return true
        return t.targetGroup == this.selectedTargetGroup
      })
      .filter(t => {
        if (this.minPrice === null) return true
        return t.price >= this.minPrice
      })
      .filter(t => {
        if (this.maxPrice === null) return true
        return t.price <= this.maxPrice
      })
      .filter(t => {
        if (this.minDate == '') return true
        return new Date(t.productionDate) >= new Date(this.minDate)
      })
      .filter(t => {
        if (this.maxDate == '') return true
        return new Date(t.productionDate) <= new Date(this.maxDate)
      })
      .filter(t => {
        if (this.minRating === null) return true
        return this.getAverageRating(t) >= this.minRating
      })

    this.filteredToys.set(filtered)
  }
}