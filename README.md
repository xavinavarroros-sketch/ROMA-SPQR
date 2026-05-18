# ROME-YES

Updated version with shared Supabase game data, clearer republic economy panels, emojis and color coding for gold/food, and a rebuilt military tab.

## Latest changes

- Gold now uses 🪙 and gold-colored labels/values.
- Food now uses 🌾 and green-colored labels/values.
- Economy of the Republic is clearer as two balance sheets:
  - 🪙 Gold Balance
  - 🌾 Food Balance
- Military tab now has separate panels for:
  - Total armed forces in men
  - Cost to recruit/build forces
  - Total upkeep of the armed forces
  - Detailed Legions, Cavalry, and Fleets lists
- Total forces now includes:
  - Legion soldiers
  - Cavalry riders
  - Fleet crews
- Fleets calculate crew/strength as triremes × 200.

## Deploy

Keep Railway variables:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Do not upload node_modules, dist, .env, .env.local, or package-lock.json.

## Latest update
- Players can edit their character/Roman name, login username, class, Discord username, and avatar from the Character tab.
- The Game Master can reset a senator's password from GM Panel → Senators if a player forgets it.
- Password resets should be communicated privately to the player.

## Latest update
- Senator classes now have distinct colors and emojis.
- Senator roster includes filters by name/search, class, and magistracy.
- Election candidate and voter names are clickable to open senator profiles.
