(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const dossier=(typeof module==='object'&&module.exports)?require('./canonical-governance-dossier.js'):root.PRO4X4_CANONICAL_GOVERNANCE_DOSSIER;
  const api=factory(integrity,dossier);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_CANONICAL_REVIEW_WORKFLOW=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,dossier){
  'use strict';
  const SCHEMA_VERSION='0.26.29';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='CANONICAL_REVIEW_ASSIGNMENT_WORKFLOW';
  const CLAIM_AUTHORITY='review-claim-only';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const sha=v=>/^[a-f0-9]{64}$/i.test(clean(v))?clean(v).toLowerCase():null;
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const canonical=a=>dossier?.canonical?.(a)||false;

  function referenceSnapshots(master,references=[]){
    if(dossier?.referenceSnapshots)return dossier.referenceSnapshots(master,references);
    const byId=new Map((references||[]).filter(Boolean).map(r=>[r.assetId,r]));
    return unique([...(master?.referencePack?.requiredReferenceIds||[]),...(master?.canonicalView?.referenceIds||[])]).map(assetId=>{const r=byId.get(assetId);return {assetId,present:!!r,checksumSha256:sha(r?.file?.checksumSha256),governanceState:r?.governance?.state||null,runtimeStatus:r?.status||null,licenceStatus:r?.provenance?.licenceStatus||null,sourceType:r?.provenance?.sourceType||null,authenticityRole:r?.referenceEvidence?.authenticityRole||null,productionEligible:r?.referenceEvidence?.productionEligible??null,referencePackId:r?.referencePack?.packId||null,referencePackManifestSha256:sha(r?.referencePack?.manifestSha256)}});
  }
  function evidenceBinding(master,references=[]){
    if(!canonical(master))return null;
    const handoff=master.candidateHandoff||null;
    return stable({
      canonicalMaster:{assetId:master.assetId,briefId:master.canonicalView?.briefId||null,viewId:master.viewId},
      canonicalContract:{reviewContractId:master.canonicalView?.reviewContractId||null,requiredCheckIds:clone(master.canonicalView?.reviewContractRequiredChecks||[]),referenceGap:clone(master.canonicalView?.referenceGap||null)},
      referencePack:{packId:master.referencePack?.packId||null,manifestSha256:sha(master.referencePack?.manifestSha256),requiredReferenceIds:clone(master.referencePack?.requiredReferenceIds||master.canonicalView?.referenceIds||[]),referenceSnapshots:referenceSnapshots(master,references)},
      candidateHandoff:handoff?{handoffId:handoff.handoffId||null,handoffSha256:sha(handoff.handoffSha256),candidateId:handoff.candidate?.candidateId||null,candidateChecksumSha256:sha(handoff.candidate?.checksumSha256),upstreamDecision:handoff.upstreamReview?.decision||null,intakeState:handoff.intake?.state||null,intakeBlockers:clone(handoff.intake?.blockers||[])}:null
    });
  }
  function bindingSha256(master,references=[]){const b=evidenceBinding(master,references);return b?hash(b):null}
  function intake(master,references=[]){
    if(!canonical(master))return {state:'not-canonical',blockers:['asset is not a governed canonical master'],canClaim:false};
    const d=master.governanceDossier||null,dFresh=dossier?.freshness?.(d,master,references)||'unprepared',r=dossier?.reviewEligibility?.(master,references)||d?.basis?.reviewerIntake||{state:'blocked',blockers:['reviewer intake is unavailable']},blockers=[];
    if(dFresh!=='current')blockers.push(`governance dossier is ${dFresh}`);
    blockers.push(...(r.blockers||[]));
    const canClaim=dFresh==='current'&&['ready-for-review','review-in-progress','review-complete-awaiting-approval'].includes(r.state)&&blockers.length===0;
    let state=r.state||'blocked';if(dFresh!=='current')state='blocked-dossier';else if(canClaim&&r.state==='ready-for-review')state='ready-to-claim';
    return {state,sourceState:r.state||null,blockers:unique(blockers),canClaim,dossierFreshness:dFresh,nextAction:r.nextAction||null};
  }
  function claimCore(master,evidenceBindingSha256,actor,assignedAt){
    const actorId=clean(actor?.actorId),displayName=clean(actor?.displayName)||actorId,role=clean(actor?.role),candidateChecksumSha256=sha(master?.candidateHandoff?.candidate?.checksumSha256),briefId=master?.canonicalView?.briefId||master?.assetId||'CANONICAL';
    return stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,authority:CLAIM_AUTHORITY,productionEligible:false,claimId:`${briefId}-REVIEW-CLAIM-${actorId}-${assignedAt}`,canonicalMasterId:master?.assetId||null,canonicalBriefId:master?.canonicalView?.briefId||null,evidenceBindingSha256:sha(evidenceBindingSha256),candidateChecksumSha256,reviewerActorId:actorId,reviewerDisplayName:displayName,reviewerRole:role,assignedAt,assignedBy:{actorId,displayName,role}});
  }
  function signClaim(master,references=[],actor={},assignedAt=null){
    const at=assignedAt||new Date().toISOString(),core=claimCore(master,bindingSha256(master,references),actor,at);return {...core,claimSha256:hash(core)};
  }
  function assignmentProblems(assignment,master,references=[]){
    if(!assignment)return [];
    const p=[];
    if(assignment.schemaVersion!==SCHEMA_VERSION)p.push('review claim schema is stale');
    if(assignment.policy!==POLICY||assignment.purpose!==PURPOSE)p.push('review claim policy/purpose mismatch');
    if(assignment.authority!==CLAIM_AUTHORITY||assignment.productionEligible!==false)p.push('review claim must remain claim-only and non-production');
    if(!clean(assignment.reviewerActorId))p.push('assigned reviewer actor ID is missing');
    if(!clean(assignment.assignedAt)||Number.isNaN(Date.parse(assignment.assignedAt)))p.push('review assignment timestamp is invalid');
    if(clean(assignment.canonicalMasterId)!==clean(master?.assetId))p.push('review claim canonical master binding mismatch');
    if(clean(assignment.canonicalBriefId)!==clean(master?.canonicalView?.briefId))p.push('review claim canonical brief binding mismatch');
    const currentBinding=bindingSha256(master,references);if(!currentBinding||sha(assignment.evidenceBindingSha256)!==currentBinding)p.push('review claim evidence binding is stale');
    if(sha(assignment.candidateChecksumSha256)!==sha(master?.candidateHandoff?.candidate?.checksumSha256))p.push('review claim candidate checksum is stale');
    const core=claimCore(master,assignment.evidenceBindingSha256,{actorId:assignment.reviewerActorId,displayName:assignment.reviewerDisplayName,role:assignment.reviewerRole},assignment.assignedAt);
    if(!sha(assignment.claimSha256)||sha(assignment.claimSha256)!==hash(core))p.push('review claim fingerprint is invalid');
    if(clean(assignment.claimId)!==clean(core.claimId))p.push('review claim ID is invalid');
    return unique(p);
  }
  function workflowState(saved,master,references=[]){
    const i=intake(master,references),assignment=saved?.assignment||null;
    if(master?.canonicalReviewEvidence?.verdict==='pass')return 'approval-complete';
    if(i.dossierFreshness!=='current'&&!assignment)return 'blocked-dossier';
    if(!assignment)return i.state;
    if(assignmentProblems(assignment,master,references).length)return 'claimed-invalid';
    if(i.sourceState==='review-complete-awaiting-approval')return 'review-complete-awaiting-approval';
    if(i.sourceState==='review-in-progress')return 'review-in-progress';
    if(i.sourceState==='review-return-required')return 'review-return-required';
    if(i.canClaim||i.sourceState==='ready-for-review')return 'claimed';
    return `claimed-${i.state}`;
  }
  function build({master,references=[],preparedAt=null,preparedBy=null,assignment=null,priorWorkflow=null}={}){
    if(!canonical(master))return null;
    const binding=evidenceBinding(master,references),bindingHash=hash(binding),i=intake(master,references),wf={schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,workflowId:`${master.canonicalView.briefId}-REVIEW-WORKFLOW`,authority:'review-assignment-only',productionEligible:false,preparedAt:preparedAt||null,preparedBy:preparedBy?clone(preparedBy):null,intakeDossierSha256:sha(master.governanceDossier?.dossierSha256),evidenceBindingSha256:bindingHash,evidenceBinding:binding,assignment:assignment?clone(assignment):null,intake:{state:i.state,sourceState:i.sourceState,blockers:clone(i.blockers),canClaim:i.canClaim,dossierFreshness:i.dossierFreshness,nextAction:i.nextAction}};
    wf.state=workflowState(wf,master,references);
    wf.workflowSha256=hash({schemaVersion:wf.schemaVersion,policy:wf.policy,purpose:wf.purpose,workflowId:wf.workflowId,authority:wf.authority,productionEligible:wf.productionEligible,intakeDossierSha256:wf.intakeDossierSha256,evidenceBindingSha256:wf.evidenceBindingSha256,evidenceBinding:wf.evidenceBinding,assignment:wf.assignment,intake:wf.intake,state:wf.state});
    if(priorWorkflow?.assignment&&!wf.assignment)wf.invalidatedAssignment=clone(priorWorkflow.assignment);
    return wf;
  }
  function problems(saved,master,references=[]){
    if(!canonical(master))return ['asset is not a governed canonical master'];
    if(!saved)return ['canonical review workflow is not prepared'];
    const p=[];
    if(saved.schemaVersion!==SCHEMA_VERSION)p.push('canonical review workflow schema is stale');
    if(saved.policy!==POLICY)p.push('canonical review workflow policy mismatch');
    if(saved.purpose!==PURPOSE)p.push('canonical review workflow purpose mismatch');
    if(saved.authority!=='review-assignment-only'||saved.productionEligible!==false)p.push('canonical review workflow must remain assignment-only and non-production');
    const expectedHash=hash({schemaVersion:saved.schemaVersion,policy:saved.policy,purpose:saved.purpose,workflowId:saved.workflowId,authority:saved.authority,productionEligible:saved.productionEligible,intakeDossierSha256:saved.intakeDossierSha256,evidenceBindingSha256:saved.evidenceBindingSha256,evidenceBinding:saved.evidenceBinding,assignment:saved.assignment||null,intake:saved.intake,state:saved.state});
    if(!sha(saved.workflowSha256)||sha(saved.workflowSha256)!==expectedHash)p.push('canonical review workflow fingerprint is invalid');
    const currentBinding=bindingSha256(master,references);if(!currentBinding||sha(saved.evidenceBindingSha256)!==currentBinding)p.push('canonical review workflow evidence binding is stale');
    if(saved.evidenceBinding?.canonicalMaster?.assetId!==master.assetId)p.push('canonical review workflow master binding mismatch');
    p.push(...assignmentProblems(saved.assignment,master,references));
    return unique(p);
  }
  function freshness(saved,master,references=[]){const p=problems(saved,master,references);if(!saved)return 'unprepared';if(p.some(x=>x.includes('fingerprint is invalid')||x.includes('policy mismatch')||x.includes('purpose mismatch')||x.includes('must remain assignment-only')||x.includes('claim-only')||x.includes('ID is invalid')||x.includes('schema is stale')))return 'invalid';if(p.some(x=>x.includes('stale')))return 'stale';return p.length?'invalid':'current'}
  function refresh(saved,master,references=[],actor={},at=null){
    const assignmentOk=saved?.assignment&&assignmentProblems(saved.assignment,master,references).length===0,assignment=assignmentOk?saved.assignment:null;
    return build({master,references,preparedAt:at||null,preparedBy:actor,assignment,priorWorkflow:saved||null});
  }
  function claim(saved,master,references=[],actor={},at=null){
    const role=clean(actor?.role),actorId=clean(actor?.actorId);if(!['fitment','admin'].includes(role)||!actorId)throw Object.assign(new Error('Canonical review claims require an identified fitment/admin actor'),{status:403,code:'review_claim_forbidden'});
    const f=freshness(saved,master,references);if(f!=='current')throw Object.assign(new Error(`Canonical review workflow is ${f}; refresh reviewer intake before claiming`),{status:409,code:'review_workflow_stale'});
    const i=intake(master,references);if(!i.canClaim)throw Object.assign(new Error(`Canonical review cannot be claimed: ${(i.blockers||[]).join(', ')||i.sourceState||i.state}`),{status:409,code:'review_claim_blocked',fieldErrors:(i.blockers||[]).map(message=>({field:'reviewWorkflow',message}))});
    if(saved?.assignment){if(saved.assignment.reviewerActorId!==actorId)throw Object.assign(new Error(`Canonical review is already assigned to ${saved.assignment.reviewerDisplayName||saved.assignment.reviewerActorId}`),{status:409,code:'review_already_claimed'});return saved;}
    const assignedAt=at||new Date().toISOString(),assignment=signClaim(master,references,actor,assignedAt);
    return build({master,references,preparedAt:saved?.preparedAt||assignedAt,preparedBy:saved?.preparedBy||assignment.assignedBy,assignment,priorWorkflow:saved||null});
  }
  function release(saved,master,references=[],actor={},at=null,expectedClaimSha256=null){
    if(!saved?.assignment)return refresh(saved,master,references,actor,at);
    const actorId=clean(actor?.actorId),role=clean(actor?.role);if(role!=='admin'&&actorId!==clean(saved.assignment.reviewerActorId))throw Object.assign(new Error('Only the assigned reviewer or an admin can release this canonical review'),{status:403,code:'review_release_forbidden'});
    if(expectedClaimSha256&&sha(expectedClaimSha256)!==sha(saved.assignment.claimSha256))throw Object.assign(new Error('Reviewer claim changed before release; refresh the review queue before retrying'),{status:409,code:'review_claim_conflict',expectedClaimSha256:sha(expectedClaimSha256),currentClaimSha256:sha(saved.assignment.claimSha256)});
    return build({master,references,preparedAt:at||new Date().toISOString(),preparedBy:actor,assignment:null,priorWorkflow:saved});
  }
  function approvalProblems(master,references=[],actor={}){
    if(!canonical(master))return[];
    const p=[],wf=master.reviewWorkflow||null,f=freshness(wf,master,references),assignment=wf?.assignment||null,actorId=clean(actor?.actorId),display=clean(actor?.displayName),candidateChecksum=sha(master?.file?.checksumSha256),boundChecksum=sha(wf?.evidenceBinding?.candidateHandoff?.candidateChecksumSha256);
    if(f!=='current')p.push(`canonical review workflow is ${f}`);
    if(!assignment)p.push('canonical review has no assigned reviewer');
    else{
      p.push(...assignmentProblems(assignment,master,references));
      if(actorId&&assignment.reviewerActorId!==actorId)p.push(`canonical review is assigned to ${assignment.reviewerDisplayName||assignment.reviewerActorId}, not the acting reviewer`);
      const reviewedBy=clean(master?.governance?.reviewedBy);if(reviewedBy&&reviewedBy!==assignment.reviewerDisplayName&&reviewedBy!==assignment.reviewerActorId&&reviewedBy!==display)p.push('canonical review governance reviewer does not match the assigned reviewer');
    }
    if(boundChecksum&&candidateChecksum!==boundChecksum)p.push('canonical binary checksum does not match the reviewer assignment candidate binding');
    return unique(p);
  }
  function summary(masters=[],references=[]){const rows=(masters||[]).filter(canonical).map(m=>({assetId:m.assetId,briefId:m.canonicalView?.briefId||null,freshness:freshness(m.reviewWorkflow,m,references),state:workflowState(m.reviewWorkflow,m,references),assignment:clone(m.reviewWorkflow?.assignment||null),claimIntegrity:m.reviewWorkflow?.assignment?assignmentProblems(m.reviewWorkflow.assignment,m,references).length===0:null,intake:intake(m,references)}));return {schemaVersion:SCHEMA_VERSION,policy:POLICY,total:rows.length,current:rows.filter(x=>x.freshness==='current').length,stale:rows.filter(x=>x.freshness==='stale').length,invalid:rows.filter(x=>x.freshness==='invalid').length,unprepared:rows.filter(x=>x.freshness==='unprepared').length,claimed:rows.filter(x=>!!x.assignment).length,validClaims:rows.filter(x=>x.claimIntegrity===true).length,rows}}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,claimAuthority:CLAIM_AUTHORITY,canonical,referenceSnapshots,evidenceBinding,bindingSha256,intake,claimCore,signClaim,assignmentProblems,workflowState,build,problems,freshness,refresh,claim,release,approvalProblems,summary};
});
