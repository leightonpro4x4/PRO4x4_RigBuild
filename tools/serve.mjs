import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = fileURLToPath(new URL('../public/', import.meta.url));
// Local preview only. No business API, directory listing, archive or second app.
const allowed = new Set(['index.html', ...(await fs.readdir(webRoot)).filter(p => p.endsWith('.glb'))]);
const modules=new Set(['subsystems/customer-app/app.mjs','subsystems/visual-runtime/ranger.mjs','subsystems/visual-runtime/session.mjs','subsystems/visual-eligibility/adapter.mjs','subsystems/domain/engine.mjs','subsystems/domain/fixture.mjs','subsystems/catalogue/catalogue.json','subsystems/catalogue/alpha93-fixture.json','subsystems/catalogue/alpha93-mapping.json']);
modules.add('subsystems/customer-app/projects.mjs');
modules.add('subsystems/visual-eligibility/governance-policy.mjs');
export async function handle(req, res) {
  const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  if (!allowed.has(name)&&!modules.has(name)) { res.writeHead(404); res.end(); return; }
  const bytes = await fs.readFile(path.join(modules.has(name)?path.dirname(webRoot.replace(/[\\/]$/,'')):webRoot, name));
  res.writeHead(200, { 'Content-Type': name.endsWith('.glb') ? 'model/gltf-binary' : name.endsWith('.mjs')?'text/javascript':name.endsWith('.json')?'application/json':'text/html; charset=utf-8', 'Content-Length': bytes.length });
  res.end(req.method === 'HEAD' ? undefined : bytes);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT||8094),origin=`http://127.0.0.1:${port}`;
  const {bootstrap}=await import('../subsystems/server-persistence/bootstrap.mjs');const {api}=bootstrap(origin);
  http.createServer((req,res)=>(req.url.startsWith('/api/')?api(req,res):handle(req,res)).catch(()=>{res.writeHead(500);res.end();}))
    .listen(port,'127.0.0.1',()=>console.log('Alpha94 authoritative projects preview: '+origin));
}
