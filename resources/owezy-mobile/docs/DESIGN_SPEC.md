# Owezy — Design Specification

Frame: **390 × 844 pt** (iPhone 14/15 size). All values are in pt/px at 1×.
Every colour below is a token name from `design-tokens/tokens.json`. The same names exist in light and dark mode.

---

## 1. Foundations

### Layout
| Rule | Value |
|---|---|
| Screen side padding | 20 |
| Top safe area (content starts at) | 56 |
| Vertical gap between sections | 16–20 |
| Bottom tab bar height | 88 (incl. home-indicator space) |
| Sticky bottom action bar | padding 14 / 20 / 30, top border `border` |
| Minimum touch target | 44 × 44 |
| Card padding | 14–22 (list cards 14, feature cards 18–20, hero 22) |

### Typography (Inter)
| Style | Size / weight | Tracking | Used for |
|---|---|---|---|
| display | 40 / 800 | −1.4 | Hero balances (+$842.50), expense total |
| amountLg | 30 / 800 | −1.0 | Split total |
| title | 28 / 800 | −0.8 | Tab-root page titles (Groups, Activity, Insights) |
| amount | 24 / 800 | −0.6 | Card figures |
| headline | 17 / 700 | −0.2 | Screen header titles, section titles |
| bodyStrong | 15 / 700 | 0 | List titles, buttons |
| body | 15 / 600 | 0 | Row text |
| label | 13 / 600 | 0 | Chips, secondary labels |
| caption | 12 / 500 | 0 | Meta lines ("Lisbon Trip · Maya paid") |
| micro | 11 / 600 | 0 | Nav labels, amount notes ("you owe") |
| overline | 12 / 700, uppercase | +0.5 | Section dividers (TODAY, ACCOUNT) |

All numbers use **tabular figures** (`font-variant-numeric: tabular-nums`).

### Money colour rules
- Owed to you / you lent / received → `owed` (green), prefixed with **+** when it is a net figure.
- You owe / you borrowed → `owe` (orange), prefixed with **−** when it is a net figure.
- Neutral totals (what an expense cost) → `text`.
- Never rely on colour alone: every amount has a sign or a label ("you owe", "you lent").

### Radius
8 (stepper buttons) · 12 (small tiles) · 14 (icon buttons, segmented track) · 16 (buttons, inputs, large tiles) · 18 (primary CTA, list cards) · 22 (group cards) · 24 (content cards) · 28 (hero card) · 44 (device frame) · pill (chips).

### Elevation
Light mode uses 1 px `border` on white cards. Shadows only on: hero card (`shadow.hero`), floating stat card on Group details (`shadow.floatingCard`), primary CTA, and the FAB. Dark mode uses surface steps (background → surface → surfaceRaised) instead of shadows.

### Icons
Outline style, 24 × 24 grid, stroke 1.9 (2.2–2.4 for small chevrons/checks), round caps & joins, `currentColor`. Sizes: 16 / 20 / 24. Files: `assets/icons/*.svg`, sprite: `assets/icons/sprite.svg`.

---

## 2. Components

