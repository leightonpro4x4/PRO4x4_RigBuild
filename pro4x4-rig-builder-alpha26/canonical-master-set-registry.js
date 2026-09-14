(function(root,factory){
  const req=name=>(typeof module==='object'&&module.exports)?require(name):null;
  const api=factory(
    req('./audit-integrity.js')||root.PRO4X4_AUDIT_INTEGRITY,
    req('./reference-provenance-attestation.js')||root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION,
    req('./reference-review-decision.js')||root.PRO4X4_REFERENCE_REVIEW_DECISION,
    req('./canonical-governance-dossier.js')||root.PRO4X4_CANONICAL_GOVERNANCE_DOSSIER,
    req('./canonical-review-workflow.js')||root.PRO4X4_CANONICAL_REVIEW_WORKFLOW,
    req('./canonical-review-decision.js')||root.PRO4X4_CANONICAL_REVIEW_DECISION,
    req('./render-readiness-governance.js')||root.PRO4X4_RENDER_READINESS_GOVERNANCE,
    req('./canonical-production-seal.js')||root.PRO4X4_CANONICAL_PRODUCTION_SEAL,
    req('./visual-governance-attention.js')||root.PRO4X4_VISUAL_GOVERNANCE_ATTENTION,
    req('./canonical-view-contract-registry.js')||root.PRO4X4_CANONICAL_VIEW_CONTRACT_REGISTRY,
    req('./canonical-reference-coverage-registry.js')||root.PRO4X4_CANONICAL_REFERENCE_COVERAGE_REGISTRY,
    req('./canonical-source-gap-resolution.js')||root.PRO4X4_CANONICAL_SOURCE_GAP_RESOLUTION,
    req('./visual-governance.js')||root.PRO4X4_VISUAL_GOVERNANCE
  );
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_CANONICAL_MASTER_SET_REGISTRY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,attestation,referenceReviewDecision,dossier,workflow,decision,readiness,productionSeal,attention,viewContractRegistry,referenceCoverageRegistry,sourceGapResolution,visualGovernance){
  'use strict';
  const SCHEMA_VERSION='0.26.29';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='CANONICAL_MASTER_SET_REGISTRY';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(stable(v))):null;
  const canonical=a=>a?.assetClass==='canonical-master'&&a?.layerId==='base'&&!!a?.canonicalView?.briefId;
  const sorted=masters=>(masters||[]).filter(canonical).slice().sort((a,b)=>(a.canonicalView?.priority||99)-(b.canonicalView?.priority||99)||String(a.assetId).localeCompare(String(b.assetId)));
  function refSnapshot(r){return {assetId:r?.assetId||null,checksumSha256:r?.file?.checksumSha256||null,governanceState:r?.governance?.state||null,rights:r?.provenance?.licenceStatus||null,attestationFreshness:attestation?.freshness?.(r?.provenanceAttestation,r)||'missing',attestationSha256:r?.provenanceAttestation?.attestationSha256||null,reviewDecisionFreshness:referenceReviewDecision?.freshness?.(r?.referenceReviewDecision,r)||'missing',reviewDecision:r?.referenceReviewDecision?.decision||null,reviewDecisionSha256:r?.referenceReviewDecision?.decisionSha256||null};}
  function masterSnapshot(m,references=[]){
    const refsById=new Map((references||[]).map(r=>[r.assetId,r])),ids=[...(m.referencePack?.requiredReferenceIds||m.canonicalView?.referenceIds||[])],refSnaps=ids.map(id=>refSnapshot(refsById.get(id)||{assetId:id}));
    const d=m.governanceDossier||null,w=m.reviewWorkflow||null,dec=m.canonicalReviewDecision||null,ra=m.readinessAssessment||null,seal=m.approval?.reviewEvidence?.canonicalProductionSeal||null,att=m.governanceAttention||null,viewContract=m.canonicalViewContract||null,referenceCoverage=m.canonicalReferenceCoverage||null;
    return stable({
      assetId:m.assetId,vehicleId:m.vehicleId,viewId:m.viewId,briefId:m.canonicalView?.briefId||null,priority:m.canonicalView?.priority||99,
      status:m.status||null,governanceState:m.governance?.state||null,productionEligible:!!visualGovernance?.productionEligible?.(m),cameraMatched:m.cameraGeometry?.matched===true,
      canonicalContractSha256:hash({canonicalView:m.canonicalView||null,cameraProfileId:m.cameraGeometry?.profileId||null}),
      canonicalViewContract:{contractSha256:viewContract?.contractSha256||null,basisSha256:viewContract?.basisSha256||null,state:viewContract?.state||null,freshness:viewContractRegistry?.freshness?.(viewContract,m)||'missing'},
      canonicalReferenceCoverage:{coverageSha256:referenceCoverage?.coverageSha256||null,basisSha256:referenceCoverage?.basisSha256||null,status:referenceCoverage?.status||null,freshness:referenceCoverageRegistry?.freshness?.(referenceCoverage,m,references)||'missing',summary:clone(referenceCoverage?.summary||null)},
      canonicalSourceGapResolution:sourceGapResolution?.snapshot?.(m.canonicalSourceGapResolution,m,references)||null,
      referencePack:{packId:m.referencePack?.packId||null,manifestSha256:m.referencePack?.manifestSha256||null,requiredReferenceIds:ids,referenceSnapshots:refSnaps},
      sourceGap:clone(m.canonicalView?.referenceGap||null),
      candidateHandoff:{handoffId:m.candidateHandoff?.handoffId||null,handoffSha256:m.candidateHandoff?.handoffSha256||null,intakeState:m.candidateHandoff?.intake?.state||'awaiting-wf3-candidate',candidateId:m.candidateHandoff?.candidate?.candidateId||null,candidateChecksumSha256:m.candidateHandoff?.candidate?.checksumSha256||null},
      governanceDossier:{dossierSha256:d?.dossierSha256||null,freshness:dossier?.freshness?.(d,m,references)||'unprepared'},
      reviewWorkflow:{workflowSha256:w?.workflowSha256||null,freshness:workflow?.freshness?.(w,m,references)||'unprepared',state:w?.state||null,reviewerActorId:w?.assignment?.reviewerActorId||null,claimId:w?.assignment?.claimId||null,claimSha256:w?.assignment?.claimSha256||null,claimIntegrity:w?.assignment?((workflow?.assignmentProblems?.(w.assignment,m,references)||[]).length===0):null},
      reviewDecision:{decisionSha256:dec?.decisionSha256||null,freshness:decision?.freshness?.(dec,m,references)||'unrecorded',decision:dec?.decision||null,candidateChecksumSha256:dec?.candidateChecksumSha256||null},
      readiness:{assessmentSha256:ra?.assessmentSha256||null,freshness:readiness?.freshness?.(m,readiness?.assess?.(m,references,[])||null)||'unassessed',verdict:ra?.verdict||null},
      productionSeal:{sealSha256:seal?.sealSha256||null,integrity:productionSeal?.integrityState?.(seal)||'unsealed'},
      attention:{attentionSha256:att?.attentionSha256||null,freshness:attention?.freshness?.(att,m,references,[])||'missing',blockers:att?.summary?.blockers??null,actions:att?.summary?.actions??null}
    });
  }
  function basis({vehicleId,masters=[],references=[]}={}){
    const ms=sorted(masters),snapshots=ms.map(m=>masterSnapshot(m,references)),packIds=[...new Set(snapshots.map(x=>x.referencePack.packId).filter(Boolean))],manifestIds=[...new Set(snapshots.map(x=>x.referencePack.manifestSha256).filter(Boolean))];
    return stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,vehicleId:vehicleId||ms[0]?.vehicleId||null,referencePack:{packIds,manifestSha256s:manifestIds},masters:snapshots});
  }
  function issues(b){const out=[],masters=b?.masters||[];if(masters.length<3)out.push(`canonical master set incomplete: ${masters.length}/3 governed views registered`);if((b?.referencePack?.packIds||[]).length!==1)out.push('canonical masters do not share exactly one reference-pack identity');if((b?.referencePack?.manifestSha256s||[]).length!==1)out.push('canonical masters do not share exactly one reference-pack manifest');for(const m of masters){if(m.referencePack.referenceSnapshots.some(r=>!r.checksumSha256))out.push(`${m.briefId}: required reference checksum missing`);if(m.referencePack.referenceSnapshots.some(r=>r.attestationFreshness!=='current'))out.push(`${m.briefId}: required reference provenance attestation not current`);if(m.referencePack.referenceSnapshots.some(r=>r.reviewDecisionFreshness!=='current'||r.reviewDecision!=='approved'))out.push(`${m.briefId}: required reference review decision not current/approved`);if(m.canonicalViewContract.freshness!=='current')out.push(`${m.briefId}: canonical view contract ${m.canonicalViewContract.freshness}`);else if(m.canonicalViewContract.state!=='locked')out.push(`${m.briefId}: canonical view contract ${m.canonicalViewContract.state||'unlocked'}`);if(m.canonicalReferenceCoverage.freshness!=='current')out.push(`${m.briefId}: canonical reference coverage ${m.canonicalReferenceCoverage.freshness}`);else if(m.canonicalReferenceCoverage.status!=='complete')out.push(`${m.briefId}: canonical reference coverage ${m.canonicalReferenceCoverage.status||'blocked'}`);if(m.sourceGap?.severity==='required'&&(m.canonicalSourceGapResolution?.freshness!=='current'||m.canonicalSourceGapResolution?.decision!=='approved'))out.push(`${m.briefId}: required source geometry gap decision ${m.canonicalSourceGapResolution?.decision||'missing'}/${m.canonicalSourceGapResolution?.freshness||'missing'}`);}return [...new Set(out)];}
  function build({vehicleId,masters=[],references=[],generatedAt=new Date().toISOString(),generatedBy=null}={}){const b=basis({vehicleId,masters,references}),problems=issues(b),summary={views:b.masters.length,candidates:b.masters.filter(x=>!!x.candidateHandoff.candidateId).length,reviewAssigned:b.masters.filter(x=>!!x.reviewWorkflow.reviewerActorId).length,approvedDecisions:b.masters.filter(x=>x.reviewDecision.decision==='approved'&&x.reviewDecision.freshness==='current').length,productionSealed:b.masters.filter(x=>x.productionSeal.integrity==='sealed').length,productionEligible:b.masters.filter(x=>x.productionEligible).length,openSetProblems:problems.length};const basisSha256=hash(b),payload={schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,registryId:`${b.vehicleId||'vehicle'}-CANONICAL-MASTER-SET-V1`,authority:'inspection-index-only',productionEligible:false,generatedAt,generatedBy:clone(generatedBy),basis:b,basisSha256,summary,problems};return {...payload,registrySha256:hash(payload)};}
  function integrityProblems(saved){if(!saved)return ['canonical master-set registry is missing'];const copy=clone(saved),sha=copy.registrySha256;delete copy.registrySha256;const p=[];if(saved.schemaVersion!==SCHEMA_VERSION)p.push('canonical master-set registry schema is stale');if(saved.policy!==POLICY||saved.purpose!==PURPOSE||saved.authority!=='inspection-index-only'||saved.productionEligible!==false)p.push('canonical master-set registry authority/policy metadata is invalid');if(hash(copy)!==sha)p.push('canonical master-set registry SHA-256 integrity failed');if(hash(saved.basis)!==saved.basisSha256)p.push('canonical master-set registry basis SHA-256 integrity failed');return p;}
  function freshness(saved,{vehicleId,masters=[],references=[]}={}){if(!saved)return'missing';const p=integrityProblems(saved);if(p.some(x=>x.includes('integrity failed')||x.includes('authority/policy')))return'invalid';const current=basis({vehicleId,masters,references});if(hash(current)!==saved.basisSha256)return'stale';return p.length?'stale':'current';}
  function summary(saved,{vehicleId,masters=[],references=[]}={}){return {state:freshness(saved,{vehicleId,masters,references}),registryId:saved?.registryId||null,registrySha256:saved?.registrySha256||null,...clone(saved?.summary||{views:0,candidates:0,reviewAssigned:0,approvedDecisions:0,productionSealed:0,productionEligible:0,openSetProblems:0})};}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,canonical,basis,build,issues,integrityProblems,freshness,summary};
});
