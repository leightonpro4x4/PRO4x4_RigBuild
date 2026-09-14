'use strict';
const crypto=require('node:crypto');
const {roleScopes}=require('./auth');
const supportedRoles=new Set(['sales','fitment','admin']);
function timingSafeEq(a,b){const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
function signClaims(secret,{subject,email,name,role,timestamp}){return crypto.createHmac('sha256',secret).update([subject,email,name,role,timestamp].join('|')).digest('hex')}
class TrustedAuthGateway{
  constructor(config){this.config=config}
  enabled(){return !!(this.config.authGatewayEnabled&&this.config.authGatewaySecret)}
  resolve(req){
    if(!this.enabled())return null;
    const h=req.headers,subject=String(h['x-pro4x4-idp-sub']||'').trim(),email=String(h['x-pro4x4-idp-email']||'').trim().toLowerCase(),name=String(h['x-pro4x4-idp-name']||'').trim(),role=String(h['x-pro4x4-idp-role']||'').trim(),timestamp=String(h['x-pro4x4-idp-ts']||'').trim(),signature=String(h['x-pro4x4-idp-signature']||'').trim();
    if(!subject&&!signature)return null;
    if(!subject||!email||!name||!supportedRoles.has(role)||!timestamp||!signature){const e=new Error('Incomplete identity-gateway claims');e.status=401;e.code='invalid_gateway_claims';throw e}
    const ts=Number(timestamp),now=Math.floor(Date.now()/1000);if(!Number.isFinite(ts)||Math.abs(now-ts)>this.config.authGatewayMaxSkewSeconds){const e=new Error('Identity-gateway assertion expired');e.status=401;e.code='gateway_assertion_expired';throw e}
    const expected=signClaims(this.config.authGatewaySecret,{subject,email,name,role,timestamp});if(!timingSafeEq(signature,expected)){const e=new Error('Identity-gateway signature invalid');e.status=401;e.code='invalid_gateway_signature';throw e}
    if(this.config.authGatewayEmailDomain&&!email.endsWith(`@${this.config.authGatewayEmailDomain}`)){const e=new Error('Identity email domain is not permitted');e.status=403;e.code='identity_domain_denied';throw e}
    return {actorId:`idp:${subject}`.slice(0,120),displayName:name.slice(0,120),email:email.slice(0,180),role,scopes:roleScopes[role],prototype:false,identityProvider:'gateway'};
  }
}
module.exports={TrustedAuthGateway,signClaims};
