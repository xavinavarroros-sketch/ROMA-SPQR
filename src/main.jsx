import React from "react";
import ReactDOM from "react-dom/client";
import App from "./SPQR_Webapp.jsx";

// Fallback for environments where window.storage does not exist.
// This keeps the app working on Railway, GitHub-hosted builds, and normal browsers.
// Note: localStorage is per-browser. For shared multiplayer data, connect a backend/database later.
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const value = window.localStorage.getItem(key);
      return value ? { value } : null;
    },
    set: async (key, value) => {
      window.localStorage.setItem(key, value);
      return true;
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
