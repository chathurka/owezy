import { en, MessageKey } from './messages/en';

type Params = Record<string, string | number>;

export function t(key: MessageKey, params?: Params): string {
  let message: string = en[key];
  if (!params) return message;
  for (const [name, value] of Object.entries(params)) {
    message = message.replaceAll(`{${name}}`, String(value));
  }
  return message;
}
