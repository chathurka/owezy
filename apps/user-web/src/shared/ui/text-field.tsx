import React, { forwardRef } from 'react';
import styles from './text-field.module.css';

export type TextFieldProps = {
  label?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;

/**
 * Owezy text field — 52h, radius 16, 1.5px border.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Inputs.
 * Tokens from @owezy/design-system/user; never hardcode colours.
 *
 * ```tsx
 * <TextField label="Email" type="email" error={errors.email} />
 * <TextField label="Password" type="password" trailing={<ToggleBtn />} />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, leading, trailing, id, ...rest }, ref) {
    const inputId = id ?? `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className={styles.root}>
        {label && (
          <label className={`type-caption ${styles.label}`} htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className={styles.inputWrap}>
          {leading && <span className={styles.leading}>{leading}</span>}
          <input
            ref={ref}
            id={inputId}
            className={[
              styles.input,
              error ? styles.hasError : '',
              leading ? styles.hasLeading : '',
              trailing ? styles.hasTrailing : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />
          {trailing && <span className={styles.trailing}>{trailing}</span>}
        </div>
        {error && <span className={`type-caption ${styles.error}`}>{error}</span>}
      </div>
    );
  },
);
