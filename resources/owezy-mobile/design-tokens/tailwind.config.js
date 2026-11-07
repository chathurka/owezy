// Owezy Tailwind preset. Import tokens.css once; colors resolve to CSS variables so light/dark switch automatically.
/** @type {import('tailwindcss').Config} */
module.exports = {
  "darkMode": [
    "class",
    "[data-theme=\"dark\"]"
  ],
  "theme": {
    "extend": {
      "colors": {
        "background": "var(--background)",
        "surface": "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        "subtle": "var(--subtle)",
        "track": "var(--track)",
        "border": "var(--border)",
        "border-strong": "var(--border-strong)",
        "divider": "var(--divider)",
        "text": "var(--text)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "primary": "var(--primary)",
        "primary-pressed": "var(--primary-pressed)",
        "primary-text": "var(--primary-text)",
        "accent-text": "var(--accent-text)",
        "primary-soft": "var(--primary-soft)",
        "on-primary": "var(--on-primary)",
        "owed": "var(--owed)",
        "owed-soft": "var(--owed-soft)",
        "owe": "var(--owe)",
        "owe-soft": "var(--owe-soft)",
        "danger": "var(--danger)",
        "warning-text": "var(--warning-text)",
        "inverse": "var(--inverse)"
      },
      "fontFamily": {
        "sans": [
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      "borderRadius": {
        "xs": "8px",
        "sm": "12px",
        "md": "14px",
        "lg": "16px",
        "xl": "18px",
        "2xl": "22px",
        "3xl": "24px",
        "4xl": "28px",
        "pill": "999px"
      },
      "boxShadow": {
        "hero": "0 18px 40px rgba(99,91,219,0.28)",
        "fab": "0 10px 24px rgba(99,91,219,0.40)",
        "primary-button": "0 10px 24px rgba(99,91,219,0.32)",
        "floating-card": "0 12px 30px rgba(20,20,43,0.08)",
        "segment-selected": "0 2px 6px rgba(20,20,43,0.08)",
        "focus-ring": "0 0 0 4px var(--primary-soft)"
      },
      "fontSize": {
        "display": [
          "40px",
          {
            "lineHeight": "1.1",
            "letterSpacing": "-1.4px",
            "fontWeight": "800"
          }
        ],
        "amount-lg": [
          "30px",
          {
            "lineHeight": "1.1",
            "letterSpacing": "-1.0px",
            "fontWeight": "800"
          }
        ],
        "title": [
          "28px",
          {
            "lineHeight": "1.15",
            "letterSpacing": "-0.8px",
            "fontWeight": "800"
          }
        ],
        "amount": [
          "24px",
          {
            "lineHeight": "1.2",
            "letterSpacing": "-0.6px",
            "fontWeight": "800"
          }
        ],
        "headline": [
          "17px",
          {
            "lineHeight": "1.3",
            "letterSpacing": "-0.2px",
            "fontWeight": "700"
          }
        ],
        "body-strong": [
          "15px",
          {
            "lineHeight": "1.35",
            "letterSpacing": "0px",
            "fontWeight": "700"
          }
        ],
        "body": [
          "15px",
          {
            "lineHeight": "1.35",
            "letterSpacing": "0px",
            "fontWeight": "600"
          }
        ],
        "label": [
          "13px",
          {
            "lineHeight": "1.35",
            "letterSpacing": "0px",
            "fontWeight": "600"
          }
        ],
        "caption": [
          "12px",
          {
            "lineHeight": "1.35",
            "letterSpacing": "0px",
            "fontWeight": "500"
          }
        ],
        "micro": [
          "11px",
          {
            "lineHeight": "1.3",
            "letterSpacing": "0px",
            "fontWeight": "600"
          }
        ],
        "overline": [
          "12px",
          {
            "lineHeight": "1.3",
            "letterSpacing": "0.5px",
            "fontWeight": "700"
          }
        ]
      }
    }
  }
};
