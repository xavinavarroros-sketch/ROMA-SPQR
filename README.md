# ROME-YES — Railway + Supabase Shared Game App

This version uses Supabase for shared game data, so all players can see the same senators, motions, votes, orders, laws, legions, map and GM updates.

## Railway variables required

Add these in Railway → Service → Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

## Supabase table required

Run this in Supabase SQL Editor:

```sql
create table if not exists public.game_state (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.game_state enable row level security;

drop policy if exists "Allow public read game_state" on public.game_state;
drop policy if exists "Allow public insert game_state" on public.game_state;
drop policy if exists "Allow public update game_state" on public.game_state;
drop policy if exists "Allow public delete game_state" on public.game_state;

create policy "Allow public read game_state"
on public.game_state
for select
to anon
using (true);

create policy "Allow public insert game_state"
on public.game_state
for insert
to anon
with check (true);

create policy "Allow public update game_state"
on public.game_state
for update
to anon
using (true)
with check (true);

create policy "Allow public delete game_state"
on public.game_state
for delete
to anon
using (true);
```

## Railway build settings

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

Do not upload `package-lock.json` if Railway gets stuck on `npm ci`.
