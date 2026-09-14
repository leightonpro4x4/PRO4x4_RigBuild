'use strict';
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {RigDatabase}=require('../server/database');
const governance=require('../catalogue-governance');
const root=path.join(__dirname,'..');
const actor={actorId:'wf4-fitment-editor',displayName:'WF4 Fitment Editor',role:'fitment'};
const clone=v=>JSON.parse(JSON.stringify(v));
function loadBase(){const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'data-y62.js'),'utf8'),context);const d=context.window.RIG_DATA;return {schemaVersion:d.schemaVersion,vehicleId:d.vehicle.id,vehicle:clone(d.vehicle),accessories:clone(d.accessories),revision:'BASE-Y62-001'};}
const base=loadBase();
const baseline=governance.validateCatalogue(base,{vehicleId:base.vehicleId});
assert.equal(baseline.summary.errors,0,'current Y62 base must be publishable under the shared governance policy');
assert(baseline.summary.warnings>0,'known quote/source uncertainty must remain visible rather than be inferred away');
assert(baseline.warnings.some(x=>x.recordId==='clearview-powerboards'&&x.code==='unresolved_required_part'),'blocked custom fitment token must remain an explicit warning');
assert.equal(base.accessories.find(x=>x.id==='hbmc-lift').status,'engineering');
assert.equal(base.accessories.find(x=>x.id==='clearview-powerboards').status,'blocked');

const anyOf=clone(base);anyOf.accessories.find(x=>x.id==='raslarr-camera').fitment.anyOfRequiredParts=['raslarr-rear','raslarr-wheel'];
assert.equal(governance.validateCatalogue(anyOf,{vehicleId:anyOf.vehicleId}).summary.errors,0,'valid any-of selectable dependencies must pass');
const anyOfBad=clone(base);anyOfBad.accessories.find(x=>x.id==='raslarr-camera').fitment.anyOfRequiredParts=['not-a-catalogue-id'];
assert(governance.validateCatalogue(anyOfBad,{vehicleId:anyOfBad.vehicleId}).errors.some(x=>x.code==='unknown_any_of_part'),'confirmed items cannot hide an unsupported any-of dependency');

const db=new RigDatabase(':memory:');
try{
  const draft=db.saveCatalogueDraft(base.vehicleId,base,{actor});
  assert.equal(draft.governance.policy,'source-backed-catalogue-fitment-governance');
  assert.equal(draft.governance.validation.stage,'draft');
  assert.equal(draft.governance.validation.validatedBy.actorId,actor.actorId);
  assert.equal(draft.governance.validation.blocking,false);
  assert.match(draft.governance.validation.catalogueChecksum,/^[a-f0-9]{16}$/i);

  const bad=clone(base);
  bad.accessories[1].sku=bad.accessories[0].sku;
  bad.accessories.find(x=>x.id==='hbmc-lift').fitment.reviewRequired=false;
  bad.accessories.find(x=>x.id==='gme-aerial').fitment.requiredParts=['missing-confirmed-fitting-part'];
  const badDraft=db.saveCatalogueDraft(base.vehicleId,bad,{actor});
  assert.equal(badDraft.governance.validation.blocking,true,'incomplete work must remain persistable as a governed draft');
  assert(badDraft.governance.validation.errors.some(x=>x.code==='duplicate_sku'));
  assert(badDraft.governance.validation.errors.some(x=>x.code==='review_gate_required'));
  assert(badDraft.governance.validation.errors.some(x=>x.code==='unknown_required_part'));
  assert.throws(()=>db.publishCatalogue(base.vehicleId,bad,{actor}),e=>e?.code==='catalogue_governance_blocked'&&e?.fieldErrors?.length>=3,'server publish path must enforce the same governance gate');
  assert.equal(db.getCatalogue(base.vehicleId),null,'rejected publication must not create a catalogue revision');

  const pub1=db.publishCatalogue(base.vehicleId,base,{actor});
  assert.equal(pub1.revision,'Y62-CAT-001');
  assert.equal(pub1.governance.validation.stage,'publish');
  assert.equal(pub1.governance.validation.publishedRevision,'Y62-CAT-001');
  assert.equal(pub1.governance.validation.supersedesRevision,null);
  assert.equal(pub1.governance.validation.blocking,false);
  const firstNote=pub1.accessories[0].note;

  const next=clone(pub1);next.accessories[0].note='Governed second revision test note.';
  const pub2=db.publishCatalogue(base.vehicleId,next,{actor});
  assert.equal(pub2.revision,'Y62-CAT-002','every accepted publication must create a new immutable revision even when the draft carries a prior revision ID');
  assert.equal(pub2.governance.validation.supersedesRevision,'Y62-CAT-001');
  const rows=db.db.prepare('SELECT revision,payload_json FROM catalogue_revisions WHERE vehicle_id=? ORDER BY id').all(base.vehicleId);
  assert.equal(rows.length,2);
  assert.equal(rows[0].revision,'Y62-CAT-001');assert.equal(rows[1].revision,'Y62-CAT-002');
  assert.equal(JSON.parse(rows[0].payload_json).accessories[0].note,firstNote,'publishing a new revision must not overwrite the prior payload');

  const audit=db.listAudit({entityType:'catalogue',entityId:base.vehicleId,action:'catalogue.published',limit:10})[0];
  assert.equal(audit.metadata.governance.blocking,false);
  assert.equal(audit.metadata.governance.policyVersion,governance.policyVersion);
  assert.match(audit.metadata.catalogueChecksum,/^[a-f0-9]{16}$/i);

  const html=fs.readFileSync(path.join(root,'catalogue.html'),'utf8'),ui=fs.readFileSync(path.join(root,'catalogue.js'),'utf8'),client=fs.readFileSync(path.join(root,'backend-client.js'),'utf8');
  assert.match(html,/catalogue-governance\.js/);assert.match(html,/Governance blockers/);assert.match(html,/PUBLISH GATE/);
  assert.match(ui,/Alternative accessory IDs — ANY ONE required/);assert.match(ui,/Vehicle \/ setup conditions — one per line/);assert.match(ui,/SAVE TO GOVERNED DRAFT/);assert.match(ui,/Last persisted/);
  assert.match(client,/PRO4X4_CATALOGUE_GOVERNANCE/);assert.match(client,/gateError/);

  console.log(JSON.stringify({alpha:'26-wf4',package:'catalogue-fitment-governance',baselineErrors:baseline.summary.errors,baselineWarnings:baseline.summary.warnings,draftBlockersPersisted:true,serverPublishGate:true,anyOfDependenciesGoverned:true,engineeringUncertaintyPreserved:true,immutableCatalogueRevisions:['Y62-CAT-001','Y62-CAT-002'],auditGovernancePersisted:true,staffGovernanceVisibility:true,status:'pass'},null,2));
}finally{db.close()}
