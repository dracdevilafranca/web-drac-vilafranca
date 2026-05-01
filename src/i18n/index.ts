import ca from './ca.json'
import es from './es.json'
import en from './en.json'

export const LANGUAGES = ['ca', 'es', 'en'] as const
export type Lang = (typeof LANGUAGES)[number]
export const DEFAULT_LANG: Lang = 'ca'

const translations = { ca, es, en }

function getNestedValue(obj: Record<string, unknown>, keys: string[]): unknown {
    return keys.reduce((acc: unknown, key: string) => {
        if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[key]
        }
        return undefined
    }, obj as unknown)
}

// Return type is `any` because values can be strings, arrays or nested objects — callers cast as needed.
export function t(lang: Lang, key: string): any {
    const keys = key.split('.')
    const result = getNestedValue(translations[lang] as Record<string, unknown>, keys)
    if (result !== undefined) return result
    const fallback = getNestedValue(translations[DEFAULT_LANG] as Record<string, unknown>, keys)
    return fallback ?? key
}

export function getLangFromUrl(url: URL): Lang {
    const [, lang] = url.pathname.split('/')
    if ((LANGUAGES as readonly string[]).includes(lang)) return lang as Lang
    return DEFAULT_LANG
}

export function langUrl(lang: Lang, path: string): string {
    if (!path || path === '/') return `/${lang}/`
    return `/${lang}/${path}`
}

export function getStaticLangPaths() {
    return LANGUAGES.map((lang) => ({ params: { lang } }))
}

// currentPath is like /ca/el-drac — split off the leading lang segment to get the slug
export function getAlternateUrls(currentPath: string): { lang: Lang; url: string }[] {
    const parts = currentPath.split('/').filter(Boolean)
    const slug = parts.slice(1).join('/')
    return LANGUAGES.map((lang) => ({
        lang,
        url: slug ? `/${lang}/${slug}` : `/${lang}/`,
    }))
}
