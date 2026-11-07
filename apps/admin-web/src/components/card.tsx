import React from 'react';
import styles from './card.module.css';

export type CardStyle = 'content' | 'raised' | 'floating';

export type CardProps = { children: React.ReactNode; style?: CardStyle; padding?: string | number; onClick?: () => void; className?: string; };

/**
 * Owezy admin content card — surface, 1px border (light) / surface-step (dark), radius-lg.
 *
 * Design source: owezy-admin-console assets/design-system (Cards).
 */
export function Card({ children, style = 'content', padding = '16px', onClick, className = '' }: CardProps) {
  const cls = [styles.card, style !== 'content' ? styles[style] : '', onClick ? styles.interactive : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ padding }} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  );
}
