// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { addToCart, removeFromCart, totalItems, getCart } from './cart'
import type { CartItem } from './cart'

function item(overrides: Partial<CartItem> = {}): CartItem {
    return {
        productId: 'samarreta-adult',
        productName: 'Samarreta Adult',
        size: 'M',
        color: 'Negre',
        quantity: 1,
        ...overrides,
    }
}

beforeEach(() => {
    localStorage.clear()
})

describe('totalItems()', () => {
    it('returns 0 for an empty cart', () => {
        expect(totalItems([])).toBe(0)
    })

    it('sums quantities across all items', () => {
        expect(totalItems([item({ quantity: 2 }), item({ quantity: 3 })])).toBe(5)
    })

    it('counts a single item correctly', () => {
        expect(totalItems([item({ quantity: 7 })])).toBe(7)
    })
})

describe('getCart()', () => {
    it('returns an empty array when localStorage is empty', () => {
        expect(getCart()).toEqual([])
    })

    it('returns an empty array when localStorage contains invalid JSON', () => {
        localStorage.setItem('drac-cart', 'not-valid-json')
        expect(getCart()).toEqual([])
    })
})

describe('addToCart()', () => {
    it('adds a new item to an empty cart', () => {
        addToCart(item())
        expect(getCart()).toHaveLength(1)
    })

    it('increments quantity when the same product/size/color is added again', () => {
        addToCart(item({ quantity: 1 }))
        addToCart(item({ quantity: 2 }))
        const cart = getCart()
        expect(cart).toHaveLength(1)
        expect(cart[0].quantity).toBe(3)
    })

    it('creates a separate entry for a different size', () => {
        addToCart(item({ size: 'M' }))
        addToCart(item({ size: 'L' }))
        expect(getCart()).toHaveLength(2)
    })

    it('creates a separate entry for a different color', () => {
        addToCart(item({ color: 'Negre' }))
        addToCart(item({ color: 'Blanc' }))
        expect(getCart()).toHaveLength(2)
    })

    it('creates a separate entry for a different product', () => {
        addToCart(item({ productId: 'samarreta-adult' }))
        addToCart(item({ productId: 'samarreta-nen' }))
        expect(getCart()).toHaveLength(2)
    })

    it('persists across multiple getCart() calls', () => {
        addToCart(item())
        addToCart(item({ size: 'L' }))
        expect(getCart()).toHaveLength(2)
        expect(getCart()).toHaveLength(2)
    })
})

describe('removeFromCart()', () => {
    it('removes the item at the given index', () => {
        addToCart(item({ productId: 'a' }))
        addToCart(item({ productId: 'b' }))
        removeFromCart(0)
        const cart = getCart()
        expect(cart).toHaveLength(1)
        expect(cart[0].productId).toBe('b')
    })

    it('removes the last item leaving an empty cart', () => {
        addToCart(item())
        removeFromCart(0)
        expect(getCart()).toHaveLength(0)
    })

    it('removes by index when multiple items share the same product', () => {
        addToCart(item({ size: 'S' }))
        addToCart(item({ size: 'M' }))
        addToCart(item({ size: 'L' }))
        removeFromCart(1)
        const cart = getCart()
        expect(cart).toHaveLength(2)
        expect(cart.map((i) => i.size)).toEqual(['S', 'L'])
    })
})
