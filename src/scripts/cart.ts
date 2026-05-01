export interface CartItem {
    productId: string
    productName: string
    size: string
    color: string
    quantity: number
    image?: string
}

const CART_KEY = 'drac-cart'

export function getCart(): CartItem[] {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[]
    } catch {
        return []
    }
}

export function saveCart(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
    document.dispatchEvent(new CustomEvent('cart-updated', { detail: items }))
}

export function addToCart(item: CartItem): void {
    const cart = getCart()
    const existing = cart.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
    )
    if (existing) {
        existing.quantity += item.quantity
    } else {
        cart.push(item)
    }
    saveCart(cart)
}

export function removeFromCart(index: number): void {
    const cart = getCart()
    cart.splice(index, 1)
    saveCart(cart)
}

export function totalItems(cart: CartItem[]): number {
    return cart.reduce((sum, i) => sum + i.quantity, 0)
}
