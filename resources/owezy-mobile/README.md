# Owezy — Developer Handoff

Expense-splitting app for iOS and Android. This package contains everything needed to build it in Cursor: screenshots, every visual asset as an individual file, fonts, design tokens, component CSS, a clean HTML/CSS/JS reference build, and the full clickable prototype.

> **About images:** the design uses **no photos or raster images**. Every visual (icons, logo, decorative rings, receipt illustration, charts) is vector and is included here as an individual SVG. Avatars are initials on coloured circles (CSS), and charts are drawn in code (see `docs/DESIGN_SPEC.md` § Charts). PNG exports are included for the logo and app icon.

## Folder structure

```
owezy-handoff/
├── README.md                     ← you are here
├── .cursor/rules/owezy-design.mdc← Cursor project rule (design guardrails)
├── docs/
│   └── DESIGN_SPEC.md            ← layouts, components, charts, screens, sample data
├── screenshots/                  ← 2× PNG of every screen (780 × 1688)
│   ├── light/   (13 screens)
│   ├── dark/    (13 screens)
│   └── design-system/ (light + dark boards)
├── assets/
│   ├── icons/          ← 45 SVG icons + sprite.svg (all icons in one file)
│   ├── logo/           ← mark, wordmark (light/dark), app icon SVG + PNG sizes
│   └── illustrations/  ← hero/header/premium rings, settle arrow, receipt
├── fonts/
│   ├── inter.css       ← @font-face for the web
│   └── inter/
│       ├── woff2/      ← web fonts (400, 500, 600, 700, 800)
│       ├── ttf/        ← mobile fonts (React Native / Flutter / native)
│       └── OFL-LICENSE.txt
├── design-tokens/
│   ├── tokens.json        ← single source of truth (light + dark)
│   ├── tokens.css         ← CSS variables, light default, dark via [data-theme="dark"] or OS
│   ├── tailwind.config.js ← Tailwind preset (colours map to the CSS variables)
│   └── theme.ts           ← TypeScript theme for React Native / Expo
├── css/
│   └── components.css  ← every component as reusable token-based classes
├── reference/
│   └── index.html      ← clean HTML/CSS/JS build of Home + component gallery, theme toggle
└── prototype/
    ├── index.html      ← gallery of all screens (Light / Dark / Design system)
    └── screens/        ← 28 screen files (*.dc.html) + support.js runtime
```

## Run it locally

The pages load files from sibling folders, so serve the folder rather than double-clicking:

```bash
cd owezy-handoff
npx serve .            # or: python3 -m http.server 8000
```

- `http://localhost:3000/prototype/` — every screen, clickable, light and dark.
- `http://localhost:3000/reference/` — the clean component-based build.

## How the code is organised

| Want | Use |
|---|---|
| Exact look of a screen | `screenshots/` + `prototype/screens/<Name>.dc.html` (exact markup, inline styles, sample data and interactions in the `renderVals()` script at the bottom) |
| Reusable, production-style CSS | `design-tokens/tokens.css` + `css/components.css` (see `reference/index.html` for usage) |
| React Native / Expo theme | `design-tokens/theme.ts` + `fonts/inter/ttf` |
| Tailwind / NativeWind | `design-tokens/tailwind.config.js` + `tokens.css` |
| Icons in React | import the SVGs (e.g. with `react-native-svg` / SVGR) or use `assets/icons/sprite.svg` on the web: `<svg class="icon"><use href="assets/icons/sprite.svg#home"/></svg>` |

### Screen files
`prototype/screens/*.dc.html` are self-contained HTML files rendered by `support.js` (a ~150-line template runtime included here). Template syntax: `{{ value }}` holes, `<sc-for list="{{items}}" as="item">` loops, `<sc-if value="{{cond}}">` conditions, and `onClick="{{handler}}"`. All data and interactions live in the `class Component` script at the bottom of each file. Treat them as a precise visual reference to port into your framework; the reusable CSS is in `css/components.css`.

| Screen | Light file | Dark file |
|---|---|---|
| Home | Main.dc.html | MainDark.dc.html |
| Groups | Groups.dc.html | GroupsDark.dc.html |
| Group details | GroupDetails.dc.html | GroupDetailsDark.dc.html |
| Add expense | AddExpense.dc.html | AddExpenseDark.dc.html |
| Expense details | ExpenseDetails.dc.html | ExpenseDetailsDark.dc.html |
| Split expense | SplitExpense.dc.html | SplitExpenseDark.dc.html |
| Balances | Balances.dc.html | BalancesDark.dc.html |
| Settle up | Settlements.dc.html | SettlementsDark.dc.html |
| Activity | Activity.dc.html | ActivityDark.dc.html |
| Budgets | Budgets.dc.html | BudgetsDark.dc.html |
| Insights | Analytics.dc.html | AnalyticsDark.dc.html |
| Profile & settings | Profile.dc.html | ProfileDark.dc.html |
| Premium | Premium.dc.html | PremiumDark.dc.html |

## Asset inventory

**Icons (`assets/icons`)** — activity, alert, arrow-in, arrow-out, back, bank, bell, bills, calendar, camera, card, cash, chat, check, chevron-down, chevron-right, close, crown, download, edit, filter, food, globe, groups, home, home-filled, insights, lock, logout, moon, more, mountain, plus, repeat, search, shield, shopping, sparkle, split, stay, ticket, transport, travel, user, wallet.

**Logo (`assets/logo`)** — `owezy-mark.svg` (+ 96/144/512 PNG), `owezy-logo-light.svg` / `owezy-logo-dark.svg` (+ @2x/@3x PNG), `owezy-glyph-white.svg`, `owezy-glyph-violet.svg`, `app-icon.svg` (+ 1024/512/192/180/120 PNG), `app-icon-android-foreground.svg` (+ 1024/432 PNG, use with background #635BDB).

**Illustrations (`assets/illustrations`)** — `hero-rings.svg` (Home balance card), `header-ring.svg` (Group details header), `settle-ring.svg` + `settle-arrow.svg` (Settle up card), `premium-rings.svg` (Premium header), `receipt-thumbnail.svg` (Expense details).

**Fonts** — Inter 400/500/600/700/800 (Latin subset) as WOFF2 and TTF, SIL Open Font License. Font file names for React Native: `Inter-Regular`, `Inter-Medium`, `Inter-SemiBold`, `Inter-Bold`, `Inter-ExtraBold`.

**Colours & gradients** — all in `design-tokens/tokens.json`. The design uses **no gradients** by choice; depth comes from translucent white rings on violet and soft violet shadows.

## Suggested first prompt for Cursor

> Build the Owezy mobile app with Expo (React Native + TypeScript). Follow `.cursor/rules/owezy-design.mdc` and `docs/DESIGN_SPEC.md`. Use `design-tokens/theme.ts` for all colours, type and spacing, load the Inter TTFs from `fonts/inter/ttf`, and render icons from `assets/icons` with react-native-svg. Support light and dark mode from the system setting. Start with the bottom tab navigator (Home, Groups, Add, Activity, Insights) and the Home screen; match `screenshots/light/Home.png` and `screenshots/dark/Home.png` exactly, using the sample data in the spec.
