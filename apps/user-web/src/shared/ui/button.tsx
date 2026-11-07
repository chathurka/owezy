import React from 'react';
import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'standard' | 'compact' | 'small';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  children: React.ReactNode;
};

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | 'children'> & {
    as?: 'button';
  };

type AnchorProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | 'children'> & {
    as: 'a';
    href: string;
  };

export type AppButtonProps = ButtonProps | AnchorProps;

const sizeClass: Record<ButtonSize, string> = {
  standard: styles.sizeSt,
  compact: styles.sizeCp,
  small: styles.sizeSm,
};

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

/**
 * Owezy branded button — primary / secondary / ghost.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Buttons.
 * Tokens from @owezy/design-system/user; never hardcode colours.
 *
 * ```tsx
 * <Button variant="primary" onClick={handleSubmit}>Create account</Button>
 * <Button variant="ghost" size="compact" as="a" href="/login">Sign in</Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'standard',
  fullWidth = false,
  isLoading = false,
  leadingIcon,
  children,
  ...rest
}: AppButtonProps) {
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
    return (
      <a {...anchorRest} className={className}>
        {content}
      </a>
    );
  }

  const { as: _as, ...btnRest } = rest as ButtonProps & { as?: string };
  return (
    <button {...btnRest} disabled={(btnRest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled || isLoading} className={className}>
      {content}
    </button>
  );
}
