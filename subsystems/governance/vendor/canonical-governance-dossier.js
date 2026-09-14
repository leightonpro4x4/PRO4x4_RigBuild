(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const handoff=(typeof module==='object'&&module.exports)?require('./canonical-candidate-handoff.js'):root.PRO4X4_CANONICAL_CANDIDATE_HANDOFF;
  const reviewGate=(typeof module==='object'&&module.exports)?require('./canonical-review-gate.js'):root.PRO4X4_CANONICAL_REVIEW_GATE;
  const attestation=(typeof module==='object'&&module.exports)?require('./reference-provenance-attestation.js'):root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION;
  const sourceGap=(typeof module==='object'&&module.exports)?require('./canonical-source-gap-resolution.js'):root.PRO4X4_CANONICAL_SOURCE_GAP_RESOLUTION;
  const api=factory(integrity,handoff,reviewGate,attestation,sourceGap);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_CANONICAL_GOVERNANCE_DOSSIER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,handoff,reviewGate,attestation,sourceGap){
  'use strict';
  const SCHEMA_VERSION='0.26.28';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='CANONICAL_REVIEWER_EVIDENCE_DOSSIER';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  const sha=v=>/^[a-f0-9]{64}$/i.test(clean(v))?clean(v).toLowerCase():null;
  const canonical=a=>a?.assetClass==='canonical-master'&&a?.layerId==='base'&&!!clean(a?.canonicalView?.briefId);
  function referenceSnapshots(master,references=[]){
    const byId=new Map((references||[]).filter(Boolean).map(r=>[r.assetId,r]));
    const ids=unique([...(master?.referencePack?.requiredReferenceIds||[]),...(master?.canonicalView?.referenceIds||[])]);
    return ids.map(assetId=>{const r=byId.get(assetId);return {assetId,present:!!r,checksumSha256:sha(r?.file?.checksumSha256),governanceState:r?.governance?.state||null,runtimeStatus:r?.status||null,licenceStatus:r?.provenance?.licenceStatus||null,sourceType:r?.provenance?.sourceType||null,authenticityRole:r?.referenceEvidence?.authenticityRole||null,productionEligible:r?.referenceEvidence?.productionEligible??null,provenanceAttestation:attestation?.snapshot?.(r)||null,referencePackId:r?.referencePack?.packId||null,referencePackManifestSha256:sha(r?.referencePack?.manifestSha256)}});
  }
  function reviewResults(master){
    const required=unique(master?.canonicalView?.reviewContractRequiredChecks||[]),byId=new Map((master?.canonicalReview?.results||[]).map(x=>[x.id,x]));
    return required.map(id=>({id,result:byId.get(id)?.result||'pending',note:clean(byId.get(id)?.note)||null}));
  }
  function productionBlockers(master){
    const p=[];
    if(!['master-approved','production-live'].includes(master?.governance?.state))p.push('canonical master approval is not complete');
    if(master?.status!=='production-ready')p.push('no active production-ready canonical binary');
    if(!['owned','licensed'].includes(master?.provenance?.licenceStatus))p.push('production-binary rights are not cleared');
    if(master?.cameraGeometry?.matched!==true)p.push('camera geometry is not matched');
    if(!clean(master?.governance?.reviewedBy)||!clean(master?.governance?.reviewedAt))p.push('identified reviewer evidence is not complete');
    if(!sha(master?.file?.checksumSha256))p.push('canonical binary checksum is missing');
    if(master?.file?.hasAlpha!==true)p.push('transparent canonical binary is not verified');
    return unique(p);
  }
  function reviewEligibility(master,references=[]){
    const h=master?.candidateHandoff||null,hProblems=handoff?.problems?.(h,master)||[],refProblems=reviewGate?.referenceProblems?.(master,references)||[],intakeBlockers=clone(h?.intake?.blockers||[]),review=reviewResults(master),gap=master?.canonicalView?.referenceGap,gapSnapshot=sourceGap?.snapshot?.(master?.canonicalSourceGapResolution,master,references)||null;
    const blockers=unique([...hProblems,...refProblems,...intakeBlockers]);
    if(gap?.severity==='required'&&(gapSnapshot?.freshness!=='current'||gapSnapshot?.decision!=='approved'))blockers.push(`required canonical source gap is ${gapSnapshot?.decision||'missing'} / ${gapSnapshot?.freshness||'missing'}`);
    const failed=review.filter(x=>x.result==='fail').length,passed=review.filter(x=>x.result==='pass').length,pending=review.filter(x=>x.result!=='pass'&&x.result!=='fail').length;
    let state='blocked';
    if(master?.canonicalReviewEvidence?.verdict==='pass')state='approved-review-evidence';
    else if(failed)state='review-return-required';
    else if(h?.intake?.state==='blocked-upstream')state='blocked-upstream';
    else if(h?.intake?.state==='awaiting-wf3-candidate'||!h?.candidate)state='awaiting-wf3-candidate';
    else if(blockers.length)state='blocked-evidence';
    else if(review.length&&passed===review.length)state='review-complete-awaiting-approval';
    else if(passed||pending<review.length)state='review-in-progress';
    else state='ready-for-review';
    return {state,blockers:unique(blockers),requiredChecks:review.length,passedChecks:passed,failedChecks:failed,pendingChecks:pending,nextAction:h?.intake?.nextAction||null};
  }
  function basis(master,references=[]){
    if(!canonical(master))return null;
    const refs=referenceSnapshots(master,references),eligibility=reviewEligibility(master,references),review=reviewResults(master),h=master.candidateHandoff||null,evidence=master.canonicalReviewEvidence||null,assessment=master.readinessAssessment||null;
    return stable({
      schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,authority:'inspection-only',productionEligible:false,
      canonicalMaster:{assetId:master.assetId,briefId:master.canonicalView?.briefId||null,viewId:master.viewId,status:master.status||null,governanceState:master.governance?.state||null,reviewedBy:master.governance?.reviewedBy||null,reviewedAt:master.governance?.reviewedAt||null,currentVersionId:master.lineage?.currentVersionId||null},
      canonicalContract:{reviewContractId:master.canonicalView?.reviewContractId||null,requiredCheckIds:clone(master.canonicalView?.reviewContractRequiredChecks||[]),cameraProfileId:master.cameraGeometry?.profileId||null,cameraMatched:master.cameraGeometry?.matched===true,referenceGap:clone(master.canonicalView?.referenceGap||null),sourceGapResolution:clone(sourceGap?.snapshot?.(master.canonicalSourceGapResolution,master,references)||null)},
      referencePack:{packId:master.referencePack?.packId||null,manifestSha256:sha(master.referencePack?.manifestSha256),requiredReferenceIds:clone(master.referencePack?.requiredReferenceIds||master.canonicalView?.referenceIds||[]),referenceSnapshots:refs},
      candidateHandoff:h?{handoffId:h.handoffId||null,handoffSha256:sha(h.handoffSha256),intakeState:h.intake?.state||null,candidateId:h.candidate?.candidateId||null,candidateChecksumSha256:sha(h.candidate?.checksumSha256),candidateProductionEligible:h.candidate?.productionEligible??null,upstreamDecision:h.upstreamReview?.decision||null,upstreamBlockers:clone(h.intake?.blockers||[])}:null,
      reviewContract:{results:review,evidence:evidence?{verdict:evidence.verdict||null,contractId:evidence.contractId||null,candidateChecksumSha256:sha(evidence.candidateChecksumSha256),reviewedBy:evidence.reviewedBy||null,reviewedAt:evidence.reviewedAt||null,referenceSnapshotCount:(evidence.referenceSnapshots||[]).length}:null},
      readinessAssessment:assessment?{verdict:assessment.verdict||null,fingerprintSha256:sha(assessment.fingerprintSha256),assessedAt:assessment.assessedAt||null,assessedBy:clone(assessment.assessedBy||null)}:null,
      reviewerIntake:eligibility,
      productionBlockers:productionBlockers(master)
    });
  }
  function build({master,references=[],preparedAt=null,preparedBy=null}={}){
    const b=basis(master,references);if(!b)return null;
    return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,dossierId:`${master.canonicalView.briefId}-GOVERNANCE-DOSSIER`,dossierSha256:hash(b),preparedAt:preparedAt||null,preparedBy:preparedBy?clone(preparedBy):null,basis:b};
  }
  function problems(saved,master,references=[]){
    if(!canonical(master))return ['asset is not a governed canonical master'];
    if(!saved)return ['governance dossier is not prepared'];
    const p=[];
    if(saved.policy!==POLICY)p.push('governance dossier policy mismatch');
    if(saved.purpose!==PURPOSE)p.push('governance dossier purpose mismatch');
    if(saved.basis?.authority!=='inspection-only'||saved.basis?.productionEligible!==false)p.push('governance dossier must remain inspection-only and non-production');
    const savedHash=hash(saved.basis||null);
    if(!sha(saved.dossierSha256)||savedHash!==sha(saved.dossierSha256))p.push('governance dossier fingerprint is invalid');
    const current=build({master,references});
    if(current&&sha(saved.dossierSha256)!==sha(current.dossierSha256))p.push('governance dossier is stale against current canonical evidence');
    if(saved.basis?.canonicalMaster?.assetId!==master.assetId)p.push('governance dossier canonical master binding mismatch');
    return unique(p);
  }
  function freshness(saved,master,references=[]){const p=problems(saved,master,references);if(!saved)return 'unprepared';if(p.some(x=>x.includes('fingerprint is invalid')||x.includes('policy mismatch')||x.includes('purpose mismatch')||x.includes('must remain inspection-only')))return 'invalid';if(p.some(x=>x.includes('stale against current canonical evidence')))return 'stale';return p.length?'invalid':'current'}
  function summary(masters=[],references=[]){const rows=(masters||[]).filter(canonical).map(m=>({assetId:m.assetId,briefId:m.canonicalView?.briefId||null,freshness:freshness(m.governanceDossier,m,references),reviewerIntake:reviewEligibility(m,references)}));return {schemaVersion:SCHEMA_VERSION,policy:POLICY,total:rows.length,current:rows.filter(x=>x.freshness==='current').length,stale:rows.filter(x=>x.freshness==='stale').length,invalid:rows.filter(x=>x.freshness==='invalid').length,unprepared:rows.filter(x=>x.freshness==='unprepared').length,rows}}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,canonical,referenceSnapshots,reviewResults,productionBlockers,reviewEligibility,basis,build,problems,freshness,summary};
});
