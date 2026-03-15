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

    static generateOrderId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 6).toUpperCase()
    }

    static addToCart(item: Partial<CartItemModel>, toyId: number) {
        const now = new Date()
        const createdAt = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}. ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                item.toyId = toyId
                item.orderId = null
                item.status = 'rezervisano'
                item.rating = null
                item.review = null
                item.createdAt = createdAt
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

    static getActiveCartItems() {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u.cart.filter(i => i.status === 'rezervisano' && i.orderId === null)
            }
        }
        return []
    }

    static getCartByStatus(status: 'pristiglo' | 'otkazano') {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u.cart.filter(i => i.status === status)
            }
        }
        return []
    }

    static updateCartItem(createdAt: string, toyId: number, quantity: number, totalPrice: number) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let i of u.cart) {
                    if (i.orderId === null && i.createdAt === createdAt && i.toyId === toyId) {
                        i.quantity = quantity
                        i.totalPrice = totalPrice
                    }
                }
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static deletePristigloItem(createdAt: string, toyId: number) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.cart = u.cart.filter(i => !(i.status === 'pristiglo' && i.createdAt === createdAt && i.toyId === toyId))
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static getOrderGroups(): Map<string, CartItemModel[]> {
        const items = this.getCartByStatus('pristiglo')
        const groups = new Map<string, CartItemModel[]>()
        for (let item of items) {
            if (!groups.has(item.orderId!)) {
                groups.set(item.orderId!, [])
            }
            groups.get(item.orderId!)!.push(item)
        }
        return groups
    }

    static removeFromActiveCart(createdAt: string, toyId: number) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.cart = u.cart.filter(i => !(i.orderId === null && i.createdAt === createdAt && i.toyId === toyId))
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static payActiveCart() {
        const orderId = this.generateOrderId()
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let i of u.cart) {
                    if (i.status === 'rezervisano' && i.orderId === null) {
                        i.status = 'pristiglo'
                        i.orderId = orderId
                    }
                }
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static cancelActiveCart() {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let i of u.cart) {
                    if (i.status === 'rezervisano' && i.orderId === null) {
                        i.status = 'otkazano'
                    }
                }
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static rateCartItem(createdAt: string, toyId: number, rating: number, comment: string) {
        const users = this.getUsers()
        const now = new Date()
        const reviewDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}.`
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                for (let i of u.cart) {
                    if (i.createdAt === createdAt && i.toyId === toyId && i.status === 'pristiglo') {
                        i.rating = rating
                        i.review = {
                            userEmail: u.email,
                            rating,
                            comment,
                            createdAt: reviewDate
                        }
                    }
                }
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static getReviewsForToy(toyId: number): import('../models/cart-item.model').ReviewModel[] {
        const users = this.getUsers()
        const reviews = []
        for (let u of users) {
            for (let i of u.cart) {
                if (i.toyId === toyId && i.review != null) {
                    reviews.push(i.review)
                }
            }
        }
        return reviews
    }

    static createUser(user: Partial<UserModel>) {
        const users = this.getUsers()
        user.cart = []
        users.push(user as UserModel)
        localStorage.setItem(USERS, JSON.stringify(users))
    }

    static existsByEmail(email: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email) return true
        }
        return false
    }
}