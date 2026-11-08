import { en, MessageKey } from './messages/en';
import { si } from './messages/si';
import { getLocale } from './locale';

type Params = Record<string, string | number>;

const catalogs = {
  en,
  si,
} as const;

export function t(key: MessageKey, params?: Params): string {
  const locale = getLocale();
  const catalog = catalogs[locale] ?? en;
  let message: string = (catalog as Record<string, string>)[key] ?? en[key];
  if (!params) return message;
  for (const [name, value] of Object.entries(params)) {
    message = message.replaceAll(`{${name}}`, String(value));
  }
  return message;
}
