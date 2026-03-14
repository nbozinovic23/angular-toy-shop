import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Utils } from '../utils';
import { Alerts } from '../alerts';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { CartItemModel } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, MatTableModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  toys = signal<ToyModel[]>([])
  activeCartColumns = ['naziv', 'cenaPoKomadu', 'kolicina', 'ukupnaCena', 'datum', 'opcije']
  infoColumns = ['naziv', 'cenaPoKomadu', 'kolicina', 'ukupnaCena', 'datum', 'ocena', 'opcije']
  otkazanoColumns = ['naziv', 'cenaPoKomadu', 'kolicina', 'ukupnaCena', 'datum', 'opcije']

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

  getActiveCart() {
    return AuthService.getActiveCartItems()
  }

  getOrderGroups() {
    return Array.from(AuthService.getOrderGroups().entries()).reverse()
  }

  getPristiglo() {
    return AuthService.getCartByStatus('pristiglo')
  }

  getOtkazano() {
    return AuthService.getCartByStatus('otkazano')
  }

  calculateActiveTotal() {
    return this.getActiveCart().reduce((sum, item) => sum + item.totalPrice, 0)
  }

  calculateGroupTotal(items: CartItemModel[]) {
    return items.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  getStars(rating: number | null): string {
    if (!rating) return '☆☆☆☆☆'
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
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
            <p><strong>Datum dodavanja:</strong> ${item.createdAt}</p>
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
            <p><strong>Porudžbina:</strong> ${item.orderId}</p>
        </div>
        <img src="${src}" style="margin-top: 16px" />
    `)
  }

  rateItem(item: CartItemModel) {
    const toy = this.getToy(item.toyId)
    if (!toy) return
    Alerts.rateItem(toy.name, (rating, comment) => {
      AuthService.rateCartItem(item.createdAt, item.toyId, rating, comment)
      this.reloadComponent()
    })
  }

  removeFromCart(item: CartItemModel) {
    Alerts.confirm('Da li ste sigurni da želite da uklonite igračku iz korpe?', () => {
      AuthService.removeFromActiveCart(item.createdAt, item.toyId)
      this.reloadComponent()
    })
  }

  cancelActiveCart() {
    Alerts.confirm('Da li ste sigurni da želite da otkažete celu korpu?', () => {
      AuthService.cancelActiveCart()
      this.reloadComponent()
    })
  }

  payAll() {
    Alerts.confirm(`Da li ste sigurni da želite da poručite sve? Ukupno: ${this.calculateActiveTotal()} RSD`, () => {
      AuthService.payActiveCart()
      this.reloadComponent()
    })
  }
}