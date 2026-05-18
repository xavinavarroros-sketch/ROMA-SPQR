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
