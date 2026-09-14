(function(root,factory){
  const visualState=typeof module==='object'&&module.exports?require('./customer-visual-state.js'):(root?root.PRO4X4_CUSTOMER_VISUAL_STATE:null);
  const api=factory(visualState);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PRO4X4_CUSTOMER_SHARED_BUILD=api;
})(typeof window!=='undefined'?window:null,function(visualState){
  const rule='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const blockingTypes=new Set(['fitment-blocked','dependency','dependency-any-of','vehicle-fitment']);
  const clone=v=>JSON.parse(JSON.stringify(v));
  const vehicleLabel=v=>[v?.yearRange,v?.make,v?.model,v?.trim].filter(Boolean).join(' ');
  function visualDetail(render={}){
    const explained=visualState?.fromResolution?visualState.fromResolution(render,{viewId:render.view||null}):{productionReady:render.productionReady===true,exactMatchRequired:render.exactMatchRequired!==false,fallbackPolicy:render.fallbackPolicy||'none',headline:render.productionReady===true?'EXACT PRODUCTION STACK READY':'EXACT PRODUCTION VISUAL PENDING',summary:render.productionReady===true?'Every required layer resolved to an exact approved production asset.':'One or more exact approved production layers are unavailable. No fallback visual will be substituted.',counts:{available:0,missing:0,blocked:0,other:0},layers:[]};
    const layers=(Array.isArray(explained.layers)?explained.layers:[]).map(layer=>({
      layerId:layer.layerId||'unknown-layer',
      exactSku:layer.exactSku??null,
      state:layer.state||'missing',
      label:layer.label||String(layer.state||'missing').toUpperCase(),
      reason:layer.reason||null,
      detail:layer.detail||null,
      assetId:layer.state==='available'?(layer.assetId||null):null,
      checksumSha256:layer.state==='available'?(layer.checksumSha256||null):null
    }));
    return {
      productionReady:explained.productionReady===true,
      exactMatchRequired:explained.exactMatchRequired!==false,
      fallbackPolicy:explained.fallbackPolicy||'none',
      view:render.view||explained.viewId||null,
      headline:explained.headline||null,
      summary:explained.summary||null,
      counts:{available:Number(explained.counts?.available)||0,missing:Number(explained.counts?.missing)||0,blocked:Number(explained.counts?.blocked)||0,other:Number(explained.counts?.other)||0},
      layers,
      snapshotSource:'resolved-share.revision.snapshot.render'
    };
  }
  function gateDetail(gate={}){
    return {
      type:gate.type||'fitment-review',
      id:gate.id||null,
      productId:gate.productId||gate.id||null,
      requiredId:gate.requiredId||null,
      requiredAnyOf:Array.isArray(gate.requiredAnyOf)?[...gate.requiredAnyOf]:[],
      alternatives:Array.isArray(gate.alternatives)?gate.alternatives.map(x=>({id:x.id||null,name:x.name||x.id||'Required option'})):[],
      note:gate.note||'PRO4X4 fitment review is required.',
      blocking:blockingTypes.has(gate.type)
    };
  }
  function setupChecks(selections=[]){
    return selections.flatMap(item=>Array.isArray(item.fitment?.conditions)&&item.fitment.conditions.filter(Boolean).length?[{
      productId:item.id||null,
      productName:item.name||item.id||'Selected product',
      conditions:item.fitment.conditions.filter(Boolean).map(String)
    }]:[]);
  }
  function missingPricing(pricing={}){return Object.values(pricing.unpricedComponentCounts||{}).reduce((n,v)=>n+(Number(v)||0),0)}
  function build(snapshot={},context={}){
    const selections=Array.isArray(snapshot.selections)?snapshot.selections:[];
    const gates=(Array.isArray(snapshot.gates)?snapshot.gates:[]).map(gateDetail);
    const checks=setupChecks(selections);
    const blocking=gates.filter(g=>g.blocking),review=gates.filter(g=>!g.blocking);
    return {
      schemaVersion:'0.26.14',
      immutableSource:'resolved-share.revision.snapshot',
      projectId:context.projectId||null,
      revisionId:context.revisionId||null,
      revisionChecksum:context.revisionChecksum||null,
      revisionCreatedAt:context.revisionCreatedAt||snapshot.createdAt||null,
      role:context.role||'customer-view',
      reference:snapshot.reference||null,
      vehicle:vehicleLabel(snapshot.vehicle),
      vehicleId:snapshot.vehicle?.id||null,
      itemCount:selections.length,
      selections:selections.map(item=>({id:item.id||null,name:item.name||'Selected product',brand:item.brand||'',sku:item.sku||'',pricing:clone(item.pricing||{})})),
      pricing:{currency:snapshot.pricing?.currency||'AUD',knownSubtotal:Number(snapshot.pricing?.knownSubtotal)||0,isComplete:snapshot.pricing?.isComplete===true,missingCount:missingPricing(snapshot.pricing||{})},
      weight:clone(snapshot.weight||{}),
      workflowStatus:snapshot.workflow?.status||null,
      catalogueRevision:snapshot.catalogue?.revision||null,
      gates:{total:gates.length,blockingCount:blocking.length,reviewCount:review.length,rows:gates,snapshotSource:'resolved-share.revision.snapshot.gates'},
      setupChecks:checks,
      visual:visualDetail(snapshot.render||{}),
      customerVisualRule:rule
    };
  }
  return {schemaVersion:'0.26.14',build,visualDetail,gateDetail,setupChecks,missingPricing,customerVisualRule:rule};
});
