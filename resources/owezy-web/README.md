# Owezy Web Dashboard — design export

> **Design board (Claude artifact):** `https://claude.ai/artifact/Pm7DX6oPiEtdh68f1Ryz7s`  
> **Local board HTML (all pages as compressed blobs):** `Owezy Web Dashboard.html`

Open `index.html` in any modern browser. No server or install needed.

## Folders

| Folder | Contents |
|---|---|
| `pages/` | 19 standalone `*.dc.html` pages: 15 desktop screens (1440 px), 2 tablet views (834 px), design system light + dark, **Sign in, Sign up**. `owezy-runtime.js` drives interactions. |
| `00 · Sign in-html/` | Sign in screen (also in `pages/SignIn.dc.html`) |
| `00 · Sign up-html/` | Sign up / Create account screen (also in `pages/SignUp.dc.html`) |
| `screenshots/` | Full-page PNG of every page, numbered in canvas order. |
| `design-tokens/` | `tokens.json` (source of truth) and `tokens.css` — CSS variables for light (`:root`) and dark (`[data-theme="dark"]`), spacing, radius, layout, shadows and `.type-*` text classes. |
| `source/` | Original design-canvas files (`*.dc.html`, `canvas.json`). |

## Screen inventory (`pages/`)

| Screen | File | Notes |
|--------|------|-------|
| Sign in | `SignIn.dc.html` | Auth — email + password, Remember me |
| Sign up | `SignUp.dc.html` | Auth — name, email, password, social |
| Dashboard | `Dashboard.dc.html` | Home — balance summary, recent activity |
| Groups | `Groups.dc.html` | Group list |
| Group workspace | `GroupWorkspace.dc.html` | Group detail — members, expenses, balances |
| Expenses | `Expenses.dc.html` | Expense list |
| Add expense | `AddExpense.dc.html` | Add/edit expense modal |
| Balances | `Balances.dc.html` | Net balances per person |
| Settlements | `Settlements.dc.html` | Settle up flow |
| Activity | `Activity.dc.html` | Activity feed |
| Budgets | `Budgets.dc.html` | Budget tracker |
| Analytics | `Analytics.dc.html` | Spending insights |
| Reports | `Reports.dc.html` | Expense report export |
| Settings | `Settings.dc.html` | Profile & preferences |
| Premium | `Premium.dc.html` | Upgrade / paywall |
| Dashboard (tablet) | `TabletDashboard.dc.html` | 834 px breakpoint |
| Analytics (tablet) | `TabletAnalytics.dc.html` | 834 px breakpoint |
| Design system | `DesignSystem.dc.html` | Token & component reference |
| Design system (dark) | `DesignSystemDark.dc.html` | Dark theme variant |

## Extracting a page from the board HTML

If a screen ever needs to be re-extracted from `Owezy Web Dashboard.html`:

```python
import re, base64, gzip
from pathlib import Path

PAGE_IDS = {
    "SignIn":         "8576b268-4756-4aa9-ae2e-15eaf3869556",
    "SignUp":         "65245dd0-5e6e-4161-96dd-a6ae26a67613",
    "Dashboard":      "9bbbf603-07e5-4cd2-b420-6604a171bd64",
    "Groups":         "8311628a-7937-44ec-8f0f-b06ad098b2b0",
    "GroupWorkspace": "a732276b-7b95-45eb-a97b-e28d1579be7b",
    "Expenses":       "e96fbe7e-7cbc-4de8-b907-588781a852e7",
    "AddExpense":     "7b927461-7167-4f54-9c39-f1461b6ffead",
    "Balances":       "64e351fb-9530-41f4-ba43-60bdf7005d33",
    "Settlements":    "be463b8c-eb54-4927-935a-03d3ca36214f",
    "Activity":       "a1fd6360-abc9-42ed-b5e4-bdaaac164eb9",
    "Budgets":        "b806c46d-2b6f-44ad-b36f-f9fa4eceb13a",
    "Analytics":      "263d50e4-b6b5-41cf-b08e-90bdbaccc4c2",
    "Reports":        "8748be57-9583-41a2-a144-87d46dd2c34d",
    "Settings":       "4f5680a6-13ba-40b3-b4b0-eae7623ea290",
    "Premium":        "4776fe74-d712-446e-b123-c5fb1c889e45",
    "TabletDashboard":"b782ca4b-d057-4610-a2f2-82656cca253c",
    "TabletAnalytics":"fb0ae90b-2f8b-4a91-988d-b65e0414cc0c",
    "DesignSystem":   "da69dbc2-c563-4991-90b1-e63a4db20cae",
    "DesignSystemDark":"44ab8753-7dae-43a2-ac17-d346008db141",
}

board = Path("Owezy Web Dashboard.html").read_text(errors="replace")

def extract(name, uid):
    pat = re.compile(re.escape(uid) + r'":\{"mime":"text/html","compressed":true,"data":"([^"]+)"\}')
    raw = gzip.decompress(base64.b64decode(pat.search(board).group(1))).decode(errors="replace")
    start = raw.find("<!DOCTYPE html>", 1)
    end   = raw.find('<\\u002Fhtml>"', start) + len('<\\u002Fhtml>')
    html  = raw[start:end].replace('\\u002F','/').replace('\\n','\n').replace('\\"','"')
    Path(f"pages/{name}.dc.html").write_text(html)

extract("SignIn", PAGE_IDS["SignIn"])   # re-extract a specific screen
```

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