| Component | Spec |
|---|---|
| **Icon button** | 44 × 44, radius 14, `surface` + 1 px `border`, icon 20–22. On violet: `rgba(255,255,255,.16)`, no border. Notification dot 8 px `owe` with 2 px surface ring at top 10 / right 11. |
| **Primary button** | 56 h (52 in split bars), radius 18 (16), `primary` fill, `onPrimary` 16/700 text, `shadow.primaryButton`. |
| **Secondary button** | `primarySoft` fill, `accentText` label. |
| **Hero card** | `primary` fill, radius 28, padding 22, `shadow.hero`, decorative `hero-rings.svg` at right −70 / top −80. Two inner tiles `rgba(255,255,255,.14)` radius 18 padding 12/14. |
| **Chip** | 36 h (category chips 40), pill radius, 1 px `borderStrong`, 13/600. Selected: `primary` fill + white text (category chips) or `inverse`-style dark fill (activity filters). |
| **Segmented control** | Track `track`, padding 4, radius 14. Item 36–38 h, radius 11, 13/700. Selected item `surfaceRaised` + `shadow.segmentSelected`, label `primaryText`. |
| **Underline tabs** | 14/600 `textMuted`; selected 14/700 `primaryText` + 2.5 px `primary` underline; 22 gap; 1 px `borderStrong` baseline. |
| **Group card** | `surface`, radius 22, padding 14, 52 × 52 category tile (radius 16), title 15/700, avatar stack (24 px, −8 overlap, 2 px surface ring), meta 12/500; right column: note 11/600 muted + amount 15/800 coloured. |
| **List row** | 44 × 44 category tile radius 14, title 15/600, meta 12/500 muted, right-aligned amount 15/700 + note 11/500. Row padding 10–11 vertical; dividers `divider`. |
| **Avatar** | Circle, initials 700. Sizes 24 / 34 / 36 / 40 / 44 / 56 / 68. Colours from `avatar.*` palette ("you" is always violet). |
| **Badge** | 11/700, padding 4/9, radius 10. Variants: owed (Settled), owe (Owes), primary (Paid), neutral (Free plan). |
| **Progress bar** | 6–8 h, radius 4, track `divider` (or `primarySoft` on Home), fill `primary`; ≥ 80 % uses `chart.negative` (orange). |
| **Switch** | 48 × 28, knob 22 white, on = `primary`, off = `borderStrong`. |
| **Text input** | 52 h, radius 16, 1.5 px border; focused: `primary` border + 4 px `primarySoft` ring. |
| **Amount input** | Centred, 56/800, −2 tracking, with a 30/700 muted currency symbol. |
| **Alert** | Radius 18, padding 12/14, warning = `oweSoft` + `warningText`. |
| **Bottom tab bar** | 88 h, `surface`, top border. Items: Home, Groups, [+], Activity, Insights. Item 64 w, icon 24, label 11. Active = `primaryText` 700 + home icon filled with `primarySoft`. Centre FAB 56 × 56 radius 20, raised −26, `shadow.fab`. |

---

## 3. Charts

| Chart | Where | Spec |
|---|---|---|
| Mini daily bars | Home | 7 bars, 12 w, gap 7, radius 4, max 64 h; today = `primary`, others `chart.barMuted`. |
| Monthly area line | Insights | 330 × 156 viewBox; y-axis $0–$3k gridlines (`border`), 10/600 labels; smooth cubic line 3 px `primaryText`; area `primary` @ 10 %; peak marker 6 r white with 3 px stroke + dark tooltip (radius 8). Toggle 6M / 1Y. |
| Donut | Insights | r 46, stroke 16, 3 px gaps, 5 series from `chart.series`; centre total 16/800. Legend: 10 px rounded squares + value 800. |
| Weekday bars | Insights | 26 w bars, radius 8, max 60 h, value label above; peak bar `primary`. |
| Stacked share bar | Group details, Split | 10–14 h, 3 px gaps, per-category or per-person colours. |
| Diverging bars | Balances | Centre axis 2 px; left = you owe (`chart.negative`), right = owes you (`chart.positive`), length ∝ amount / max. |
| Budget ring | Budgets | r 66, stroke 16, track `primarySoft`, round cap, starts at 12 o'clock. |

---

## 4. Screens

Prototype file names are in brackets. Dark versions add `Dark` to the name.

