(function(root,factory){
  const visualState=typeof module==='object'&&module.exports?require('./customer-visual-state.js'):(root?root.PRO4X4_CUSTOMER_VISUAL_STATE:null);
  const api=factory(visualState);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PRO4X4_HANDOFF_REVIEW=api;
})(typeof window!=='undefined'?window:null,function(visualState){
  const blockingTypes=new Set(['fitment-blocked','dependency','dependency-any-of','vehicle-fitment']);
  const reviewTypes=new Set(['fitment-review']);
  const actionLabels={save:'SAVE IMMUTABLE REVISION',share:'CREATE REVISION-LOCKED SHARE',quote:'SEND EXACT REVISION TO PRO4X4'};
  const titleLabels={save:'REVIEW BEFORE SAVING',share:'REVIEW SAVED BUILD BEFORE SHARING',quote:'FINAL BUILD REVIEW'};
  const customerVisualRule='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  function vehicleLabel(v={}){return [v.yearRange,v.make,v.model,v.trim].filter(Boolean).join(' ')}
  function fallbackVisual(render={}){
    const layers=Array.isArray(render.layers)?render.layers:[],counts={available:0,missing:0,blocked:0,other:0};
    for(const layer of layers){if(Object.prototype.hasOwnProperty.call(counts,layer.state))counts[layer.state]++;else counts.other++;}
    return {productionReady:render.productionReady===true,exactMatchRequired:render.exactMatchRequired!==false,fallbackPolicy:render.fallbackPolicy||'none',viewId:render.view||null,headline:render.productionReady===true?'EXACT PRODUCTION STACK READY':'EXACT PRODUCTION VISUAL PENDING',summary:render.productionReady===true?'Every required layer resolved to an exact approved production asset.':'One or more exact approved production layers are still unavailable. No draft, reference-only, approximate or guessed output will be substituted.',counts,layers:layers.map(layer=>({layerId:layer.layerId||'unknown-layer',exactSku:layer.exactSku??null,state:['available','missing','blocked'].includes(layer.state)?layer.state:'other',label:String(layer.state||'review').toUpperCase(),reason:layer.reason||null,detail:layer.state==='available'?'An exact approved production asset resolved for this required layer.':'The exact required production visual is not available for customer production.',stateKey:layer.stateKey||null,assetId:layer.state==='available'?(layer.assetId||null):null,checksumSha256:layer.state==='available'?(layer.checksumSha256||null):null}))};
  }
  function visualSummary(render={}){
    const explained=visualState?.fromResolution?visualState.fromResolution(render,{viewId:render.view||null}):fallbackVisual(render);
    const layers=Array.isArray(explained.layers)?explained.layers.map(layer=>({layerId:layer.layerId||'unknown-layer',exactSku:layer.exactSku??null,state:layer.state||'other',label:layer.label||String(layer.state||'review').toUpperCase(),reason:layer.reason||null,detail:layer.detail||null,stateKey:layer.stateKey||null,assetId:layer.state==='available'?(layer.assetId||null):null,checksumSha256:layer.state==='available'?(layer.checksumSha256||null):null})):[];
    return {productionReady:explained.productionReady===true,exactMatchRequired:explained.exactMatchRequired!==false,fallbackPolicy:explained.fallbackPolicy||'none',view:render.view||explained.viewId||null,layerCount:layers.length,counts:{available:Number(explained.counts?.available)||0,missing:Number(explained.counts?.missing)||0,blocked:Number(explained.counts?.blocked)||0,other:Number(explained.counts?.other)||0},headline:explained.headline||null,summary:explained.summary||null,layers,snapshotSource:'review-snapshot.render'};
  }
  function gateSummary(gates=[]){const blocking=gates.filter(g=>blockingTypes.has(g.type)),review=gates.filter(g=>reviewTypes.has(g.type)),other=gates.filter(g=>!blockingTypes.has(g.type)&&!reviewTypes.has(g.type));return {total:gates.length,blocking,review,other,clear:gates.length===0};}
  function pricingSummary(pricing={}){const missing=pricing.unpricedComponentCounts||{},missingCount=Object.values(missing).reduce((n,v)=>n+(Number(v)||0),0);return {currency:pricing.currency||'AUD',knownSubtotal:Number(pricing.knownSubtotal)||0,isComplete:pricing.isComplete===true,missingCount};}
  function build(snapshot={},context={}){
    const mode=context.mode||'save',selections=Array.isArray(snapshot.selections)?snapshot.selections:[],gates=gateSummary(Array.isArray(snapshot.gates)?snapshot.gates:[]),visual=visualSummary(snapshot.render||{}),pricing=pricingSummary(snapshot.pricing||{}),revisionId=context.revisionId||snapshot.project?.revisionId||null,projectId=context.projectId||snapshot.project?.id||null,setupChecks=selections.flatMap(x=>Array.isArray(x.fitment?.conditions)&&x.fitment.conditions.length?[{productId:x.id,productName:x.name,conditions:x.fitment.conditions.filter(Boolean)}]:[]);
    return {schemaVersion:'0.26.13',mode,title:titleLabels[mode]||titleLabels.save,actionLabel:actionLabels[mode]||actionLabels.save,projectId,revisionId,revisionState:revisionId?'immutable-saved-revision':'pending-immutable-revision',reference:snapshot.reference||null,vehicle:vehicleLabel(snapshot.vehicle),vehicleId:snapshot.vehicle?.id||null,itemCount:selections.length,selections:selections.map(x=>({id:x.id,name:x.name,brand:x.brand,sku:x.sku})),setupChecks,gates,visual,pricing,workflowStatus:snapshot.workflow?.status||null,lead:{name:snapshot.lead?.name||'',phone:snapshot.lead?.phone||'',email:snapshot.lead?.email||'',postcode:snapshot.lead?.postcode||''},catalogueRevision:snapshot.catalogue?.revision||null,customerVisualRule};
  }
  return {schemaVersion:'0.26.13',build,gateSummary,visualSummary,pricingSummary};
});
