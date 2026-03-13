import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Utils } from '../utils';
import { Alerts, matCustomClass } from '../alerts';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { CartItemModel } from '../../models/cart-item.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, MatTableModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  toys = signal<ToyModel[]>([])
  displayedColumns = ['naziv', 'cenaPoKomadu', 'kolicina', 'ukupnaCena', 'datum', 'opcije']
  infoColumns = ['naziv', 'cenaPoKomadu', 'kolicina', 'ukupnaCena', 'datum', 'opcije']

  constructor(public router: Router, public utils: Utils) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
      return
    }

    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data))
  }

  getToy(toyId: number) {
    return this.toys().find(t => t.toyId === toyId)
  }

  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/cart']))
  }

  getRezervisano() {
    return AuthService.getCartByStatus('rezervisano')
  }

  getPristiglo() {
    return AuthService.getCartByStatus('pristiglo')
  }

  getOtkazano() {
    return AuthService.getCartByStatus('otkazano')
  }

  calculateTotal() {
    let total = 0
    for (let item of this.getRezervisano()) {
      total += item.totalPrice
    }
    return total
  }

  showDetails(item: CartItemModel) {
    const toy = this.getToy(item.toyId)
    if (!toy) return
    Alerts.toyDetails(toy.name, `
        <div style="text-align: left">
            <p><strong>Opis:</strong> ${toy.description}</p>
            <p><strong>Tip:</strong> ${toy.type.name}</p>
            <p><strong>Uzrast:</strong> ${toy.ageGroup.name} god.</p>
            <p><strong>Ciljna grupa:</strong> ${toy.targetGroup}</p>
            <p><strong>Datum proizvodnje:</strong> ${this.utils.formatDate(toy.productionDate)}</p>
            <p><strong>Cena/kom:</strong> ${toy.price} RSD</p>
            <p><strong>Količina:</strong> ${item.quantity}</p>
            <p><strong>Ukupno:</strong> ${item.totalPrice} RSD</p>
            <p><strong>Datum rezervacije:</strong> ${item.createdAt}</p>
            <p><strong>Status:</strong> ${item.status}</p>
        </div>
    `)
  }

  showConfirmation(item: CartItemModel) {
      const toy = this.getToy(item.toyId)
      if (!toy) return
      const barcode = item.createdAt.replace(/[^0-9]/g, '')
      const src = `https://quickchart.io/barcode?type=code128&text=${barcode}&width=280&includeText=true`
      Alerts.toyDetails(toy.name, `
          <div style="text-align: left">
              <p><strong>Opis:</strong> ${toy.description}</p>
              <p><strong>Tip:</strong> ${toy.type.name}</p>
              <p><strong>Uzrast:</strong> ${toy.ageGroup.name} god.</p>
              <p><strong>Ciljna grupa:</strong> ${toy.targetGroup}</p>
              <p><strong>Datum proizvodnje:</strong> ${this.utils.formatDate(toy.productionDate)}</p>
              <p><strong>Cena/kom:</strong> ${toy.price} RSD</p>
              <p><strong>Količina:</strong> ${item.quantity}</p>
              <p><strong>Ukupno:</strong> ${item.totalPrice} RSD</p>
              <p><strong>Datum rezervacije:</strong> ${item.createdAt}</p>
          </div>
          <img src="${src}" style="margin-top: 16px" />
      `)
  }

  cancelItem(item: CartItemModel) {
    Alerts.confirm('Da li ste sigurni da želite da otkažete rezervaciju?', () => {
      AuthService.cancelCartItem(item.createdAt)
      this.reloadComponent()
    })
  }

  payAll() {
    Alerts.confirm(`Da li ste sigurni da želite da platite sve? Ukupno: ${this.calculateTotal()} RSD`, () => {
      AuthService.payCartItem()
      this.reloadComponent()
    })
  }
}