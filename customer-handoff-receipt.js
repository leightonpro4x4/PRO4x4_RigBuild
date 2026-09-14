(function(root,factory){
  const visualState=typeof module==='object'&&module.exports?require('./customer-visual-state.js'):(root?root.PRO4X4_CUSTOMER_VISUAL_STATE:null);
  const api=factory(visualState);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PRO4X4_HANDOFF_RECEIPT=api;
})(typeof window!=='undefined'?window:null,function(visualState){
  const blockingTypes=new Set(['fitment-blocked','dependency','dependency-any-of','vehicle-fitment']);
  const titles={save:'BUILD SAVED',share:'SHARE LINK READY',quote:'QUOTE REQUEST RECEIVED'};
  const statusLabels={save:'SAVED IMMUTABLE REVISION',share:'REVISION-LOCKED SHARE',quote:'IN PRO4X4 SALES QUEUE'};
  const customerVisualRule='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const pricingComponents=['parts','labour','paint','freight','engineering'];
  const clone=v=>JSON.parse(JSON.stringify(v));
  function vehicleLabel(v={}){return [v.yearRange,v.make,v.model,v.trim].filter(Boolean).join(' ')}
  function counts(render={}){const out={available:0,missing:0,blocked:0,other:0};for(const layer of Array.isArray(render.layers)?render.layers:[]){if(Object.prototype.hasOwnProperty.call(out,layer.state))out[layer.state]++;else out.other++;}return out;}
  function fallbackVisual(render={}){const c=counts(render);return {productionReady:render.productionReady===true,exactMatchRequired:render.exactMatchRequired!==false,fallbackPolicy:render.fallbackPolicy||'none',viewId:render.view||null,headline:render.productionReady===true?'EXACT PRODUCTION STACK READY':'EXACT PRODUCTION VISUAL PENDING',summary:render.productionReady===true?'Every required layer resolved to an exact approved production asset.':'One or more exact approved production layers are still unavailable. No draft, reference-only, approximate or guessed output will be substituted.',counts:c,layers:(Array.isArray(render.layers)?render.layers:[]).map(layer=>({layerId:layer.layerId||'unknown-layer',exactSku:layer.exactSku??null,state:['available','missing','blocked'].includes(layer.state)?layer.state:'other',label:String(layer.state||'review').toUpperCase(),reason:layer.reason||null,detail:layer.state==='available'?'An exact approved production asset resolved for this required layer.':'The exact required production visual is not available for customer production.',stateKey:layer.stateKey||null,assetId:layer.state==='available'?(layer.assetId||null):null,checksumSha256:layer.state==='available'?(layer.checksumSha256||null):null}))};}
  function visualDetail(render={}){
    const explained=visualState?.fromResolution?visualState.fromResolution(render,{viewId:render.view||null}):fallbackVisual(render);
    const layers=Array.isArray(explained.layers)?explained.layers.map(layer=>({layerId:layer.layerId||'unknown-layer',exactSku:layer.exactSku??null,state:layer.state||'other',label:layer.label||String(layer.state||'review').toUpperCase(),reason:layer.reason||null,detail:layer.detail||null,stateKey:layer.stateKey||null,assetId:layer.state==='available'?(layer.assetId||null):null,checksumSha256:layer.state==='available'?(layer.checksumSha256||null):null})):[];
    return {productionReady:explained.productionReady===true,exactMatchRequired:explained.exactMatchRequired!==false,fallbackPolicy:explained.fallbackPolicy||'none',view:render.view||explained.viewId||null,counts:{available:Number(explained.counts?.available)||0,missing:Number(explained.counts?.missing)||0,blocked:Number(explained.counts?.blocked)||0,other:Number(explained.counts?.other)||0},headline:explained.headline||null,summary:explained.summary||null,layers,snapshotSource:'persisted-revision.render'};
  }

  function bomRow(item={}){
    const pricing=clone(item.pricing||{}),required=Array.isArray(item.pricingRequired)?[...item.pricingRequired]:[];
    const knownValue=pricingComponents.reduce((sum,key)=>pricing[key]==null?sum:sum+(Number(pricing[key])||0),0);
    const missingRequired=required.filter(key=>pricing[key]==null);
    return {id:item.id||null,name:item.name||'Selected product',vendor:item.brand||'',sku:item.sku||'',category:item.category||'Other',pricing,pricingRequired:required,knownValue,missingRequired};
  }
  function bomDetail(selections=[],pricing={}){
    const rows=selections.map(bomRow);
    return {rows,itemCount:rows.length,knownSubtotal:Number(pricing.knownSubtotal)||0,isComplete:pricing.isComplete===true,missingRequiredCount:rows.reduce((sum,row)=>sum+row.missingRequired.length,0),snapshotSource:'persisted-revision.selections'};
  }
  function persistedNumber(value){return value===null||value===undefined||value===''||!Number.isFinite(Number(value))?null:Number(value)}
  function persistedCount(value){const n=persistedNumber(value);return n==null?null:Math.max(0,Math.trunc(n))}
  function sameMoney(a,b){return a!=null&&b!=null&&Math.abs(a-b)<0.005}
  function pricingDetail(pricing={},bom={}){
    const sourceComponents=pricing&&typeof pricing.components==='object'&&pricing.components?pricing.components:{},sourceMissing=pricing&&typeof pricing.unpricedComponentCounts==='object'&&pricing.unpricedComponentCounts?pricing.unpricedComponentCounts:{};
    const components=Object.fromEntries(pricingComponents.map(key=>[key,persistedNumber(sourceComponents[key])]));
    const unpricedComponentCounts=Object.fromEntries(pricingComponents.map(key=>[key,persistedCount(sourceMissing[key])]));
    const savedKnownSubtotal=persistedNumber(pricing.knownSubtotal),rowKnownSubtotal=Array.isArray(bom.rows)?Number(bom.rows.reduce((sum,row)=>sum+(Number(row.knownValue)||0),0).toFixed(2)):null;
    const componentValuesRecorded=pricingComponents.some(key=>Object.prototype.hasOwnProperty.call(sourceComponents,key)),componentKnownSubtotal=componentValuesRecorded?Number(pricingComponents.reduce((sum,key)=>sum+(components[key]||0),0).toFixed(2)):null;
    const savedMissingRequiredCount=pricingComponents.some(key=>Object.prototype.hasOwnProperty.call(sourceMissing,key))?pricingComponents.reduce((sum,key)=>sum+(unpricedComponentCounts[key]||0),0):null,rowMissingRequiredCount=persistedCount(bom.missingRequiredCount);
    const rowSubtotalMatches=savedKnownSubtotal==null||rowKnownSubtotal==null?null:sameMoney(savedKnownSubtotal,rowKnownSubtotal),componentSubtotalMatches=savedKnownSubtotal==null||componentKnownSubtotal==null?null:sameMoney(savedKnownSubtotal,componentKnownSubtotal),missingCountMatches=savedMissingRequiredCount==null||rowMissingRequiredCount==null?null:savedMissingRequiredCount===rowMissingRequiredCount;
    const mismatch=[rowSubtotalMatches,componentSubtotalMatches,missingCountMatches].some(value=>value===false),summaryPresent=savedKnownSubtotal!=null&&componentValuesRecorded;
    const pricingState=mismatch?'persisted-summary-mismatch':!summaryPresent?'persisted-summary-incomplete':pricing.isComplete===true&&savedMissingRequiredCount===0&&rowMissingRequiredCount===0?'persisted-pricing-complete':'persisted-pricing-tbc';
    return {currency:String(pricing.currency||''),taxMode:String(pricing.taxMode||''),savedKnownSubtotal,components,unpricedComponentCounts,savedMissingRequiredCount,rowKnownSubtotal,rowMissingRequiredCount,componentKnownSubtotal,rowSubtotalMatches,componentSubtotalMatches,missingCountMatches,pricingState,snapshotSource:'persisted-revision.pricing',reconciliationSource:bom.snapshotSource||'persisted-revision.selections'};
  }
  function missingPricing(pricing={}){return Object.values(pricing.unpricedComponentCounts||{}).reduce((n,v)=>n+(Number(v)||0),0)}
  function customerDetail(lead={}){return {name:String(lead.name||''),phone:String(lead.phone||''),email:String(lead.email||''),postcode:String(lead.postcode||''),preferredContact:String(lead.preferredContact||''),notes:String(lead.notes||''),snapshotSource:'persisted-revision.lead'};}
  function vehicleDetail(vehicle={},render={}){
    const value=v=>v==null?'':String(v),variant=render&&typeof render.stateVariant==='object'&&render.stateVariant?render.stateVariant:{};
    const configured={vehicleId:value(vehicle.id),paintId:value(vehicle.paint),wheelTyreId:value(vehicle.wheelTyre),viewId:value(vehicle.view)};
    const renderState={paintId:value(variant.paintId),wheelTyreId:value(variant.wheelTyreId),viewId:value(render.view)};
    const keys=['paintId','wheelTyreId','viewId'],mismatch=keys.some(key=>configured[key]&&renderState[key]&&configured[key]!==renderState[key]),complete=keys.every(key=>configured[key]&&renderState[key]);
    return {...configured,renderState,visualStateParity:mismatch?'mismatch':complete?'aligned':'incomplete',snapshotSource:'persisted-revision.vehicle',renderSnapshotSource:'persisted-revision.render'};
  }
  function provenanceDetail(snapshot={},context={}){
    const project=snapshot&&typeof snapshot.project==='object'&&snapshot.project?snapshot.project:{},catalogue=snapshot&&typeof snapshot.catalogue==='object'&&snapshot.catalogue?snapshot.catalogue:{},contract=snapshot&&typeof snapshot.contract==='object'&&snapshot.contract?snapshot.contract:{},workflow=snapshot&&typeof snapshot.workflow==='object'&&snapshot.workflow?snapshot.workflow:{};
    const text=v=>v==null?'':String(v),number=v=>v===null||v===undefined||v===''||!Number.isFinite(Number(v))?null:Number(v),handoffStatus=context.handoffWorkflowStatus??context.workflowStatus??null;
    return {snapshot:{schemaVersion:text(snapshot.schemaVersion),createdAt:text(snapshot.createdAt),channel:text(snapshot.channel)},project:{savedAt:text(project.savedAt),source:text(project.source),revisionNumber:number(project.revisionNumber),projectVersion:number(project.projectVersion)},catalogue:{schemaVersion:text(catalogue.schemaVersion),revision:text(catalogue.revision)},contract:{version:text(contract.version),createEndpoint:text(contract.createEndpoint)},revisionWorkflow:{status:text(workflow.status),owner:text(workflow.owner),lastUpdatedAt:text(workflow.lastUpdatedAt)},handoff:{mode:text(context.mode||'save'),queueReference:text(context.queueReference),status:text(handoffStatus)},snapshotSource:'persisted-revision',handoffSource:handoffStatus||context.queueReference?'handoff-result-context':'none'};
  }
  function massDetail(weight={}){
    const baseline=weight&&typeof weight.baseline==='object'&&weight.baseline?weight.baseline:{};
    const number=v=>v===null||v===undefined||v===''||!Number.isFinite(Number(v))?null:Number(v);
    const integer=v=>{const n=number(v);return n==null?null:Math.max(0,Math.trunc(n));};
    const kerbMassKg=number(baseline.kerbMassKg),gvmKg=number(baseline.gvmKg),nominalPayloadKg=number(baseline.nominalPayloadKg),knownAccessoryMassKg=number(weight.knownAccessoryMassKg),unknownAccessoryMassCount=integer(weight.unknownAccessoryMassCount);
    const planningKerbMassKg=kerbMassKg!=null&&knownAccessoryMassKg!=null?Number((kerbMassKg+knownAccessoryMassKg).toFixed(2)):null;
    const remainingKnownPayloadKg=gvmKg!=null&&planningKerbMassKg!=null?Number((gvmKg-planningKerbMassKg).toFixed(2)):null;
    const complete=kerbMassKg!=null&&gvmKg!=null&&knownAccessoryMassKg!=null&&unknownAccessoryMassCount!=null;
    const massState=!complete?'incomplete':remainingKnownPayloadKg<0?'known-load-over-gvm':unknownAccessoryMassCount>0?'unknown-mass':'planning-record-complete';
    return {baseline:{kerbMassKg,gvmKg,nominalPayloadKg,confidence:String(baseline.confidence||''),note:String(baseline.note||'')},knownAccessoryMassKg,unknownAccessoryMassCount,planningKerbMassKg,remainingKnownPayloadKg,massState,complianceState:'review-required',snapshotSource:'persisted-revision.weight',calculationBasis:'persisted-weight-fields-only'};
  }
  function build(snapshot={},context={}){
    const mode=context.mode||'save',projectId=context.projectId||snapshot.project?.id||null,revisionId=context.revisionId||snapshot.project?.revisionId||null,gates=Array.isArray(snapshot.gates)?clone(snapshot.gates):[],selections=Array.isArray(snapshot.selections)?snapshot.selections:[],setupChecks=selections.flatMap(x=>Array.isArray(x.fitment?.conditions)&&x.fitment.conditions.length?[{productId:x.id,productName:x.name,conditions:x.fitment.conditions.filter(Boolean)}]:[]),vehicleState=vehicleDetail(snapshot.vehicle||{},snapshot.render||{}),massCompliance=massDetail(snapshot.weight||{}),visual=visualDetail(snapshot.render||{}),bom=bomDetail(selections,snapshot.pricing||{}),pricingState=pricingDetail(snapshot.pricing||{},bom),provenance=provenanceDetail(snapshot,context),verification=[];
    const blocking=gates.filter(g=>blockingTypes.has(g.type));
    const review=gates.filter(g=>!blockingTypes.has(g.type));
    if(blocking.length)verification.push({type:'fitment-blocker',state:'open',label:'FITMENT / DEPENDENCY',detail:`${blocking.length} blocking fitment or dependency requirement${blocking.length===1?' remains':'s remain'} attached to this exact revision.`});
    else if(review.length||setupChecks.length)verification.push({type:'fitment-review',state:'open',label:'FITMENT REVIEW',detail:`${review.length+setupChecks.length} fitment review or vehicle-setup check${review.length+setupChecks.length===1?' remains':'s remain'} for PRO4X4 confirmation.`});
    else verification.push({type:'fitment-clear',state:'clear',label:'FITMENT',detail:'No open fitment/dependency gates are recorded on this revision.'});
    if(pricingState.pricingState==='persisted-summary-mismatch')verification.push({type:'pricing-integrity',state:'open',label:'PRICING RECORD',detail:'The persisted pricing summary does not reconcile with the persisted BOM line values and/or required-value counts on this exact revision. PRO4X4 must review the saved pricing record; current catalogue pricing is not substituted.'});
    else if(pricingState.pricingState==='persisted-summary-incomplete')verification.push({type:'pricing',state:'open',label:'FINAL PRICING',detail:'The persisted pricing summary is incomplete on this exact revision. Missing aggregate values are not reconstructed from the current catalogue; PRO4X4 review is required.'});
    else if(pricingState.pricingState==='persisted-pricing-tbc'){const pricingMissing=pricingState.savedMissingRequiredCount??pricingState.rowMissingRequiredCount??0;verification.push({type:'pricing',state:'open',label:'FINAL PRICING',detail:`${pricingMissing} required pricing component${pricingMissing===1?' remains':'s remain'} TBC on this exact revision before a final fitted quote.`});}
    else verification.push({type:'pricing',state:'clear',label:'PRICING',detail:'The persisted pricing summary reconciles with the saved BOM and required pricing fields are complete on this exact revision.'});
    if(massCompliance.massState==='known-load-over-gvm')verification.push({type:'mass-compliance',state:'open',label:'WEIGHT / COMPLIANCE',detail:`Known saved mass alone exceeds the persisted GVM by ${Math.abs(massCompliance.remainingKnownPayloadKg)} kg. This immutable revision requires PRO4X4 load/compliance review; unknown masses, occupants, cargo, towball download and axle limits are not inferred.`});
    else if(massCompliance.massState==='unknown-mass')verification.push({type:'mass-compliance',state:'open',label:'WEIGHT / COMPLIANCE',detail:`${massCompliance.unknownAccessoryMassCount} selected item${massCompliance.unknownAccessoryMassCount===1?' has':'s have'} unknown mass on this saved revision. Known-mass planning remains provisional and final compliance requires exact vehicle, weighbridge, axle/load, occupants, cargo and towball checks.`});
    else if(massCompliance.massState==='incomplete')verification.push({type:'mass-compliance',state:'open',label:'WEIGHT / COMPLIANCE',detail:'Persisted mass planning fields are incomplete on this revision. Missing values are not recalculated from the current catalogue or vehicle defaults; PRO4X4 review is required.'});
    else verification.push({type:'mass-compliance',state:'next',label:'WEIGHT / COMPLIANCE',detail:'Saved baseline and known accessory-mass fields are complete for this revision. They remain planning data only, not compliance sign-off; exact vehicle, weighbridge, axle/load, occupants, cargo and towball checks still apply.'});
    if(visual.productionReady&&vehicleState.visualStateParity==='aligned')verification.push({type:'visual',state:'clear',label:'BUILD VISUAL',detail:'The saved revision records an exact approved production render stack and its paint, wheel/tyre and view identifiers align with the persisted vehicle configuration.'});
    else {const parityNote=vehicleState.visualStateParity==='mismatch'?' Persisted vehicle/render state identifiers do not agree; PRO4X4 review is required before any visual can be treated as exact for this configuration.':vehicleState.visualStateParity==='incomplete'?' Persisted render-state identifiers are incomplete; they will not be inferred from current defaults.':'';verification.push({type:'visual',state:'open',label:'BUILD VISUAL',detail:`Exact visual state: ${visual.counts.available} available · ${visual.counts.missing} missing · ${visual.counts.blocked} blocked.${parityNote} Per-layer reasons below are read from this saved revision; no draft, reference-only or approximate visual will be substituted.`});}
    if(mode==='quote')verification.push({type:'staff',state:'next',label:'PRO4X4 HANDOFF',detail:'PRO4X4 staff will inspect this exact immutable revision before confirming fitment, supply, labour and final quote scope.'});
    return {schemaVersion:'0.26.29',mode,title:titles[mode]||titles.save,statusLabel:statusLabels[mode]||statusLabels.save,projectId,revisionId,reference:snapshot.reference||null,vehicle:vehicleLabel(snapshot.vehicle),catalogueRevision:provenance.catalogue.revision||null,itemCount:selections.length,knownSubtotal:pricingState.savedKnownSubtotal??0,workflowStatus:provenance.revisionWorkflow.status||null,handoffStatus:provenance.handoff.status||null,queueReference:provenance.handoff.queueReference||null,provenance,share:context.share?{revisionId:context.share.revisionId||revisionId,createdAt:context.share.createdAt||null,expiresAt:context.share.expiresAt||null,tokenHint:context.share.tokenHint||null}:null,customer:customerDetail(snapshot.lead||{}),vehicleState,massCompliance,pricingState,bom,visual,gates:{total:gates.length,blocking:blocking.length,review:review.length,setupChecks:setupChecks.length,rows:gates,setupRows:setupChecks,snapshotSource:'persisted-revision.gates'},verification,customerVisualRule};
  }
  return {schemaVersion:'0.26.29',build,counts,visualDetail,bomRow,bomDetail,pricingDetail,customerDetail,vehicleDetail,massDetail,provenanceDetail,missingPricing};
});
