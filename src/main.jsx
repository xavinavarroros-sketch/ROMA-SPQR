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

const normalizeSupabaseUrl = (url) => String(url || "").trim().replace(/\/$/, "");
const isPublishableKey = (key) => String(key || "").startsWith("sb_publishable_");
const isJwtKey = (key) => String(key || "").startsWith("eyJ");
const API_URL = normalizeSupabaseUrl(SUPABASE_URL);

function supabaseHeaders(extra = {}) {
  const headers = {
    apikey: SUPABASE_KEY,
    ...extra,
  };

  // Legacy anon keys are JWTs and should be sent as Authorization Bearer.
  // New Supabase publishable keys are not JWTs, so sending them as Bearer can
  // make PostgREST reject requests. They are sent through the apikey header.
  if (isJwtKey(SUPABASE_KEY) && !headers.Authorization) {
    headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  }
  return headers;
}

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

function setServerStatus(update) {
  window.__SPQR_SERVER_STATUS__ = {
    connected: false,
    configured: HAS_SUPABASE,
    url: API_URL || null,
    keyType: isPublishableKey(SUPABASE_KEY) ? "publishable" : isJwtKey(SUPABASE_KEY) ? "legacy-anon-jwt" : SUPABASE_KEY ? "unknown" : "missing",
    lastError: null,
    lastKey: null,
    lastAction: null,
    ...window.__SPQR_SERVER_STATUS__,
    ...update,
  };
}
setServerStatus({});

async function supabaseGet(key) {
  if (!API_URL || !SUPABASE_KEY) throw new Error("Supabase variables are missing.");
  const url = `${API_URL}/rest/v1/game_state?id=eq.${encodeURIComponent(key)}&select=value&limit=1`;
  const res = await fetch(url, {
    method: "GET",
    headers: supabaseHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase read failed for ${key}: ${res.status} ${text}`);
  }
  const rows = await res.json();
  setServerStatus({ connected: true, configured: true, lastError: null, lastKey: key, lastAction: "read" });
  if (!rows || rows.length === 0) return null;
  return { value: JSON.stringify(rows[0].value) };
}

async function supabaseSet(key, value) {
  if (!API_URL || !SUPABASE_KEY) throw new Error("Supabase variables are missing.");
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    parsed = value;
  }

  const url = `${API_URL}/rest/v1/game_state?on_conflict=id`;
  const res = await fetch(url, {
    method: "POST",
    headers: supabaseHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
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
    throw new Error(`Supabase write failed for ${key}: ${res.status} ${text}`);
  }
  setServerStatus({ connected: true, configured: true, lastError: null, lastKey: key, lastAction: "write" });
  return true;
}

if (!window.storage) {
  window.storage = {
    get: async (key, shared = true) => {
      if (!shared || !HAS_SUPABASE) return local.get(key);

      try {
        const remote = await supabaseGet(key);
        if (remote) {
          window.localStorage.setItem(key, remote.value);
          return remote;
        }

        // One-time migration: if this browser had old local data and Supabase is empty,
        // upload it to Supabase. This preserves existing GM data after upgrading.
        const oldLocal = await local.get(key);
        if (oldLocal) {
          await supabaseSet(key, oldLocal.value);
          return oldLocal;
        }
        return null;
      } catch (err) {
        const msg = String(err?.message || err);
        setServerStatus({ connected: false, configured: HAS_SUPABASE, lastError: msg, lastKey: key, lastAction: "read-fallback" });
        console.error("Supabase unavailable, using localStorage fallback:", err);
        return local.get(key);
      }
    },
    set: async (key, value, shared = true) => {
      await local.set(key, value);

      if (!shared || !HAS_SUPABASE) return true;
      try {
        return await supabaseSet(key, value);
      } catch (err) {
        const msg = String(err?.message || err);
        setServerStatus({ connected: false, configured: HAS_SUPABASE, lastError: msg, lastKey: key, lastAction: "write-failed-local-only" });
        console.error("Supabase write failed, saved locally only:", err);
        return true;
      }
    },
  };
}

window.__SPQR_TEST_SUPABASE__ = async () => {
  const key = "spqr_connection_test";
  const payload = { time: new Date().toISOString(), userAgent: navigator.userAgent };
  await window.storage.set(key, JSON.stringify(payload), true);
  return {
    status: window.__SPQR_SERVER_STATUS__,
    value: await window.storage.get(key, true),
  };
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
