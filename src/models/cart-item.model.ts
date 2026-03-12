export interface CartItemModel {
    toyId: number
    quantity: number
    status: 'rezervisano' | 'pristiglo' | 'otkazano'
    createdAt: string
    rating: number | null
}