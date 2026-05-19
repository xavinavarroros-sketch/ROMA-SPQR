import React from "react";
import ReactDOM from "react-dom/client";
import App from "./SPQR_Webapp.jsx";

/*
  Shared storage for ROME-YES.
  - Shared game keys are stored in Supabase table: public.game_state
  - Private/local keys (read notifications, etc.) remain in localStorage.
  - If Supabase variables are missing or Supabase fails, the app falls back to localStorage.

  Required Railway variables:
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your publishable/anon key
*/
const RUNTIME_ENV = window.__ENV__ || {};
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || RUNTIME_ENV.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || RUNTIME_ENV.VITE_SUPABASE_ANON_KEY;
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);
window.__SPQR_SERVER_STATUS__ = { connected: false, configured: HAS_SUPABASE, lastError: null };

const local = {
  get: async (key) => {
    const value = window.localStorage.getItem(key);
    return value ? { value } : null;
  },
  set: async (key, value) => {
    window.localStorage.setItem(key, value);
    return true;
  },
};

async function supabaseGet(key) {
  const url = `${SUPABASE_URL}/rest/v1/game_state?id=eq.${encodeURIComponent(key)}&select=value&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) { const text = await res.text().catch(() => ""); throw new Error(`Supabase read failed: ${res.status} ${text}`); }
  const rows = await res.json();
  if (!rows || rows.length === 0) return null;
  return { value: JSON.stringify(rows[0].value) };
}

async function supabaseSet(key, value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    parsed = value;
  }

  const url = `${SUPABASE_URL}/rest/v1/game_state?on_conflict=id`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify([
      {
        id: key,
        value: parsed,
        updated_at: new Date().toISOString(),
      },
    ]),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase write failed: ${res.status} ${text}`);
  }
  return true;
}

if (!window.storage) {
  window.storage = {
    get: async (key, shared = true) => {
      // Private data remains local to each player/browser.
      if (!shared || !HAS_SUPABASE) return local.get(key);

      try {
        const remote = await supabaseGet(key);
        if (remote) {
          window.__SPQR_SERVER_STATUS__ = { connected: true, configured: true, lastError: null };
          // Keep a local mirror as emergency fallback.
          window.localStorage.setItem(key, remote.value);
          return remote;
        }

        // One-time migration: if this browser had old local data and Supabase is empty,
        // upload it to Supabase. This helps the GM preserve existing data after upgrading.
        const oldLocal = await local.get(key);
        if (oldLocal) {
          await supabaseSet(key, oldLocal.value);
          return oldLocal;
        }
        return null;
      } catch (err) {
        window.__SPQR_SERVER_STATUS__ = { connected: false, configured: HAS_SUPABASE, lastError: String(err?.message || err) };
        console.error("Supabase unavailable, using localStorage fallback:", err);
        return local.get(key);
      }
    },
    set: async (key, value, shared = true) => {
      // Always keep a local mirror.
      await local.set(key, value);

      if (!shared || !HAS_SUPABASE) return true;
      try {
        return await supabaseSet(key, value);
      } catch (err) {
        window.__SPQR_SERVER_STATUS__ = { connected: false, configured: HAS_SUPABASE, lastError: String(err?.message || err) };
        console.error("Supabase write failed, saved locally only:", err);
        return true;
      }
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
