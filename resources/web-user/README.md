# resources/web-user

Place web design mocks and design system documentation here before running `/spec-build` for a user-web UI feature.

## Expected contents

| File | Purpose |
|------|---------|
| `Owezy Web App-standalone-src.html` | In-app screen mocks (home, groups, expenses, etc.) |
| `Owezy Onboarding-standalone-src.html` | Auth/onboarding flow mocks |
| `owezy-web-app-design-system.md` | Tokens, components, Lucide icons, motion, copy rules |
| `assets/` | Brand images, logos, og-card |

## When /spec-build reads these files

For any feature with admin-web or user-web in scope:
- Reads `README.md` first (this file)
- Opens the matched screen mock (`*-standalone-src.html`)
- Always also reads `owezy-web-app-design-system.md`
- Copies brand images from `assets/` to `app/public/`

If this folder is empty, `/spec-build` will proceed using stub screens and note the gap in the architecture doc's Open Questions section.
