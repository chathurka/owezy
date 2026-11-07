import React from 'react';
import styles from './button.module.css';

export type AdminButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type AdminButtonSize = 'sm' | 'md' | 'lg';

type ButtonBaseProps = {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  children: React.ReactNode;
};

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | 'children'>;

type AnchorProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | 'children'> & {
    as: 'a';
    href: string;
  };

export type AdminButtonProps = ButtonProps | AnchorProps;

const sizeClass: Record<AdminButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const variantClass: Record<AdminButtonVariant, string> = {
  primary:   styles.primary,
  secondary: styles.secondary,
  ghost:     styles.ghost,
  danger:    styles.danger,
};

/**
 * Owezy admin button — 40h default, 14px, admin density.
 *
 * Design source: owezy-admin-console assets/design-system/components/Button.
 * Tokens from @owezy/design-system/admin.
 *
 * ```tsx
 * <Button variant="primary" onClick={handleSave}>Save</Button>
 * <Button variant="danger" size="sm">Delete</Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leadingIcon,
  children,
  ...rest
}: AdminButtonProps) {
  const className = [
    styles.btn,
    variantClass[variant],
    sizeClass[size],
    fullWidth ? styles.fullWidth : '',
    (rest as { className?: string }).className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {isLoading ? <span className={styles.spinner} aria-hidden /> : leadingIcon}
      <span>{children}</span>
    </>
  );

  if ((rest as AnchorProps).as === 'a') {
    const { as: _as, ...anchorRest } = rest as AnchorProps & { as: string };
    return <a {...anchorRest} className={className}>{content}</a>;
  }

  const { as: _as, ...btnRest } = rest as ButtonProps & { as?: string };
  return (
    <button
      {...btnRest}
      disabled={(btnRest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled || isLoading}
      className={className}
    >
      {content}
    </button>
  );
}
