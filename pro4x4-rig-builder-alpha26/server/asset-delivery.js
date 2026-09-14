'use strict';
const crypto=require('node:crypto');
const b64=v=>Buffer.from(v).toString('base64url'),unb64=v=>Buffer.from(v,'base64url').toString('utf8');
function timingEqual(a,b){const aa=Buffer.from(String(a)),bb=Buffer.from(String(b));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
class AssetDeliverySigner{
  constructor(secret,{ttlSeconds=300,publicOrigin=''}={}){this.secret=String(secret||'');this.ttlSeconds=Math.max(30,Math.min(3600,Number(ttlSeconds)||300));this.publicOrigin=publicOrigin?String(publicOrigin).replace(/\/+$/,''):''}
  sign(claims,{ttlSeconds=this.ttlSeconds}={}){const exp=Math.floor(Date.now()/1000)+Math.max(30,Math.min(3600,Number(ttlSeconds)||this.ttlSeconds)),payload=b64(JSON.stringify({...claims,exp})),sig=crypto.createHmac('sha256',this.secret).update(payload).digest('base64url');return `${payload}.${sig}`}
  verify(token){const [payload,sig,extra]=String(token||'').split('.');if(!payload||!sig||extra)throw Object.assign(new Error('Invalid signed asset delivery token'),{status:403,code:'asset_delivery_invalid'});const expected=crypto.createHmac('sha256',this.secret).update(payload).digest('base64url');if(!timingEqual(sig,expected))throw Object.assign(new Error('Invalid signed asset delivery token'),{status:403,code:'asset_delivery_invalid'});let claims;try{claims=JSON.parse(unb64(payload))}catch{throw Object.assign(new Error('Invalid signed asset delivery token'),{status:403,code:'asset_delivery_invalid'})}if(!claims.exp||claims.exp<Math.floor(Date.now()/1000))throw Object.assign(new Error('Signed asset delivery token has expired'),{status:403,code:'asset_delivery_expired'});return claims}
  url(token){const p=`/api/v1/render-assets/version-delivery/${encodeURIComponent(token)}`;return this.publicOrigin?this.publicOrigin+p:p}
}
module.exports={AssetDeliverySigner};
