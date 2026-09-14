'use strict';
const crypto=require('node:crypto');
const COOKIE='p4x4_session';
const roles=['customer','sales','fitment','admin'];
const roleScopes={customer:['project:read','project:write:self','share:create:self'],sales:['project:read:any','quote:read','quote:write','share:create:any'],fitment:['project:read:any','quote:read','fitment:write','catalogue:read'],admin:['*']};
const safe=(v,d)=>typeof v==='string'&&v.trim()?v.trim().slice(0,120):d;
function parseCookies(header=''){const out={};for(const part of String(header).split(';')){const i=part.indexOf('=');if(i<0)continue;const k=part.slice(0,i).trim(),v=part.slice(i+1).trim();if(k)out[k]=decodeURIComponent(v)}return out}
function cookieHeader(token,{secure,maxAge}){const attrs=[`${COOKIE}=${encodeURIComponent(token||'')}`,'Path=/','HttpOnly','SameSite=Lax'];if(secure)attrs.push('Secure');if(maxAge!=null)attrs.push(`Max-Age=${Math.max(0,Math.floor(maxAge))}`);return attrs.join('; ')}
function prototypeActor(headers={}){const role=roles.includes(headers['x-pro4x4-role'])?headers['x-pro4x4-role']:'customer';return {actorId:safe(headers['x-pro4x4-actor'],`prototype-${role}`),displayName:safe(headers['x-pro4x4-name'],role==='customer'?'Prototype Customer':`PRO4X4 ${role}`),role,scopes:roleScopes[role],prototype:true}}
function anonymousActor(){const actorId=`guest-${crypto.randomBytes(12).toString('hex')}`;return {actorId,displayName:'Guest Builder',role:'customer',scopes:roleScopes.customer,prototype:false}}
class AuthBoundary{
  constructor(db,config,{gateway=null}={}){this.db=db;this.config=config;this.gateway=gateway}
  token(req){return parseCookies(req.headers.cookie||'')[COOKIE]||null}
  issue(res,actor,metadata={}){const out=this.db.createAuthSession(actor,{ttlMinutes:this.config.sessionTtlMinutes,metadata});res.setHeader('set-cookie',cookieHeader(out.token,{secure:this.config.secureCookies,maxAge:this.config.sessionTtlMinutes*60}));return out}
  clear(res){res.setHeader('set-cookie',cookieHeader('',{secure:this.config.secureCookies,maxAge:0}))}
  resolve(req,res,{allowAnonymous=true}={}){const token=this.token(req);if(token){const session=this.db.resolveAuthSession(token);if(session)return {actor:session.actor,source:'session',session,token}}
    if(this.gateway){const gatewayActor=this.gateway.resolve(req);if(gatewayActor){const issued=this.issue(res,gatewayActor,{source:'trusted-auth-gateway'});return {actor:issued.actor,source:'gateway-session-new',session:issued,token:issued.token}}}
    if(this.config.allowPrototypeHeaders&&req.headers['x-pro4x4-role'])return {actor:prototypeActor(req.headers),source:'prototype-header',session:null,token:null};
    if(!allowAnonymous)return {actor:null,source:'anonymous',session:null,token:null};
    const issued=this.issue(res,anonymousActor(),{source:'anonymous-browser'});return {actor:issued.actor,source:'session-new',session:issued,token:issued.token};
  }
  devLogin(req,res,payload={}){if(!this.config.allowDevLogin){const e=new Error('Development login is disabled');e.status=403;e.code='dev_login_disabled';throw e}const role=roles.includes(payload.role)?payload.role:null;if(!role){const e=new Error('Unsupported role');e.status=422;e.code='validation_error';e.fieldErrors=[{field:'role',message:'Role must be customer, sales, fitment or admin'}];throw e}const actor={actorId:safe(payload.actorId,`dev-${role}-${crypto.randomBytes(5).toString('hex')}`),displayName:safe(payload.displayName,role==='customer'?'Development Customer':`PRO4X4 ${role[0].toUpperCase()+role.slice(1)}`),role,scopes:roleScopes[role],prototype:false};return this.issue(res,actor,{source:'dev-login'})}
  logout(req,res,actor){const token=this.token(req);if(token)this.db.revokeAuthSession(token,{actor});this.clear(res);return true}
}
module.exports={AuthBoundary,roles,roleScopes,parseCookies,prototypeActor,COOKIE};
