import {createSession} from '../visual-runtime/session.mjs';
import {startRuntime} from '../visual-runtime/ranger.mjs';
import {createProjectWorkflow} from './projects.mjs';
const get=async path=>{const r=await fetch(path);if(!r.ok)throw new Error(`Could not load ${path}`);return r.json();};
const [catalogue,fixture,mapping]=await Promise.all(['catalogue','alpha93-fixture','alpha93-mapping'].map(n=>get(`/subsystems/catalogue/${n}.json`)));
const $=id=>document.getElementById(id),suffix={predator:'Pred',rally:'Rally',lights:'Lights',scout:'Scout',powerboards:'Powerboards',tubrack:'Tubrack',rearbumper:'Rearbumper'};
let profile=localStorage.getItem('p4x4-a94-profile')==='checkpoint'?'checkpoint':'catalogue',session,state;
const request=async(url,body)=>{const response=await fetch(url,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},credentials:'same-origin',body:body?JSON.stringify(body):undefined});const result=await response.json();if(!response.ok)throw new Error(result.message||result.error);return result;};
const projects=createProjectWorkflow(request);
const panel=document.createElement('section');panel.className='quote';panel.innerHTML='<b>Saved projects and immutable revisions</b><p id="projectState">Unsaved draft — local cache is not server authority</p><button id="saveProject">Save revision</button> <button id="newProject">Save as new project</button> <button id="refreshProjects">Refresh projects</button><select id="projectList" aria-label="Saved project"></select><select id="revisionList" aria-label="Saved revision"></select><button id="loadRevision">Load selected revision</button><button id="migrateRevision">Revalidate as new revision</button><button id="shareRevision">Share saved revision</button><button id="importLegacy">Import old Alpha93 local selection as checkpoint</button><div id="projectReceipt" aria-live="polite"></div>';
document.querySelector('.wrap').append(panel);
function workflowUI(){const p=projects.state();$('projectState').textContent=p.saved?`${p.saved.snapshot.projectId} / ${p.saved.snapshot.revisionId} · ${p.dirty?'UNSAVED CHANGES':'SAVED'}${p.saved.migrationRequired?' · MIGRATION REQUIRED':''}`:'UNSAVED DRAFT · local cache is not authority';$('quote').disabled=!p.saved||p.dirty||p.saved.migrationRequired||profile==='checkpoint';$('quote').textContent='REQUEST REVIEW OF SAVED REVISION';}
const storageKey=()=>`p4x4-a94-${profile}-${$('vehicle').value}`;
const productIdentity=row=>profile==='checkpoint'?`alpha93-regression-only::${row.visualProductId}`:row.catalogueIdentity;
function sync(message){
  const persisted=projects.state();state=persisted.saved&&!persisted.dirty?{decision:persisted.saved.snapshot.decision,render:persisted.saved.snapshot.renderState}:session.current();localStorage.setItem(storageKey(),session.serialize());
  const {decision}=state,chosen=decision.products;
  const sum=chosen.reduce((n,p)=>n+(p.commercial.partsPrice??0),0),unknown=chosen.filter(p=>p.commercial.partsPrice===null).length;
  $('count').textContent=`${chosen.length} PRODUCTS`;$('total').textContent=`A$${sum.toLocaleString()} KNOWN PARTS${unknown?' + UNPRICED':''}`;
  $('qparts').textContent=$('total').textContent;$('fitted').textContent='INSTALL / REVIEW REQUIRED';$('build').textContent=profile==='checkpoint'?'ALPHA 93 CHECKPOINT FIXTURE':'AUTHORITATIVE CATALOGUE DRAFT';
  $('decisionReasons').textContent=message||decision.reasons.map(r=>r.message).join(' ')||'No open domain requirements. Visual output remains preview only.';
  if($('vehicle').value.startsWith('nissan')&&profile==='catalogue')$('decisionReasons').textContent+=' Y62 catalogue: 26 products; no approved 3D base or fallback.';
  $('quoteLines').textContent=chosen.map(p=>p.identity).join(' | ')||'No products selected.';
  $('choices').replaceChildren();
  const y62=$('vehicle').value.startsWith('nissan')&&profile==='catalogue';
  document.querySelector('.badge').textContent=y62?'Y62 · CATALOGUE ONLY · NO 3D BASE':'RANGER · PRESERVED PREVIEW · DRAG / PINCH';
  if(y62)for(const p of catalogue.products.filter(p=>p.vehicleId===$('vehicle').value)){const b=document.createElement('button');b.textContent=`${decision.selected.includes(p.identity)?'Remove':'Add'} ${p.data.name} · ${p.data.status}`;b.disabled=p.data.status==='blocked';b.onclick=()=>change(p.identity);$('choices').append(b);}
  for(const row of mapping.mappings){const id=productIdentity(row),on=decision.selected.includes(id),unavailable=profile==='catalogue'&&(!id||$('vehicle').value!==mapping.vehicleId);for(const prefix of ['toggle','card']){const b=$(prefix+suffix[row.visualProductId]);b.disabled=unavailable;b.textContent=unavailable?'UNAVAILABLE IN THIS CATALOGUE':`${on?'REMOVE':'ADD'} ${fixture.products[row.visualProductId].name}`;}
    const card=$('card'+suffix[row.visualProductId]).closest('.card'),p=catalogue.products.find(p=>p.identity===id)?.data,price=profile==='checkpoint'?fixture.products[row.visualProductId].price:p?.price??p?.pricing?.parts;
    card.querySelector('.price').textContent=Number.isFinite(price)?`A$${price.toLocaleString()}${profile==='checkpoint'?' FIXTURE':''}`:'PRICE UNRESOLVED';
    card.querySelector('p').textContent=profile==='checkpoint'?`Alpha 93 regression fixture · ${row.sku}`:`${row.sku} · ${row.unresolved.join(' ')}`;
  }
  $('loadFullBuild').disabled=profile!=='checkpoint';workflowUI();
  $('result').textContent='Quotes bind to saved server revisions. Unresolved prices or fitment prevent finalisation.';
  window.dispatchEvent(new CustomEvent('rigchange',{detail:state.render}));
}
function change(identity){const selected=session.current().decision.selected;const result=session.change({type:selected.includes(identity)?'remove':'add',identity});if(result.transition.applied)projects.changed();sync(result.transition.applied?null:result.transition.decision.reasons.map(r=>r.message).join(' '));
  for(const reason of result.transition.decision.reasons.filter(r=>r.code==='any-of-choice'))for(const alt of reason.alternatives){const b=document.createElement('button');b.textContent=`Choose ${alt.name}`;b.disabled=!alt.available;b.onclick=()=>change(alt.identity);$('choices').append(b);}
}
function initialize(){projects.detach();profile=$('profile').value;localStorage.setItem('p4x4-a94-profile',profile);$('vehicle').disabled=profile==='checkpoint';session=createSession({catalogue,fixture,mapping,profile,vehicleId:$('vehicle').value});session.restore(localStorage.getItem(storageKey()));sync();}
$('profile').value=profile;$('profile').onchange=initialize;$('vehicle').onchange=initialize;
for(const row of mapping.mappings)for(const prefix of ['toggle','card'])$(prefix+suffix[row.visualProductId]).onclick=()=>change(productIdentity(row));
$('loadFullBuild').onclick=()=>{projects.changed();session.reset();for(const row of mapping.mappings)session.change({type:'add',identity:productIdentity(row)});sync();};
$('resetBuild').onclick=()=>{projects.changed();session.reset();sync();};
for(const [button,target] of [['cat','catBody'],['vendor','vendorBody'],['touringCat','touringBody'],['touringVendor','touringVendorBody'],['sideCat','sideBody'],['sideVendor','sideVendorBody'],['tubCat','tubBody'],['tubVendor','tubVendorBody'],['rearCat','rearBody'],['rearVendor','rearVendorBody'],['testCat','testBody']])$(button).onclick=()=>$(target).classList.toggle('hidden');
$('resetView').onclick=()=>window.dispatchEvent(new Event('resetview'));$('front').onclick=()=>window.dispatchEvent(new CustomEvent('setview',{detail:'front'}));$('threeq').onclick=()=>window.dispatchEvent(new CustomEvent('setview',{detail:'3q'}));
const run=fn=>async()=>{try{await fn();}catch(e){$('projectReceipt').textContent=e.message;}};
async function history(){const p=await projects.history($('projectList').value);$('revisionList').replaceChildren(...p.revisions.map(r=>{const o=document.createElement('option');o.value=r.revision_id;o.textContent=r.revision_id;return o;}));}
async function refresh(){const list=await projects.list();$('projectList').replaceChildren(...list.map(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.title+' · '+p.id;return o;}));if(list.length)await history();}
function applySaved(saved){const snap=saved.snapshot;profile=snap.profile;$('profile').value=profile;if(profile==='catalogue')$('vehicle').value=snap.vehicle.id;$('vehicle').disabled=profile==='checkpoint';session=createSession({catalogue,fixture,mapping,profile,vehicleId:snap.vehicle.id});session.restore(JSON.stringify({schemaVersion:1,profile,vehicleId:snap.vehicle.id,selected:snap.selected}));state={decision:snap.decision,render:snap.renderState};sync();window.dispatchEvent(new CustomEvent('rigchange',{detail:snap.renderState}));localStorage.setItem('p4x4-a94-server-pointer',JSON.stringify({projectId:snap.projectId,revisionId:snap.revisionId}));$('projectReceipt').textContent=`Server revision ${snap.revisionId} · checksum ${saved.checksum}`;}
for(const [id,newProject] of [['saveProject',false],['newProject',true]])$(id).onclick=run(async()=>{const saved=await projects.save({profile,vehicleId:state.decision.vehicleId,selected:state.decision.selected},newProject);applySaved(saved);await refresh();});
$('refreshProjects').onclick=run(refresh);$('projectList').onchange=run(history);
$('loadRevision').onclick=run(async()=>{if(projects.state().dirty&&!confirm('Discard unsaved changes and load this immutable server revision?'))return;applySaved(await projects.load($('projectList').value,$('revisionList').value,{discardDirty:true}));});
$('migrateRevision').onclick=run(async()=>{if(confirm('Revalidate this saved selection against the current catalogue as a new revision?'))applySaved(await projects.migrate());});
$('shareRevision').onclick=run(async()=>{const s=await projects.share();$('projectReceipt').textContent=`Pinned revision link: ${location.origin}/api/public-shares/${s.token}`;});
$('importLegacy').onclick=run(async()=>{if(!confirm('Import old local selection as an untrusted Alpha93 checkpoint? It cannot become a production quote.'))return;const selected=JSON.parse(localStorage.getItem('p4x4-a87')||'null');if(!Array.isArray(selected))throw new Error('No supported Alpha93 local selection found.');applySaved(await projects.importLegacy('p4x4-a87',selected));await refresh();});
$('quote').onclick=run(async()=>{const q=await projects.quote({name:$('name').value,email:$('email').value,phone:$('phone').value,notes:$('notes').value});$('result').textContent=`SERVER QUOTE ${q.id} · ${q.quoteReady?'ready for authorised finaliser':'review / pricing required'} · pinned ${q.revisionId}`;});
window.addEventListener('beforeunload',e=>{if(projects.state().dirty&&projects.state().saved){e.preventDefault();e.returnValue='';}});
initialize();try{await projects.init();await refresh();const pointer=JSON.parse(localStorage.getItem('p4x4-a94-server-pointer')||'null');if(pointer)applySaved(await projects.load(pointer.projectId,pointer.revisionId,{discardDirty:true}));}catch(e){$('projectReceipt').textContent='Server workflow unavailable: '+e.message;}
await startRuntime(()=>state.render);
