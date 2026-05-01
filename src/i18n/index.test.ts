import { describe, it, expect } from 'vitest'
import { t, getLangFromUrl, langUrl, getStaticLangPaths, getAlternateUrls, LANGUAGES } from './index'

describe('t()', () => {
    it('returns a translation for a valid key', () => {
        expect(t('ca', 'site.title')).toBe('Drac de Vilafranca del Penedès')
    })

    it('returns the same key translated for all supported languages', () => {
        const caTitle = t('ca', 'site.title')
        const esTitle = t('es', 'site.title')
        const enTitle = t('en', 'site.title')
        expect(typeof caTitle).toBe('string')
        expect(typeof esTitle).toBe('string')
        expect(typeof enTitle).toBe('string')
    })

    it('falls back to ca when key is missing in target lang', () => {
        const caValue = t('ca', 'site.title')
        expect(t('es', 'site.title')).toBeTruthy()
        expect(caValue).toBeTruthy()
    })

    it('returns the key string when not found in any language', () => {
        expect(t('ca', 'totally.missing.key')).toBe('totally.missing.key')
        expect(t('en', 'another.missing')).toBe('another.missing')
    })

    it('returns nested values via dot notation', () => {
        expect(t('ca', 'nav.home')).toBeTruthy()
        expect(t('es', 'nav.home')).toBeTruthy()
    })
})

describe('getLangFromUrl()', () => {
    it('extracts the lang segment from a URL', () => {
        expect(getLangFromUrl(new URL('https://example.com/ca/el-drac'))).toBe('ca')
        expect(getLangFromUrl(new URL('https://example.com/es/historia/origens'))).toBe('es')
        expect(getLangFromUrl(new URL('https://example.com/en/'))).toBe('en')
    })

    it('returns the default lang (ca) for an unknown lang segment', () => {
        expect(getLangFromUrl(new URL('https://example.com/fr/page'))).toBe('ca')
        expect(getLangFromUrl(new URL('https://example.com/'))).toBe('ca')
    })
})

describe('langUrl()', () => {
    it('builds a lang-prefixed URL for a given path', () => {
        expect(langUrl('ca', 'el-drac')).toBe('/ca/el-drac')
        expect(langUrl('es', 'historia/origens')).toBe('/es/historia/origens')
        expect(langUrl('en', 'contacte')).toBe('/en/contacte')
    })

    it('returns the lang root for an empty or root path', () => {
        expect(langUrl('ca', '')).toBe('/ca/')
        expect(langUrl('en', '/')).toBe('/en/')
    })
})

describe('getStaticLangPaths()', () => {
    it('returns one path per supported language', () => {
        const paths = getStaticLangPaths()
        expect(paths).toHaveLength(LANGUAGES.length)
    })

    it('includes all supported languages', () => {
        const langs = getStaticLangPaths().map((p) => p.params.lang)
        expect(langs).toContain('ca')
        expect(langs).toContain('es')
        expect(langs).toContain('en')
    })
})

describe('getAlternateUrls()', () => {
    it('returns one alternate URL per language', () => {
        const alts = getAlternateUrls('/ca/el-drac')
        expect(alts).toHaveLength(LANGUAGES.length)
    })

    it('correctly builds alternate URLs preserving the slug', () => {
        const alts = getAlternateUrls('/ca/el-drac')
        expect(alts.find((a) => a.lang === 'es')?.url).toBe('/es/el-drac')
        expect(alts.find((a) => a.lang === 'en')?.url).toBe('/en/el-drac')
    })

    it('handles root path', () => {
        const alts = getAlternateUrls('/ca/')
        expect(alts.find((a) => a.lang === 'es')?.url).toBe('/es/')
        expect(alts.find((a) => a.lang === 'en')?.url).toBe('/en/')
    })

    it('handles deeply nested paths', () => {
        const alts = getAlternateUrls('/ca/historia/origens')
        expect(alts.find((a) => a.lang === 'es')?.url).toBe('/es/historia/origens')
    })
})
