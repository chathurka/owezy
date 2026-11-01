# @owezy/design-system

Owezy shared design tokens. This package provides the single source of truth for colours, typography, spacing, radius, and shadows across all platforms.

## Usage

### Web (Next.js / CSS)

```css
@import '@owezy/design-system/tokens.css';

/* Then use CSS variables: */
color: var(--color-text-primary);
```

### TypeScript / React

```ts
import { colors, spacing } from '@owezy/design-system';
```

### Flutter

See `flutter/` for Dart token mirrors. Import via the `AppColors`, `AppSpacing`, `AppRadius`, and `AppTextStyles` classes in `apps/mobile/lib/core/theme/`.

---

Token values are placeholders. Replace with final brand palette once delivered by design team.
