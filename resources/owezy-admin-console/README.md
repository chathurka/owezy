# Owezy Admin Console — design export

Open `index.html` in a browser. Everything works offline; no build step or server needed.

## Contents

| Path | What |
|---|---|
| `index.html` | Gallery linking every screen in light and dark |
| `Main.html` … `AuditLogs.html` | 10 admin screens, light mode |
| `*Dark.html` | The same screens in dark mode |
| `DesignSystem.html`, `DesignSystemDark.html` | Design system reference |
| `assets/design-system/tokens.css` | CSS custom properties — light by default, dark via `data-theme="dark"` on `<html>` or the OS setting |
| `assets/design-system/tokens.json` | Same tokens as JSON (colour per theme, type, spacing, radius, shadow) |
| `assets/design-system/README.md` | Principles, layout, components and chart rules |
| `assets/design-system/components/` | `bundle.css` plus guidelines and previews for Button, Status badge, KPI card, Data table, Sidebar nav |
| `assets/icons/` | 20 outline icons + the Owezy mark (SVG, `currentColor`) |
| `assets/fonts/` | Inter (400–800) and JetBrains Mono (500), with `fonts.css` |
| `assets/dc-runtime.js` | Small script that renders the interactive pages |

## Screens

Dashboard · User management · User details · Group management · Group details · Reports & disputes · Subscriptions · Sync monitoring · Configuration · Audit logs

## Notes

- Each page's markup and data live inside the page itself (`#dc-template` and the `Component` script), so copy, numbers and styles can be edited in any text editor.
- Brand violet is `#635BDB`. Token names match Owezy Mobile and Web.
- Sample data is illustrative.
- Fonts: Inter and JetBrains Mono are licensed under the SIL Open Font License 1.1 (see `assets/fonts/`).
