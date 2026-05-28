const fs = require('fs');
const path = require('path');
const http = require('http');

const root = path.join(__dirname, 'dist');
const envPayload = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
};

fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(
  path.join(root, 'env.js'),
  `window.__ENV__ = ${JSON.stringify(envPayload)};\n`,
  'utf8'
);

console.log('[SPQR PREBUILT] Runtime env.js written', {
  hasUrl: Boolean(envPayload.VITE_SUPABASE_URL),
  hasKey: Boolean(envPayload.VITE_SUPABASE_ANON_KEY),
});

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function safeFilePath(reqUrl) {
  const url = new URL(reqUrl, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const fullPath = path.normalize(path.join(root, pathname));
  if (!fullPath.startsWith(root)) return null;
  return fullPath;
}

const server = http.createServer((req, res) => {
  let filePath = safeFilePath(req.url || '/');
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': filePath.endsWith('env.js') ? 'no-store' : 'public, max-age=3600',
    });
    res.end(data);
  });
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '0.0.0.0', () => console.log(`[SPQR PREBUILT] serving dist on ${port}`));