1. **Home** (`Main`) — header (avatar 44, greeting, name 18/700, bell) → hero net-balance card (+$842.50, owed $1,057.50 / owe $215.00) → 4 quick actions (56 tiles: Add, Settle up, Split, Balances) → November spending card (amount, progress 66 %, mini bars) → Recent activity list → tab bar (Home active).
2. **Groups** (`Groups`) — title + search + "New" button → two stat tiles (owed / owe) → segmented filter (All · 5 / Owed to you / You owe — filters the list) → 5 group cards → tab bar.
3. **Group details** (`GroupDetails`) — violet header (back, more, trip tile, title, dates, avatar stack) → floating stat card overlapping header by 44 (Total spent / Your share / You're owed + stacked category bar + legend) → underline tabs → expense rows with date chip (OCT / 24) → sticky bar: Settle up (secondary) + Add expense (primary).
4. **Add expense** (`AddExpense`, white background) — close, title, group picker pill → big amount input + per-person helper chip → description input (focused state) → category chips (single select) → grouped rows: Paid by, Split, Date, Note → bottom: camera button + Save expense.
5. **Expense details** (`ExpenseDetails`) — back, edit, more → category tile, title, meta, total 40/800 → "Paid by" card with your share → split card (progress "2 of 4 settled", 5 participant rows with status badges) → receipt thumbnail + comment → sticky "Settle $37.30 with Maya".
6. **Split expense** (`SplitExpense`) — total card with "Balanced" badge and stacked per-person bar → segmented method (Equal / Exact / Percent / Shares — updates amounts and bar) → participant rows with stepper → bottom: Assigned $186.50 / $186.50 + Done.
7. **Balances** (`Balances`) — net +$842.50 + owed/owe split bar → "Simplify debts" switch banner → per-person rows with diverging bar and Remind / Pay buttons.
8. **Settle up** (`Settlements`) — violet card: You → Sana, $145.00, group chip → "Pay with" 2 × 2 method cards (single select, focus ring) → recent settlements → "Record $145.00 payment".
9. **Activity** (`Activity`) — title + "Mark all read" → filter chips (All / Expenses / Payments / Updates — filters) → day-grouped cards (TODAY / YESTERDAY / THIS WEEK); rows have category tile + actor avatar badge → tab bar (Activity active).
10. **Budgets** (`Budgets`) — back, month picker, add → ring card ($614 left of $1,800; spent, safe daily spend, days left) → warning alert → 5 category budget rows with progress and %.
11. **Insights** (`Analytics`) — title + 6M/1Y toggle → area line card with delta badge → donut by category → weekday bars → tab bar (Insights active).
12. **Profile & settings** (`Profile`) — avatar 68 with ring, name, email, plan badge → stats row (Groups / Expenses / Friends) → dark "Upgrade to Premium" banner → ACCOUNT list → PREFERENCES switches (Push, Face ID, Dark mode) → Sign out.
13. **Premium** (`Premium`) — violet header with rings, crown tile, title, tagline → 6 features in 2 columns → plan cards (Yearly with SAVE 33 % badge, Monthly; radio select) → "Start 7-day free trial" + fine print.

### Navigation map
Home → Profile (avatar), Activity (bell / See all), Budgets (spending card), Add expense (+), Settle up, Split, Balances (quick actions).
Groups → Group details → Expense details → Settle up. Group details → Add expense / Balances / Insights.
Add expense → Split expense (Split row) → Expense details (Done / Save).
Profile → Premium.

---

## 5. Sample data (consistent across screens)

- You: **Alex Morgan** (AM). Friends: Maya Chen, Leo Park, Daniel Ruiz, Priya Nair, Sana Iqbal, Jordan Lee.
- Net +$842.50 = owed $1,057.50 (Maya 312.40, Leo 268.10, Priya 256.00, Daniel 221.00) − owe $215.00 (Sana 145.00, Jordan 70.00).
- Groups: Lisbon Trip (+486.20), Flatmates · 12 Elm St (−145.00), Friday Dinners (+112.30), Office Lunch (−70.00), Ski Weekend (settled).
- November spend $1,186 of $1,800: Food 412/500, Travel 286/400, Rent & bills 248/600, Groceries 152/200, Entertainment 88/100.
- Monthly spend (Jun–Nov): 1,240 · 1,380 · 1,520 · 1,290 · 2,860 · 1,186.
- Premium: $4.99 / month or $39.99 / year (placeholder prices).
