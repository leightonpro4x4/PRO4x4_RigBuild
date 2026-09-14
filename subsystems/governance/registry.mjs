import {DatabaseSync} from 'node:sqlite';
import crypto from 'node:crypto';
import audit from '../server-persistence/vendor/audit-integrity.cjs';
import referenceGate from './vendor/canonical-review-gate.js';
export const hash=v=>audit.sha256Hex(audit.stableStringify(v));
export const binaryHash=b=>crypto.createHash('sha256').update(b).digest('hex');
const clone=v=>JSON.parse(JSON.stringify(v)),fail=code=>{throw Object.assign(Error(code),{code});};
const required=v=>typeof v==='string'&&v.trim().length>0;
export function candidateIdentity(c){
  if(!['vehicleId','variant','viewId','candidateId'].every(k=>required(c[k])))fail('candidate_identity_incomplete');
  return [c.vehicleId,c.variant,c.viewId,c.candidateId].map(encodeURIComponent).join('::');
}
export function tuple(c){
  if(!['vehicleId','variant','viewId','layerId'].every(k=>required(c[k]))||!Object.hasOwn(c,'exactSku')||!Object.hasOwn(c,'renderState')||c.renderState==null)fail('exact_render_tuple_required');
  return hash([c.vehicleId,c.variant,c.viewId,c.layerId,c.exactSku,c.renderState]);
}
function initial(b){
  const refs=b.referenceRecords.map(r=>({id:r.assetId,vehicleId:r.vehicleId,variant:b.variant,sha256:r.file.checksumSha256,rights:r.provenance.licenceStatus,status:r.governance.state,approval:r.referenceReviewDecision,source:r}));
  const masters=b.masterRecords.map(m=>({id:m.assetId,vehicleId:m.vehicleId,variant:b.variant,viewId:m.viewId,referenceIds:m.canonicalView.referenceIds,requiredChecks:m.canonicalView.reviewContractRequiredChecks,
    cameraLocked:m.canonicalViewContract?.state==='locked',sourceGap:m.canonicalView.referenceGap?.severity==='required',requiresF34:m.viewId!=='front34',source:m}));
  return {references:refs,masters,candidates:clone(b.candidates),claims:[],decisions:[],seals:[],production:[],blocks:[],baselineHash:hash(b)};
}
// Internal server service. Actor IDs resolve against server-configured grants, never caller role strings.
// No customer HTTP endpoint exposes this registry or accepts governance writes.
export class GovernanceRegistry {
  #state;#db;#grants;#readBinary;#head=null;
  constructor({baseline,filename=':memory:',actors={},readBinary}){
    this.#grants=clone(actors);this.#readBinary=readBinary;this.#state=initial(baseline);
    this.#db=new DatabaseSync(filename);this.#db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS governance_events(seq INTEGER PRIMARY KEY,body TEXT NOT NULL,sha TEXT NOT NULL);
      CREATE TRIGGER IF NOT EXISTS governance_no_update BEFORE UPDATE ON governance_events BEGIN SELECT RAISE(ABORT,'immutable governance event'); END;
      CREATE TRIGGER IF NOT EXISTS governance_no_delete BEFORE DELETE ON governance_events BEGIN SELECT RAISE(ABORT,'immutable governance event'); END;`);
    try{for(const row of this.#db.prepare('SELECT * FROM governance_events ORDER BY seq').all()){
      const e=JSON.parse(row.body);if(e.previous!==this.#head||hash(e)!==row.sha)fail('governance_audit_invalid');
      if(e.state.baselineHash!==this.#state.baselineHash)fail('explicit_governance_migration_required');this.#state=e.state;this.#head=row.sha;
    }}catch(e){this.#db.close();throw e;}
  }
  close(){this.#db.close();}
  snapshot(){return clone(this.#state);}
  counts(){const s=this.#state;return {references:s.references.length,approvedReferences:s.references.filter(r=>r.status==='reference-approved').length,masters:s.masters.length,candidates:s.candidates.length,claims:s.claims.filter(c=>!c.invalidated).length,decisions:s.decisions.filter(d=>!d.invalidated).length,seals:s.seals.length,production:s.production.filter(p=>this.#productionValid(p)).length};}
  #actor(id,roles){if(!required(id)||!roles.some(r=>(this.#grants[id]||[]).includes(r)))fail('unauthorized_governance_actor');return id;}
  #run(id,roles,action,fn){
    this.#actor(id,roles);const before=clone(this.#state);this.#db.exec('BEGIN IMMEDIATE');
    try{
      const latest=this.#db.prepare('SELECT sha FROM governance_events ORDER BY seq DESC LIMIT 1').get();if((latest?.sha||null)!==this.#head)fail('governance_concurrency_conflict');
      const result=fn();const e={previous:this.#head,actorId:id,action,at:new Date().toISOString(),state:this.#state},sha=hash(e);
      this.#db.prepare('INSERT INTO governance_events(body,sha) VALUES(?,?)').run(JSON.stringify(e),sha);this.#db.exec('COMMIT');this.#head=sha;return clone(result);
    }catch(e){this.#db.exec('ROLLBACK');this.#state=before;throw e;}
  }
  #get(kind,id){const x=this.#state[kind].find(x=>x.id===id);if(!x)fail('unknown_'+kind);return x;}
  #bytes(c){const b=this.#readBinary?.(c.source);if(!b||binaryHash(b)!==c.sha256)fail('binary_evidence_mismatch');}
  #refs(master){return master.referenceIds.map(id=>{const r=this.#get('references',id);if(r.vehicleId!==master.vehicleId||r.variant!==master.variant||r.status!=='reference-approved'||!r.approval||!r.rights)fail('reference_not_approved_or_wrong_vehicle');this.#bytes({source:r.binarySource||{branch:'wf3',path:'wf3_run56/'+r.source.source},sha256:r.sha256});return r;});}
  #binding(c){const m=this.#get('masters',c.masterId);return hash({candidate:c,master:m,references:this.#refs(m)});}
  #candidate(id){const c=this.#get('candidates',id);if(candidateIdentity(c)!==id)fail('candidate_identity_mismatch');return c;}
  registerReference(input,actor){return this.#run(actor,['curator'],'reference.register',()=>{
    if(!['id','vehicleId','variant','sha256','rights'].every(k=>required(input[k]))||!input.source)fail('reference_evidence_required');
    if(this.#state.references.some(r=>r.id===input.id))fail('duplicate_reference');this.#bytes(input);
    const r={id:input.id,vehicleId:input.vehicleId,variant:input.variant,sha256:input.sha256,rights:input.rights,binarySource:clone(input.source),status:'reference-only',approval:null};this.#state.references.push(r);return r;
  });}
  approveReference(id,expectedSha,actor){return this.#run(actor,['reference-reviewer'],'reference.approve',()=>{
    const r=this.#get('references',id);if(r.sha256!==expectedSha||!r.rights)fail('reference_approval_binding');this.#bytes({source:r.binarySource,sha256:r.sha256});
    r.status='reference-approved';r.approval={actorId:actor,sha256:expectedSha,rights:r.rights,at:new Date().toISOString()};return r;
  });}
  replaceReference(id,input,actor){return this.#run(actor,['curator'],'reference.replace',()=>{
    const r=this.#get('references',id);if(r.source)fail('frozen_reference_requires_authoritative_reconciliation');
    if(input.expectedSha!==r.sha256||!input.rights)fail('reference_concurrency_or_rights');this.#bytes(input);
    r.sha256=input.sha256;r.binarySource=clone(input.source);r.rights=input.rights;r.status='reference-only';r.approval=null;return r;
  });}
  registerMaster(input,actor){return this.#run(actor,['curator'],'master.register',()=>{
    if(!['id','vehicleId','variant','viewId'].every(k=>required(input[k]))||!input.referenceIds?.length||!input.requiredChecks?.length)fail('master_reference_contract_required');
    if(this.#state.masters.some(m=>m.id===input.id))fail('duplicate_master');
    const m={id:input.id,vehicleId:input.vehicleId,variant:input.variant,viewId:input.viewId,referenceIds:clone(input.referenceIds),requiredChecks:clone(input.requiredChecks),cameraLocked:false,sourceGap:true,requiresF34:input.viewId!=='front34',contractApproval:null};this.#refs(m);this.#state.masters.push(m);return m;
  });}
  acceptMasterContract(id,evidence,actor){return this.#run(actor,['reference-reviewer'],'master.contract.accept',()=>{
    const m=this.#get('masters',id);if(m.source)fail('frozen_master_requires_authoritative_reconciliation');
    if(!evidence.source||!required(evidence.sha256)||evidence.viewId!==m.viewId||evidence.masterId!==id)fail('master_contract_evidence_required');this.#bytes(evidence);
    m.cameraLocked=true;m.sourceGap=false;m.contractApproval={...clone(evidence),actorId:actor};return m;
  });}
  stageCandidate(input,actor){return this.#run(actor,['processor'],'candidate.stage',()=>{
    const id=candidateIdentity(input),m=this.#get('masters',input.masterId);this.#refs(m);
    if(m.vehicleId!==input.vehicleId||m.variant!==input.variant||m.viewId!==input.viewId||hash([...m.referenceIds].sort())!==hash([...(input.referenceIds||[])].sort()))fail('master_reference_candidate_mismatch');
    if(this.#state.candidates.some(c=>c.id===id))fail('candidate_version_immutable');this.#bytes(input);tuple(input);
    const c={id,vehicleId:input.vehicleId,variant:input.variant,viewId:input.viewId,candidateId:input.candidateId,masterId:m.id,referenceIds:clone(input.referenceIds),sha256:input.sha256,source:clone(input.source),layerId:input.layerId,exactSku:input.exactSku,renderState:clone(input.renderState),lineage:input.lineage||null,state:'master-draft',productionEligible:false,evidence:null,binaryRights:null,cameraMatched:false,reconstruction:'unreviewed',blockers:[]};
    // New identity/version always resets evidence. Caller approval/claim/seal fields are discarded.
    this.#state.candidates.push(c);return c;
  });}
  recordEvidence(id,evidence,actor){return this.#run(actor,['processor'],'candidate.evidence',()=>{
    const c=this.#candidate(id);if(this.#state.production.some(p=>p.candidateId===id))fail('production_version_immutable');this.#bytes(c);
    if(evidence.candidateId!==id||evidence.sha256!==c.sha256||evidence.viewId!==c.viewId||!evidence.source)fail('candidate_evidence_binding');this.#bytes({source:evidence.source,sha256:evidence.evidenceSha256});
    c.evidence=clone(evidence);c.cameraMatched=evidence.cameraMatched===true;c.reconstruction=evidence.reconstruction;
    for(const claim of this.#state.claims.filter(x=>x.candidateId===id))claim.invalidated=true;
    for(const d of this.#state.decisions.filter(x=>x.candidateId===id))d.invalidated=true;
    return c;
  });}
  recordBinaryRights(id,rights,actor){return this.#run(actor,['rights-reviewer'],'candidate.production-rights',()=>{
    const c=this.#candidate(id);if(this.#state.production.some(p=>p.candidateId===id))fail('production_version_immutable');
    if(rights.candidateId!==id||rights.sha256!==c.sha256||rights.scope!=='production-binary'||!rights.source)fail('production_rights_binding');this.#bytes({source:rights.source,sha256:rights.evidenceSha256});c.binaryRights={...clone(rights),actorId:actor};return c;
  });}
  #ready(c){
    this.#bytes(c);const m=this.#get('masters',c.masterId);this.#refs(m);
    if(m.vehicleId!==c.vehicleId||m.variant!==c.variant||m.viewId!==c.viewId||hash([...m.referenceIds].sort())!==hash([...c.referenceIds].sort()))fail('master_reference_candidate_mismatch');
    if(m.source){const problems=referenceGate.referenceProblems(m.source,this.#state.references.map(r=>r.source).filter(Boolean));if(problems.length)fail('wf4_reference_gate');}
    if(!m.cameraLocked||m.sourceGap)fail('master_camera_or_source_gap');
    if(!m.source){if(!m.contractApproval)fail('master_contract_evidence_required');this.#bytes(m.contractApproval);}
    if(c.blockers?.length)fail('candidate_blocked');
    if(!c.evidence||c.evidence.sha256!==c.sha256||c.evidence.candidateId!==c.id)fail('candidate_evidence_required');
    this.#bytes({source:c.evidence.source,sha256:c.evidence.evidenceSha256});
    if(c.cameraMatched!==true)fail('camera_mismatch');if(c.reconstruction!=='pass')fail('reconstruction_failed');
    if(!c.binaryRights||c.binaryRights.sha256!==c.sha256)fail('production_binary_rights_missing');
    this.#bytes({source:c.binaryRights.source,sha256:c.binaryRights.evidenceSha256});
    if(!m.requiredChecks.length||m.requiredChecks.some(k=>c.evidence.checks?.[k]!=='pass'))fail('required_review_checks_failed');
    if(m.requiresF34&&!this.#state.production.some(p=>p.vehicleId===c.vehicleId&&p.variant===c.variant&&p.viewId==='front34'&&this.#productionValid(p)))fail('F34_first');
  }
  claim(id,actor){return this.#run(actor,['reviewer'],'candidate.claim',()=>{
    const c=this.#candidate(id);this.#ready(c);const binding=this.#binding(c),existing=this.#state.claims.find(x=>x.candidateId===id&&!x.invalidated);
    if(existing){if(existing.actorId===actor&&existing.binding===binding)return existing;fail('claim_conflict');}
    const claim={id:crypto.randomUUID(),candidateId:id,actorId:actor,binding,sha256:c.sha256,at:new Date().toISOString(),productionEligible:false};claim.checksum=hash(claim);this.#state.claims.push(claim);return claim;
  });}
  decide(id,claimChecksum,verdict,actor){return this.#run(actor,['reviewer'],'candidate.decision',()=>{
    const c=this.#candidate(id),claim=this.#state.claims.find(x=>x.candidateId===id&&!x.invalidated&&x.checksum===claimChecksum);
    if(!claim||claim.actorId!==actor||claim.binding!==this.#binding(c))fail('stale_or_unauthorized_claim');this.#bytes(c);
    if(!['approved','returned'].includes(verdict))fail('invalid_decision');if(verdict==='approved')this.#ready(c);
    if(this.#state.decisions.some(d=>d.claimChecksum===claimChecksum&&!d.invalidated))fail('decision_already_recorded');
    const d={id:crypto.randomUUID(),candidateId:id,claimChecksum,binding:claim.binding,actorId:actor,verdict,at:new Date().toISOString()};d.checksum=hash(d);this.#state.decisions.push(d);return d;
  });}
  seal(id,decisionChecksum,actor){return this.#run(actor,['sealer'],'candidate.seal',()=>{
    const c=this.#candidate(id);this.#ready(c);const binding=this.#binding(c),d=this.#state.decisions.find(d=>!d.invalidated&&d.candidateId===id&&d.checksum===decisionChecksum&&d.verdict==='approved');
    if(!d||d.binding!==binding)fail('current_approved_decision_required');if(this.#state.seals.some(s=>s.candidateId===id))fail('seal_immutable');
    const seal={id:crypto.randomUUID(),candidateId:id,binding,decisionChecksum,sha256:c.sha256,actorId:actor,at:new Date().toISOString(),auditHead:this.#head};seal.checksum=hash(seal);this.#state.seals.push(seal);return seal;
  });}
  promote(id,sealChecksum,actor){return this.#run(actor,['publisher'],'candidate.promote',()=>{
    const c=this.#candidate(id);this.#ready(c);const s=this.#state.seals.find(s=>s.candidateId===id&&s.checksum===sealChecksum&&s.binding===this.#binding(c));if(!s)fail('current_production_seal_required');
    const key=tuple(c);if(this.#state.production.some(p=>p.tuple===key))fail('duplicate_production_tuple');
    const p={candidateId:id,vehicleId:c.vehicleId,variant:c.variant,viewId:c.viewId,layerId:c.layerId,exactSku:c.exactSku,renderState:c.renderState,tuple:key,sha256:c.sha256,sealChecksum,source:c.source};this.#state.production.push(p);return p;
  });}
  #productionValid(p){try{const c=this.#candidate(p.candidateId);this.#ready(c);return this.#state.seals.some(s=>s.checksum===p.sealChecksum&&s.candidateId===c.id&&s.binding===this.#binding(c));}catch{return false;}}
  block(request,actor){return this.#run(actor,['curator'],'visual.block',()=>{const key=tuple(request);this.#state.blocks.push(key);return {tuple:key};});}
  resolve(request){
    let key;try{key=tuple(request);}catch{return {state:'unavailable',productionApproved:false,binary:null,fallback:'none'};}
    if(this.#state.blocks.includes(key))return {state:'blocked',productionApproved:false,binary:null,fallback:'none'};
    const matches=this.#state.production.filter(p=>p.tuple===key&&this.#productionValid(p));
    if(matches.length!==1)return {state:'unavailable',productionApproved:false,binary:null,fallback:'none'};
    return {state:'approved',productionApproved:true,binary:clone(matches[0].source),sha256:matches[0].sha256,sealChecksum:matches[0].sealChecksum,fallback:'none'};
  }
}
