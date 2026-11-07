/**
 * Owezy admin-web component kit.
 *
 * All components use CSS variables from @owezy/design-system/admin and
 * respect the light/dark [data-theme] on <html>. Admin surface adds
 * --danger, --danger-soft, --info, --info-soft tokens and denser 14px type.
 *
 * Usage:
 * ```ts
 * import { Button, TextField, Badge } from '@/components';
 * ```
 */

export { Button } from './button';
export type { AdminButtonProps, AdminButtonVariant, AdminButtonSize } from './button';

export { TextField } from './text-field';
export type { TextFieldProps } from './text-field';

export { Switch } from './switch';
export type { SwitchProps } from './switch';

export { Avatar, AvatarStack } from './avatar';
export type { AvatarProps, AvatarPalette, AvatarStackProps } from './avatar';

export { Badge } from './badge';
export type { BadgeProps, BadgeVariant } from './badge';

export { Alert } from './alert';
export type { AlertProps, AlertVariant } from './alert';

export { FilterChip } from './chip';
export type { FilterChipProps } from './chip';

export { Card } from './card';
export type { CardProps, CardStyle } from './card';

export { Amount } from './amount';
export type { AmountProps, AmountSign } from './amount';
