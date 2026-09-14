const data=window.RIG_DATA; const manifest=window.Y62_RENDER_MANIFEST; const contract=window.PRO4X4_QUOTE_CONTRACT; const projectStore=window.PRO4X4_PROJECT_STORE; const backend=window.PRO4X4_BACKEND.active(); const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const renderContracts=window.Y62_RENDER_CONTRACTS||{contracts:{}};
let state={view:'front34',paint:'black-obsidian',wheelTyre:'factory-warrior',filter:'ALL',projectId:null,revisionId:null,projectVersion:0,projectRecord:null,renderResolution:null,renderRequest:0,renderLoads:{},renderRetryCount:0,renderResolveAttempts:0};
const money=n=>n==null?'QUOTE':new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:n%1?2:0}).format(n);
const selected=()=>data.accessories.filter(a=>a.selected);
const componentKeys=['parts','labour','paint','freight','engineering'];
const componentLabels={parts:'Parts retail',labour:'Fitted labour',paint:'Paint / colour coding',freight:'Freight',engineering:'Engineering / allowance'};
const byId=id=>data.accessories.find(a=>a.id===id);
function componentTotals(){
  const totals={parts:0,labour:0,paint:0,freight:0,engineering:0};
  const missing={parts:0,labour:0,paint:0,freight:0,engineering:0};
  selected().forEach(a=>componentKeys.forEach(k=>{const required=(a.pricingRequired||componentKeys).includes(k);const v=a.pricing?.[k];if(v==null){if(required)missing[k]++}else totals[k]+=v;}));
  return {totals,missing};
}
function knownSubtotal(){const {totals}=componentTotals();return componentKeys.reduce((s,k)=>s+totals[k],0)}
function relationshipIssues(){
  const set=new Set(selected().map(a=>a.id)); const out=[];
  selected().forEach(a=>{
    (a.fitment?.requiredParts||[]).forEach(req=>{if(!set.has(req))out.push({type:'dependency',id:a.id,sku:a.sku,status:'dependency',note:`${a.name} requires ${byId(req)?.name||req}.`,requiredId:req});});
    (a.fitment?.conflicts||[]).forEach(conflict=>out.push({type:'conflict',id:a.id,sku:a.sku,status:'conflict',note:`${a.name}: ${conflict}.`}));
  });
  return out;
}
function fitmentIssues(){return selected().filter(a=>a.status!=='confirmed').map(a=>({type:'fitment',id:a.id,sku:a.sku,status:a.status,note:a.note}));}
function allGates(){return [...fitmentIssues(),...relationshipIssues()]}
function renderStateForLayer(layer){
  if(layer.id==='base')return {state:{paintId:state.paint},stateKey:`paint:${state.paint}`};
  if(layer.id==='wheels')return {state:{wheelTyreId:state.wheelTyre},stateKey:`wheel:${state.wheelTyre}`};
  return {state:{},stateKey:null};
}
function activeRenderRequirements(viewId=state.view){
  const view=manifest.views[viewId],selectedLayers=new Set(selected().map(a=>a.layer));
  return [...view.layers].sort((a,b)=>a.priority-b.priority).filter(layer=>layer.id==='base'||layer.id==='wheels'||selectedLayers.has(layer.id)||selectedLayers.has(layer.id.replace(/-(wheel|jerry|camera)$/,''))).map(layer=>({...renderStateForLayer(layer),layerId:layer.id,exactSku:layer.exactSku??null,label:layer.label,priority:layer.priority}));
}
function resolutionKey(layerId,exactSku,stateKey=null){return `${layerId}::${exactSku||''}::${stateKey||''}`}
function currentResolutionMap(){const r=state.renderResolution;if(!r||r.viewId!==state.view)return new Map();return new Map((r.layers||[]).map(x=>[resolutionKey(x.layerId,x.exactSku,x.stateKey),x]))}
function loadKey(x){return `${x.layerId}::${x.assetId||''}::${x.checksumSha256||''}`}
function loadStatus(x){return state.renderLoads[loadKey(x)]||{state:'pending',attempt:0,durationMs:null,errorCode:null}}
function telemetrySessionKey(){let k=localStorage.getItem('pro4x4-render-session');if(!k){const a=new Uint8Array(8);crypto.getRandomValues(a);k='RB-'+[...a].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();localStorage.setItem('pro4x4-render-session',k)}return k}
function emitRenderTelemetry(event){const payload={sessionKey:telemetrySessionKey(),vehicleId:data.vehicle.id,viewId:state.view,...event};Promise.resolve(backend.recordRenderTelemetry?.(payload)).catch(()=>{})}
function transientRenderError(e){return !e?.status||e.status===408||e.status===429||e.status>=500}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function setLoadStatus(x,patch){state.renderLoads[loadKey(x)]={...loadStatus(x),...patch};renderLayerInspector();renderDiagnostics();syncRenderLoadUi()}
function syncRenderLoadUi(){
  const resolution=state.renderResolution,empty=$('#visualEmpty'),mode=$('#assetMode'),gate=$('#visualGate');if(!resolution||!empty||!mode||!gate)return;
  const available=(resolution.layers||[]).filter(x=>x.state==='available'),base=available.find(x=>x.layerId==='base'),baseLoad=base?loadStatus(base):null,loaded=available.filter(x=>loadStatus(x).state==='loaded').length,failed=available.filter(x=>loadStatus(x).state==='failed').length,pending=available.length-loaded-failed,total=activeRenderRequirements().length;
  if(base?.state==='available'&&baseLoad?.state==='loaded')empty.classList.add('hidden');else{empty.classList.remove('hidden');const b=empty.querySelector('b'),span=empty.querySelector('span');if(base){b.textContent=baseLoad?.state==='failed'?'PRODUCTION BASE LOAD FAILED':'LOADING APPROVED PRODUCTION BASE';span.textContent=baseLoad?.state==='failed'?'The exact approved base could not be delivered after retry. No fallback artwork will be shown.':'The approved binary is being loaded. Reference artwork remains hidden.'}}
  if(failed){mode.textContent='PRODUCTION DELIVERY DEGRADED — NO FALLBACK';gate.textContent=`LOAD ${loaded}/${available.length} · ${failed} FAILED`;gate.className='visual-gate blocked'}
  else if(available.length&&pending){mode.textContent='LOADING EXACT PRODUCTION LAYERS';gate.textContent=`LOAD ${loaded}/${available.length} · ${pending} PENDING`;gate.className='visual-gate'}
  else if(resolution.productionReady&&available.length){mode.textContent='LIVE PRODUCTION STACK — EXACT LAYERS ONLY';gate.textContent=`VISUAL GATE ${available.length}/${total} CLEAR`;gate.className='visual-gate complete'}
}
function loadApprovedLayer(img,x,requestId){
  const c=renderContracts.contracts?.[state.view],policy=c?.loadPolicy||{maxAttempts:3,retryDelaysMs:[0,350,900],timeoutMs:8000},max=Math.max(1,Number(policy.maxAttempts)||3),delays=policy.retryDelaysMs||[0,350,900],timeoutMs=Number(policy.timeoutMs)||8000;
  const run=async attempt=>{
    if(requestId!==state.renderRequest)return;const started=Date.now();setLoadStatus(x,{state:'loading',attempt,errorCode:null});emitRenderTelemetry({eventType:'asset-load-start',layerId:x.layerId,exactSku:x.exactSku,stateKey:x.stateKey,attempt,assetId:x.assetId,checksumSha256:x.checksumSha256});
    const ok=await new Promise(resolve=>{let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(v)};const timer=setTimeout(()=>finish(false),timeoutMs);img.onload=()=>finish(true);img.onerror=()=>finish(false);const sep=x.binaryUrl.includes('?')?'&':'?';img.src=x.binaryUrl+(attempt>1?`${sep}loadAttempt=${attempt}`:'')});
    if(requestId!==state.renderRequest)return;const durationMs=Date.now()-started;if(ok){setLoadStatus(x,{state:'loaded',attempt,durationMs,errorCode:null});emitRenderTelemetry({eventType:'asset-load-success',layerId:x.layerId,exactSku:x.exactSku,stateKey:x.stateKey,attempt,durationMs,assetId:x.assetId,checksumSha256:x.checksumSha256});const available=(state.renderResolution?.layers||[]).filter(y=>y.state==='available');if(available.length&&available.every(y=>loadStatus(y).state==='loaded'))emitRenderTelemetry({eventType:'stack-ready',attempt:state.renderResolveAttempts,durationMs:null,metadata:{availableLayers:available.length,paint:state.paint,wheelTyre:state.wheelTyre}});return}
    if(attempt<max){state.renderRetryCount++;setLoadStatus(x,{state:'retrying',attempt,durationMs,errorCode:'asset-load-failed'});emitRenderTelemetry({eventType:'asset-load-retry',layerId:x.layerId,exactSku:x.exactSku,stateKey:x.stateKey,attempt,durationMs,assetId:x.assetId,checksumSha256:x.checksumSha256,errorCode:'asset-load-failed'});await wait(Number(delays[attempt]??delays.at(-1)??350));return run(attempt+1)}
    setLoadStatus(x,{state:'failed',attempt,durationMs,errorCode:'asset-load-failed'});img.remove();emitRenderTelemetry({eventType:'asset-load-error',layerId:x.layerId,exactSku:x.exactSku,stateKey:x.stateKey,attempt,durationMs,assetId:x.assetId,checksumSha256:x.checksumSha256,errorCode:'asset-load-failed'});emitRenderTelemetry({eventType:'stack-degraded',attempt:state.renderResolveAttempts,metadata:{failedLayer:x.layerId,paint:state.paint,wheelTyre:state.wheelTyre}})
  };run(1);
}
function renderProductionStack(){
  const host=$('#vehicleRenderStack'),empty=$('#visualEmpty'),mode=$('#assetMode'),gate=$('#visualGate'),reqs=activeRenderRequirements(),resolution=state.renderResolution&&state.renderResolution.viewId===state.view?state.renderResolution:null;
  host.innerHTML='';const layers=resolution?.layers||[],base=layers.find(x=>x.layerId==='base'),counts=resolution?.counts||{available:0,missing:reqs.length,blocked:0};
  if(base?.state==='available'){
    layers.filter(x=>x.state==='available').forEach(x=>{const img=document.createElement('img');img.className='production-layer';img.alt=`${x.layerId} approved production layer`;img.dataset.assetId=x.assetId||'';img.dataset.checksum=x.checksumSha256||'';img.dataset.stateKey=x.stateKey||'';host.appendChild(img);loadApprovedLayer(img,x,state.renderRequest)});
  }else{empty.classList.remove('hidden');const b=empty.querySelector('b'),span=empty.querySelector('span');b.textContent=resolution?'PRODUCTION BASE REQUIRED':'RESOLVING APPROVED VISUALS';span.textContent=resolution?'No reference board or stage render will be substituted. The configurator remains usable while the exact production base/state is missing.':'Checking the governed production registry.';}
  const total=reqs.length,available=counts.available||0,blocked=counts.blocked||0,missing=counts.missing||0;
  if(!resolution){mode.textContent='RESOLVING PRODUCTION LAYERS';gate.textContent='VISUAL GATE —';gate.className='visual-gate';return}
  if(!base||base.state!=='available'){mode.textContent='NO PRODUCTION BASE — REFERENCE ART HIDDEN';gate.textContent=`VISUAL GATE ${available}/${total} · ${missing} MISSING${blocked?` · ${blocked} BLOCKED`:''}`;gate.className='visual-gate'+(blocked?' blocked':'')}
  else{mode.textContent='APPROVED STACK RESOLVED — VERIFYING DELIVERY';gate.textContent=`VISUAL GATE ${available}/${total}${missing?` · ${missing} MISSING`:''}${blocked?` · ${blocked} BLOCKED`:''}`;gate.className='visual-gate'+(blocked?' blocked':'')}
  syncRenderLoadUi();
}
async function refreshRenderStack(){
  const requestId=++state.renderRequest,viewId=state.view,requirements=activeRenderRequirements(viewId).map(({layerId,exactSku,stateKey,state})=>({layerId,exactSku,stateKey,state})),c=renderContracts.contracts?.[viewId],policy=c?.loadPolicy||{maxAttempts:3,retryDelaysMs:[0,350,900]};state.renderResolution=null;state.renderLoads={};state.renderRetryCount=0;state.renderResolveAttempts=0;renderProductionStack();renderLayerInspector();renderDiagnostics();
  let resolved=null,lastError=null;const max=Math.max(1,Number(policy.maxAttempts)||3),delays=policy.retryDelaysMs||[0,350,900];
  for(let attempt=1;attempt<=max;attempt++){if(requestId!==state.renderRequest||viewId!==state.view)return;state.renderResolveAttempts=attempt;const started=Date.now();emitRenderTelemetry({eventType:'resolve-start',attempt,metadata:{paint:state.paint,wheelTyre:state.wheelTyre,requirementCount:requirements.length}});try{resolved=await backend.resolveRenderStack({vehicleId:data.vehicle.id,viewId,requirements});emitRenderTelemetry({eventType:'resolve-success',attempt,durationMs:Date.now()-started,metadata:{counts:resolved.counts,paint:state.paint,wheelTyre:state.wheelTyre}});break}catch(e){lastError=e;emitRenderTelemetry({eventType:'resolve-error',attempt,durationMs:Date.now()-started,errorCode:e.code||`http-${e.status||0}`,metadata:{message:String(e.message||'').slice(0,180)}});if(attempt>=max||!transientRenderError(e))break;state.renderRetryCount++;await wait(Number(delays[attempt]??delays.at(-1)??350))}}
  if(requestId!==state.renderRequest||viewId!==state.view)return;
  state.renderResolution=resolved||{schemaVersion:'0.22.0',vehicleId:data.vehicle.id,viewId,fallbackPolicy:'none',exactMatchRequired:true,productionReady:false,counts:{available:0,missing:requirements.length,blocked:0},layers:requirements.map(r=>({...r,state:'missing',reason:'resolver-unavailable',registryStatus:null,assetId:null,binaryUrl:null,checksumSha256:null})),error:lastError?.message||'Resolver unavailable'};
  renderProductionStack();renderLayerInspector();renderDiagnostics();
}
function renderView(){
  const v=data.vehicle.views[state.view];$('#viewLabel').textContent=v.label;$$('.view-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));refreshRenderStack();
}
function renderPaint(){
  const host=$('#swatches'); host.innerHTML=''; data.vehicle.paints.forEach(p=>{const selectable=!!p.validated,visualReady=p.visualReady!==false;const b=document.createElement('button');b.className='swatch '+(p.id===state.paint?'active ':'')+(!selectable?'disabled':'')+(!visualReady?' asset-pending':'');b.style.background=p.swatch;b.title=!selectable?p.label+' — source required':visualReady?p.label:p.label+' — colour validated; exact production render state still required';b.disabled=!selectable;b.onclick=()=>{state.paint=p.id;renderPaint();refreshRenderStack()};host.appendChild(b)});
  const paint=data.vehicle.paints.find(p=>p.id===state.paint);$('#paintName').textContent=(paint?.label||state.paint)+(paint?.visualReady===false?' · VISUAL PENDING':'');
}
function renderWheel(){
  const sel=$('#wheelTyre');sel.innerHTML='';data.vehicle.wheelTyres.forEach(w=>{const o=document.createElement('option');o.value=w.id;o.textContent=w.validated?w.label:w.label+' — source required';o.disabled=!w.validated;sel.appendChild(o)});sel.value=state.wheelTyre;
}
function renderLayerInspector(){
  const view=manifest.views[state.view],host=$('#layerStack');host.innerHTML='';const selectedLayers=new Set(selected().map(a=>a.layer)),resolved=currentResolutionMap();let ready=0,relevant=0;const unresolved=[];
  [...view.layers].sort((a,b)=>a.priority-b.priority).forEach((layer,idx)=>{
    const req=activeRenderRequirements().find(x=>x.layerId===layer.id&&x.exactSku===layer.exactSku),isBase=layer.id==='base'||layer.id==='wheels',active=isBase||selectedLayers.has(layer.id)||selectedLayers.has(layer.id.replace(/-(wheel|jerry|camera)$/,'')),r=req?resolved.get(resolutionKey(req.layerId,req.exactSku,req.stateKey)):null;let visualState='inactive',label='NOT ACTIVE',title=layer.note;
    if(active){relevant++;if(r){const ls=r.state==='available'?loadStatus(r):null;visualState=r.state==='available'&&ls?.state==='failed'?'load-failed':r.state;label=r.state==='available'?(ls?.state==='loaded'?'AVAILABLE':ls?.state==='failed'?'LOAD FAILED':ls?.state==='retrying'?'RETRYING':'LOADING'):r.state.toUpperCase();title=`${layer.note} · Resolver: ${r.reason||'server-approved production binary'}${r.stateKey?` · ${r.stateKey}`:''}`;if(r.state==='available')ready++;else unresolved.push({layer,r})}else{visualState='missing';label='CHECKING';unresolved.push({layer,r:null})}}
    const row=document.createElement('div');row.className=`layer-row ${active?'active':'inactive'} ${visualState}`;const stateLabel=req?.stateKey?` · ${req.stateKey}`:'';row.innerHTML=`<span class="z">${String(idx+1).padStart(2,'0')}</span><div><b>${layer.label}</b><small>${layer.exactSku||'VEHICLE BASE'}${stateLabel}</small></div><span class="layer-state ${visualState}">${label}</span>`;row.title=title;host.appendChild(row);
  });
  const pct=relevant?Math.round(ready/relevant*100):0;$('#renderCoverage').textContent=`${ready}/${relevant} approved production layers`;$('#renderBar').style.width=pct+'%';
  const first=unresolved.sort((a,b)=>a.layer.priority-b.layer.priority)[0];if(!state.renderResolution)$('#nextLayer').textContent='RESOLVING GOVERNED PRODUCTION ASSETS…';else if(first?.r?.state==='blocked')$('#nextLayer').textContent=`FITMENT BLOCK: ${first.layer.label} · ${first.layer.exactSku||'base'}`;else if(first)$('#nextLayer').textContent=`NEXT EXACT ASSET: ${first.layer.label} · ${first.r?.stateKey||first.layer.exactSku||'base'}`;else $('#nextLayer').textContent='All active visual layers are server-approved and production-ready.';
}

function renderDiagnostics(){
  const c=renderContracts.contracts?.[state.view],r=state.renderResolution,host=$('#renderDiagnosticsList');if(!host)return;
  $('#renderContractId').textContent=c?.contractId||'UNLOCKED';$('#renderCameraId').textContent=c?.cameraProfileId||'PENDING';
  const layers=r?.layers||[],fail=layers.filter(x=>x.state!=='available'),loadFailed=layers.filter(x=>x.state==='available'&&loadStatus(x).state==='failed');$('#renderFailureCount').textContent=String(fail.length+loadFailed.length);
  const base=layers.find(x=>x.layerId==='base'),baseLoad=base?.state==='available'?loadStatus(base):null;$('#renderPreloadState').textContent=!r?'WAITING':base?.state!=='available'?(base?.state==='blocked'?'BASE BLOCKED':'BASE MISSING'):baseLoad?.state==='loaded'?'BASE LOADED':baseLoad?.state==='failed'?'BASE LOAD FAILED':'BASE LOADING';
  if($('#renderLoadState'))$('#renderLoadState').textContent=`${layers.filter(x=>x.state==='available'&&loadStatus(x).state==='loaded').length}/${layers.filter(x=>x.state==='available').length}`;if($('#renderRetryCount'))$('#renderRetryCount').textContent=String(state.renderRetryCount);
  host.innerHTML='';
  if(!c){host.innerHTML='<div class="diag-item error">No production layer-set contract exists for this view.</div>';return}
  const stateRow=document.createElement('div');stateRow.className='diag-item state-contract';stateRow.textContent=`STATE · paint:${state.paint} · wheel:${state.wheelTyre} · exact-state match only`;host.appendChild(stateRow);
  const order=c.requiredOrder||[],by=new Map(layers.map(x=>[x.layerId,x]));
  order.forEach((id,i)=>{const x=by.get(id);if(!x)return;const ls=x.state==='available'?loadStatus(x):null,stateClass=x.state==='available'&&ls?.state==='failed'?'error':x.state,d=document.createElement('div');d.className=`diag-item ${stateClass}`;d.textContent=`${String(i+1).padStart(2,'0')} · ${id} · ${x.state.toUpperCase()}${x.stateKey?' · '+x.stateKey:''}${x.exactSku?' · '+x.exactSku:''}${x.state==='available'?` · delivery ${ls?.state||'pending'}${ls?.attempt?` #${ls.attempt}`:''}`:''}${x.reason?' · '+x.reason:''}`;host.appendChild(d)});
  if(!layers.length)host.innerHTML+='<div class="diag-item">Awaiting server resolver response.</div>';
}

function renderPricing(){
  const {totals,missing}=componentTotals();const host=$('#priceBreakdown');host.innerHTML='';componentKeys.forEach(k=>{const row=document.createElement('div');row.className='price-row';row.innerHTML=`<span>${componentLabels[k]}${missing[k]?` <small>${missing[k]} quote item${missing[k]===1?'':'s'}</small>`:''}</span><b>${totals[k]?money(totals[k]):(missing[k]?'QUOTE':'—')}</b>`;host.appendChild(row)});
  $('#total').textContent=money(knownSubtotal());const open=componentKeys.reduce((s,k)=>s+missing[k],0);$('#pricingNote').textContent=open?`${open} selected cost components remain deliberately unpriced. Known subtotal is not a fitted drive-away total.`:'All selected cost components are priced.';
}
function renderBuild(){
  const host=$('#buildItems');host.innerHTML='';selected().forEach(a=>{const price=a.pricing?.parts??a.pricing?.paint??a.pricing?.engineering??null;const el=document.createElement('div');el.className='build-row';el.innerHTML=`<div><strong>${a.name}</strong><span class="small">${a.brand} · ${a.sku}</span><br><span class="status ${a.status}">${a.status==='confirmed'?'Fitment data loaded':a.status==='engineering'?'Engineering validation required':'Compatibility blocked'}</span></div><div style="text-align:right"><b>${money(price)}</b><br><button class="remove" data-remove="${a.id}">Remove</button></div>`;host.appendChild(el)});
  $('#itemCount').textContent=selected().length.toString().padStart(2,'0');const gates=allGates();const gate=$('#gate');gate.className='gate'+(gates.length?'':' ok');gate.textContent=gates.length?`${gates.length} build gate${gates.length>1?'s':''} unresolved — concept can be saved, formal quote routes to PRO4X4 review.`:'Fitment gate clear for selected catalogue items.';
  $$('[data-remove]').forEach(b=>b.onclick=()=>{byId(b.dataset.remove).selected=false;renderAll()});renderPricing();renderDependencySummary();
}
function renderDependencySummary(){
  const rel=relationshipIssues();const host=$('#dependencySummary');if(!rel.length){host.className='dependency-summary ok';host.textContent='Accessory dependency check passed.';return;}host.className='dependency-summary';host.innerHTML=rel.map(x=>`<div>${x.note}</div>`).join('');
}
function renderCatalogue(){
  const cats=['ALL',...new Set(data.accessories.map(a=>a.category.toUpperCase()))];const f=$('#filters');f.innerHTML='';cats.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.className=state.filter===c?'active':'';b.onclick=()=>{state.filter=c;renderCatalogue()};f.appendChild(b)});
  const host=$('#productGrid');host.innerHTML='';data.accessories.filter(a=>state.filter==='ALL'||a.category.toUpperCase()===state.filter).forEach(a=>{const price=a.pricing?.parts??a.pricing?.paint??a.pricing?.engineering??null;const req=(a.fitment?.requiredParts||[]).map(id=>byId(id)?.name||id);const el=document.createElement('article');el.className='product '+a.status;el.innerHTML=`<div class="brand">${a.brand} · ${a.category}</div><h3>${a.name}</h3><div class="sku">${a.sku}</div><p class="small">${a.note}</p>${req.length?`<div class="requires">REQUIRES · ${req.join(', ')}</div>`:''}<div class="price">${money(price)}</div><button data-add="${a.id}" class="${a.selected?'added':''}">${a.selected?'ADDED — REMOVE':'ADD TO BUILD'}</button>`;host.appendChild(el)});
  $$('[data-add]').forEach(b=>b.onclick=()=>{const a=byId(b.dataset.add);a.selected=!a.selected;renderAll()});
}
function leadFromForm(){
  return {name:$('#leadName').value.trim(),phone:$('#leadPhone').value.trim(),email:$('#leadEmail').value.trim(),postcode:$('#leadPostcode').value.trim(),preferredContact:$('#leadContact').value,notes:$('#leadNotes').value.trim()};
}
function autoQueueStatus(){
  const gates=allGates();if(gates.length)return 'needs-fitment-review';const {missing}=componentTotals();if(componentKeys.reduce((s,k)=>s+missing[k],0))return 'pricing-incomplete';return 'ready-to-quote';
}
function renderReadiness(){
  const status=autoQueueStatus();const label=contract.statuses.find(s=>s.id===status)?.label||status;$('#queueState').textContent=label.toUpperCase();$('#queueState').className='queue-state '+status;
}
function buildPayload(ref,lead={}){
  const {totals,missing}=componentTotals();const gates=allGates();const viewManifest=manifest.views[state.view];const activeLayerIds=new Set(['base','wheels',...selected().map(a=>a.layer)]);const renderLayers=viewManifest.layers.filter(l=>activeLayerIds.has(l.id)||activeLayerIds.has(l.id.replace(/-(wheel|jerry|camera)$/,'')));
  return {
    schemaVersion:'0.12.0',reference:ref,createdAt:new Date().toISOString(),channel:'web-configurator',lead,
    vehicle:{id:data.vehicle.id,yearRange:data.vehicle.yearRange,make:data.vehicle.make,model:data.vehicle.model,trim:data.vehicle.trim,paint:state.paint,wheelTyre:state.wheelTyre,view:state.view},
    selections:selected().map(a=>({id:a.id,brand:a.brand,name:a.name,sku:a.sku,status:a.status,layer:a.layer,pricing:a.pricing,pricingRequired:a.pricingRequired||componentKeys,fitment:a.fitment,finishOptions:a.finishOptions||[],weightKg:a.weightKg??null,sourceProductWeightKg:a.sourceProductWeightKg??null,removedVehicleMassKg:a.removedVehicleMassKg??null,install:a.install||null,source:a.source})),
    pricing:{currency:'AUD',taxMode:'retail-gst-inclusive-where-sourced',knownSubtotal:knownSubtotal(),components:totals,unpricedComponentCounts:missing,isComplete:componentKeys.every(k=>missing[k]===0)},
    weight:{baseline:data.vehicle.weights||null,knownAccessoryMassKg:selected().reduce((n,a)=>n+(Number.isFinite(a.weightKg)?a.weightKg:0),0),unknownAccessoryMassCount:selected().filter(a=>a.weightKg==null).length},
    gates,
    render:{view:state.view,manifestVersion:manifest.schemaVersion,resolverVersion:state.renderResolution?.schemaVersion||'0.22.0',fallbackPolicy:'none',productionReady:!!state.renderResolution?.productionReady,stateVariant:{paintId:state.paint,wheelTyreId:state.wheelTyre},deliveryHealthy:(state.renderResolution?.layers||[]).filter(x=>x.state==='available').every(x=>loadStatus(x).state!=='failed'),resolveAttempts:state.renderResolveAttempts,retryCount:state.renderRetryCount,activeLayers:renderLayers.map(l=>{const req=activeRenderRequirements().find(x=>x.layerId===l.id&&x.exactSku===l.exactSku),r=req?currentResolutionMap().get(resolutionKey(req.layerId,req.exactSku,req.stateKey)):null,ls=r?.state==='available'?loadStatus(r):null;return {id:l.id,registryStatus:r?.registryStatus||l.status,exactSku:l.exactSku,stateKey:req?.stateKey||null,requestedState:req?.state||{},visualState:r?.state||'missing',deliveryState:ls?.state||null,assetId:r?.assetId||null,checksumSha256:r?.checksumSha256||null}})},
    workflow:{status:autoQueueStatus(),owner:null,staffNotes:'',lastUpdatedAt:new Date().toISOString()},
    catalogue:{schemaVersion:data.schemaVersion,revision:data.catalogueMeta?.revision||'BASE-Y62-001',publishedAt:data.catalogueMeta?.publishedAt||null},
    contract:{version:contract.schemaVersion,createEndpoint:contract.endpoints.createBuild}
  };
}
function makeRef(){return 'P4X4-Y62-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+String(Math.floor(Math.random()*900)+100)}
function downloadPayload(payload){const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${payload.reference}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
async function persistBuild(payload){return backend.createBuild(payload)}
function makeProjectId(){const a=new Uint8Array(6);crypto.getRandomValues(a);const suffix=[...a].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,8).toUpperCase();return `P4X4-PROJ-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${suffix}`}
function revisionFromProject(p,rid){return p?.revisions?.find(r=>r.id===rid)||p?.revisions?.find(r=>r.id===p.currentRevisionId)||p?.revisions?.at(-1)||null}
function syncProjectUi(){const p=state.projectRecord,r=revisionFromProject(p,state.revisionId);const box=$('#projectStatus');if(box){box.innerHTML=`<div><span>PROJECT</span><b>${p?p.id:'UNSAVED BUILD'}</b></div><div><span>REVISION</span><b>${r?r.id:'—'}</b></div>`;}$('#shareCustomer').disabled=!p;$('#shareStaff').disabled=!p;$('#historyLink').href=p?`projects.html?project=${encodeURIComponent(p.id)}`:'projects.html'}
async function saveProjectRevision(source='customer-builder'){
  const ref=makeRef(),payload=buildPayload(ref,leadFromForm()),title=payload.lead?.name?`${payload.lead.name} · Y62 Warrior`:'Y62 Warrior Build',id=state.projectId||makeProjectId(),expectedVersion=state.projectRecord?.version??0;
  const saved=await backend.saveProjectRevision(id,payload,{source,expectedVersion,title});state.projectId=saved.project.id;state.revisionId=saved.revision.id;state.projectVersion=saved.project.version;state.projectRecord=saved.project;localStorage.setItem('pro4x4-last-concept',JSON.stringify(saved.snapshot));history.replaceState(null,'',`index.html?project=${encodeURIComponent(state.projectId)}&revision=${encodeURIComponent(state.revisionId)}`);syncProjectUi();$('#export').disabled=false;return saved.snapshot;
}
async function saveConcept(){try{const payload=await saveProjectRevision('customer-builder');$('#quoteResult').innerHTML=`Project <b>${payload.project.id}</b> saved as immutable revision <b>${payload.project.revisionId}</b> through <b>${backend.mode}</b>. It has not entered the sales queue.`;return payload}catch(e){$('#quoteResult').textContent=e.code==='VERSION_CONFLICT'||e.code==='version_conflict'?`This project changed elsewhere (current version ${e.currentVersion??'unknown'}). Reload it before saving another revision.`:`Project save failed: ${e.message}`;}}
async function queueSalesReview(){
  const lead=leadFromForm();if(!lead.name||(!lead.phone&&!lead.email)){ $('#quoteResult').textContent='Sales queue needs a customer name plus phone or email. Save a revision first if you only want to preserve the concept.';return; }
  let payload;try{payload=await saveProjectRevision('sales-queue-submit')}catch(e){$('#quoteResult').textContent=`Project save failed before queue submission: ${e.message}`;return}try{await persistBuild(payload);$('#quoteResult').innerHTML=`Project <b>${payload.project.id}</b> revision <b>${payload.project.revisionId}</b> added to the <b>${backend.mode}</b> staff queue as <b>${contract.statuses.find(s=>s.id===payload.workflow.status)?.label}</b>.`;$('#export').disabled=false;}catch(e){$('#quoteResult').textContent=`Sales queue submission failed: ${e.message}. The project revision remains saved.`;}
}
async function createShare(role){if(!state.projectId)return;try{const share=await backend.createProjectShare(state.projectId,{role,revisionId:state.revisionId,expiresDays:30});state.projectRecord=await backend.getProject(state.projectId);state.projectVersion=state.projectRecord.version;const url=new URL('share.html',location.href);url.searchParams.set('token',share.token);const message=role==='staff-review'?'Staff review link':'Customer view link',persistenceNote=backend.mode==='local-adapter'?'browser-local link':'server-backed link';if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url.href).then(()=>$('#quoteResult').innerHTML=`${message} copied for <b>${state.revisionId}</b> as a ${persistenceNote}.`).catch(()=>prompt('Copy share link',url.href));}else prompt('Copy share link',url.href);syncProjectUi()}catch(e){$('#quoteResult').textContent=`Share link failed: ${e.message}`}}
function applySnapshot(x){if(!x)return;state.view=x.vehicle?.view||state.view;state.paint=x.vehicle?.paint||state.paint;state.wheelTyre=x.vehicle?.wheelTyre||state.wheelTyre;const ids=new Set((x.selections||[]).map(a=>a.id));data.accessories.forEach(a=>a.selected=ids.has(a.id));const lead=x.lead||{};[['leadName','name'],['leadPhone','phone'],['leadEmail','email'],['leadPostcode','postcode'],['leadNotes','notes']].forEach(([id,k])=>{const el=$('#'+id);if(el)el.value=lead[k]||''});if($('#leadContact'))$('#leadContact').value=lead.preferredContact||'phone';localStorage.setItem('pro4x4-last-concept',JSON.stringify(x));$('#export').disabled=false;}
async function loadRequestedProject(){const q=new URLSearchParams(location.search),pid=q.get('project'),rid=q.get('revision');if(!pid)return;try{const p=await backend.getProject(pid),r=revisionFromProject(p,rid||p.currentRevisionId);if(!r)throw new Error('Project revision not found');state.projectId=p.id;state.revisionId=r.id;state.projectVersion=p.version;state.projectRecord=p;applySnapshot(r.snapshot);$('#quoteResult').innerHTML=`Loaded <b>${p.id}</b> revision <b>${r.id}</b> from <b>${backend.mode}</b>. Saving will create a new immutable revision rather than overwriting it.`;}catch(e){$('#quoteResult').textContent=`Saved project/revision could not be loaded: ${e.message}`;}}
function renderAll(){renderView();renderPaint();renderWheel();renderBuild();renderCatalogue();renderReadiness();syncProjectUi();const cr=$('#catalogueRevision');if(cr)cr.textContent=`Catalogue ${data.catalogueMeta?.revision||'BASE-Y62-001'}`}
$$('.view-tabs button').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;renderView()});$('#wheelTyre').onchange=e=>{state.wheelTyre=e.target.value;renderView()};
$('#save').onclick=()=>saveConcept();$('#quote').onclick=queueSalesReview;$('#shareCustomer').onclick=()=>createShare('customer-view');$('#shareStaff').onclick=()=>createShare('staff-review');$('#export').onclick=()=>{const raw=localStorage.getItem('pro4x4-last-concept');if(raw)downloadPayload(JSON.parse(raw));};
async function initialise(){
  try{if(backend.mode!=='local-adapter'){const c=await backend.getCatalogue(data.vehicle.id);if(c?.vehicle){if(Array.isArray(c.vehicle.paints))data.vehicle.paints=JSON.parse(JSON.stringify(c.vehicle.paints));if(Array.isArray(c.vehicle.wheelTyres))data.vehicle.wheelTyres=JSON.parse(JSON.stringify(c.vehicle.wheelTyres));}if(Array.isArray(c?.accessories))data.accessories=JSON.parse(JSON.stringify(c.accessories));data.schemaVersion=c?.schemaVersion||data.schemaVersion;data.catalogueMeta={revision:c?.revision||'BASE-Y62-001',publishedAt:c?.publishedAt||null,publishedBy:c?.publishedBy||null,schemaVersion:c?.schemaVersion||data.schemaVersion};}}catch(e){console.warn('Catalogue backend unavailable; using local/base data',e)}
  await loadRequestedProject();renderAll();
}
initialise();
