const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const envPayload = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
};

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(
  'dist/env.js',
  `window.__ENV__ = ${JSON.stringify(envPayload)};\n`,
  'utf8'
);

console.log('[SPQR] Runtime env.js written:', {
  hasUrl: Boolean(envPayload.VITE_SUPABASE_URL),
  hasKey: Boolean(envPayload.VITE_SUPABASE_ANON_KEY),
  urlHost: envPayload.VITE_SUPABASE_URL ? new URL(envPayload.VITE_SUPABASE_URL).host : null,
  keyPrefix: envPayload.VITE_SUPABASE_ANON_KEY ? envPayload.VITE_SUPABASE_ANON_KEY.slice(0, 14) + '...' : null,
});

const port = process.env.PORT || '8080';
const localServe = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'serve.cmd' : 'serve');
const serveCmd = fs.existsSync(localServe) ? localServe : 'serve';
const child = spawn(serveCmd, ['-s', 'dist', '-l', `tcp://0.0.0.0:${port}`], { stdio: 'inherit' });
child.on('error', (err) => { console.error('[SPQR] Failed to start static server:', err); process.exit(1); });
child.on('exit', (code) => process.exit(code ?? 0));
