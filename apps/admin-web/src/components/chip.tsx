import React from 'react';
import styles from './chip.module.css';

export type FilterChipProps = { label: string; isSelected?: boolean; onClick?: () => void; leadingIcon?: React.ReactNode; };

/** Owezy admin filter chip — 32h, pill, 13px. */
export function FilterChip({ label, isSelected = false, onClick, leadingIcon }: FilterChipProps) {
  return (
    <button type="button" className={[styles.chip, isSelected ? styles.selected : ''].filter(Boolean).join(' ')} onClick={onClick} aria-pressed={isSelected}>
      {leadingIcon}{label}
    </button>
  );
}
