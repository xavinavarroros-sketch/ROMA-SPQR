# ROME-YES — Supabase Shared Version

This version includes:

- Shared Supabase data storage for all players.
- Player Resources tab: stockpile, gold income, food income, provinces and economy trend graph.
- Player Legions tab: all legions visible to players.
- Magistrates tab: offices, current holders and role descriptions.
- GM Resources & Regions integrated in one control panel.
- GM election system: open candidacy, open voting, close election and auto-assign winner.
- If election result is a draw or no votes are cast, the election restarts.
- More Roman Republic visual style: lighter parchment/white panels with red/gold accents.
- Balanced early-game Roman resources and legion costs.
- “Senate Seating” naming instead of Curia Julia.

## Railway

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

## Required Railway variables

```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Do not upload `package-lock.json`.
