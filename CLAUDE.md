# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

동거동락 — a Korean rental property management app for two users (family). It is a **zero-dependency, single-file web app**. There is no build step, no package manager, no framework. The entire app lives in `rent_app.html`. `index.html` is an identical copy used for GitHub Pages deployment (the two files must be kept in sync).

## Running / testing

Open `rent_app.html` directly in a browser. There are no build commands, no npm scripts, and no test suite. To test a change, open the file in Chrome or Safari and exercise the UI manually.

To deploy, copy `rent_app.html` → `index.html` and push to `main`. GitHub Pages serves `index.html` automatically.

## Architecture

All code — HTML structure, CSS, and JavaScript — is in a single file (`rent_app.html`), roughly structured top-to-bottom as:

1. **CSS** (lines ~12–1530): design system via CSS custom properties (`:root`), then component styles. Key variables: `--primary` (#1e40af), `--success`, `--danger`, `--warning`. Touch targets use `-webkit-tap-highlight-color: transparent` and `touch-action: manipulation`.

2. **HTML structure** (lines ~1530–2560): app shell with `.app-header`, `.content-area` (contains `.page` divs), and `.bottom-nav`. Each tab is a `.page` div hidden via `display:none`; the active page gets class `active`. Modals are `.modal-overlay` divs appended inline.

3. **JavaScript** (lines ~2560–end): one large `<script>` block with no modules or bundling.

### Data model

All state lives in a single global object:

```js
let appData = {
    buildings: [],  // { id, name, address, type, totalRooms, memo, ... }
    rooms:     [],  // { id, buildingId, number, status, rent, deposit, ... }
    tenants:   [],  // { id, roomId, buildingId, name, phone, status, contractStart, contractEnd, rentType, ... }
    rents:     [],  // { id, tenantId, roomId, buildingId, month, amount, status, type, ... }
    expenses:  []   // { id, buildingId, roomId, title, amount, category, date, receipts, ... }
};
```

### Persistence

- **localStorage** (`appData` key): primary store, written synchronously on every `saveData()` call.
- **Firestore** (`rentalApp/main` document): debounced write (~750 ms) after every `saveData()`. Real-time sync via `onSnapshot` — when another device saves, the listener merges changes into local `appData` and re-renders the current page.

Firebase uses the compat SDK v10.11.0 (CDN), anonymous auth, and offline persistence (`enablePersistence`). Config is the `FIREBASE_CONFIG` constant near the top of the script block (~line 2578). This repo must remain **private** as the Firebase API key is embedded.

### Key function patterns

- `switchPage(pageId)` — hides all `.page` divs, shows the target, updates nav active state, then calls the appropriate `render*()` function.
- `saveData()` — writes to localStorage, debounces Firestore write via `_saveToFirestore()`.
- `loadData()` — reads from localStorage on startup; Firestore snapshot listener handles subsequent cloud updates.
- CRUD per entity follows: `save*()`, `edit*()`, `delete*()`, `render*()` — e.g. `saveBuilding`, `editBuilding`, `deleteBuilding`, `renderBuildings`.
- `openModal(id)` / `closeModal(id)` — manages `.modal-overlay.active` class and body scroll locking. `editingId` / `editingType` globals track what's being edited.
- Receipts are stored as base64 data URLs inside `expense.receipts[]`.

### Pages

| pageId | Purpose |
|---|---|
| `dashboardPage` | KPI cards, recent payments, alerts, quick actions |
| `tenantsPage` | Active/past tenant list, contract management |
| `rentPage` | 12-month rent grid per tenant, SMS auto-parse |
| `expensesPage` | Expense log with category/bar charts |
| `taxPage` | Annual rental income tax worksheet (종합소득세) |
| `settingsPage` | Firebase sync status, JSON/CSV export, changelog |

### SMS bank message parsing

`openSmsModal()` lets users paste a Korean bank deposit SMS. The parser extracts amount, sender name, and bank name, then pre-fills a rent payment record. Entry point around line ~6969.

### Tenant rent types

- `monthly` — standard monthly rent; a pending `rents` record is created per month.
- `yearly` (연세) — lump-sum annual payment; single record covering the contract year. The "paid month" defaults to the contract start month (not January).

## Important constraints

- Receipts (base64) are excluded from Firestore sync comparisons (`_appDataForSyncCompare`) to avoid Firestore document size limits — receipts only live in localStorage.
- `cleanupInvalidRents()` removes `pending` monthly rent records outside a tenant's contract window; always call via `saveData()` flow, not directly.
- Any change to the data model shape must also handle the `loadData()` migration path that validates `requiredKeys`.
