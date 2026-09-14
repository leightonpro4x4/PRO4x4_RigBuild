(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api; else root.PRO4X4_CUSTOMER_BROWSE_SESSION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ALL='ALL', PREFIX='pro4x4-wf1-browse:v1:';
  const clean=v=>String(v==null?'':v).trim();
  const categoryOf=p=>(clean(p?.category)||'OTHER').toUpperCase();
  const vendorOf=p=>clean(p?.brand)||'OTHER';
  const selectedSet=ids=>ids instanceof Set?ids:new Set(Array.isArray(ids)?ids:[]);
  function normalize(context,products,selectedIds){
    const list=products||[], selected=selectedSet(selectedIds), input=context||{};
    let category=(clean(input.category)||ALL).toUpperCase();
    if(category!==ALL&&!list.some(p=>categoryOf(p)===category))category=ALL;
    let vendor=clean(input.vendor)||ALL;
    const scoped=list.filter(p=>category===ALL||categoryOf(p)===category);
    if(vendor!==ALL&&!scoped.some(p=>vendorOf(p)===vendor))vendor=ALL;
    let focusProductId=clean(input.focusProductId)||null;
    const focus=list.find(p=>p.id===focusProductId);
    if(!focus||!selected.has(focus.id)||(category!==ALL&&categoryOf(focus)!==category)||(vendor!==ALL&&vendorOf(focus)!==vendor))focusProductId=null;
    return {category,vendor,focusProductId};
  }
  function selectedFallback(products,selectedIds){
    const list=products||[],selected=selectedSet(selectedIds);
    const p=[...list].reverse().find(item=>selected.has(item.id));
    if(!p)return {category:ALL,vendor:ALL,focusProductId:null};
    return {category:categoryOf(p),vendor:vendorOf(p),focusProductId:p.id};
  }
  function key(projectId,revisionId){return projectId&&revisionId?`${PREFIX}${projectId}:${revisionId}`:null}
  function save(storage,projectId,revisionId,context,products,selectedIds){
    const k=key(projectId,revisionId);if(!storage||!k)return null;
    const normalized=normalize(context,products,selectedIds);
    try{storage.setItem(k,JSON.stringify(normalized));return normalized}catch(_){return null}
  }
  function load(storage,projectId,revisionId,products,selectedIds){
    const k=key(projectId,revisionId),fallback=selectedFallback(products,selectedIds);if(!storage||!k)return fallback;
    try{const raw=storage.getItem(k);if(!raw)return fallback;return normalize(JSON.parse(raw),products,selectedIds)}catch(_){return fallback}
  }
  return {schemaVersion:'0.26.17',ALL,normalize,selectedFallback,key,save,load};
});
