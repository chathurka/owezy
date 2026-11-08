import { en, MessageKey } from './messages/en';

export function t(key: MessageKey): string {
  return en[key] ?? key;
}

export type { MessageKey };
