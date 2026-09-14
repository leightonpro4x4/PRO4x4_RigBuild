(function(){
  const P=window.PRO4X4_PERSISTENCE.local;
  const contract=window.PRO4X4_QUOTE_CONTRACT;
  const QKEY='sales:queue-v2', SETTINGS='sales:settings-v2', PREVIEW='sales:quote-preview-v2';
  const clone=v=>JSON.parse(JSON.stringify(v));
  const legacyRead=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw==null?fallback:JSON.parse(raw)}catch{return fallback}};
  function migrateOnce(){
    if(P.get(QKEY,null)==null){const q=legacyRead(contract.storageKey,[]);P.set(QKEY,Array.isArray(q)?q:[])}
    if(P.get(SETTINGS,null)==null){P.set(SETTINGS,legacyRead(contract.staffSettingsKey,{labourRate:null,quoteValidityDays:14}))}
    if(P.get(PREVIEW,null)==null){const v=legacyRead(contract.quotePreviewKey,null);if(v)P.set(PREVIEW,v)}
  }
  migrateOnce();
  function list(){return clone(P.get(QKEY,[]))}
  function replace(records,{audit=false}={}){const out=clone(Array.isArray(records)?records:[]);P.set(QKEY,out);if(audit)window.PRO4X4_AUDIT_STORE?.append('quote.queue.replaced','sales-queue','primary',{count:out.length});return out}
  function get(reference){return list().find(x=>x.reference===reference)||null}
  function upsert(record,{action='quote.upserted',metadata={}}={}){if(!record?.reference)throw Object.assign(new Error('Quote reference is required'),{code:'VALIDATION_ERROR'});const q=list(),i=q.findIndex(x=>x.reference===record.reference);if(i>=0)q[i]=clone(record);else q.unshift(clone(record));P.set(QKEY,q);window.PRO4X4_AUDIT_STORE?.append(action,'quote',record.reference,{status:record.workflow?.status||null,projectId:record.project?.id||null,...metadata});return clone(record)}
  function patch(reference,patch,{action='quote.updated'}={}){const current=get(reference);if(!current)throw Object.assign(new Error('Quote not found'),{code:'NOT_FOUND'});const next={...current,...clone(patch||{})};return upsert(next,{action})}
  function remove(reference){const q=list(),next=q.filter(x=>x.reference!==reference);if(next.length===q.length)return false;P.set(QKEY,next);window.PRO4X4_AUDIT_STORE?.append('quote.deleted','quote',reference,{});return true}
  function getSettings(){return {...{labourRate:null,quoteValidityDays:14},...clone(P.get(SETTINGS,{}))}}
  function setSettings(settings){const out={labourRate:settings?.labourRate==null?null:Number(settings.labourRate),quoteValidityDays:Math.max(1,Math.round(Number(settings?.quoteValidityDays)||14))};P.set(SETTINGS,out);window.PRO4X4_AUDIT_STORE?.append('staff.settings.updated','staff-settings','quote',{quoteValidityDays:out.quoteValidityDays,labourRateConfigured:out.labourRate!=null});return clone(out)}
  function setPreview(record){if(record)P.set(PREVIEW,record);else P.remove(PREVIEW);return clone(record)}
  function getPreview(){return clone(P.get(PREVIEW,null))}
  window.PRO4X4_SALES_STORE={schemaVersion:'0.12.0',keys:{queue:QKEY,settings:SETTINGS,preview:PREVIEW},list,replace,get,upsert,patch,remove,getSettings,setSettings,setPreview,getPreview};
})();
