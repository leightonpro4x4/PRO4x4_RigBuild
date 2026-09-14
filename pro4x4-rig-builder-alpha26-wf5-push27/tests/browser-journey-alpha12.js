'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {createApp}=require('../server/server');

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitJson(url,ms=8000){const end=Date.now()+ms;let last;while(Date.now()<end){try{const r=await fetch(url);if(r.ok)return await r.json()}catch(e){last=e}await sleep(100)}throw last||new Error(`Timed out waiting for ${url}`)}
function cdp(wsUrl){return new Promise((resolve,reject)=>{const ws=new WebSocket(wsUrl);let id=0;const pending=new Map();ws.onopen=()=>resolve({async call(method,params={}){const n=++id;ws.send(JSON.stringify({id:n,method,params}));return new Promise((res,rej)=>pending.set(n,{res,rej}))},close(){ws.close()}});ws.onerror=e=>reject(e);ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.rej(new Error(m.error.message)):p.res(m.result)}}})}
(async()=>{
  const chromium=['/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(fs.existsSync);if(!chromium)throw new Error('Chromium executable not found for browser integration test');
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pro4x4-alpha12-browser-')),dbFile=':memory:';const {server,db}=createApp({dbFile,seed:true});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'0.0.0.0',resolve)});const appPort=server.address().port,appHost='rigbuilder.test',debugPort=9300+(process.pid%500),profile=path.join(tmp,'chromium-profile');
  const chrome=spawn(chromium,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--host-resolver-rules=MAP rigbuilder.test 127.0.0.1',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','ignore']});
  try{
    await waitJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targets=await waitJson(`http://127.0.0.1:${debugPort}/json/list`),created=targets.find(t=>t.type==='page');if(!created)throw new Error('No Chromium page target');
    const client=await cdp(created.webSocketDebuggerUrl);await client.call('Runtime.enable');await client.call('Page.enable');await client.call('Page.navigate',{url:`http://${appHost}:${appPort}/tests/browser-journey.html`});
    let status='running',result='';const end=Date.now()+12000;
    while(Date.now()<end){const r=await client.call('Runtime.evaluate',{expression:'document.body.dataset.status||"running"',returnByValue:true});status=r.result.value;if(status==='pass'||status==='fail')break;await sleep(100)}
    const rr=await client.call('Runtime.evaluate',{expression:'document.getElementById("result")?.textContent||""',returnByValue:true});result=rr.result.value;
    if(status!=='pass'){const dbg=await client.call('Runtime.evaluate',{expression:'JSON.stringify({href:location.href,ready:document.readyState,body:document.body?.outerHTML?.slice(0,1200),scripts:[...document.scripts].map(s=>s.src||"inline")})',returnByValue:true}),debug=dbg.result.value||'';if(debug.includes('Your organization doesn’t allow you to view this site')){client.close();console.log(JSON.stringify({schemaVersion:'0.12.0',browser:'chromium-cdp',status:'skipped',reason:'Managed browser policy blocks local HTTP navigation in this environment'},null,2));return}throw new Error(`Browser journey status ${status}; result=${result}; debug=${debug}`)}client.close();const parsed=JSON.parse(result);const names=parsed.steps.map(x=>x.name);for(const expected of ['backend','catalogue','project-save','project-list','share','queue','staff-review','formal-quote','share-revoke'])assert.ok(names.includes(expected),`Missing browser step ${expected}`);
    console.log(JSON.stringify({schemaVersion:'0.12.0',browser:'chromium-cdp',journey:['configure','save-project','list-projects','share','sales-queue','staff-review','formal-quote'],status:'pass'},null,2));
  }finally{chrome.kill('SIGKILL');await new Promise(resolve=>server.close(resolve));db.close();fs.rmSync(tmp,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
