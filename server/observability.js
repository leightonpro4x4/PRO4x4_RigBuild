'use strict';
const crypto=require('node:crypto');

function now(){return new Date().toISOString()}
function createLogger(config={}){
  const service='pro4x4-rig-builder';
  const write=(level,event,fields={})=>{
    const payload={ts:now(),level,service,env:config.env||'development',event,...fields};
    const line=JSON.stringify(payload);
    (level==='error'?console.error:level==='warn'?console.warn:console.log)(line);
    return payload;
  };
  return {
    info:(event,fields)=>write('info',event,fields),
    warn:(event,fields)=>write('warn',event,fields),
    error:(event,fields)=>write('error',event,fields)
  };
}

function createMetrics(){
  const started=Date.now();
  const counters=new Map();
  const durations=new Map();
  const key=(name,labels={})=>`${name}|${Object.entries(labels).sort().map(([k,v])=>`${k}=${v}`).join(',')}`;
  const inc=(name,labels={},value=1)=>{const k=key(name,labels);counters.set(k,(counters.get(k)||0)+value)};
  const observe=(name,labels={},seconds=0)=>{const k=key(name,labels),d=durations.get(k)||{count:0,sum:0};d.count++;d.sum+=seconds;durations.set(k,d)};
  const esc=v=>String(v).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n');
  const split=k=>{const [name,labelText='']=k.split('|');const labels={};if(labelText)for(const p of labelText.split(',')){const i=p.indexOf('=');labels[p.slice(0,i)]=p.slice(i+1)}return {name,labels}};
  const fmtLabels=labels=>Object.keys(labels).length?`{${Object.entries(labels).map(([k,v])=>`${k}="${esc(v)}"`).join(',')}}`:'';
  const render=()=>{
    const lines=['# HELP pro4x4_uptime_seconds Process uptime in seconds','# TYPE pro4x4_uptime_seconds gauge',`pro4x4_uptime_seconds ${((Date.now()-started)/1000).toFixed(3)}`];
    for(const [k,v] of counters){const {name,labels}=split(k);lines.push(`${name}${fmtLabels(labels)} ${v}`)}
    for(const [k,v] of durations){const {name,labels}=split(k);lines.push(`${name}_count${fmtLabels(labels)} ${v.count}`);lines.push(`${name}_sum${fmtLabels(labels)} ${v.sum.toFixed(6)}`)}
    return lines.join('\n')+'\n';
  };
  return {inc,observe,render};
}

function requestFingerprint(req){return crypto.createHash('sha256').update(`${req.socket?.remoteAddress||''}|${req.headers['user-agent']||''}`).digest('hex').slice(0,16)}
module.exports={createLogger,createMetrics,requestFingerprint};
