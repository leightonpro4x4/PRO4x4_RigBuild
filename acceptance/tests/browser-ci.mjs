import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {handle} from '../../tools/serve.mjs';
import {bootstrap} from '../../subsystems/server-persistence/bootstrap.mjs';
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'alpha94-browser-'));
const app=bootstrap('http://127.0.0.1:18098',{directory});
const server=http.createServer((req,res)=>(req.url.startsWith('/api/')?app.api(req,res):handle(req,res)).catch(e=>{console.error(e);res.writeHead(500);res.end();}));
try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(18098,'127.0.0.1',resolve);});
  process.env.ALPHA94_PREVIEW_URL='http://127.0.0.1:18098';
  await import('./desktop-governance.mjs');
}finally{
  server.closeAllConnections();await new Promise(resolve=>server.close(resolve));app.store.close();app.governance.close();
  assert.equal(path.dirname(path.resolve(directory)),path.resolve(os.tmpdir()));assert(path.basename(directory).startsWith('alpha94-browser-'));fs.rmSync(directory,{recursive:true});
}
