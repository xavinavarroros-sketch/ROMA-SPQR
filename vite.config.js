# ROME-YES / ROMA-SPQR

Updated version with shared Supabase storage, economy, elections, provinces, magistrates, legions, cavalry and fleets.

## Latest changes

- Fleets are now represented as **triremes**.
- Fleets show base/location, commander, mission and status.
- Fleet maintenance is included in the economy, just like legions.
- GM can edit fleet trireme count and see the fleet maintenance cost.
- Player military view shows active triremes and fleet maintenance per turn.
- Resources panel includes **Gold Upkeep / Trireme** and **Food Upkeep / Trireme**.

## Railway

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

Do not upload `node_modules`, `dist`, `.env`, `.env.local` or `package-lock.json`.
