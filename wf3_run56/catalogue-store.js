(function(){
  const P=window.PRO4X4_PERSISTENCE.local;
  const publishedKey='catalogue:published-v2';
  const draftKey='catalogue:draft-v2';
  const clone=v=>JSON.parse(JSON.stringify(v));
  const initialBase=window.RIG_DATA?{
    schemaVersion:'0.12.0',
    vehicleId:window.RIG_DATA.vehicle?.id||'nissan-y62-warrior-2025',
    vehicle:clone(window.RIG_DATA.vehicle||{}),
    accessories:clone(window.RIG_DATA.accessories||[]),
    revision:'BASE-Y62-001',
    publishedAt:null,
    publishedBy:'base-code'
  }:null;
  function base(){return clone(initialBase||{schemaVersion:'0.12.0',vehicleId:'nissan-y62-warrior-2025',vehicle:{},accessories:[],revision:'BASE-Y62-001',publishedAt:null,publishedBy:'base-code'})}
  function getPublished(){return P.get(publishedKey,null)}
  function getDraft(){return P.get(draftKey,null)}
  function getWorking(){return clone(getDraft()||getPublished()||base())}
  function applyPublished(data){const p=getPublished();if(!p||!data)return null;if(p.vehicleId&&data.vehicle?.id&&p.vehicleId!==data.vehicle.id)return null;if(p.vehicle){if(Array.isArray(p.vehicle.paints))data.vehicle.paints=clone(p.vehicle.paints);if(Array.isArray(p.vehicle.wheelTyres))data.vehicle.wheelTyres=clone(p.vehicle.wheelTyres)}if(Array.isArray(p.accessories))data.accessories=clone(p.accessories);data.schemaVersion=p.schemaVersion||data.schemaVersion;data.catalogueMeta={revision:p.revision,publishedAt:p.publishedAt,publishedBy:p.publishedBy||null,schemaVersion:p.schemaVersion};return p}
  function saveDraft(snapshot){snapshot=clone(snapshot);snapshot.schemaVersion='0.12.0';snapshot.savedAt=new Date().toISOString();P.set(draftKey,snapshot);window.PRO4X4_AUDIT_STORE?.append('catalogue.draft.saved','catalogue',snapshot.vehicleId||'nissan-y62-warrior-2025',{accessoryCount:snapshot.accessories?.length||0});return snapshot}
  function discardDraft(){P.remove(draftKey);window.PRO4X4_AUDIT_STORE?.append('catalogue.draft.discarded','catalogue','nissan-y62-warrior-2025',{})}
  function nextRevision(){const p=getPublished();const match=String(p?.revision||'').match(/(\d+)$/);const n=match?Number(match[1])+1:1;return `Y62-CAT-${String(n).padStart(3,'0')}`}
  function publish(snapshot,user='PRO4X4 staff'){const out=clone(snapshot);out.schemaVersion='0.12.0';out.revision=nextRevision();out.publishedAt=new Date().toISOString();out.publishedBy=user;delete out.savedAt;P.set(publishedKey,out);P.remove(draftKey);window.PRO4X4_AUDIT_STORE?.append('catalogue.revision.published','catalogue',out.vehicleId,{revision:out.revision,accessoryCount:out.accessories?.length||0,publishedBy:user});return out}
  function resetPublished(){P.remove(publishedKey);P.remove(draftKey);window.PRO4X4_AUDIT_STORE?.append('catalogue.reset','catalogue','nissan-y62-warrior-2025',{})}
  window.PRO4X4_CATALOGUE_STORE={schemaVersion:'0.12.0',publishedKey,draftKey,base,getPublished,getDraft,getWorking,applyPublished,saveDraft,discardDraft,publish,resetPublished,nextRevision};
  if(window.RIG_DATA)applyPublished(window.RIG_DATA);
})();
