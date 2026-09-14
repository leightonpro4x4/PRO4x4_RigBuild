(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api; else root.PRO4X4_PRODUCT_VISUALS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const allowed=new Set(['approved','priced-only','staff-review','blocked']);
  function derive(product,vehicleId){
    const explicit=product.visual||{};
    let state=explicit.status;
    if(!allowed.has(state)){
      if(product.status==='blocked')state='blocked';
      else if(product.status==='engineering'||product.fitment?.reviewRequired)state='staff-review';
      else state='priced-only';
    }
    const supportedViews=Array.isArray(explicit.supportedViews)?explicit.supportedViews:[];
    return {
      visualisable: explicit.visualisable===true,
      supportedViews,
      visualLayerRequired: explicit.visualLayerRequired!==false,
      status: state,
      referenceAvailable: explicit.referenceAvailable===true,
      fitmentConfidence: explicit.fitmentConfidence || (product.status==='confirmed'&&!product.fitment?.reviewRequired?'confirmed':'review-required'),
      vehicleId: explicit.vehicleId||vehicleId||null,
      layerId: explicit.layerId||product.layer||null,
      note: explicit.note||null
    };
  }
  function badge(product,vehicleId){
    const v=derive(product,vehicleId);
    if(v.status==='approved')return {label:'VISUAL PREVIEW AVAILABLE',className:'good'};
    if(v.status==='blocked')return {label:'VISUAL BLOCKED',className:'bad'};
    if(v.status==='staff-review')return {label:'STAFF FITMENT REVIEW',className:'warn'};
    return {label:'PRICED / PREVIEW PENDING',className:'neutral'};
  }
  function selectionGate(product,allProducts,selectedIds){
    const ids=new Set(selectedIds||[]), byId=new Map((allProducts||[]).map(p=>[p.id,p]));
    const blockers=[], warnings=[], autoAdd=[], resolutionActions=[];
    if(product.status==='blocked') blockers.push('This item is blocked for this vehicle until PRO4X4 verifies a valid fitment path.');
    for(const c of product.fitment?.conflicts||[]){
      if(ids.has(c)){const p=byId.get(c);blockers.push(`Conflicts with selected ${p?.name||c}. Remove that item first.`);resolutionActions.push({type:'remove',productId:c,label:`REMOVE ${p?.name||c}`})}
      else if(!byId.has(c)) warnings.push(`Fitment constraint: ${c}. PRO4X4 will validate this before quote approval.`);
    }
    const anyOf=product.fitment?.anyOfRequiredParts||[];
    if(anyOf.length&&!anyOf.some(id=>ids.has(id))){
      const choices=anyOf.map(id=>byId.get(id)).filter(Boolean);
      blockers.push(`Requires one compatible supporting item: ${choices.map(x=>x.name).join(' OR ')||anyOf.join(' OR ')}.`);
      for(const dep of choices.filter(x=>x.status!=='blocked')) resolutionActions.push({type:'add',productId:dep.id,label:`ADD ${dep.name}`});
    }
    for(const req of product.requires||product.fitment?.requiredParts||[]){
      if(ids.has(req)) continue;
      const dep=byId.get(req);
      if(dep?.status==='blocked') blockers.push(`Required item ${dep.name} is currently blocked.`);
      else if(dep) autoAdd.push(dep.id);
      else warnings.push(`Requires ${req}; this dependency is not yet a selectable catalogue item and needs staff review.`);
    }
    if(product.status==='engineering'||product.fitment?.reviewRequired) warnings.push('PRO4X4 fitment review is required before final quote approval.');
    return {allowed:blockers.length===0,blockers,warnings,autoAdd,resolutionActions};
  }
  function preAddMessages(product,allProducts,selectedIds){
    const gate=selectionGate(product,allProducts,selectedIds);
    return [
      ...gate.blockers.map(x=>`BLOCKED: ${x}`),
      ...gate.warnings,
      ...gate.autoAdd.map(id=>{const p=(allProducts||[]).find(x=>x.id===id);return `Requires ${p?.name||id}; it will be added with this item.`;})
    ];
  }
  function applyDataset(data){if(!data?.accessories)return data;for(const p of data.accessories){const v=derive(p,data.vehicle?.id);p.visual={...(p.visual||{}),visualisable:v.visualisable,supportedViews:v.supportedViews,visualLayerRequired:v.visualLayerRequired,status:v.status,referenceAvailable:v.referenceAvailable,fitmentConfidence:v.fitmentConfidence,vehicleId:v.vehicleId,layerId:v.layerId,note:v.note};}data.visualContractVersion='0.26.4';return data;}
  function coverageSummary(data){
    const rows=(data?.accessories||[]).map(p=>derive(p,data?.vehicle?.id));
    const counts={approved:0,'priced-only':0,'staff-review':0,blocked:0};
    for(const r of rows) counts[r.status]=(counts[r.status]||0)+1;
    return {total:rows.length,counts,visualisable:rows.filter(r=>r.visualisable).length,referenceBacked:rows.filter(r=>r.referenceAvailable).length};
  }
  return {schemaVersion:'0.26.4',derive,badge,selectionGate,preAddMessages,coverageSummary,applyDataset};
});
