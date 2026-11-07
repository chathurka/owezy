# Owezy Web Dashboard — export

Open `index.html` in any modern browser. No server or install needed.

## Folders

| Folder | Contents |
|---|---|
| `pages/` | 17 standalone HTML pages: 13 desktop screens (1440), 2 tablet views (834), design system light + dark. `owezy-runtime.js` drives the interactions. |
| `screenshots/` | Full-page PNG of every page, numbered in canvas order. |
| `design-tokens/` | `tokens.json` (source of truth) and `tokens.css` — CSS variables for light (`:root`) and dark (`[data-theme="dark"]`), spacing, radius, layout, shadows and `.type-*` text classes. |
| `source/` | Original design-canvas files (`*.dc.html`, `canvas.json`). |

## Using the tokens in code

```html
<link rel="stylesheet" href="design-tokens/tokens.css">
<html data-theme="dark"> <!-- or "light"; omit to follow the OS setting -->
```

```css
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-24); }
.owed { color: var(--owed); }   /* always pair with + or a label */
```

## Notes

- Pages link to each other through the sidebar, top bar and buttons — start at `pages/Main.dc.html`.
- The dashboard screens use light-mode values; the design-system sheets show both themes.
- Sample data (Alex Morgan, Lisbon Trip, …) and Premium prices are placeholders.
