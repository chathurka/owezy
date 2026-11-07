import React from 'react';
import styles from './avatar.module.css';

export type AvatarPalette = 'you' | 'pink' | 'sky' | 'amber' | 'green' | 'peach' | 'violet';

export type AvatarProps = { initials: string; size?: number; palette?: AvatarPalette; };

/** Owezy admin avatar — circle with initials. "you" palette is always violet. */
export function Avatar({ initials, size = 32, palette = 'you' }: AvatarProps) {
  const display = initials.slice(0, 2).toUpperCase();
  const fontSize = Math.round(size * 0.36);
  return (
    <span className={`${styles.avatar} ${styles[palette]}`} style={{ width: size, height: size, fontSize }} aria-label={`Avatar for ${initials}`}>
      {display}
    </span>
  );
}

export type AvatarStackProps = { avatars: AvatarProps[]; size?: number; maxVisible?: number; };

/** Overlapping avatar stack. */
export function AvatarStack({ avatars, size = 24, maxVisible = 4 }: AvatarStackProps) {
  const visible = avatars.slice(0, maxVisible);
  const extra = avatars.length - maxVisible;
  return (
    <div className={styles.stack}>
      {visible.map((a, i) => <Avatar key={i} {...a} size={size} />)}
      {extra > 0 && <span className={`${styles.avatar} ${styles.extra}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>+{extra}</span>}
    </div>
  );
}
