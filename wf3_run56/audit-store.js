(function(){
  const P=window.PRO4X4_PERSISTENCE.local;
  const INDEX='audit:index-v1', PREFIX='audit:event:';
  const clone=v=>JSON.parse(JSON.stringify(v));
  const now=()=>new Date().toISOString();
  const rand=()=>Math.random().toString(36).slice(2,10).toUpperCase();
  function actor(){return window.PRO4X4_AUTH?.actorSnapshot?.()||{actorId:'local-unknown',displayName:'Local User',role:'customer',prototype:true}}
  function readIndex(){return P.get(INDEX,[])}
  function append(action,entityType,entityId,metadata={},opts={}){
    const event={schemaVersion:'0.12.0',id:`AUD-${Date.now().toString(36).toUpperCase()}-${rand()}`,at:now(),action:String(action),entityType:String(entityType),entityId:String(entityId||''),actor:clone(opts.actor||actor()),correlationId:opts.correlationId||null,metadata:clone(metadata||{})};
    P.set(PREFIX+event.id,event);const index=readIndex();P.set(INDEX,[event.id,...index].slice(0,2000));return clone(event);
  }
  function list({entityType=null,entityId=null,action=null,limit=200}={}){
    return readIndex().map(id=>P.get(PREFIX+id,null)).filter(Boolean).filter(e=>(!entityType||e.entityType===entityType)&&(!entityId||e.entityId===entityId)&&(!action||e.action===action)).slice(0,Math.max(1,Math.min(Number(limit)||200,1000))).map(clone);
  }
  function clear(){readIndex().forEach(id=>P.remove(PREFIX+id));P.remove(INDEX)}
  window.PRO4X4_AUDIT_STORE={schemaVersion:'0.12.0',append,list,clear};
})();
