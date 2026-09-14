import {resultURL} from '../support/results.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sourceArchive} from '../../tools/source-archive.mjs';
import {ProjectStore,SCHEMA} from '../../subsystems/server-persistence/store.mjs';
import {createEngine} from '../../subsystems/domain/engine.mjs';
const root=new URL('../../',import.meta.url),json=p=>JSON.parse(fs.readFileSync(new URL(p,root)));
const catalogue=json('subsystems/catalogue/catalogue.json'),fixture=json('subsystems/catalogue/alpha93-fixture.json'),mapping=json('subsystems/catalogue/alpha93-mapping.json');
const s=new ProjectStore({catalogue,fixture,mapping,assetHashes:{},implementationVersion:'stage7-current-WF5'}),actor={actorId:'wf5-customer',role:'customer'},engine=createEngine(catalogue),vehicleId=mapping.vehicleId,k=id=>vehicleId+'::'+id;
const save=selected=>s.save({schemaVersion:SCHEMA,catalogueVersion:s.catalogueVersion,profile:'catalogue',vehicleId,selected},actor);
const lineage=r=>({projectId:r.snapshot.projectId,revisionId:r.snapshot.revisionId,checksum:r.checksum});
try{
  const orphan=save([k('oa-butt-kicker-7-pair-ranger')]);
  assert(orphan.snapshot.decision.reasons.some(r=>r.code==='any-of-choice'));assert.equal(orphan.snapshot.quoteReady,false);
  const q=s.createQuote(lineage(orphan),actor);assert.equal(q.quoteReady,false);assert.equal(q.revisionChecksum,orphan.checksum);
  assert.throws(()=>s.createQuote({...lineage(orphan),revisionContent:{...orphan.snapshot,decision:{reasons:[]}}},actor),e=>e.code==='revision_content_mismatch');
  const d=engine.evaluate({vehicleId,selected:[k('oa-butt-kicker-7-pair-ranger'),k('oa-predator')]});assert(!d.reasons.some(r=>r.code==='any-of-choice'));assert(!d.selected.includes(k('oa-toro-ranger')));
  const removal=engine.transition({vehicleId,selected:d.selected,action:{type:'remove',identity:k('oa-predator')}});assert(removal.decision.reasons.some(r=>r.code==='any-of-choice'));assert.equal(save(removal.selected).snapshot.quoteReady,false);
  const scout=save([k('oa-scout-rack-ranger')]);assert(scout.snapshot.decision.reasons.some(r=>r.code==='fitment-evidence-review'));assert.equal(s.createQuote(lineage(scout),actor).quoteReady,false);
}finally{s.close();}
// Every original WF5 acceptance assertion is explicitly bound to a current implementation test.
// No historical database/resolver is instantiated by this gate.
const historical=sourceArchive('wf5').get('pro4x4-rig-builder-alpha26-wf5-push27/tests/wf5-alpha26-acceptance-gate.js').toString();
const ids=[...historical.matchAll(/check\('([^']+)'/g)].map(x=>x[1]);
const bindings={
 'WF1-BOM-ANYOF':['wf5-current.mjs','const orphan='],
 'WF1-QUOTE-ANYOF':['wf5-current.mjs','q.quoteReady'],
 'WF1-BOM-ANYOF-SATISFIED':['wf5-current.mjs','oa-toro-ranger'],
 'WF1-REMOVE-ANYOF':['wf5-current.mjs','const removal='],
 'WF1-CONDITIONAL-FITMENT-GATE':['wf5-current.mjs','const scout='],
 'WF4-DIRECT-PRODUCTION-EVIDENCE':['governance.mjs','WF4-DIRECT-PRODUCTION-REVIEW/EVIDENCE'],
 'WF4-QUOTE-GATE-TRUST-BOUNDARY':['wf5-current.mjs','revision_content_mismatch'],
 'WF4-PRODUCTION-BINARY-IMMUTABILITY':['governance.mjs','WF4-PRODUCTION-BINARY/IDENTITY-IMMUTABILITY'],
 'WF4-PRODUCTION-IDENTITY-IMMUTABILITY':['governance.mjs','WF4-PRODUCTION-BINARY/IDENTITY-IMMUTABILITY'],
 'WF4-PROJECT-RENDER-TRUST-BOUNDARY':['persistence.mjs','caller render mismatch and null rejected'],
 'WF4-QUOTE-PROJECT-REVISION-BINDING':['persistence.mjs','caller revision content mismatch rejected'],
 'WF4-QUOTE-LINEAGE-REQUIRED':['persistence.mjs','quote without lineage rejected'],
 'WF4-QUOTE-LINEAGE-EXISTENCE':['persistence.mjs','nonexistent project/revision rejected'],
 'WF4-QUOTE-LINEAGE-OWNERSHIP':['persistence.mjs','wrong owner cannot read revision/save/quote/share'],
 'WF4-QUOTE-REFERENCE-OWNERSHIP':['persistence.mjs','quote ownership enforced on reads and drafts'],
 'WF4-QUOTE-FINALISATION-AUTHORITY':['persistence.mjs','finaliser identity and role required'],
 'WF4-QUOTE-REFINALISATION-IMMUTABILITY':['persistence.mjs','different re-finalisation key/issuer rejected'],
 'WF4-FINALISED-QUOTE-IMMUTABILITY':['persistence.mjs','finalised customer mutation rejected'],
 'WF4-FINALISED-QUOTE-STAFF-MUTATION':['persistence.mjs','finalised staff mutation rejected'],
 'WF4-QUOTE-FINALISER-IDENTITY':['persistence.mjs','terminal issuance binds issuer/checksum/total'],
 'WF4-QUOTE-REVISION-CHECKSUM-BINDING':['persistence.mjs','checksum absent or mismatched rejected'],
 'WF4-SHARE-REVISION-ISOLATION':['persistence.mjs','share exposes pinned revision only'],
 'WF4-SHARE-REGISTRY-ISOLATION':['persistence.mjs','share does not expose governance/reviewer registries']
};
const crosswalk=ids.map(id=>{const [file,assertion]=bindings[id]||['governance.mjs',id];assert(fs.readFileSync(new URL('acceptance/tests/'+file,root),'utf8').includes(assertion),'Missing current WF5 binding: '+id);return {id,file,assertion};});
const scripts=JSON.stringify(json('validation.config.json').groups);for(const f of new Set(crosswalk.map(x=>x.file)))assert(scripts.includes('acceptance/tests/'+f));
const report={status:'PASS',historicalAssertions:ids.length,currentBindings:crosswalk.length,additionalIntegrationChecks:5,crosswalk};
fs.writeFileSync(resultURL('wf5.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:'PASS',historicalAssertions:ids.length,currentBindings:crosswalk.length,additionalIntegrationChecks:5}));
