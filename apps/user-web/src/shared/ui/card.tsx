import React from 'react';
import styles from './card.module.css';

export type CardStyle = 'content' | 'raised' | 'floating';
export type CardRadius = 18 | 22 | 24 | 28;

export type CardProps = {
  children: React.ReactNode;
  style?: CardStyle;
  radius?: CardRadius;
  padding?: string | number;
  onClick?: () => void;
  className?: string;
};

const radiusClass: Partial<Record<CardRadius, string>> = {
  18: styles.radius18,
  22: styles.radius22,
  28: styles.radius28,
};

/**
 * Owezy content card — surface, border (light) / surface-step (dark), radius 24.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Hero & stat cards.
 * Elevation policy: border in light, surface steps in dark, shadows only on floating.
 *
 * ```tsx
 * <Card><ExpenseList /></Card>
 * <Card style="floating" radius={28} padding="22px"><HeroContent /></Card>
 * ```
 */
export function Card({
  children,
  style = 'content',
  radius,
  padding = '20px',
  onClick,
  className = '',
}: CardProps) {
  const cls = [
    styles.card,
    style !== 'content' ? styles[style] : '',
    radius ? (radiusClass[radius] ?? '') : '',
    onClick ? styles.interactive : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={{ padding }} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  );
}
