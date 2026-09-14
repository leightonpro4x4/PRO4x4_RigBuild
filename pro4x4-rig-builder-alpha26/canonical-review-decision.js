(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const workflow=(typeof module==='object'&&module.exports)?require('./canonical-review-workflow.js'):root.PRO4X4_CANONICAL_REVIEW_WORKFLOW;
  const dossier=(typeof module==='object'&&module.exports)?require('./canonical-governance-dossier.js'):root.PRO4X4_CANONICAL_GOVERNANCE_DOSSIER;
  const attestation=(typeof module==='object'&&module.exports)?require('./reference-provenance-attestation.js'):root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION;
  const sourceGapResolution=(typeof module==='object'&&module.exports)?require('./canonical-source-gap-resolution.js'):root.PRO4X4_CANONICAL_SOURCE_GAP_RESOLUTION;
  const api=factory(integrity,workflow,dossier,attestation,sourceGapResolution);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_CANONICAL_REVIEW_DECISION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,workflow,dossier,attestation,sourceGapResolution){
  'use strict';
  const SCHEMA_VERSION='0.26.29';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='CANONICAL_REVIEW_DECISION_ENVELOPE';
  const DECISIONS=new Set(['approved','returned']);
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const sha=v=>/^[a-f0-9]{64}$/i.test(clean(v))?clean(v).toLowerCase():null;
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const canonical=a=>workflow?.canonical?.(a)||false;
  function referenceSnapshots(master,references=[]){
    if(dossier?.referenceSnapshots)return dossier.referenceSnapshots(master,references);
    const byId=new Map((references||[]).filter(Boolean).map(r=>[r.assetId,r])),ids=unique([...(master?.referencePack?.requiredReferenceIds||[]),...(master?.canonicalView?.referenceIds||[])]);
    return ids.map(assetId=>{const r=byId.get(assetId);return {assetId,present:!!r,checksumSha256:sha(r?.file?.checksumSha256),governanceState:r?.governance?.state||null,licenceStatus:r?.provenance?.licenceStatus||null,packId:r?.referencePack?.packId||null,manifestSha256:sha(r?.referencePack?.manifestSha256),attestationBasisSha256:sha(r?.provenanceAttestation?.basisSha256),attestationFreshness:attestation?.freshness?.(r?.provenanceAttestation,r)||'missing'};});
  }
  function normalizeResults(master,inputResults=[]){
    const required=unique(master?.canonicalView?.reviewContractRequiredChecks||[]),byId=new Map((inputResults||[]).map(x=>[clean(x?.id),x]));
    return required.map(id=>{const x=byId.get(id)||{};const result=['pass','fail'].includes(x.result)?x.result:'pending';return {id,result,note:clean(x.note)||null};});
  }
  function evidenceBasis(master,references=[]){
    if(!canonical(master))return null;const wf=master.reviewWorkflow||null,h=master.candidateHandoff||null;
    return stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,canonicalMaster:{assetId:master.assetId,briefId:master.canonicalView?.briefId||null,viewId:master.viewId},canonicalContract:{reviewContractId:master.canonicalView?.reviewContractId||null,requiredCheckIds:clone(master.canonicalView?.reviewContractRequiredChecks||[]),referenceGap:clone(master.canonicalView?.referenceGap||null)},referencePack:{packId:master.referencePack?.packId||null,manifestSha256:sha(master.referencePack?.manifestSha256),requiredReferenceIds:clone(master.referencePack?.requiredReferenceIds||[]),referenceSnapshots:referenceSnapshots(master,references)},candidateHandoff:h?{handoffId:h.handoffId||null,handoffSha256:sha(h.handoffSha256),candidateId:h.candidate?.candidateId||null,candidateChecksumSha256:sha(h.candidate?.checksumSha256),intakeState:h.intake?.state||null,upstreamDecision:h.upstreamReview?.decision||null}:null,reviewWorkflow:wf?{workflowId:wf.workflowId||null,workflowSha256:sha(wf.workflowSha256),evidenceBindingSha256:sha(wf.evidenceBindingSha256),assignment:wf.assignment?{claimId:wf.assignment.claimId||null,claimSha256:sha(wf.assignment.claimSha256),authority:wf.assignment.authority||null,productionEligible:wf.assignment.productionEligible??null,evidenceBindingSha256:sha(wf.assignment.evidenceBindingSha256),candidateChecksumSha256:sha(wf.assignment.candidateChecksumSha256),reviewerActorId:wf.assignment.reviewerActorId||null,reviewerDisplayName:wf.assignment.reviewerDisplayName||null,assignedAt:wf.assignment.assignedAt||null}:null}:null,sourceGapResolution:sourceGapResolution?.snapshot?.(master?.canonicalSourceGapResolution,master,references)||null});
  }
  function submissionProblems(master,references=[],input={},actor={}){
    if(!canonical(master))return ['asset is not a governed canonical master'];const p=[],decision=clean(input.decision),wf=master.reviewWorkflow||null,wfFresh=workflow?.freshness?.(wf,master,references)||'unprepared',assignment=wf?.assignment||null,actorId=clean(actor?.actorId),role=clean(actor?.role),results=normalizeResults(master,input.results||master.canonicalReview?.results||[]),gap=master?.canonicalView?.referenceGap,gapResolution=sourceGapResolution?.snapshot?.(master?.canonicalSourceGapResolution,master,references)||null;
    if(!['fitment','admin'].includes(role)||!actorId)p.push('review decision requires an identified fitment/admin reviewer');
    if(!DECISIONS.has(decision))p.push('review decision must be approved or returned');
    if(wfFresh!=='current')p.push(`canonical review workflow is ${wfFresh}`);
    if(!assignment)p.push('canonical review has no assigned reviewer');else if(actorId&&assignment.reviewerActorId!==actorId)p.push(`canonical review is assigned to ${assignment.reviewerDisplayName||assignment.reviewerActorId}, not the acting reviewer`);
    const candidateSha=sha(master?.candidateHandoff?.candidate?.checksumSha256);if(!candidateSha)p.push('canonical candidate checksum is missing');
    if(decision==='approved'){
      const pending=results.filter(x=>x.result!=='pass');if(pending.length)p.push(`approved review decision requires all ${results.length} locked checks to pass`);
      if(gap?.severity==='required'){const gp=sourceGapResolution?.approvalProblems?.(master?.canonicalSourceGapResolution,master,references)||['required source gap resolution is missing'];if(gp.length)p.push(...gp.map(x=>`approved review decision source gap: ${x}`))}
      const intake=workflow?.intake?.(master,references)||{};if(!['ready-for-review','review-in-progress','review-complete-awaiting-approval'].includes(intake.sourceState))p.push(`reviewer intake source state ${intake.sourceState||intake.state||'unknown'} is not approval-ready`);
    }
    if(decision==='returned'&&!results.some(x=>x.result==='fail')&&!clean(input.notes))p.push('returned review decision requires at least one failed check or a reviewer note');
    return unique(p);
  }
  function build({master,references=[],input={},decidedAt=null,decidedBy=null}={}){
    const problems=submissionProblems(master,references,input,decidedBy||{});if(problems.length)return {decision:null,problems};
    const evidence=evidenceBasis(master,references),results=normalizeResults(master,input.results||master.canonicalReview?.results||[]),sourceGapResolutionSnapshot=sourceGapResolution?.snapshot?.(master?.canonicalSourceGapResolution,master,references)||null,at=decidedAt||new Date().toISOString(),by={actorId:clean(decidedBy?.actorId),displayName:clean(decidedBy?.displayName)||clean(decidedBy?.actorId),role:clean(decidedBy?.role)},decision=clean(input.decision),basisSha256=hash(evidence);
    const core=stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,authority:'review-decision-only',productionEligible:false,decisionId:`${master.canonicalView.briefId}-REVIEW-DECISION-${master.candidateHandoff?.candidate?.candidateId||'CANDIDATE'}`,decision,basisSha256,evidenceBasis:evidence,candidateChecksumSha256:sha(master.candidateHandoff?.candidate?.checksumSha256),results,sourceGapResolution:sourceGapResolutionSnapshot,notes:clean(input.notes)||null,decidedAt:at,decidedBy:by});
    return {decision:{...core,decisionSha256:hash(core)},problems:[]};
  }
  function problems(saved,master,references=[]){
    if(!canonical(master))return ['asset is not a governed canonical master'];if(!saved)return ['canonical review decision is not recorded'];const p=[];
    if(saved.schemaVersion!==SCHEMA_VERSION)p.push('canonical review decision schema is stale');if(saved.policy!==POLICY)p.push('canonical review decision policy mismatch');if(saved.purpose!==PURPOSE)p.push('canonical review decision purpose mismatch');if(saved.authority!=='review-decision-only'||saved.productionEligible!==false)p.push('canonical review decision must remain decision-only and non-production');if(!DECISIONS.has(saved.decision))p.push('canonical review decision value is invalid');
    const core=stable({schemaVersion:saved.schemaVersion,policy:saved.policy,purpose:saved.purpose,authority:saved.authority,productionEligible:saved.productionEligible,decisionId:saved.decisionId,decision:saved.decision,basisSha256:saved.basisSha256,evidenceBasis:saved.evidenceBasis,candidateChecksumSha256:saved.candidateChecksumSha256,results:saved.results,sourceGapResolution:saved.sourceGapResolution,notes:saved.notes,decidedAt:saved.decidedAt,decidedBy:saved.decidedBy});if(!sha(saved.decisionSha256)||hash(core)!==sha(saved.decisionSha256))p.push('canonical review decision fingerprint is invalid');
    const current=evidenceBasis(master,references),currentHash=hash(current);if(!currentHash||sha(saved.basisSha256)!==currentHash)p.push('canonical review decision is stale against current evidence');if(sha(saved.candidateChecksumSha256)!==sha(master?.candidateHandoff?.candidate?.checksumSha256))p.push('canonical review decision candidate checksum is stale');if(saved.decidedBy?.actorId!==master?.reviewWorkflow?.assignment?.reviewerActorId)p.push('canonical review decision reviewer no longer matches the assigned reviewer');
    return unique(p);
  }
  function freshness(saved,master,references=[]){const p=problems(saved,master,references);if(!saved)return 'unrecorded';if(p.some(x=>x.includes('fingerprint is invalid')||x.includes('policy mismatch')||x.includes('purpose mismatch')||x.includes('must remain decision-only')||x.includes('value is invalid')))return 'invalid';if(p.some(x=>x.includes('stale')||x.includes('no longer matches')))return 'stale';return p.length?'invalid':'current'}
  function approvalProblems(saved,master,references=[],actor={},candidateChecksumSha256=null){const p=problems(saved,master,references),actorId=clean(actor?.actorId),assignment=master?.reviewWorkflow?.assignment||null,candidateSha=sha(candidateChecksumSha256||master?.file?.checksumSha256);if(saved?.decision!=='approved')p.push('canonical review decision is not approved');if(assignment&&actorId&&assignment.reviewerActorId!==actorId)p.push('acting reviewer does not match the reviewer decision assignment');if(candidateSha&&sha(saved?.candidateChecksumSha256)!==candidateSha)p.push('canonical binary checksum does not match the approved review decision candidate');return unique(p)}
  function summary(masters=[],references=[]){const rows=(masters||[]).filter(canonical).map(m=>({assetId:m.assetId,briefId:m.canonicalView?.briefId||null,freshness:freshness(m.canonicalReviewDecision,m,references),decision:m.canonicalReviewDecision?.decision||null,decidedBy:clone(m.canonicalReviewDecision?.decidedBy||null),candidateChecksumSha256:m.canonicalReviewDecision?.candidateChecksumSha256||null}));return {schemaVersion:SCHEMA_VERSION,policy:POLICY,total:rows.length,current:rows.filter(x=>x.freshness==='current').length,approved:rows.filter(x=>x.freshness==='current'&&x.decision==='approved').length,returned:rows.filter(x=>x.freshness==='current'&&x.decision==='returned').length,stale:rows.filter(x=>x.freshness==='stale').length,invalid:rows.filter(x=>x.freshness==='invalid').length,unrecorded:rows.filter(x=>x.freshness==='unrecorded').length,rows}}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,canonical,referenceSnapshots,normalizeResults,evidenceBasis,submissionProblems,build,problems,freshness,approvalProblems,summary};
});
