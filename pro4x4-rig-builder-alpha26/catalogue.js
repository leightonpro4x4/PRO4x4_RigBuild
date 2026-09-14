const localStore=window.PRO4X4_CATALOGUE_STORE;
const governance=window.PRO4X4_CATALOGUE_GOVERNANCE;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
if(window.PRO4X4_AUTH?.current?.().role==='customer')window.PRO4X4_AUTH.setLocalRole('fitment','PRO4X4 Fitment');
const backend=window.PRO4X4_BACKEND.active(),vehicleId='nissan-y62-warrior-2025';
let published=null,working=localStore.base(),activeId=working.accessories[0]?.id||null,category='ALL',dirty=false;
const componentKeys=['parts','labour','paint','freight','engineering'];
const clone=v=>JSON.parse(JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const csv=v=>(v||[]).join(', '),fromCsv=s=>String(s||'').split(',').map(x=>x.trim()).filter(Boolean),fromLines=s=>String(s||'').split(/\n+/).map(x=>x.trim()).filter(Boolean),numOrNull=v=>String(v).trim()===''?null:Number(v);
const issueText=x=>typeof x==='string'?x:(x?.message||String(x||''));
function active(){return working.accessories.find(a=>a.id===activeId)}
function sourceChecked(a){return governance?.sourceChecked?governance.sourceChecked(a):/verified|authoritative|exact-sku/i.test(a.source?.verification||'')}
function pricingGapCount(a){const required=a.pricingRequired||componentKeys;return required.filter(k=>a.pricing?.[k]==null).length}
function fitmentFlag(a){return a.status!=='confirmed'||Boolean(a.fitment?.reviewRequired)||(a.fitment?.conflicts||[]).length>0||!(a.fitment?.compatibleVehicleIds||[]).includes(working.vehicleId)}
function validateRecord(a){return governance?.validateRecord?governance.validateRecord(a,working,working.accessories.indexOf(a)):{errors:[],warnings:[]}}
function validateCatalogue(){return governance?.validateCatalogue?governance.validateCatalogue(working,{vehicleId}):{blocking:false,errors:[],warnings:[],records:[],summary:{errors:0,warnings:0}}}
function setPublishMessage(text,error=false){const el=$('#publishMessage');el.textContent=text;el.classList.toggle('error-copy',error)}
async function persistDraft(){working.schemaVersion='0.12.0';working.savedAt=new Date().toISOString();working=clone(await backend.saveCatalogueDraft(vehicleId,working));dirty=true;renderDraftState();renderKpis();renderBoards();return working}
function renderRevision(){
  $('#activeRevision').textContent=published?.revision||'BASE-Y62-001';
  const g=published?.governance?.validation,base=published?.publishedAt?`Published ${new Date(published.publishedAt).toLocaleString('en-AU')} · ${published.publishedBy||'staff'} · ${backend.mode}`:`Code baseline · ${backend.mode}`;
  $('#revisionMeta').textContent=g?`${base} · governed ${g.summary?.errors||0}E/${g.summary?.warnings||0}W`:base;
}
function renderDraftState(){const el=$('#draftState');el.textContent=dirty?'DRAFT CHANGES SAVED':'NO DRAFT CHANGES';el.classList.toggle('draft-live',dirty)}
function renderKpis(){
  const a=working.accessories,v=validateCatalogue();
  $('#catTotal').textContent=a.length;$('#catConfirmed').textContent=a.filter(x=>x.status==='confirmed'&&!x.fitment?.reviewRequired).length;$('#catReview').textContent=a.filter(fitmentFlag).length;$('#catPricing').textContent=a.filter(x=>pricingGapCount(x)>0).length;$('#catSources').textContent=a.filter(sourceChecked).length;
  const gate=$('#catGate');gate.textContent=v.blocking?`${v.summary.errors} BLOCKER${v.summary.errors===1?'':'S'}`:'PASS';gate.className=v.blocking?'error-count':'source-ok';
}
function renderFilters(){const cats=['ALL',...new Set(working.accessories.map(a=>a.category.toUpperCase()))],host=$('#catalogueFilters');host.innerHTML='';cats.forEach(c=>{const b=document.createElement('button');b.textContent=c;b.className=category===c?'active':'';b.onclick=()=>{category=c;renderRows()};host.appendChild(b)})}
function renderRows(){
  const q=$('#catalogueSearch').value.trim().toLowerCase(),status=$('#catalogueStatus').value,rows=working.accessories.filter(a=>(category==='ALL'||a.category.toUpperCase()===category)&&(status==='ALL'||a.status===status)&&(!q||[a.brand,a.name,a.sku,a.category].some(v=>String(v).toLowerCase().includes(q)))),host=$('#catalogueRows');host.innerHTML='';
  if(!rows.length){host.innerHTML='<div class="empty-queue">No catalogue records match these filters.</div>';return}
  rows.forEach(a=>{const v=validateRecord(a),el=document.createElement('button');el.className=`catalogue-row ${a.id===activeId?'active ':''}${a.status}`;el.innerHTML=`<div class="row-main"><span class="row-brand">${esc(a.brand)} · ${esc(a.category)}</span><b>${esc(a.name)}</b><small>${esc(a.sku)}</small></div><div class="row-flags"><span class="mini-state ${a.status}">${a.status}</span><span>${pricingGapCount(a)} price gaps</span><span class="${sourceChecked(a)?'source-ok':'source-warn'}">${sourceChecked(a)?'source ✓':'source ?'}</span>${v.errors.length?`<span class="error-count">${v.errors.length} blocker${v.errors.length===1?'':'s'}</span>`:''}</div>`;el.onclick=()=>{activeId=a.id;renderRows();renderEditor()};host.appendChild(el)})
}
function editorField(label,id,value,type='text',extra=''){return `<label class="editor-field"><span>${label}</span><input id="${id}" type="${type}" value="${esc(value??'')}" ${extra}></label>`}
function renderEditor(){
  const a=active(),host=$('#catalogueEditor');if(!a){host.innerHTML='<div class="empty-queue">Select a catalogue record.</div>';return}
  const v=validateRecord(a),anyOf=a.fitment?.anyOfRequiredParts||[],conditions=a.fitment?.conditions||[];
  host.innerHTML=`<div class="editor-head"><div><div class="eyebrow">${esc(a.id)}</div><h2>${esc(a.name)}</h2><div class="small">${esc(a.brand)} · ${esc(a.sku)}</div></div><span class="mini-state ${a.status}">${a.status}</span></div>
<div class="validation-box ${v.errors.length?'has-errors':'ok'}"><b>${v.errors.length?`${v.errors.length} governance blocker${v.errors.length>1?'s':''}`:'Record structure passes governance'}</b>${v.errors.map(x=>`<div>• ${esc(issueText(x))}</div>`).join('')}${v.warnings.map(x=>`<div class="validation-warn">• ${esc(issueText(x))}</div>`).join('')}</div>
<div class="editor-section"><h4>Identity</h4><div class="editor-grid">${editorField('Product name','edName',a.name)}${editorField('Brand','edBrand',a.brand)}${editorField('SKU','edSku',a.sku)}${editorField('Category','edCategory',a.category)}<label class="editor-field"><span>Fitment status</span><select id="edStatus"><option value="confirmed" ${a.status==='confirmed'?'selected':''}>Confirmed</option><option value="engineering" ${a.status==='engineering'?'selected':''}>Engineering review</option><option value="blocked" ${a.status==='blocked'?'selected':''}>Blocked / custom fit</option></select></label>${editorField('Visual layer key','edLayer',a.layer)}</div></div>
<div class="editor-section"><h4>Component pricing <small>blank = quote required only when marked required</small></h4><div class="pricing-editor">${componentKeys.map(k=>editorField(k[0].toUpperCase()+k.slice(1),`price-${k}`,a.pricing?.[k]??'','number','min="0" step="0.01"')).join('')}</div><div class="pricing-required">${componentKeys.map(k=>`<label class="checkline compact-check"><input type="checkbox" data-required-price="${k}" ${(a.pricingRequired||componentKeys).includes(k)?'checked':''}> ${k} required for quote</label>`).join('')}</div></div>
<div class="editor-section"><h4>Fitment rules <small>unknown/engineering states are retained, never inferred away</small></h4><label class="checkline"><input id="edReview" type="checkbox" ${a.fitment?.reviewRequired?'checked':''}> Require staff fitment / engineering review</label><div class="editor-grid one"><label class="editor-field"><span>Compatible vehicle IDs</span><input id="edCompatible" value="${esc(csv(a.fitment?.compatibleVehicleIds))}"></label><label class="editor-field"><span>Required accessory IDs — ALL required</span><input id="edRequired" value="${esc(csv(a.fitment?.requiredParts))}" placeholder="e.g. raslarr-rear"></label><label class="editor-field"><span>Alternative accessory IDs — ANY ONE required</span><input id="edAnyOfRequired" value="${esc(csv(anyOf))}" placeholder="e.g. predator-bar, toro-bar"></label><label class="editor-field"><span>Conflicts / gates</span><input id="edConflicts" value="${esc(csv(a.fitment?.conflicts))}" placeholder="e.g. supplier-excludes-warrior"></label><label class="editor-field"><span>Vehicle / setup conditions — one per line</span><textarea id="edConditions" placeholder="Factory towbar required&#10;Camera relocation required">${esc(conditions.join('\n'))}</textarea></label><label class="editor-field"><span>Finish options</span><input id="edFinish" value="${esc(csv(a.finishOptions))}"></label></div><div class="editor-grid">${editorField('Weight kg','edWeight',a.weightKg??'','number','min="0" step="0.01"')}${editorField('Install hours min','edInstallMin',a.install?.estimateHoursMin??'','number','min="0" step="0.25"')}${editorField('Install hours max','edInstallMax',a.install?.estimateHoursMax??'','number','min="0" step="0.25"')}</div></div>
<div class="editor-section"><h4>Source truth</h4><div class="editor-grid one">${editorField('Authority','edAuthority',a.source?.authority)}${editorField('Source URL','edUrl',a.source?.url,'url')}${editorField('Verification state','edVerification',a.source?.verification)}<label class="editor-field"><span>Internal / customer note</span><textarea id="edNote">${esc(a.note||'')}</textarea></label></div>${a.source?.url?`<a class="source-link source-open" target="_blank" rel="noopener" href="${esc(a.source.url)}">OPEN SOURCE ↗</a>`:''}</div>
<div class="editor-actions"><button class="secondary" id="revertRecord">REVERT RECORD</button><button class="primary" id="saveRecord">SAVE TO GOVERNED DRAFT</button></div>`;
  $('#saveRecord').onclick=saveActive;$('#revertRecord').onclick=revertActive;
}
function collectActive(){
  const a=active();if(!a)return null;
  a.name=$('#edName').value.trim();a.brand=$('#edBrand').value.trim();a.sku=$('#edSku').value.trim();a.category=$('#edCategory').value.trim();a.status=$('#edStatus').value;a.layer=$('#edLayer').value.trim();
  a.pricing=a.pricing||{};componentKeys.forEach(k=>a.pricing[k]=numOrNull($(`#price-${k}`).value));a.pricingRequired=componentKeys.filter(k=>$(`[data-required-price="${k}"]`)?.checked);
  a.fitment={...(a.fitment||{}),reviewRequired:$('#edReview').checked,compatibleVehicleIds:fromCsv($('#edCompatible').value),requiredParts:fromCsv($('#edRequired').value),anyOfRequiredParts:fromCsv($('#edAnyOfRequired').value),conflicts:fromCsv($('#edConflicts').value),conditions:fromLines($('#edConditions').value)};
  a.finishOptions=fromCsv($('#edFinish').value);a.weightKg=numOrNull($('#edWeight').value);a.install={...(a.install||{}),estimateHoursMin:numOrNull($('#edInstallMin').value),estimateHoursMax:numOrNull($('#edInstallMax').value),sourceVerified:Boolean(a.install?.sourceVerified)};
  a.source={...(a.source||{}),authority:$('#edAuthority').value.trim(),url:$('#edUrl').value.trim(),verification:$('#edVerification').value.trim()};a.note=$('#edNote').value.trim();return a;
}
async function saveActive(){
  const a=collectActive();if(!a)return;
  try{await persistDraft();renderRows();renderEditor();const v=validateCatalogue();setPublishMessage(`${a.name} saved to ${backend.mode} governed draft. ${v.summary.errors?`${v.summary.errors} publish blocker${v.summary.errors===1?'':'s'} remain.`:'Publish gate passes.'}`,Boolean(v.summary.errors))}catch(e){setPublishMessage(`Draft save failed: ${e.message}`,true)}
}
async function revertActive(){const source=published||localStore.base(),original=source.accessories.find(x=>x.id===activeId);if(!original)return;const idx=working.accessories.findIndex(x=>x.id===activeId);working.accessories[idx]=clone(original);try{await persistDraft();renderRows();renderEditor();setPublishMessage('Record reverted to active published/base value and saved into draft.')}catch(e){setPublishMessage(`Revert failed: ${e.message}`,true)}}
function renderGovernanceState(v){
  const el=$('#catalogueGovernanceState'),persisted=working.governance?.validation,who=persisted?.validatedBy?.displayName||persisted?.validatedBy?.actorId||null,when=persisted?.validatedAt?new Date(persisted.validatedAt).toLocaleString('en-AU'):null;
  el.className=`governance-strip ${v.blocking?'blocked':v.summary.warnings?'warn':''}`;
  el.innerHTML=v.blocking?`<b>PUBLISH BLOCKED · ${v.summary.errors} ERROR${v.summary.errors===1?'':'S'}</b> · Draft may be saved, but the shared runtime will reject publication until all blockers are resolved.${persisted?` <span>Last persisted ${esc(persisted.stage||'draft')} validation: ${esc(who||'staff')} · ${esc(when||'time unavailable')}.</span>`:''}`:`<b>PUBLISH GATE PASS</b> · ${v.accessoryCount} records structurally governed${v.summary.warnings?` · ${v.summary.warnings} warning${v.summary.warnings===1?'':'s'} retained for quote/source visibility`:''}.${persisted?` <span>Last persisted ${esc(persisted.stage||'draft')} validation: ${esc(who||'staff')} · ${esc(when||'time unavailable')}.</span>`:''}`;
  const button=$('#publishCatalogue');if(button)button.disabled=Boolean(v.blocking);
}
function renderBoards(){
  const fit=working.accessories.filter(fitmentFlag),price=working.accessories.filter(a=>pricingGapCount(a)>0),sources=working.accessories.filter(a=>!sourceChecked(a)),v=validateCatalogue();
  $('#fitmentIssues').innerHTML=fit.length?fit.map(a=>`<button data-jump="${esc(a.id)}" class="issue-row"><b>${esc(a.name)}</b><span>${a.status}${a.fitment?.reviewRequired?' · review required':''}${(a.fitment?.conflicts||[]).length?` · ${(a.fitment.conflicts).join(', ')}`:''}${(a.fitment?.anyOfRequiredParts||[]).length?` · any of: ${a.fitment.anyOfRequiredParts.join(' / ')}`:''}</span></button>`).join(''):'<div class="clean-state">No fitment flags.</div>';
  $('#pricingIssues').innerHTML=price.length?price.map(a=>`<button data-jump="${esc(a.id)}" class="issue-row"><b>${esc(a.name)}</b><span>${(a.pricingRequired||componentKeys).filter(k=>a.pricing?.[k]==null).join(', ')}</span></button>`).join(''):'<div class="clean-state">All component pricing loaded.</div>';
  $('#sourceIssues').innerHTML=sources.length?sources.map(a=>`<button data-jump="${esc(a.id)}" class="issue-row"><b>${esc(a.name)}</b><span>${esc(a.source?.verification||'not verified')}</span></button>`).join(''):'<div class="clean-state">Every source marked verified.</div>';
  const grouped=new Map();for(const x of v.errors){const key=x.recordId||'catalogue';if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(x)}
  $('#governanceIssues').innerHTML=grouped.size?[...grouped.entries()].map(([id,issues])=>{const a=working.accessories.find(x=>x.id===id),label=a?.name||id;return `<button ${a?`data-jump="${esc(id)}"`:''} class="issue-row"><b>${esc(label)}</b><span>${issues.map(x=>esc(issueText(x))).join(' · ')}</span></button>`}).join(''):'<div class="clean-state">No publish blockers.</div>';
  $$('[data-jump]').forEach(b=>b.onclick=()=>{activeId=b.dataset.jump;renderRows();renderEditor();document.querySelector('.catalogue-admin-grid').scrollIntoView({behavior:'smooth'})});
  renderGovernanceState(v);
}
async function resetDraft(){working=clone(published||localStore.base());try{await backend.discardCatalogueDraft(vehicleId);dirty=false;activeId=working.accessories[0]?.id||null;renderAll();setPublishMessage('Draft reset to the active published/base catalogue.')}catch(e){setPublishMessage(`Reset failed: ${e.message}`,true)}}
function exportCatalogue(){const validation=validateCatalogue(),payload={...working,exportedAt:new Date().toISOString(),validation},blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`PRO4X4-Y62-catalogue-${working.revision||'draft'}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
async function publishCatalogue(){
  const v=validateCatalogue();if(v.blocking){setPublishMessage(`Publish blocked: ${v.summary.errors} governance error${v.summary.errors===1?'':'s'}. Resolve the Governance blockers column first.`,true);return}
  try{const out=await backend.publishCatalogue(vehicleId,working);published=clone(out);working=clone(out);dirty=false;renderAll();setPublishMessage(`${out.revision} published through ${backend.mode}. Shared governance gate passed; ${v.summary.warnings} non-blocking warning${v.summary.warnings===1?'':'s'} retained.`)}catch(e){const details=(e.fieldErrors||[]).slice(0,3).map(x=>x.message).join(' · ');setPublishMessage(`Publish failed: ${e.message}${details?` · ${details}`:''}`,true)}
}
function renderAll(){renderRevision();renderDraftState();renderKpis();renderFilters();renderRows();renderEditor();renderBoards()}
async function initialise(){
  try{published=await backend.getCatalogue(vehicleId)||localStore.base()}catch{published=localStore.base()}
  try{const draft=await backend.getCatalogueDraft(vehicleId);working=clone(draft||published);dirty=Boolean(draft)}catch{working=clone(published);dirty=false}
  activeId=working.accessories[0]?.id||null;renderAll();setPublishMessage(`Catalogue loaded via ${backend.mode}. Shared governance policy ${governance?.policyVersion||'unavailable'}.`)
}
$('#catalogueSearch').addEventListener('input',renderRows);$('#catalogueStatus').addEventListener('change',renderRows);$('#resetDraft').onclick=resetDraft;$('#exportCatalogue').onclick=exportCatalogue;$('#publishCatalogue').onclick=publishCatalogue;initialise();
