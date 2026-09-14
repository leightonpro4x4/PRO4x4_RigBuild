'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const session=require('../customer-browse-session.js');
const root=path.join(__dirname,'..');

const products=[
  {id:'oa-bar',category:'Protection',brand:'Offroad Animal'},
  {id:'mcc-step',category:'Protection',brand:'MCC 4x4'},
  {id:'darche-chair',category:'Touring',brand:'Darche'}
];
const selected=new Set(['mcc-step','darche-chair']);

assert.deepEqual(session.normalize({category:'PROTECTION',vendor:'MCC 4x4',focusProductId:'mcc-step'},products,selected),{
  category:'PROTECTION',vendor:'MCC 4x4',focusProductId:'mcc-step'
});
assert.deepEqual(session.normalize({category:'MISSING',vendor:'Ghost',focusProductId:'mcc-step'},products,selected),{
  category:'ALL',vendor:'ALL',focusProductId:'mcc-step'
});
assert.deepEqual(session.normalize({category:'PROTECTION',vendor:'Offroad Animal',focusProductId:'mcc-step'},products,selected),{
  category:'PROTECTION',vendor:'Offroad Animal',focusProductId:null
});
assert.deepEqual(session.normalize({category:'PROTECTION',vendor:'MCC 4x4',focusProductId:'oa-bar'},products,selected),{
  category:'PROTECTION',vendor:'MCC 4x4',focusProductId:null
});
assert.deepEqual(session.selectedFallback(products,selected),{
  category:'TOURING',vendor:'Darche',focusProductId:'darche-chair'
});

const store=new Map();
const storage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)||null};
const saved=session.save(storage,'P4X4-PROJ-1','REV-3',{category:'PROTECTION',vendor:'MCC 4x4',focusProductId:'mcc-step'},products,selected);
assert.equal(saved.focusProductId,'mcc-step');
assert.deepEqual(session.load(storage,'P4X4-PROJ-1','REV-3',products,selected),saved);
assert.deepEqual(session.load(storage,'P4X4-PROJ-1','REV-4',products,selected),session.selectedFallback(products,selected),'presentation state must be revision-scoped');

// The read-only helper must never mutate catalogue or selection ownership.
const beforeProducts=JSON.stringify(products),beforeSelected=[...selected];
session.normalize(saved,products,selected);session.selectedFallback(products,selected);session.save(storage,'P','R',saved,products,selected);
assert.equal(JSON.stringify(products),beforeProducts);
assert.deepEqual([...selected],beforeSelected);

// Real governed Ranger proof: stored context resolves against existing catalogue IDs only.
global.window=global;
require('../data-ranger.js');
const ranger=global.RANGER_DATA.accessories;
const rangerSelected=new Set(['mcc-309bsbk','mcc-309rp']);
const rangerContext=session.normalize({category:'PROTECTION',vendor:'MCC 4x4',focusProductId:'mcc-309rp'},ranger,rangerSelected);
assert.deepEqual(rangerContext,{category:'PROTECTION',vendor:'MCC 4x4',focusProductId:'mcc-309rp'});

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.ok(html.indexOf('customer-browse-session.js')<html.indexOf('merged-app.js'),'browse-session helper must load before the customer app');
assert.match(app,/snap=\(\)=>\(\{vehicle:state\.vehicle,selected:\[\.\.\.state\.selected\],browse:/,'undo history must retain presentation-only browse context');
assert.match(app,/applyBrowse\(s\.browse\|\|browseSession\?\.selectedFallback/,'undo/redo must restore the captured browse context rather than reset to ALL');
assert.match(app,/function applySnapshot\(x,browseContext=null\)/,'immutable project load must accept separately resolved presentation context');
assert.match(app,/browseSession\?\.load\?\.\(localStorage,p\.id,r\.id/,'saved project load must recover UI context by exact project + revision');
assert.match(app,/if\(!state\.projectId\|\|!state\.revisionId\|\|state\.dirty\)return null/,'dirty edits must not overwrite the last immutable revision browse cache');
assert.match(app,/rememberBrowseForSavedRevision\(\);history\.replaceState/,'a newly saved immutable revision must receive its own presentation context cache');
assert.match(app,/Browse context restored to/,'customer must receive explicit load-state messaging');
assert.match(css,/\.merge-product\.restore-focus/,'restored selected-product context must have a visible focus state');

const payloadFn=app.slice(app.indexOf('function buildPayload()'),app.indexOf('function renderHandoffVisualLayers'));
assert.doesNotMatch(payloadFn,/browse|category|vendor|focusProductId/,'presentation-only browse state must never enter the immutable build snapshot');
assert.doesNotMatch(fs.readFileSync(path.join(root,'customer-browse-session.js'),'utf8'),/\.push\(|\.splice\(|\.brand\s*=|\.category\s*=/,'browse-session helper must not write catalogue ownership');

console.log('WF1 Alpha 26 browse-state + selected-state recovery: PASS');
