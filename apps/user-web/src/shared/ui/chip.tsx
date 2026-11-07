import React from 'react';
import styles from './chip.module.css';

export type ChipCategory =
  | 'food'
  | 'bills'
  | 'travel'
  | 'settlement'
  | 'groceries'
  | 'entertainment';

type FilterChipProps = {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  leadingIcon?: React.ReactNode;
};

type CategoryChipProps = {
  label: string;
  category: ChipCategory;
};

const catClass: Record<ChipCategory, string> = {
  food:          styles.catFood,
  bills:         styles.catBills,
  travel:        styles.catTravel,
  settlement:    styles.catSettlement,
  groceries:     styles.catGroceries,
  entertainment: styles.catEntertainment,
};

/**
 * Owezy filter chip — 36h, pill radius.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Chips & segments.
 *
 * ```tsx
 * <FilterChip label="All · 5" isSelected onClick={() => setFilter('all')} />
 * <FilterChip label="Owed to you" onClick={() => setFilter('owed')} />
 * ```
 */
export function FilterChip({ label, isSelected = false, onClick, leadingIcon }: FilterChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {leadingIcon}
      {label}
    </button>
  );
}

/**
 * Owezy category chip — 40h, coloured bg/fg, non-interactive (decorative).
 *
 * ```tsx
 * <CategoryChip label="Food" category="food" />
 * ```
 */
export function CategoryChip({ label, category }: CategoryChipProps) {
  return (
    <span className={`${styles.chip} ${styles.category} ${catClass[category]}`}>{label}</span>
  );
}
