import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
    output: 'static',
    site: 'https://www.dracdevilafranca.com',
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: 'ca',
                locales: { ca: 'ca-ES', es: 'es-ES', en: 'en-GB' },
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
})
