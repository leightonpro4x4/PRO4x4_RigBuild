'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const nav=require('../customer-revision-navigation.js');
const root=path.join(__dirname,'..');

const project={
  id:'P4X4-PROJ-TEST',currentRevisionId:'R0003',version:3,revisions:[
    {id:'R0001',number:1,createdAt:'2026-09-13T01:00:00.000Z',summary:{itemCount:1,knownSubtotal:1000,vehicleLabel:'2025 Ford Ranger'},snapshot:{selections:[{id:'a'}]}},
    {id:'R0002',number:2,createdAt:'2026-09-13T02:00:00.000Z',summary:{itemCount:2,knownSubtotal:2000,vehicleLabel:'2025 Ford Ranger'},snapshot:{selections:[{id:'a'},{id:'b'}]}},
    {id:'R0003',number:3,createdAt:'2026-09-13T03:00:00.000Z',summary:{itemCount:3,knownSubtotal:3000,vehicleLabel:'2025 Ford Ranger'},snapshot:{selections:[{id:'a'},{id:'b'},{id:'c'}]}}
  ]
};

const m=nav.model(project,'R0002');
assert.equal(m.revisionCount,3);
assert.equal(m.activeRevisionId,'R0002');
assert.equal(m.currentRevisionId,'R0003');
assert.equal(m.isHistorical,true);
assert.equal(m.previousRevisionId,'R0001');
assert.equal(m.nextRevisionId,'R0003');
assert.equal(m.revisions[1].active,true);
assert.equal(m.revisions[2].projectCurrent,true);
assert.equal(m.revisions[1].itemCount,2);

assert.equal(nav.exact(project,'R0002').id,'R0002');
assert.equal(nav.exact(project,'DOES-NOT-EXIST'),null,'revision navigation must never silently fall back to current/latest');
assert.deepEqual(nav.intent(project,'R0002','R0001',false).requiresConfirmation,false);
assert.deepEqual(nav.intent(project,'R0002','R0001',true).requiresConfirmation,true);
assert.equal(nav.intent(project,'R0002','R0002',true).reason,'already-active');
assert.equal(nav.intent(project,'R0002','R9999',false).reason,'revision-not-found');

const frozen=JSON.stringify(project);nav.model(project,'R0002');nav.exact(project,'R0001');nav.intent(project,'R0002','R0003',true);assert.equal(JSON.stringify(project),frozen,'WF1 revision helper must remain read-only');

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.ok(html.indexOf('customer-revision-navigation.js')<html.indexOf('merged-app.js'),'revision helper must load before customer app');
assert.match(html,/id="revisionNavigator"/);
assert.match(html,/id="revisionGuard"/);
assert.match(html,/DISCARD UNSAVED \+ LOAD/);
assert.match(app,/function requestRevisionNavigation\(targetRevisionId\)/);
assert.match(app,/intent\?\.\(state\.projectRecord,state\.revisionId,targetRevisionId,state\.dirty\)/,'dirty-state decision must be based on current immutable project + active revision');
assert.match(app,/function loadProjectRevision\(revisionId,\{discardDirty=false\}=\{\}\)/);
assert.match(app,/revisionNav\?\.exact\?\.\(state\.projectRecord,intent\.targetRevisionId\)/,'navigation must load one exact revision');
assert.match(app,/applySnapshot\(r\.snapshot,browse\)/,'navigation must render the persisted immutable snapshot');
assert.match(app,/history\.replaceState\(null,'',`index\.html\?project=/,'URL must pin exact project + revision after navigation');
assert.match(app,/Project history was not changed\. Any edit from this checkpoint will save as a new revision/);
assert.match(app,/historical checkpoint/,'dirty edit messaging must identify branch-from-history behavior');
assert.match(css,/\.merge-revision-nav/);
assert.match(css,/\.merge-revision-warning/);

const loadFn=app.slice(app.indexOf('async function loadProjectRevision'),app.indexOf('async function confirmRevisionNavigation'));
assert.doesNotMatch(loadFn,/restoreProjectRevision|saveProjectRevision|createBuild|createProjectShare/,'revision browsing must not mutate backend/project/quote state');
assert.doesNotMatch(loadFn,/buildPayload\(/,'revision browsing must not rebuild catalogue or fitment truth');

console.log('WF1 Alpha 26 immutable revision navigation + dirty-state protection: PASS');
