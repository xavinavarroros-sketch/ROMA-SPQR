import React from "react";
import ReactDOM from "react-dom/client";
import App from "./SPQR_Webapp.jsx";

/*
  Shared storage for ROME-YES.
  Railway + Neon version:
  - Shared game keys are stored through the backend API in Neon Postgres.
  - Private/local keys (read notifications, local preferences, etc.) remain in localStorage.
  - If the API fails, the app falls back to localStorage so the UI can still load.

  Required Railway variable:
  DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
*/
window.__SPQR_SERVER_STATUS__ = { connected: false, configured: true, lastError: null };

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

async function apiGet(key) {
  const res = await fetch(`/api/storage/${encodeURIComponent(key)}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API read failed: ${res.status} ${text}`);
  }
  return await res.json();
}

async function apiSet(key, value) {
  const res = await fetch(`/api/storage/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API write failed: ${res.status} ${text}`);
  }
  return true;
}

if (!window.storage) {
  window.storage = {
    get: async (key, shared = true) => {
      if (!shared) return local.get(key);
      try {
        const remote = await apiGet(key);
        if (remote) {
          window.__SPQR_SERVER_STATUS__ = { connected: true, configured: true, lastError: null };
          window.localStorage.setItem(key, remote.value);
          return remote;
        }

        // One-time migration: if this browser has local data and Neon is empty,
        // upload it. Do this first from the GM browser that has the latest data.
        const oldLocal = await local.get(key);
        if (oldLocal) {
          await apiSet(key, oldLocal.value);
          window.__SPQR_SERVER_STATUS__ = { connected: true, configured: true, lastError: null };
          return oldLocal;
        }
        return null;
      } catch (err) {
        window.__SPQR_SERVER_STATUS__ = { connected: false, configured: true, lastError: String(err?.message || err) };
        console.error("Neon API unavailable, using localStorage fallback:", err);
        return local.get(key);
      }
    },
    set: async (key, value, shared = true) => {
      await local.set(key, value);
      if (!shared) return true;
      try {
        await apiSet(key, value);
        window.__SPQR_SERVER_STATUS__ = { connected: true, configured: true, lastError: null };
        return true;
      } catch (err) {
        window.__SPQR_SERVER_STATUS__ = { connected: false, configured: true, lastError: String(err?.message || err) };
        console.error("Neon API write failed, saved locally only:", err);
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
