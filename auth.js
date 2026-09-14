(function(){
  const KEY='pro4x4-rig-builder:auth:session-v1';
  const roles=['customer','sales','fitment','admin'];
  const safe=(v,d)=>typeof v==='string'&&v.trim()?v.trim():d;
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
  function defaultSession(){return {schemaVersion:'0.12.0',actorId:'local-customer',displayName:'Local Customer',role:'customer',scopes:['project:read','project:write:self','share:create:self'],prototype:true,issuedAt:new Date().toISOString()}}
  function current(){return read()||defaultSession()}
  function setLocalRole(role,displayName){if(!roles.includes(role))throw new Error('Unsupported role');const scopes=role==='customer'?['project:read','project:write:self','share:create:self']:role==='sales'?['project:read:any','quote:read','quote:write','share:create:any']:role==='fitment'?['project:read:any','quote:read','fitment:write','catalogue:read']:['*'];const session={schemaVersion:'0.12.0',actorId:`local-${role}`,displayName:safe(displayName,role==='admin'?'PRO4X4 Admin':role==='sales'?'PRO4X4 Sales':role==='fitment'?'PRO4X4 Fitment':'Local Customer'),role,scopes,prototype:true,issuedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(session));return session}
  function can(scope,session=current()){return session.scopes?.includes('*')||session.scopes?.includes(scope)||false}
  function actorSnapshot(session=current()){return {actorId:session.actorId,displayName:session.displayName,role:session.role,prototype:!!session.prototype}}
  window.PRO4X4_AUTH={schemaVersion:'0.12.0',roles,current,setLocalRole,can,actorSnapshot};
})();
