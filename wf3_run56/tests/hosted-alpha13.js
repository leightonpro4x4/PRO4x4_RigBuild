'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {createApp}=require('../server/server');
const {signClaims}=require('../server/auth-gateway');
(async()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'p4x4-a13-')),dbFile=path.join(tmp,'test.sqlite'),secret='alpha13-test-secret';
  const {server,db}=createApp({dbFile,config:{env:'development',allowDevLogin:false,allowPrototypeHeaders:false,authGatewayEnabled:true,authGatewaySecret:secret,authGatewayEmailDomain:'pro4x4.com.au',metricsEnabled:true,metricsToken:'metrics-test'}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
  try{
    let r=await fetch(base+'/api/v1/ready');assert.equal(r.status,200);assert.equal((await r.json()).ready,true);
    r=await fetch(base+'/metrics');assert.equal(r.status,401);
    r=await fetch(base+'/metrics',{headers:{authorization:'Bearer metrics-test'}});assert.equal(r.status,200);assert.match(await r.text(),/pro4x4_http_requests_total/);
    const timestamp=String(Math.floor(Date.now()/1000)),claims={subject:'staff-001',email:'ops@pro4x4.com.au',name:'PRO4X4 Ops',role:'admin',timestamp},sig=signClaims(secret,claims);
    r=await fetch(base+'/api/v1/auth/session',{headers:{'x-pro4x4-idp-sub':claims.subject,'x-pro4x4-idp-email':claims.email,'x-pro4x4-idp-name':claims.name,'x-pro4x4-idp-role':claims.role,'x-pro4x4-idp-ts':timestamp,'x-pro4x4-idp-signature':sig}});assert.equal(r.status,200);const sess=await r.json();assert.equal(sess.actor.role,'admin');assert.match(r.headers.get('set-cookie')||'',/HttpOnly/);
    r=await fetch(base+'/api/v1/auth/session',{headers:{'x-pro4x4-idp-sub':'x','x-pro4x4-idp-email':'bad@example.com','x-pro4x4-idp-name':'Bad','x-pro4x4-idp-role':'admin','x-pro4x4-idp-ts':timestamp,'x-pro4x4-idp-signature':'bad'}});assert.equal(r.status,401);
    console.log('Alpha 13 hosted readiness test passed');
  }finally{await new Promise(r=>server.close(r));db.close();fs.rmSync(tmp,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
