(function(root,factory){
  const req=name=>(typeof module==='object'&&module.exports)?require(name):null;
  const api=factory(
    req('./audit-integrity.js')||root.PRO4X4_AUDIT_INTEGRITY,
    req('./reference-provenance-attestation.js')||root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION,
    req('./reference-review-decision.js')||root.PRO4X4_REFERENCE_REVIEW_DECISION,
    req('./canonical-view-contract-registry.js')||root.PRO4X4_CANONICAL_VIEW_CONTRACT_REGISTRY
  );
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_CANONICAL_SOURCE_GAP_RESOLUTION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,attestation,referenceReviewDecision,viewContractRegistry){
  'use strict';
  const SCHEMA_VERSION='0.26.28';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='CANONICAL_SOURCE_GAP_RESOLUTION';
  const DECISIONS=new Set(['open','approved','returned']);
  const METHODS=new Set(['additional-reference','reviewed-reconstruction']);
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const sha=v=>/^[a-f0-9]{64}$/i.test(clean(v))?clean(v).toLowerCase():null;
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(stable(v))):null;
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const canonical=a=>a?.assetClass==='canonical-master'&&a?.layerId==='base'&&!!a?.canonicalView?.briefId;
  const requiredGap=a=>canonical(a)&&a?.canonicalView?.referenceGap?.severity==='required'?clone(a.canonicalView.referenceGap):null;
  function refSnapshot(r,briefId){
    return stable({assetId:r?.assetId||null,present:!!r,viewId:r?.viewId||null,checksumSha256:sha(r?.file?.checksumSha256),status:r?.status||null,governanceState:r?.governance?.state||null,sourceType:r?.provenance?.sourceType||null,rights:r?.provenance?.licenceStatus||null,canonicalViewDeclared:!!r&&(r.referenceEvidence?.canonicalViewIds||[]).includes(briefId),productionEligible:r?.referenceEvidence?.productionEligible??null,attestationFreshness:r?attestation?.freshness?.(r.provenanceAttestation,r)||'missing':'missing',attestationSha256:sha(r?.provenanceAttestation?.attestationSha256),reviewDecisionFreshness:r?referenceReviewDecision?.freshness?.(r.referenceReviewDecision,r)||'missing':'missing',reviewDecision:r?.referenceReviewDecision?.decision||null,reviewDecisionSha256:sha(r?.referenceReviewDecision?.decisionSha256),referencePackId:r?.referencePack?.packId||null,referencePackManifestSha256:sha(r?.referencePack?.manifestSha256)});
  }
  function referenceEligible(r,briefId,master=null){const s=refSnapshot(r,briefId),sameView=!master||r?.viewId===master?.viewId,samePack=!master||(r?.referencePack?.packId===master?.referencePack?.packId&&sha(r?.referencePack?.manifestSha256)===sha(master?.referencePack?.manifestSha256));return !!r&&s.status==='reference-only'&&s.governanceState==='reference-approved'&&s.productionEligible===false&&!!s.checksumSha256&&s.canonicalViewDeclared&&sameView&&samePack&&s.attestationFreshness==='current'&&s.reviewDecisionFreshness==='current'&&s.reviewDecision==='approved'}
  function basis(master,references=[],opts={}){
    if(!requiredGap(master))return null;
    const briefId=master.canonicalView.briefId,ids=unique(opts.evidenceReferenceIds||[]),byId=new Map((references||[]).map(r=>[r.assetId,r])),requiredIds=unique([...(master.referencePack?.requiredReferenceIds||[]),...(master.canonicalView?.referenceIds||[])]),vc=master.canonicalViewContract||null,h=master.candidateHandoff||null,w=master.reviewWorkflow||null;
    return stable({
      schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,
      canonicalMaster:{assetId:master.assetId,vehicleId:master.vehicleId,viewId:master.viewId,briefId},
      declaredGap:clone(master.canonicalView.referenceGap),
      resolutionMethod:opts.resolutionMethod||null,
      referencePack:{packId:master.referencePack?.packId||null,manifestSha256:sha(master.referencePack?.manifestSha256),requiredReferenceIds:clone(master.referencePack?.requiredReferenceIds||[])},
      canonicalViewContract:{contractSha256:sha(vc?.contractSha256),basisSha256:sha(vc?.basisSha256),state:vc?.state||null,freshness:viewContractRegistry?.freshness?.(vc,master)||'missing'},
      candidateHandoff:opts.resolutionMethod==='reviewed-reconstruction'&&h?{handoffId:h.handoffId||null,handoffSha256:sha(h.handoffSha256),intakeState:h.intake?.state||null,candidateId:h.candidate?.candidateId||null,candidateChecksumSha256:sha(h.candidate?.checksumSha256),upstreamDecision:h.upstreamReview?.decision||null}:null,
      reviewWorkflow:opts.resolutionMethod==='reviewed-reconstruction'&&w?{workflowId:w.workflowId||null,workflowSha256:sha(w.workflowSha256),state:w.state||null,assignment:w.assignment?{reviewerActorId:w.assignment.reviewerActorId||null,reviewerDisplayName:w.assignment.reviewerDisplayName||null,assignedAt:w.assignment.assignedAt||null}:null}:null,
      cameraMatched:opts.resolutionMethod==='reviewed-reconstruction'?master.cameraGeometry?.matched===true:null,
      requiredReferenceSnapshots:requiredIds.map(id=>refSnapshot(byId.get(id)||{assetId:id},briefId)),
      evidenceReferences:ids.map(id=>refSnapshot(byId.get(id)||{assetId:id},briefId))
    });
  }
  function approvalPathProblems(master,references=[],input={},actor={}){
    const gap=requiredGap(master);if(!gap)return [];
    const p=[],method=clean(input.resolutionMethod),actorId=clean(actor?.actorId),role=clean(actor?.role),briefId=master.canonicalView.briefId;
    if(!['fitment','admin'].includes(role)||!actorId)p.push('source-gap resolution requires an identified fitment/admin reviewer');
    if(!METHODS.has(method))p.push('source-gap approval requires resolutionMethod additional-reference or reviewed-reconstruction');
    if(method==='additional-reference'){
      const ids=unique(input.evidenceReferenceIds||[]),byId=new Map((references||[]).map(r=>[r.assetId,r]));
      if(!ids.length)p.push('additional-reference resolution requires at least one evidence reference');
      for(const id of ids){const r=byId.get(id);if(!r)p.push(`source-gap evidence reference ${id} is not registered`);else if(!referenceEligible(r,briefId,master))p.push(`source-gap evidence reference ${id} is not current, approved, attested, exact-view, same-pack evidence bound to ${briefId}`)}
    }
    if(method==='reviewed-reconstruction'){
      const vc=master.canonicalViewContract||null,vcFresh=viewContractRegistry?.freshness?.(vc,master)||'missing',h=master.candidateHandoff||null,w=master.reviewWorkflow||null,a=w?.assignment||null;
      if(vcFresh!=='current'||vc?.state!=='locked')p.push(`reviewed reconstruction requires a CURRENT/LOCKED canonical view contract (now ${vcFresh}/${vc?.state||'missing'})`);
      if(!sha(h?.candidate?.checksumSha256))p.push('reviewed reconstruction requires a checksum-identified WF3 candidate');
      if(h?.intake?.state!=='ready-for-wf4-review')p.push(`reviewed reconstruction requires WF3 handoff ready-for-wf4-review (now ${h?.intake?.state||'missing'})`);
      if(!a)p.push('reviewed reconstruction requires a claimed canonical reviewer');else if(a.reviewerActorId!==actorId)p.push(`reviewed reconstruction is assigned to ${a.reviewerDisplayName||a.reviewerActorId}, not the acting reviewer`);
      if(w?.state!=='claimed')p.push(`reviewed reconstruction requires claimed reviewer workflow (now ${w?.state||'unprepared'})`);
      if(master.cameraGeometry?.matched!==true)p.push('reviewed reconstruction requires the candidate camera/geometry overlay to be marked matched');
      if(!clean(input.notes))p.push('reviewed reconstruction approval requires a reviewer note explaining the geometry evidence');
    }
    return unique(p);
  }
  function submissionProblems(master,references=[],input={},actor={}){
    if(!canonical(master))return ['asset is not a governed canonical master'];const gap=requiredGap(master),p=[],decision=clean(input.decision);
    if(!gap)return ['canonical master has no required source gap'];
    if(!['approved','returned'].includes(decision))p.push('source-gap decision must be approved or returned');
    if(decision==='approved')p.push(...approvalPathProblems(master,references,input,actor));
    if(decision==='returned'){
      if(!['fitment','admin'].includes(clean(actor?.role))||!clean(actor?.actorId))p.push('source-gap resolution requires an identified fitment/admin reviewer');
      if(!clean(input.notes))p.push('returned source-gap decision requires a reviewer note');
    }
    return unique(p);
  }
  function buildOpen(master,references=[],{generatedAt=new Date().toISOString(),generatedBy=null}={}){
    if(!requiredGap(master))return null;const b=basis(master,references,{}),basisSha256=hash(b),core=stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,authority:'source-gap-decision-only',productionEligible:false,resolutionId:`${master.canonicalView.briefId}-SOURCE-GAP-V1`,decision:'open',resolutionMethod:null,evidenceReferenceIds:[],basisSha256,evidenceBasis:b,notes:master.canonicalView.referenceGap.note||null,decidedAt:generatedAt,decidedBy:clone(generatedBy)});return {...core,resolutionSha256:hash(core)};
  }
  function buildDecision({master,references=[],input={},decidedAt=new Date().toISOString(),decidedBy=null}={}){
    const problems=submissionProblems(master,references,input,decidedBy||{});if(problems.length)return {resolution:null,problems};
    const decision=clean(input.decision),method=decision==='approved'?clean(input.resolutionMethod):null,ids=decision==='approved'?unique(input.evidenceReferenceIds||[]):[],b=basis(master,references,{resolutionMethod:method,evidenceReferenceIds:ids}),basisSha256=hash(b),core=stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,authority:'source-gap-decision-only',productionEligible:false,resolutionId:`${master.canonicalView.briefId}-SOURCE-GAP-V1`,decision,resolutionMethod:method,evidenceReferenceIds:ids,basisSha256,evidenceBasis:b,notes:clean(input.notes)||null,decidedAt,decidedBy:{actorId:clean(decidedBy?.actorId),displayName:clean(decidedBy?.displayName)||clean(decidedBy?.actorId),role:clean(decidedBy?.role)}});return {resolution:{...core,resolutionSha256:hash(core)},problems:[]};
  }
  function integrityProblems(saved){if(!saved)return ['source-gap resolution is not persisted'];const copy=clone(saved),shaStored=sha(copy.resolutionSha256);delete copy.resolutionSha256;const p=[];if(saved.schemaVersion!==SCHEMA_VERSION)p.push('source-gap resolution schema is stale');if(saved.policy!==POLICY||saved.purpose!==PURPOSE||saved.authority!=='source-gap-decision-only'||saved.productionEligible!==false)p.push('source-gap resolution authority/policy metadata is invalid');if(!DECISIONS.has(saved.decision))p.push('source-gap resolution decision is invalid');if(!shaStored||hash(copy)!==shaStored)p.push('source-gap resolution SHA-256 integrity failed');if(hash(saved.evidenceBasis)!==sha(saved.basisSha256))p.push('source-gap resolution basis SHA-256 integrity failed');return unique(p)}
  function problems(saved,master,references=[]){
    if(!requiredGap(master))return saved?['source-gap resolution exists for a canonical master without a required gap']:[];if(!saved)return ['source-gap resolution is not persisted'];const p=[...integrityProblems(saved)],current=basis(master,references,{resolutionMethod:saved.resolutionMethod,evidenceReferenceIds:saved.evidenceReferenceIds||[]});if(hash(current)!==sha(saved.basisSha256))p.push('source-gap resolution is stale against current canonical/reference evidence');
    if(saved.decision==='approved'){
      if(!METHODS.has(saved.resolutionMethod))p.push('approved source-gap resolution method is invalid');
      if(saved.resolutionMethod==='additional-reference'){const byId=new Map((references||[]).map(r=>[r.assetId,r]));for(const id of saved.evidenceReferenceIds||[])if(!referenceEligible(byId.get(id),master.canonicalView.briefId,master))p.push(`approved source-gap evidence reference ${id} is no longer current/eligible`)}
    }
    return unique(p);
  }
  function freshness(saved,master,references=[]){if(!saved)return'missing';const p=problems(saved,master,references);if(p.some(x=>x.includes('integrity failed')||x.includes('authority/policy')||x.includes('decision is invalid')||x.includes('method is invalid')))return'invalid';if(p.some(x=>x.includes('stale')||x.includes('no longer current/eligible')||x.includes('schema is stale')))return'stale';return p.length?'invalid':'current'}
  function approvalProblems(saved,master,references=[]){const p=problems(saved,master,references);if(requiredGap(master)&&saved?.decision!=='approved')p.push(`required source gap decision is ${saved?.decision||'missing'}, not approved`);return unique(p)}
  function readinessProblems(saved,master,references=[]){if(!requiredGap(master))return[];return approvalProblems(saved,master,references)}
  function snapshot(saved,master,references=[]){if(!requiredGap(master))return null;return {resolutionId:saved?.resolutionId||`${master?.canonicalView?.briefId||master?.assetId}-SOURCE-GAP-V1`,decision:saved?.decision||'missing',resolutionMethod:saved?.resolutionMethod||null,evidenceReferenceIds:clone(saved?.evidenceReferenceIds||[]),resolutionSha256:sha(saved?.resolutionSha256),basisSha256:sha(saved?.basisSha256),freshness:freshness(saved,master,references),notes:saved?.notes||null,decidedAt:saved?.decidedAt||null,decidedBy:clone(saved?.decidedBy||null),authority:saved?.authority||'source-gap-decision-only',productionEligible:false}}
  function summary(masters=[],references=[]){const rows=(masters||[]).filter(m=>requiredGap(m)).map(m=>({assetId:m.assetId,briefId:m.canonicalView?.briefId||null,viewId:m.viewId,...snapshot(m.canonicalSourceGapResolution,m,references)}));return {schemaVersion:SCHEMA_VERSION,policy:POLICY,totalRequired:rows.length,current:rows.filter(x=>x.freshness==='current').length,approved:rows.filter(x=>x.freshness==='current'&&x.decision==='approved').length,open:rows.filter(x=>x.freshness==='current'&&x.decision==='open').length,returned:rows.filter(x=>x.freshness==='current'&&x.decision==='returned').length,stale:rows.filter(x=>x.freshness==='stale').length,invalid:rows.filter(x=>x.freshness==='invalid').length,missing:rows.filter(x=>x.freshness==='missing').length,rows}}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,canonical,requiredGap,refSnapshot,referenceEligible,basis,approvalPathProblems,submissionProblems,buildOpen,buildDecision,integrityProblems,problems,freshness,approvalProblems,readinessProblems,snapshot,summary};
});
