(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PRO4X4_CUSTOMER_VISUAL_STATE=api;
})(typeof window!=='undefined'?window:null,function(){
  const rule='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const reasonText={
    'reference-only-not-production':'Reference evidence exists for this exact layer, but it is not production-approved and cannot be shown to customers.',
    'production-asset-missing':'The exact production asset for this layer has not been approved and hosted yet.',
    'render-state-not-registered':'This exact visual state is not registered as an approved production state.',
    'exact-sku-not-registered':'No approved production visual is registered for this exact SKU.',
    'hosted-production-proof-required':'The exact hosted production proof is not available yet.',
    'approved-master-not-available':'An approved canonical master is not available yet.',
    'fitment-blocked':'This visual layer is blocked by a governed fitment condition.',
    'asset-gate-blocked':'This visual asset has not cleared the production governance gate.',
    'governance-review-required':'The visual asset is waiting for recorded production review approval.'
  };
  const stateLabels={available:'AVAILABLE',missing:'MISSING',blocked:'BLOCKED'};
  function normaliseCounts(render={}){
    const out={available:0,missing:0,blocked:0,other:0};
    const layers=Array.isArray(render.layers)?render.layers:[];
    if(layers.length){
      for(const layer of layers){if(Object.prototype.hasOwnProperty.call(out,layer.state))out[layer.state]++;else out.other++;}
      return out;
    }
    const source=render.counts||{};
    for(const k of ['available','missing','blocked'])out[k]=Number(source[k])||0;
    return out;
  }
  function explainLayer(layer={}){
    const state=['available','missing','blocked'].includes(layer.state)?layer.state:'missing';
    let detail;
    if(state==='available')detail='An exact approved production asset resolved for this required layer.';
    else detail=reasonText[layer.reason]||'The exact required production visual is not available for customer production.';
    return {
      layerId:layer.layerId||'unknown-layer',
      exactSku:layer.exactSku??null,
      state,
      label:stateLabels[state],
      reason:layer.reason||null,
      detail,
      stateKey:layer.stateKey||null,
      assetId:state==='available'?(layer.assetId||null):null,
      checksumSha256:state==='available'?(layer.checksumSha256||null):null
    };
  }
  function fromResolution(render,context={}){
    const vehicleKey=context.vehicleKey||null;
    if(!render){
      return {
        schemaVersion:'0.26.12',rule,mode:'unconfigured',tone:'neutral',headline:'PRODUCTION VISUAL NOT YET ENABLED',summary:vehicleKey==='ranger'?'This vehicle is in the catalogue + fitment proof program. No stand-in vehicle artwork will be used while exact production visuals are unavailable.':'No production render resolution is attached to this build yet.',counts:{available:0,missing:0,blocked:0,other:0},layers:[],fallbackPolicy:'none',exactMatchRequired:true,productionReady:false,viewId:null,error:null
      };
    }
    const counts=normaliseCounts(render),layers=(Array.isArray(render.layers)?render.layers:[]).map(explainLayer),productionReady=render.productionReady===true&&counts.missing===0&&counts.blocked===0;
    let mode='pending',tone='warn',headline='EXACT PRODUCTION VISUAL PENDING';
    if(productionReady){mode='ready';tone='good';headline='EXACT PRODUCTION STACK READY';}
    else if(counts.blocked>0){mode='blocked';tone='bad';headline='PRODUCTION VISUAL BLOCKED';}
    const summary=productionReady?'Every required layer resolved to an exact approved production asset.':counts.blocked>0?'At least one required layer is blocked. PRO4X4 will not substitute another product, state, reference image or draft asset.':'One or more exact approved production layers are still missing. PRO4X4 will not substitute reference-only, draft, approximate or guessed output.';
    return {schemaVersion:'0.26.12',rule,mode,tone,headline,summary,counts,layers,fallbackPolicy:render.fallbackPolicy||'none',exactMatchRequired:render.exactMatchRequired!==false,productionReady,viewId:render.viewId||context.viewId||null,error:render.error||null};
  }
  function selectedCoverage(products=[],derive){
    const rows=(products||[]).map(p=>({productId:p.id,name:p.name,visual:derive?derive(p):p.visual||{}})),counts={approved:0,'priced-only':0,'staff-review':0,blocked:0,other:0};
    for(const row of rows){const s=row.visual?.status||'priced-only';if(Object.prototype.hasOwnProperty.call(counts,s))counts[s]++;else counts.other++;}
    return {schemaVersion:'0.26.12',total:rows.length,counts,rows};
  }
  return {schemaVersion:'0.26.12',rule,reasonText,normaliseCounts,explainLayer,fromResolution,selectedCoverage};
});
