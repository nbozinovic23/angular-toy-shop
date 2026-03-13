import { CartItemModel } from "../models/cart-item.model"
import { UserModel } from "../models/user.model"

const USERS = 'users'
const ACTIVE = 'active'

export class AuthService {
    static getUsers(): UserModel[] {
        const baseUser: UserModel = {
            email: 'user@example.com',
            password: 'user123',
            firstName: 'Example',
            lastName: 'User',
            phone: '0601234567',
            address: 'Ulica bb',
            favoriteToyTypes: ['Slagalica'],
            cart: []
        }

        if (localStorage.getItem(USERS) == null) {
            localStorage.setItem(USERS, JSON.stringify([baseUser]))
        }

        return JSON.parse(localStorage.getItem(USERS)!)
    }

    static login(email: string, password: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email && u.password === password) {
                localStorage.setItem(ACTIVE, email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u
            }
        }

        return null
    }

    static updateActiveUser(newUserData: UserModel) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.firstName = newUserData.firstName
                u.lastName = newUserData.lastName
                u.address = newUserData.address
                u.phone = newUserData.phone
                u.favoriteToyTypes = newUserData.favoriteToyTypes
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static updateActiveUserPassword(newPassword: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.password = newPassword
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static logout() {
        localStorage.removeItem(ACTIVE)
    }

    static addToCart(item: Partial<CartItemModel>, toyId: number) {
        item.toyId = toyId
        item.status = 'rezervisano'
        item.rating = null
        const now = new Date()
        item.createdAt = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}. ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.cart.push(item as CartItemModel)
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static getCartItems() {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u.cart
            }
        }
        return []
    }
}