(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_COMPOSITE_ELIGIBILITY=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const policy='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const schemaVersion='0.26.17';
  const masterStates=['master-approved','production-live'];
  const layerStates=['layer-approved','production-live'];
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  function briefFor(viewId,briefs={}){return Object.values(briefs||{}).find(b=>b?.viewId===viewId)||briefs?.[viewId]||null}
  function masterAssetId(viewId,briefs={}){const b=briefFor(viewId,briefs);return b?.briefId?`${b.briefId}-MASTER`:null}
  function expectedBinding(asset,briefs={}){
    if(!asset||asset.assetClass==='reference'||asset.layerId==='reference'||asset.layerId==='base')return null;
    const b=briefFor(asset.viewId,briefs),cls=asset.assetClass||'product-layer';
    return {schemaVersion,policy,vehicleId:asset.vehicleId||null,viewId:asset.viewId||null,canonicalBriefId:b?.briefId||null,canonicalMasterAssetId:b?.briefId?`${b.briefId}-MASTER`:null,layerId:asset.layerId||null,exactSku:asset.exactSku||null,productFamilyId:asset.productFamilyId||asset.visualFamilyId||null,assetClass:cls,role:cls==='product-layer'?'product-layer':'canonical-state-layer',exactMatchRequired:true,fallbackPolicy:'none',requiredCanonicalGovernanceStates:[...masterStates],requiredLayerGovernanceStates:cls==='product-layer'?[...layerStates]:[...masterStates],customerCompositeRule:'canonical master production-ready + exact governed layer production-ready'};
  }
  function bindingProblems(asset,binding,briefs={}){
    if(!asset||asset.assetClass==='reference'||asset.layerId==='reference'||asset.layerId==='base')return[];
    const expected=expectedBinding(asset,briefs),p=[];
    if(!binding)p.push('composite eligibility binding missing');
    else{
      for(const key of ['policy','vehicleId','viewId','canonicalBriefId','canonicalMasterAssetId','layerId','exactSku','role','fallbackPolicy'])if((binding?.[key]??null)!==(expected?.[key]??null))p.push(`composite binding ${key} mismatch`);
      if(binding.exactMatchRequired!==true)p.push('composite binding must require exact match');
      const required=expected.requiredLayerGovernanceStates||[],actual=binding.requiredLayerGovernanceStates||[];if(JSON.stringify(actual)!==JSON.stringify(required))p.push('composite binding layer governance states mismatch');
      const mreq=expected.requiredCanonicalGovernanceStates||[],mact=binding.requiredCanonicalGovernanceStates||[];if(JSON.stringify(mact)!==JSON.stringify(mreq))p.push('composite binding canonical governance states mismatch');
    }
    if(!asset.exactSku)p.push('composite layer exact SKU/state missing');
    if(!expected?.canonicalMasterAssetId)p.push('canonical master binding unavailable for view');
    return [...new Set(p)];
  }
  function runtimeProblems({layerAsset,baseAsset,briefs={}}={}){
    const p=[];if(!layerAsset)return['composite layer asset missing'];
    p.push(...bindingProblems(layerAsset,layerAsset.compositeEligibility,briefs));
    if(!baseAsset){p.push('canonical master required for composite');return [...new Set(p)]}
    if(baseAsset.vehicleId!==layerAsset.vehicleId||baseAsset.viewId!==layerAsset.viewId)p.push('canonical master vehicle/view mismatch');
    if(baseAsset.assetClass!=='canonical-master')p.push('composite root is not a canonical master');
    if(baseAsset.layerId!=='base')p.push('composite root must use base layer');
    if(baseAsset.status!=='production-ready')p.push('canonical master is not production-ready');
    if(!masterStates.includes(baseAsset.governance?.state))p.push(`canonical master governance state ${baseAsset.governance?.state||'unset'} is not approved`);
    const required=layerAsset.assetClass==='product-layer'?layerStates:masterStates;
    if(layerAsset.status!=='production-ready')p.push('composite layer is not production-ready');
    if(!required.includes(layerAsset.governance?.state))p.push(`composite layer governance state ${layerAsset.governance?.state||'unset'} is not approved`);
    if(layerAsset.compositeEligibility?.canonicalMasterAssetId&&baseAsset.assetId!==layerAsset.compositeEligibility.canonicalMasterAssetId){
      // Legacy governed base records may still satisfy old Alpha resolver fixtures, but only the canonical slot is a declared production target.
      if(baseAsset.canonicalView?.briefId||baseAsset.assetId?.endsWith('-MASTER'))p.push('composite layer is bound to a different canonical master');
    }
    return [...new Set(p)];
  }
  function describe(asset,briefs={}){const expected=expectedBinding(asset,briefs);return expected?clone(expected):null}
  return {schemaVersion,policy,masterStates,layerStates,briefFor,masterAssetId,expectedBinding,bindingProblems,runtimeProblems,describe};
});
