(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PRO4X4_AUDIT_INTEGRITY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='sha256-chain-v1';

  function canonicalize(value){
    if(value===null||typeof value==='string'||typeof value==='boolean')return value;
    if(typeof value==='number')return Number.isFinite(value)?value:null;
    if(Array.isArray(value))return value.map(v=>{const t=typeof v;return v===undefined||t==='function'||t==='symbol'?null:canonicalize(v)});
    if(typeof value==='object'){
      const out={};
      Object.keys(value).sort().forEach(k=>{const v=value[k],t=typeof v;if(v!==undefined&&t!=='function'&&t!=='symbol')out[k]=canonicalize(v)});
      return out;
    }
    return null;
  }
  function stableStringify(value){return JSON.stringify(canonicalize(value))}
  function utf8Bytes(text){
    const s=String(text),out=[];
    for(let i=0;i<s.length;i++){
      let c=s.charCodeAt(i);
      if(c<0x80){out.push(c);continue}
      if(c<0x800){out.push(0xc0|(c>>6),0x80|(c&0x3f));continue}
      if(c>=0xd800&&c<=0xdbff&&i+1<s.length){const d=s.charCodeAt(i+1);if(d>=0xdc00&&d<=0xdfff){const cp=0x10000+((c-0xd800)<<10)+(d-0xdc00);out.push(0xf0|(cp>>18),0x80|((cp>>12)&0x3f),0x80|((cp>>6)&0x3f),0x80|(cp&0x3f));i++;continue}}
      out.push(0xe0|(c>>12),0x80|((c>>6)&0x3f),0x80|(c&0x3f));
    }
    return out;
  }
  function rotr(x,n){return (x>>>n)|(x<<(32-n))}
  function sha256Fallback(input){
    const bytes=utf8Bytes(input),bitLen=bytes.length*8,data=bytes.slice();data.push(0x80);while((data.length%64)!==56)data.push(0);const hi=Math.floor(bitLen/0x100000000),lo=bitLen>>>0;for(let s=24;s>=0;s-=8)data.push((hi>>>s)&255);for(let s=24;s>=0;s-=8)data.push((lo>>>s)&255);
    const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const w=new Array(64);
    for(let off=0;off<data.length;off+=64){for(let i=0;i<16;i++){const p=off+i*4;w[i]=((data[p]<<24)|(data[p+1]<<16)|(data[p+2]<<8)|data[p+3])>>>0}for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2],s0=(rotr(x,7)^rotr(x,18)^(x>>>3))>>>0,s1=(rotr(y,17)^rotr(y,19)^(y>>>10))>>>0;w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0}let [a,b,c,d,e,f,g,hh]=h;for(let i=0;i<64;i++){const S1=(rotr(e,6)^rotr(e,11)^rotr(e,25))>>>0,ch=((e&f)^((~e)&g))>>>0,t1=(hh+S1+ch+k[i]+w[i])>>>0,S0=(rotr(a,2)^rotr(a,13)^rotr(a,22))>>>0,maj=((a&b)^(a&c)^(b&c))>>>0,t2=(S0+maj)>>>0;hh=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}h[0]=(h[0]+a)>>>0;h[1]=(h[1]+b)>>>0;h[2]=(h[2]+c)>>>0;h[3]=(h[3]+d)>>>0;h[4]=(h[4]+e)>>>0;h[5]=(h[5]+f)>>>0;h[6]=(h[6]+g)>>>0;h[7]=(h[7]+hh)>>>0}
    return h.map(x=>x.toString(16).padStart(8,'0')).join('');
  }
  function sha256Hex(input){
    try{if(typeof require==='function'){const crypto=require('node:crypto');return crypto.createHash('sha256').update(String(input),'utf8').digest('hex')}}catch{}
    return sha256Fallback(String(input));
  }
  function coreFor(event,previousHash){return {schemaVersion:event.schemaVersion||null,id:event.id||null,at:event.at||null,action:event.action||null,entityType:event.entityType||null,entityId:event.entityId||'',actor:event.actor||null,correlationId:event.correlationId||null,metadata:event.metadata||{},integrity:{version:VERSION,previousHash:previousHash||null}}}
  function eventHash(event,previousHash){return sha256Hex(stableStringify(coreFor(event,previousHash)))}
  function seal(event,previousHash=null){const e={...event},prev=previousHash||null;e.integrity={version:VERSION,previousHash:prev,eventHash:eventHash(e,prev)};return e}
  function verify(events){
    const rows=Array.isArray(events)?events:[],problems=[];let previousHash=null,sealedEvents=0,legacyEvents=0,seenSealed=false;
    rows.forEach((e,index)=>{const i=e?.integrity;if(!i?.eventHash){legacyEvents++;if(seenSealed)problems.push({index,id:e?.id||null,code:'unsealed_after_chain_start'});return}seenSealed=true;sealedEvents++;if(i.version!==VERSION)problems.push({index,id:e.id||null,code:'unsupported_integrity_version',expected:VERSION,actual:i.version||null});if((i.previousHash||null)!==(previousHash||null))problems.push({index,id:e.id||null,code:'previous_hash_mismatch',expected:previousHash||null,actual:i.previousHash||null});const expected=eventHash(e,i.previousHash||null);if(expected!==i.eventHash)problems.push({index,id:e.id||null,code:'event_hash_mismatch',expected,actual:i.eventHash});previousHash=i.eventHash});
    const status=problems.length?'broken':sealedEvents===0?'unsealed':legacyEvents?'sealed-with-legacy-prefix':'sealed';
    return {schemaVersion:'0.26.10',policy:'append-only-sha256-chain',integrityVersion:VERSION,status,totalEvents:rows.length,sealedEvents,legacyEvents,headHash:previousHash,problems};
  }
  return {VERSION,canonicalize,stableStringify,sha256Hex,eventHash,seal,verify};
});
