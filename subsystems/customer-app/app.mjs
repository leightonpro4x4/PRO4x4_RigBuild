import {createSession} from '../visual-runtime/session.mjs';
import {startRuntime} from '../visual-runtime/ranger.mjs';
const get=async path=>{const r=await fetch(path);if(!r.ok)throw new Error(`Could not load ${path}`);return r.json();};
const [catalogue,fixture,mapping]=await Promise.all(['catalogue','alpha93-fixture','alpha93-mapping'].map(n=>get(`/subsystems/catalogue/${n}.json`)));
const $=id=>document.getElementById(id),suffix={predator:'Pred',rally:'Rally',lights:'Lights',scout:'Scout',powerboards:'Powerboards',tubrack:'Tubrack',rearbumper:'Rearbumper'};
let profile=localStorage.getItem('p4x4-a94-profile')==='checkpoint'?'checkpoint':'catalogue',session,state;
const storageKey=()=>`p4x4-a94-${profile}-${$('vehicle').value}`;
const productIdentity=row=>profile==='checkpoint'?`alpha93-regression-only::${row.visualProductId}`:row.catalogueIdentity;
function sync(message){
  state=session.current();localStorage.setItem(storageKey(),session.serialize());
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
  $('loadFullBuild').disabled=profile!=='checkpoint';$('quote').disabled=profile!=='checkpoint';
  $('result').textContent='Local checkpoint snapshots only. No production quote delivery or approval.';
  window.dispatchEvent(new CustomEvent('rigchange',{detail:state.render}));
}
function change(identity){const selected=session.current().decision.selected;const result=session.change({type:selected.includes(identity)?'remove':'add',identity});sync(result.transition.applied?null:result.transition.decision.reasons.map(r=>r.message).join(' '));
  for(const reason of result.transition.decision.reasons.filter(r=>r.code==='any-of-choice'))for(const alt of reason.alternatives){const b=document.createElement('button');b.textContent=`Choose ${alt.name}`;b.disabled=!alt.available;b.onclick=()=>change(alt.identity);$('choices').append(b);}
}
function initialize(){profile=$('profile').value;localStorage.setItem('p4x4-a94-profile',profile);$('vehicle').disabled=profile==='checkpoint';session=createSession({catalogue,fixture,mapping,profile,vehicleId:$('vehicle').value});session.restore(localStorage.getItem(storageKey()));sync();}
$('profile').value=profile;$('profile').onchange=initialize;$('vehicle').onchange=initialize;
for(const row of mapping.mappings)for(const prefix of ['toggle','card'])$(prefix+suffix[row.visualProductId]).onclick=()=>change(productIdentity(row));
$('loadFullBuild').onclick=()=>{session.reset();for(const row of mapping.mappings)session.change({type:'add',identity:productIdentity(row)});sync();};
$('resetBuild').onclick=()=>{session.reset();sync();};
for(const [button,target] of [['cat','catBody'],['vendor','vendorBody'],['touringCat','touringBody'],['touringVendor','touringVendorBody'],['sideCat','sideBody'],['sideVendor','sideVendorBody'],['tubCat','tubBody'],['tubVendor','tubVendorBody'],['rearCat','rearBody'],['rearVendor','rearVendorBody'],['testCat','testBody']])$(button).onclick=()=>$(target).classList.toggle('hidden');
$('resetView').onclick=()=>window.dispatchEvent(new Event('resetview'));$('front').onclick=()=>window.dispatchEvent(new CustomEvent('setview',{detail:'front'}));$('threeq').onclick=()=>window.dispatchEvent(new CustomEvent('setview',{detail:'3q'}));
$('quote').onclick=()=>{localStorage.setItem('p4x4-a94-local-checkpoint',JSON.stringify({classification:'local-regression-snapshot-only',selection:JSON.parse(session.serialize()),partsTotal:session.current().decision.products.reduce((n,p)=>n+(p.commercial.partsPrice??0),0)}));$('result').textContent='Local checkpoint saved. Not a production quote.';};
initialize();await startRuntime(()=>session.current().render);
