export const ALLOWED_LOCALES = ['en', 'si'] as const;
export type AppLocale = (typeof ALLOWED_LOCALES)[number];

let currentLocale: AppLocale = 'en';

export function getLocale(): AppLocale {
  return currentLocale;
}

export function setLocale(locale: string): AppLocale {
  currentLocale = ALLOWED_LOCALES.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : 'en';
  if (typeof document !== 'undefined') {
    document.documentElement.lang = currentLocale;
  }
  return currentLocale;
}
