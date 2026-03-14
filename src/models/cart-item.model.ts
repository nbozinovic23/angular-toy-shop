export interface ReviewModel {
    userEmail: string
    rating: number
    comment: string
    createdAt: string
}

export interface CartItemModel {
    orderId: string | null
    toyId: number
    quantity: number
    totalPrice: number
    status: 'rezervisano' | 'pristiglo' | 'otkazano'
    createdAt: string
    rating: number | null
    review: ReviewModel | null
}