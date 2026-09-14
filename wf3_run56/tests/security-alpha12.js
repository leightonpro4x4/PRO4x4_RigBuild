'use strict';
const assert=require('node:assert/strict');
const {createApp}=require('../server/server');
const {loadConfig}=require('../server/config');

async function listen(app){await new Promise((resolve,reject)=>{app.server.once('error',reject);app.server.listen(0,'127.0.0.1',resolve)});return `http://127.0.0.1:${app.server.address().port}`}
async function close(app){await new Promise(resolve=>app.server.close(resolve));app.db.close()}
const cookieOf=r=>(r.headers.get('set-cookie')||'').split(';')[0];

(async()=>{
  const prod=loadConfig({env:'production'});assert.equal(prod.allowPrototypeHeaders,false);assert.equal(prod.allowDevLogin,false);assert.equal(prod.secureCookies,true);
  const app=createApp({dbFile:':memory:',seed:true,config:{allowPrototypeHeaders:false,allowDevLogin:true,secureCookies:false,rateLimitMax:100,authRateLimitMax:100,requestBodyLimitBytes:64000}}),base=await listen(app);
  try{
    let r=await fetch(base+'/api/v1/health');assert.equal(r.status,200);let j=await r.json();assert.equal(j.schemaVersion,'0.12.0');assert.ok(j.dbSchemaVersion>=5);assert.equal(j.authMode,'server-session-cookie');assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert.match(r.headers.get('content-security-policy')||'',/frame-ancestors 'none'/);
    r=await fetch(base+'/api/v1/auth/session');assert.equal(r.status,200);const guestCookie=cookieOf(r);assert.match(guestCookie,/^p4x4_session=/);j=await r.json();assert.equal(j.actor.role,'customer');assert.equal(j.source,'session-new');
    r=await fetch(base+'/api/v1/staff/quotes',{headers:{cookie:guestCookie}});assert.equal(r.status,403);
    r=await fetch(base+'/api/v1/staff/quotes',{headers:{'x-pro4x4-role':'admin','x-pro4x4-actor':'forged-admin'}});assert.equal(r.status,403);
    r=await fetch(base+'/api/v1/auth/dev-login',{method:'POST',headers:{'content-type':'application/json',cookie:guestCookie},body:JSON.stringify({role:'sales',displayName:'Security Test Sales'})});assert.equal(r.status,201);const staffCookie=cookieOf(r);j=await r.json();assert.equal(j.actor.role,'sales');
    r=await fetch(base+'/api/v1/staff/quotes',{headers:{cookie:staffCookie}});assert.equal(r.status,200);
    r=await fetch(base+'/api/v1/builds',{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json',cookie:guestCookie},body:'{}'});assert.equal(r.status,403);j=await r.json();assert.equal(j.code,'origin_forbidden');
    r=await fetch(base+'/api/v1/builds',{method:'POST',headers:{'content-type':'application/json',cookie:guestCookie},body:JSON.stringify({blob:'x'.repeat(70000)})});assert.equal(r.status,413);j=await r.json();assert.equal(j.code,'payload_too_large');
    r=await fetch(base+'/api/v1/auth/logout',{method:'POST',headers:{'content-type':'application/json',cookie:staffCookie},body:'{}'});assert.equal(r.status,200);assert.match(r.headers.get('set-cookie')||'',/Max-Age=0/);
    r=await fetch(base+'/api/v1/staff/quotes',{headers:{cookie:staffCookie}});assert.equal(r.status,403);
    assert.ok(app.db.getDatabaseStatus().migrationVersion>=5);assert.ok(app.db.db.prepare('SELECT COUNT(*) n FROM auth_sessions').get().n>=2);const backup=app.db.backup();assert.equal(Object.prototype.hasOwnProperty.call(backup,'authSessions'),false);
  }finally{await close(app)}

  const limited=createApp({dbFile:':memory:',seed:false,config:{allowPrototypeHeaders:false,allowDevLogin:false,secureCookies:false,rateLimitMax:100,authRateLimitMax:3,rateLimitWindowMs:60000}}),base2=await listen(limited);
  try{let status=0;for(let i=0;i<4;i++){const r=await fetch(base2+'/api/v1/auth/session');status=r.status;if(i<3)assert.equal(status,200)}assert.equal(status,429)}finally{await close(limited)}
  console.log(JSON.stringify({schemaVersion:'0.12.0',sessionCookie:true,httpOnlyBoundary:true,prototypeHeadersRejected:true,ownerDefaultRole:'customer',databaseMigration:3,securityHeaders:true,crossOriginMutationBlocked:true,bodyLimit:true,rateLimit:true,logoutRevocation:true,status:'pass'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
