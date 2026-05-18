# ROME-YES / SPQR Webapp

Updated build with shared Supabase storage, Roman Republic economy, elections, legions, cavalry, fleets and editable maintenance costs.

## Latest changes

- GM can edit maintenance costs for:
  - Legions
  - Auxiliary cavalry units
  - Fleets / triremes
- Maintenance is deducted from the stockpile when the GM advances the session.
- GM can also apply maintenance immediately without advancing the turn.
- Economy summary shows active legions, cavalry units, triremes, gold maintenance and food maintenance.

## Deploy

Railway variables required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not upload:

- `node_modules`
- `dist`
- `.env`
- `.env.local`
- `package-lock.json`
