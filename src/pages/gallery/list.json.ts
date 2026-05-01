import type { APIRoute } from 'astro'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

export const GET: APIRoute = () => {
    const dir = join(process.cwd(), 'public', 'gallery')
    let files: string[] = []
    try {
        files = readdirSync(dir)
            .filter((f) => /^\d{4}\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .sort((a, b) => b.localeCompare(a))
    } catch {}
    return new Response(JSON.stringify({ files }), {
        headers: { 'Content-Type': 'application/json' },
    })
}
