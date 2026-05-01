import { describe, it, expect } from 'vitest'
import { onRequestPost } from './reserva'

function makeRequest(body: unknown): Request {
    return new Request('https://example.com/api/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

const validBody = {
    customer_name: 'Joan Puig',
    customer_email: 'joan@example.com',
    items: [{ product_name: 'Samarreta Adult', size: 'M', color: 'Negre', quantity: 1 }],
}

describe('onRequestPost() — validation', () => {
    it('returns 500 when RESEND_API_KEY is not set', async () => {
        const res = await onRequestPost({
            request: makeRequest(validBody),
            env: { RESEND_API_KEY: '' },
        })
        expect(res.status).toBe(500)
        const json = await res.json() as { ok: boolean }
        expect(json.ok).toBe(false)
    })

    it('returns 400 for a malformed JSON body', async () => {
        const req = new Request('https://example.com/api/reserva', {
            method: 'POST',
            body: 'not-json',
        })
        const res = await onRequestPost({ request: req, env: { RESEND_API_KEY: 'key' } })
        expect(res.status).toBe(400)
    })

    it('returns 400 when customer_name is missing', async () => {
        const res = await onRequestPost({
            request: makeRequest({ ...validBody, customer_name: '' }),
            env: { RESEND_API_KEY: 'key' },
        })
        expect(res.status).toBe(400)
    })

    it('returns 400 when customer_email is invalid', async () => {
        const res = await onRequestPost({
            request: makeRequest({ ...validBody, customer_email: 'not-an-email' }),
            env: { RESEND_API_KEY: 'key' },
        })
        expect(res.status).toBe(400)
    })

    it('returns 400 when customer_email is missing', async () => {
        const res = await onRequestPost({
            request: makeRequest({ ...validBody, customer_email: '' }),
            env: { RESEND_API_KEY: 'key' },
        })
        expect(res.status).toBe(400)
    })

    it('returns 400 when items array is empty', async () => {
        const res = await onRequestPost({
            request: makeRequest({ ...validBody, items: [] }),
            env: { RESEND_API_KEY: 'key' },
        })
        expect(res.status).toBe(400)
    })

    it('returns 400 when items contains only entries without a product name', async () => {
        const res = await onRequestPost({
            request: makeRequest({ ...validBody, items: [{ product_name: '', quantity: 1 }] }),
            env: { RESEND_API_KEY: 'key' },
        })
        expect(res.status).toBe(400)
    })

    it('returns 400 when a single-item body has no product_name', async () => {
        const res = await onRequestPost({
            request: makeRequest({ customer_name: 'Joan', customer_email: 'joan@example.com', product_name: '' }),
            env: { RESEND_API_KEY: 'key' },
        })
        expect(res.status).toBe(400)
    })

    it('accepts a valid email with subdomains', async () => {
        const res = await onRequestPost({
            request: makeRequest({ ...validBody, customer_email: 'user@mail.example.com' }),
            env: { RESEND_API_KEY: '' },
        })
        // RESEND_API_KEY is empty so it returns 500, but NOT 400 — validation passed
        expect(res.status).toBe(500)
    })
})
