/**
 * Owezy user-web shared UI kit.
 *
 * All components use CSS variables from @owezy/design-system/user and
 * respect the light/dark [data-theme] on <html>. Never import raw
 * hex/rem/px values into feature code.
 *
 * Usage:
 * ```ts
 * import { Button, TextField, Badge, Amount } from '@/shared/ui';
 * ```
 */

// Primitives
export { Button } from './button';
export type { AppButtonProps, ButtonVariant, ButtonSize } from './button';

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

export { FilterChip, CategoryChip } from './chip';
export type { ChipCategory } from './chip';

export { Card } from './card';
export type { CardProps, CardStyle, CardRadius } from './card';

export { Amount } from './amount';
export type { AmountProps, AmountSign } from './amount';
