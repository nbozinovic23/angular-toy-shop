import { CartItemModel } from "./cart-item.model";

export interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    favoriteToyTypes: string[],
    cart: CartItemModel[]
}