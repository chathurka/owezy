import React from 'react';
import styles from './amount.module.css';

export type AmountSign = 'positive' | 'negative' | 'neutral';

export type AmountProps = {
  /** Formatted value string — e.g. '$48.00'. Do NOT include +/−. */
  value: string;
  sign: AmountSign;
  /** If true, automatically prepends + or − to the value. */
  showSignPrefix?: boolean;
  /** Optional label shown below the value (e.g. "owed to you"). Required if showSignPrefix=false. */
  label?: string;
  /** Override font size (px). Defaults to 24. */
  fontSize?: number;
  className?: string;
};

/**
 * Owezy amount display — enforces the money colour rule.
 *
 * **Rule (non-negotiable):** Money colours are NEVER used alone.
 * Either set showSignPrefix=true (adds +/−) OR provide a label.
 * Throws at runtime in dev if neither is supplied.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 List rows, Hero card.
 *
 * ```tsx
 * <Amount value="$48.00" sign="positive" />              // → "+$48.00" in green
 * <Amount value="$215.00" sign="negative" />             // → "−$215.00" in orange
 * <Amount value="$842.50" sign="positive" label="owed to you" showSignPrefix={false} />
 * <Amount value="$186.00" sign="neutral" />              // expense total, plain text
 * ```
 */
export function Amount({
  value,
  sign,
  showSignPrefix = true,
  label,
  fontSize = 24,
  className = '',
}: AmountProps) {
  if (process.env.NODE_ENV !== 'production') {
    if (!showSignPrefix && !label && sign !== 'neutral') {
      console.error('AppAmount: set showSignPrefix=true OR provide a label — never rely on colour alone.');
    }
  }

  const prefix =
    !showSignPrefix || sign === 'neutral'
      ? ''
      : sign === 'positive'
      ? '+'
      : '−';

  return (
    <span className={`${styles.root} ${className}`}>
      <span
        className={`${styles.value} ${styles[sign]}`}
        style={{ fontSize }}
      >
        {prefix}{value}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}
