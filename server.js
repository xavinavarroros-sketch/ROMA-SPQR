import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pkg from "pg";

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json({ limit: "25mb" }));

let pool = null;
if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
  });
}

async function ensureDb() {
  if (!pool) throw new Error("DATABASE_URL is not configured");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS game_state (
      id TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

function loadBundledBackup() {
  const fullPath = path.join(__dirname, "seed", "rome-full-backup.json");
  const privatePath = path.join(__dirname, "seed", "rome-private-backup.json");
  const full = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const privateBackup = fs.existsSync(privatePath) ? JSON.parse(fs.readFileSync(privatePath, "utf8")) : { keys: {} };
  return {
    type: "rome-yes-bundled-neon-restore",
    exportedAt: full.exportedAt,
    restoredAt: new Date().toISOString(),
    keys: {
      ...(full.keys || {}),
      ...(privateBackup.keys || {})
    }
  };
}

async function writeBackupToDb(backup, { overwrite = false } = {}) {
  if (!pool) throw new Error("DATABASE_URL is not configured");
  const entries = backup?.keys || {};
  const keys = Object.keys(entries);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const key of keys) {
      const value = entries[key];
      if (overwrite) {
        await client.query(
          `INSERT INTO game_state (id, value, updated_at)
           VALUES ($1, $2::jsonb, NOW())
           ON CONFLICT (id)
           DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [key, JSON.stringify(value)]
        );
      } else {
        await client.query(
          `INSERT INTO game_state (id, value, updated_at)
           VALUES ($1, $2::jsonb, NOW())
           ON CONFLICT (id) DO NOTHING`,
          [key, JSON.stringify(value)]
        );
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  return { count: keys.length, keys };
}

async function seedIfEmpty() {
  if (!pool) return;
  const countResult = await pool.query("SELECT COUNT(*)::int AS count FROM game_state");
  const rowCount = Number(countResult.rows?.[0]?.count || 0);
  const forceSeed = String(process.env.FORCE_SEED_BACKUP || "").toLowerCase() === "true";
  if (rowCount === 0 || forceSeed) {
    const backup = loadBundledBackup();
    const result = await writeBackupToDb(backup, { overwrite: forceSeed });
    console.log(`${forceSeed ? "Forced restore" : "Seeded empty database"} from bundled Roman backup: ${result.count} keys.`);
  } else {
    console.log(`Neon game_state already contains ${rowCount} rows. Bundled backup not applied.`);
  }
}

const initPromise = ensureDb().then(seedIfEmpty).catch(err => {
  console.error("Database initialization failed:", err.message);
});

function parseStoredValue(raw) {
  if (typeof raw !== "string") return raw;
  try { return JSON.parse(raw); } catch { return raw; }
}

app.get("/api/health", async (_req, res) => {
  try {
    await initPromise;
    if (!pool) throw new Error("DATABASE_URL missing");
    await pool.query("SELECT 1");
    res.json({ ok: true, db: true });
  } catch (err) {
    res.status(500).json({ ok: false, db: false, error: err.message });
  }
});

app.get("/api/admin/backup-info", async (_req, res) => {
  try {
    await initPromise;
    const backup = loadBundledBackup();
    const countResult = await pool.query("SELECT COUNT(*)::int AS count FROM game_state");
    res.json({
      ok: true,
      dbRows: Number(countResult.rows?.[0]?.count || 0),
      bundledBackup: {
        type: backup.type,
        exportedAt: backup.exportedAt,
        keyCount: Object.keys(backup.keys || {}).length,
        hasPlayers: Array.isArray(backup.keys?.spqr_p),
        players: Array.isArray(backup.keys?.spqr_p) ? backup.keys.spqr_p.length : 0,
        assets: Array.isArray(backup.keys?.spqr_assets) ? backup.keys.spqr_assets.length : 0,
        wealthPlayers: backup.keys?.spqr_wealth ? Object.keys(backup.keys.spqr_wealth).length : 0,
        reputationPlayers: backup.keys?.spqr_reputation ? Object.keys(backup.keys.spqr_reputation).length : 0
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/admin/restore-bundled-backup", async (req, res) => {
  try {
    await initPromise;
    const confirm = req.query.confirm || req.body?.confirm;
    if (confirm !== "RESTORE") {
      return res.status(400).json({ ok: false, error: "Add ?confirm=RESTORE or body { confirm: 'RESTORE' } to restore the bundled backup." });
    }
    const backup = loadBundledBackup();
    const before = await pool.query("SELECT id, value FROM game_state");
    const snapshotKey = `server_backup_before_bundled_restore_${Date.now()}`;
    const snapshot = Object.fromEntries(before.rows.map(r => [r.id, r.value]));
    await pool.query(
      `INSERT INTO game_state (id, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [snapshotKey, JSON.stringify(snapshot)]
    );
    const result = await writeBackupToDb(backup, { overwrite: true });
    res.json({ ok: true, restoredKeys: result.count, snapshotKey, exportedAt: backup.exportedAt });
  } catch (err) {
    console.error("Bundled restore failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/storage/:key", async (req, res) => {
  try {
    await initPromise;
    if (!pool) throw new Error("DATABASE_URL missing");
    const { key } = req.params;
    const result = await pool.query("SELECT value FROM game_state WHERE id = $1 LIMIT 1", [key]);
    if (!result.rows.length) return res.json(null);
    res.json({ value: JSON.stringify(result.rows[0].value) });
  } catch (err) {
    console.error("Storage read failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/storage/:key", async (req, res) => {
  try {
    await initPromise;
    if (!pool) throw new Error("DATABASE_URL missing");
    const { key } = req.params;
    const value = parseStoredValue(req.body?.value);
    await pool.query(
      `INSERT INTO game_state (id, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (id)
       DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, JSON.stringify(value)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Storage write failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/storage/bulk", async (req, res) => {
  try {
    await initPromise;
    if (!pool) throw new Error("DATABASE_URL missing");
    const entries = req.body?.entries || {};
    const keys = Object.keys(entries);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const key of keys) {
        const value = parseStoredValue(entries[key]);
        await client.query(
          `INSERT INTO game_state (id, value, updated_at)
           VALUES ($1, $2::jsonb, NOW())
           ON CONFLICT (id)
           DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [key, JSON.stringify(value)]
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    res.json({ ok: true, count: keys.length });
  } catch (err) {
    console.error("Bulk storage write failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ROME-SPQR server listening on port ${PORT}`);
  console.log(DATABASE_URL ? "DATABASE_URL configured" : "DATABASE_URL missing");
});
