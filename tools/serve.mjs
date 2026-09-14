import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = fileURLToPath(new URL('../public/', import.meta.url));
// Local preview only. No business API, directory listing, archive or second app.
const allowed = new Set(['index.html', ...(await fs.readdir(webRoot)).filter(p => p.endsWith('.glb'))]);
export async function handle(req, res) {
  const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  if (!allowed.has(name)) { res.writeHead(404); res.end(); return; }
  const bytes = await fs.readFile(path.join(webRoot, name));
  res.writeHead(200, { 'Content-Type': name.endsWith('.glb') ? 'model/gltf-binary' : 'text/html; charset=utf-8', 'Content-Length': bytes.length });
  res.end(req.method === 'HEAD' ? undefined : bytes);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  http.createServer((req, res) => handle(req, res).catch(() => { res.writeHead(500); res.end(); }))
    .listen(Number(process.env.PORT || 8094), '127.0.0.1', () => console.log('Alpha 93 preserved preview: http://127.0.0.1:' + (process.env.PORT || 8094)));
}
