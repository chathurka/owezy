# Owezy

Split expenses, settle up, stay friends. One violet system shared by Owezy Mobile, Owezy Web and the Owezy Admin Console — light and dark, built on the same token names.

## Principles

- **Money is never colour-only.** Owed to you = `owed` with a `+`; you owe = `owe` with a `−` or a "you owe" label. Neutral totals use `text`.
- **Calm surfaces, one loud colour.** Neutral `background` → `surface` → `surface-raised`; `primary` (#635BDB) is reserved for the one action, the active place, and series 1 in charts.
- **Borders in light, steps in dark.** Light mode cards are `surface` + 1px `border` (+ `shadow-card`). Dark mode drops shadows and uses the surface steps.
- **Soft and friendly geometry.** Generous radii (`radius-lg` cards, `radius-pill` chips), Inter at heavy weights for figures, tabular numbers everywhere.
- **Minimal text.** Labels are one or two words; meta lines carry the detail.

## Colour

| Role | Token | Use |
|---|---|---|
| Brand | `primary`, `primary-hover`, `primary-text`, `primary-soft`, `on-primary` | CTA, active nav, links, focus ring (`primary-soft` 4px) |
| Positive | `owed`, `owed-fill`, `owed-soft` | Owed to you, success, healthy, active, settled |
| Caution | `owe`, `owe-fill`, `owe-soft` | You owe, warning, pending, degraded, budget ≥ 80% |
| Negative | `danger`, `danger-soft` | Failed, suspended, destructive |
| Info | `info`, `info-soft` | In review, syncing, trial |
| Charts | `chart-1` … `chart-5`, `chart-muted`, `chart-grid` | Violet, teal, amber, rose, blue — always in this order |

Text tokens (`text`, `text-muted`, `text-subtle`) pass 4.5:1 on `background`, `surface`, `surface-raised` and `surface-sunken` in both themes. Badge text (`owed`, `owe`, `danger`, `info`, `primary-text`) passes 4.5:1 on its matching `*-soft` fill. Use `*-fill` colours only for shapes, never small text.

## Type

Inter (Google Fonts, 400–800). All figures use `font-variant-numeric: tabular-nums`.

| Style | Spec | Use |
|---|---|---|
| display | 40 / 800 / −1.4 | Hero balances, mobile expense total |
| kpi | 28 / 800 / −0.8 | Admin KPI card values |
| title | 24 / 800 / −0.6 | Page titles |
| headline | 17 / 700 | Card and section titles |
| body-strong / body | 14 / 700 · 14 / 500 | Table primary cell, row text |
| label | 13 / 600 | Buttons, chips, form labels |
| caption | 12 / 500 | Meta lines, table secondary text |
| micro | 11 / 600 | Badge text, axis labels |
| overline | 11 / 700 uppercase +0.6 | Sidebar group labels, table headers |
| mono | 12 / 500 JetBrains Mono | IDs, batch IDs, IPs, JSON |

Mobile keeps its 15px body (see `design/DESIGN_SPEC.md`); web and admin use 14px for density.

## Layout — Admin Console

- **Shell:** 248px sidebar (`surface`, right `border`) + top bar 64px (search ⌘K, environment pill, theme toggle, notifications, admin avatar) + content on `background`.
- **Content:** max 1440px, gutter `space-6`, sections `space-8` apart, card grids `space-4` gap. 12-column grid; KPI rows are 4 × 3 columns.
- **Sidebar:** logo + "Admin" tag; groups OVERVIEW · MANAGE · REVENUE · PLATFORM · SECURITY; items 40px, `radius-sm`, icon 18; active = `primary-soft` fill + `primary-text` 700 (fill only, no left-border bars). Count badges right-aligned.
- **Below 960px** the sidebar collapses to a 72px icon rail; below 640px it becomes a top menu and tables scroll horizontally in their card.

## Components

- **KPI card** — `surface`, `radius-lg`, padding `space-5`. Overline label + 18px icon tile (`primary-soft`), value in `kpi`, delta pill (▲ `owed-soft`/`owed`, ▼ `danger-soft`/`danger`) + "vs last 30d" caption, optional 32px sparkline in `chart-1`.
- **Data table** — inside a card; header band `surface-sunken`, `overline` headers in `text-muted`; rows 56px, `divider` separators, hover `primary-soft` at 40%. First column: avatar/tile + `body-strong` + `caption`. Numbers right-aligned tabular. Row actions: 32px ghost icon button "⋯". Footer: "1–10 of 48,213" + pager.
- **Filter bar** — search input (40h, `radius-md`, `border-strong`, magnifier icon), select pills, "Clear", right-aligned Export (secondary) + primary action.
- **Status badge** — 22h pill, `micro` 700, 6px leading dot. Active/Healthy/Resolved → owed · Pending/Degraded/Past due → owe · Failed/Suspended/Banned → danger · In review/Trial/Syncing → info · Draft/Inactive → neutral (`track` + `text-muted`) · Premium → primary.
- **Buttons** — 40h desktop (`radius-md`, `label` 700). Primary `primary` + `shadow-button`; secondary `primary-soft` + `primary-text`; ghost `surface` + `border-strong`; destructive `danger` text on `danger-soft`.
- **Segmented control & tabs** — same as mobile: track `track`, selected `surface-raised`; underline tabs with 2.5px `primary` bar.
- **Detail header** — avatar 64 / tile, name in `title`, meta caption, badges, actions right. Below: underline tabs.
- **Switch** — 40 × 24, on `primary`, off `border-strong`.
- **Alert** — `radius-lg`, padding 12/16, soft fill + matching text token, icon 18.

## Charts

- Line/area: 2.5px stroke `chart-1`, area 12% fill, `chart-grid` gridlines, `micro` axis labels in `text-subtle`; comparison series dashed `chart-muted`.
- Bars: radius 6 top, highlight bar `chart-1`, others `chart-muted`; stacked bars follow chart order with 2px gaps.
- Donut: stroke 18–22, 2–3px gaps, centre total in `headline` 800.
- Failure charts use `danger` for failed, `owe-fill` for retried, `owed-fill` for succeeded — always with a legend label.
- Tooltip: `inverse` fill, `on-inverse` text, `radius-xs`.

## Iconography

Outline, 24 grid, stroke 1.9, round caps and joins, `currentColor`; sizes 16 / 18 / 20 / 24. Same icon set as mobile (`assets/icons/*.svg`). No emoji.

## Voice

Plain and short. "Settle up", "Owes you", "Sync failed". Admin copy names the object and the action: "Suspend user", "Retry batch", "Resolve dispute".
