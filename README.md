# ROME-YES

React/Vite app for the Roman Republic Discord strategy game.

## This update

- Shows senator estate taxes as state income in the Republic economy balance sheet.
- Adds senator estate tax income to projected state net gold/food.
- Adds an admin panel error boundary so the GM panel does not crash the whole app.
- Normalizes estate/property asset IDs to avoid duplicate-id issues and ensures multiple owned estates count separately for income.
- Keeps all Supabase/shared-storage support.

## Railway

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

Required variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Update: Game Master Registry
- Added a GM Registry tab.
- GM can see a searchable record of senator history, orders, motions, votes, donations, wealth ledger actions, elections and other actions.
- Includes filters by senator, action type and text search.
- Includes CSV export for backups or auditing.
