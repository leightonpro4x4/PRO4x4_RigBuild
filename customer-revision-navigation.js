(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_CUSTOMER_REVISION_NAV=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const clean=v=>String(v==null?'':v).trim();
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  function revisions(project){
    return Array.isArray(project?.revisions)?project.revisions.filter(r=>r&&clean(r.id)):[];
  }
  function exact(project,revisionId){
    const id=clean(revisionId);return revisions(project).find(r=>r.id===id)||null;
  }
  function model(project,activeRevisionId){
    const list=revisions(project),activeId=clean(activeRevisionId)||clean(project?.currentRevisionId)||list.at(-1)?.id||null;
    const activeIndex=list.findIndex(r=>r.id===activeId),currentId=clean(project?.currentRevisionId)||list.at(-1)?.id||null;
    return {
      projectId:clean(project?.id)||null,
      currentRevisionId:currentId,
      activeRevisionId:activeId,
      activeIndex,
      revisionCount:list.length,
      isHistorical:!!activeId&&!!currentId&&activeId!==currentId,
      previousRevisionId:activeIndex>0?list[activeIndex-1].id:null,
      nextRevisionId:activeIndex>=0&&activeIndex<list.length-1?list[activeIndex+1].id:null,
      revisions:list.map((r,index)=>({
        id:r.id,
        number:r.number??index+1,
        createdAt:r.createdAt||null,
        source:r.source||null,
        active:r.id===activeId,
        projectCurrent:r.id===currentId,
        itemCount:Number(r.summary?.itemCount??r.snapshot?.selections?.length??0),
        knownSubtotal:Number(r.summary?.knownSubtotal??r.snapshot?.pricing?.knownSubtotal??0),
        vehicleLabel:r.summary?.vehicleLabel||[r.snapshot?.vehicle?.yearRange,r.snapshot?.vehicle?.make,r.snapshot?.vehicle?.model,r.snapshot?.vehicle?.trim].filter(Boolean).join(' ')||'Saved build'
      }))
    };
  }
  function intent(project,activeRevisionId,targetRevisionId,dirty){
    const target=exact(project,targetRevisionId);if(!target)return {allowed:false,requiresConfirmation:false,reason:'revision-not-found',targetRevisionId:null};
    if(target.id===clean(activeRevisionId))return {allowed:false,requiresConfirmation:false,reason:'already-active',targetRevisionId:target.id};
    return {allowed:!dirty,requiresConfirmation:!!dirty,reason:dirty?'unsaved-changes':null,targetRevisionId:target.id,target:clone(target)};
  }
  return {schemaVersion:'0.26.18',revisions,exact,model,intent};
});
