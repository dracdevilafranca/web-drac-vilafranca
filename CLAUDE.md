# CLAUDE.md — Drac de Vilafranca Web

Guia per a Claude Code en futures sessions d'aquest projecte.

## Projecte

Web oficial del **Drac de Vilafranca del Penedès** (entitat: Amics del Drac de Vilafranca del Penedès).  
URL de producció: `https://www.dracdevilafranca.com`  
Desplegament: **Cloudflare Pages** (branca `main` → deploy automàtic via CI/CD).

## Stack

- **Astro** (SSG, adaptador Cloudflare) + **Tailwind CSS v4** (`@import "tailwindcss"`)
- **TypeScript** estricte
- **Cloudflare Functions** per a la API (`functions/api/reserva.ts`)
- **Resend** per a l'enviament de correus de confirmació de reserves
- **Vitest** per a tests, **ESLint** (flat config v9) per a linting
- **GitHub Actions** CI/CD (`.github/workflows/ci.yml`)

## Estructura clau

```
src/
  components/        # Components reutilitzables Astro
  i18n/              # ca.json, es.json, en.json + index.ts
  layouts/           # BaseLayout.astro (HTML base, SEO, JSON-LD)
  pages/[lang]/      # Totes les pàgines (SSG per lang: ca, es, en)
  scripts/           # cart.ts (lògica carret, localStorage)
  styles/            # app.css (tema Tailwind + keyframes)
functions/
  api/reserva.ts     # POST handler: valida i envia correu via Resend
public/
  _headers           # Security headers + cache headers per Cloudflare Pages
  data/products.json # Catàleg de productes (source of truth)
```

## Idiomes

Tres idiomes: `ca` (default), `es`, `en`. Totes les pàgines sota `/[lang]/`.  
El helper `t(lang, 'clau')` llegeix les claus de `src/i18n/*.json`.  
Les claus noves s'han d'afegir als tres fitxers (`ca.json`, `es.json`, `en.json`).

## Components reutilitzables creats

| Component | Props clau | Usat a |
|---|---|---|
| `PageHeader.astro` | `title`, `subtitle?`, `supertitle?` | 11 pàgines |
| `SocialLinks.astro` | `showHandle?` | Footer, Contacte |
| `ContentImage.astro` | `src`, `alt`, `width`, `height`, `caption?`, `smallCaption?`, `imageClass?` | el-drac, els-amics, origens |

## Estat actual (abril 2026)

### Implementat i funcional

- **43 pàgines** generant correctament (build net, 0 errors)
- **38 tests passant** (i18n, cart, reserva API)
- **0 errors ESLint**
- **CI/CD** via GitHub Actions (astro check → eslint → vitest → build)
- **Botiga** amb modal de reserva, carret, focus trap, swipe tàctil
- **GDPR compliant**: checkbox de consentiment obligatori, pàgina de privacitat (`/[lang]/privacitat`) en tres idiomes, avís de recollida en mà (no enviaments)
- **SEO**: sitemap (`@astrojs/sitemap`), hreflang, Open Graph, Twitter Card, JSON-LD Organization
- **Security headers** (`_headers`): CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Animació canvas hero** pausada amb `IntersectionObserver` quan no és visible

### Millores de performance pendents (no implementades)

Ordenades per impacte/esforç:

1. **Preload hero image** + `fetchpriority="high"` — 2 línies a `BaseLayout.astro`, alt impacte LCP
2. **Convertir GIFs a WebP** — reduiria pes de les imatges animades
3. **Reduir variants de font** — revisar quines variants de Playfair Display / Source Sans 3 s'usen realment
4. **Self-host Google Fonts** — elimina dependència externa, millora privacitat i TTFB
5. **`astro:assets` Image component** — WebP + srcset automàtic (requereix moure imatges a `src/assets/`)
6. **Augmentar TTL cache imatges** — `/images/*` actual a 1 dia, podria ser 7 dies

## Convencions de codi

- **Cap comentari** llevat que el WHY no sigui obvi
- **TypeScript** estricte; no usar `any` si es pot evitar
- **No** afegir funcionalitat no sol·licitada
- Components Astro: `interface Props` sempre declarada
- Classes Tailwind en l'ordre: layout → spacing → color → typography → interactive

## Branques

- `main` → producció (Cloudflare Pages)
- `develop` → desenvolupament actiu (branca actual)
- Format commits: `type(scope): descripció` (ex: `feat(shop): add reservation modal`)

## Secrets necessaris (Cloudflare / GitHub)

- `RESEND_API_KEY` — clau API de Resend per a l'enviament de correus
- `FROM_EMAIL` — adreça remitent (ex: `reserves@dracdevilafranca.com`)
- Per a GitHub Actions CI: no cal cap secret (el build és públic)
