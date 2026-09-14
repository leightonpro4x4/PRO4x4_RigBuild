(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const api=factory(integrity);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_QUOTE_VISUAL_GOVERNANCE_SEAL=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity){
  'use strict';
  const schemaVersion='0.26.20';
  const policy='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const purpose='QUOTE_VISUAL_GOVERNANCE_EVIDENCE_SEAL';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  const sha=v=>/^[a-f0-9]{64}$/i.test(String(v||''))?String(v).toLowerCase():null;
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const findAsset=(assets,id)=>id?(assets||[]).find(a=>a?.assetId===id)||null:null;
  const findVersion=(versionsByAsset,assetId,checksum)=>((versionsByAsset&&versionsByAsset[assetId])||[]).find(v=>sha(v?.checksumSha256)===sha(checksum))||null;
  function renderSnapshot(render={}){
    return stable({
      view:render?.view||null,
      productionReady:render?.productionReady===true,
      exactMatchRequired:render?.exactMatchRequired!==false,
      fallbackPolicy:render?.fallbackPolicy||'none',
      resolverVersion:render?.resolverVersion||render?.manifestVersion||null,
      layers:(render?.layers||[]).map(l=>({layerId:l?.layerId||null,exactSku:l?.exactSku??null,stateKey:l?.stateKey||null,state:l?.state||'missing',reason:l?.reason||null,assetId:l?.assetId||null,checksumSha256:sha(l?.checksumSha256)}))
    });
  }
  function renderHash(render){return hash(renderSnapshot(render||{}))}
  function attestationSnapshot(r){const a=r?.provenanceAttestation||null;return r?{assetId:r.assetId,checksumSha256:sha(r.file?.checksumSha256),status:r.status||null,governanceState:r.governance?.state||null,sourceType:r.provenance?.sourceType||null,licenceStatus:r.provenance?.licenceStatus||null,productionEligible:r.referenceEvidence?.productionEligible??null,referencePackId:r.referencePack?.packId||null,referencePackManifestSha256:sha(r.referencePack?.manifestSha256),attestationId:a?.attestationId||null,attestationBasisSha256:sha(a?.basisSha256),attestedAt:a?.attestedAt||null,attestedBy:clone(a?.attestedBy||null)}:null}
  function canonicalSnapshot(master,references=[]){
    if(!master)return null;
    const refIds=unique([...(master.referencePack?.requiredReferenceIds||[]),...(master.canonicalView?.referenceIds||[])]),byId=new Map((references||[]).map(r=>[r.assetId,r]));
    const refs=refIds.map(id=>attestationSnapshot(byId.get(id)||{assetId:id}));
    return stable({
      assetId:master.assetId||null,assetClass:master.assetClass||null,vehicleId:master.vehicleId||null,viewId:master.viewId||null,layerId:master.layerId||null,status:master.status||null,
      governanceState:master.governance?.state||null,reviewedBy:master.governance?.reviewedBy||null,reviewedAt:master.governance?.reviewedAt||null,fileChecksumSha256:sha(master.file?.checksumSha256),currentVersionId:master.lineage?.currentVersionId||null,
      canonicalView:{briefId:master.canonicalView?.briefId||null,reviewContractId:master.canonicalView?.reviewContractId||null,requiredCheckIds:clone(master.canonicalView?.reviewContractRequiredChecks||[]),cameraProfileId:master.cameraGeometry?.profileId||null,cameraMatched:master.cameraGeometry?.matched===true,referenceGap:clone(master.canonicalView?.referenceGap||null)},
      referencePack:master.referencePack?{packId:master.referencePack.packId||null,manifestSha256:sha(master.referencePack.manifestSha256),requiredReferenceIds:clone(master.referencePack.requiredReferenceIds||refIds)}:null,
      references:refs,
      candidateHandoff:master.candidateHandoff?{handoffId:master.candidateHandoff.handoffId||null,handoffSha256:sha(master.candidateHandoff.handoffSha256),intakeState:master.candidateHandoff.intake?.state||null,candidateId:master.candidateHandoff.candidate?.candidateId||null,candidateChecksumSha256:sha(master.candidateHandoff.candidate?.checksumSha256),upstreamDecision:master.candidateHandoff.upstreamReview?.decision||null,blockerCount:(master.candidateHandoff.intake?.blockers||[]).length}:null,
      governanceDossier:master.governanceDossier?{dossierId:master.governanceDossier.dossierId||null,dossierSha256:sha(master.governanceDossier.dossierSha256),preparedAt:master.governanceDossier.preparedAt||null,reviewerIntakeState:master.governanceDossier.basis?.reviewerIntake?.state||null}:null,
      reviewWorkflow:master.reviewWorkflow?{workflowId:master.reviewWorkflow.workflowId||null,bindingSha256:sha(master.reviewWorkflow.bindingSha256),state:master.reviewWorkflow.state||master.reviewWorkflow.intake?.state||null,assignedReviewerId:master.reviewWorkflow.assignment?.reviewerId||master.reviewWorkflow.assignment?.actorId||null,assignedAt:master.reviewWorkflow.assignment?.claimedAt||master.reviewWorkflow.assignment?.assignedAt||null}:null,
      canonicalReviewEvidence:master.canonicalReviewEvidence?{verdict:master.canonicalReviewEvidence.verdict||null,contractId:master.canonicalReviewEvidence.contractId||null,candidateChecksumSha256:sha(master.canonicalReviewEvidence.candidateChecksumSha256),reviewedBy:master.canonicalReviewEvidence.reviewedBy||null,reviewedAt:master.canonicalReviewEvidence.reviewedAt||null,referenceSnapshotCount:(master.canonicalReviewEvidence.referenceSnapshots||[]).length}:null,
      readinessAssessment:master.readinessAssessment?{verdict:master.readinessAssessment.verdict||null,fingerprintSha256:sha(master.readinessAssessment.fingerprintSha256),assessedAt:master.readinessAssessment.assessedAt||null,assessedBy:clone(master.readinessAssessment.assessedBy||null)}:null,
      governanceWriteBoundary:master.governanceWriteBoundary?{policy:master.governanceWriteBoundary.policy||null,fingerprintSha256:sha(master.governanceWriteBoundary.fingerprintSha256||master.governanceWriteBoundary.basisSha256),freshness:master.governanceWriteBoundary.freshness||null}:null
    });
  }
  function layerSnapshot(layer,assets=[],versionsByAsset={}){
    const out={layerId:layer?.layerId||null,exactSku:layer?.exactSku??null,stateKey:layer?.stateKey||null,state:layer?.state||'missing',reason:layer?.reason||null,assetId:layer?.assetId||null,checksumSha256:sha(layer?.checksumSha256),evidenceAuthority:'not-required'};
    if(out.state!=='available')return stable(out);
    const asset=findAsset(assets,out.assetId),version=findVersion(versionsByAsset,out.assetId,out.checksumSha256),payload=version?.payload||asset||{};
    return stable({...out,
      evidenceAuthority:version?'immutable-version':'registry-snapshot',assetClass:payload.assetClass||asset?.assetClass||null,registryStatus:asset?.status||payload.status||null,governanceState:payload.governance?.state||null,versionId:version?.versionId||null,versionState:version?.state||null,
      reviewedBy:payload.approval?.reviewEvidence?.reviewedBy||payload.governance?.reviewedBy||null,reviewedAt:payload.approval?.reviewEvidence?.reviewedAt||payload.governance?.reviewedAt||null,
      canonicalBriefId:payload.canonicalView?.briefId||payload.cameraGeometry?.profileId||null,referencePackId:payload.referencePack?.packId||null,referencePackManifestSha256:sha(payload.referencePack?.manifestSha256),
      canonicalMasterAssetId:payload.assetClass==='canonical-master'&&payload.layerId==='base'?payload.assetId||out.assetId:payload.compositeEligibility?.canonicalMasterAssetId||null,
      compositeBinding:payload.compositeEligibility?{canonicalMasterAssetId:payload.compositeEligibility.canonicalMasterAssetId||null,canonicalBriefId:payload.compositeEligibility.canonicalBriefId||null,policy:payload.compositeEligibility.policy||null,exactMatchRequired:payload.compositeEligibility.exactMatchRequired===true,fallbackPolicy:payload.compositeEligibility.fallbackPolicy||null}:null
    });
  }
  function findCanonicalMaster(quote,assets=[]){
    const vehicleId=quote?.vehicle?.id||null,viewId=quote?.render?.view||quote?.vehicle?.view||null;
    const exact=(assets||[]).filter(a=>a?.vehicleId===vehicleId&&a?.viewId===viewId&&a?.assetClass==='canonical-master'&&a?.layerId==='base'&&a?.canonicalView?.briefId);
    if(!exact.length)return null;
    return [...exact].sort((a,b)=>Number(a.canonicalView?.priority||99)-Number(b.canonicalView?.priority||99))[0]||null;
  }
  function basis({quote,assets=[],versionsByAsset={}}={}){
    const render=renderSnapshot(quote?.render||{}),canonical=findCanonicalMaster(quote,assets),refs=(assets||[]).filter(a=>a?.assetClass==='reference'&&(!quote?.vehicle?.id||a.vehicleId===quote.vehicle.id)),master=canonicalSnapshot(canonical,refs),layers=render.layers.map(l=>layerSnapshot(l,assets,versionsByAsset));
    return stable({schemaVersion,policy,purpose,authority:'inspection-only',productionEligible:false,quote:{reference:quote?.reference||null,projectId:quote?.project?.id||null,revisionId:quote?.project?.revisionId||null,vehicleId:quote?.vehicle?.id||null,viewId:render.view,renderSnapshotSha256:hash(render)},canonicalMaster:master,referencePack:master?.referencePack||null,resolvedLayers:layers});
  }
  function seal({quote,assets=[],versionsByAsset={},sealedAt=null,sealedBy=null}={}){const b=basis({quote,assets,versionsByAsset});return {schemaVersion,policy,purpose,sealSha256:hash(b),sealedAt:sealedAt||null,sealedBy:sealedBy?clone(sealedBy):null,basis:b}}
  function currentFingerprint(snapshot){return snapshot?hash(snapshot):null}
  function inspect(saved,{quote,assets=[],versionsByAsset={}}={}){
    if(!saved)return {schemaVersion,policy,purpose,state:'legacy-unsealed',problems:[],warnings:['Quote predates the persisted visual-governance evidence seal.'],sealSha256:null,sealedAt:null,sealedBy:null,canonicalMaster:null,currentCanonicalMaster:canonicalSnapshot(findCanonicalMaster(quote,assets),(assets||[]).filter(a=>a?.assetClass==='reference')),referencePack:null,resolvedLayers:[]};
    const problems=[],warnings=[];
    if(saved.policy!==policy)problems.push('visual-governance seal policy mismatch');
    if(saved.purpose!==purpose)problems.push('visual-governance seal purpose mismatch');
    const declared=sha(saved.sealSha256),actual=hash(saved.basis||null);if(!declared||declared!==actual)problems.push('visual-governance seal fingerprint is invalid');
    const expectedRenderHash=hash(renderSnapshot(quote?.render||{})),sealedRenderHash=sha(saved.basis?.quote?.renderSnapshotSha256);if(!sealedRenderHash||sealedRenderHash!==expectedRenderHash)problems.push('quote render snapshot changed after visual-governance sealing');
    const currentMaster=canonicalSnapshot(findCanonicalMaster(quote,assets),(assets||[]).filter(a=>a?.assetClass==='reference'));
    const sealedMaster=saved.basis?.canonicalMaster||null;
    if(sealedMaster&&currentMaster&&currentFingerprint(sealedMaster)!==currentFingerprint(currentMaster))warnings.push('Current canonical master/reference-pack governance differs from the state sealed with this quote.');
    else if(sealedMaster&&!currentMaster)warnings.push('The canonical master sealed with this quote is no longer registered in the current staff registry.');
    else if(!sealedMaster&&currentMaster)warnings.push('A canonical master now exists for this view but was not present when the quote was sealed.');
    for(const l of saved.basis?.resolvedLayers||[]){
      if(l.state!=='available')continue;
      if(!l.assetId||!sha(l.checksumSha256)){problems.push(`sealed available layer ${l.layerId||'layer'} has incomplete asset/checksum evidence`);continue}
      const version=findVersion(versionsByAsset,l.assetId,l.checksumSha256),asset=findAsset(assets,l.assetId);
      if(l.evidenceAuthority==='immutable-version'){
        if(!version)problems.push(`sealed visual ${l.assetId} checksum no longer resolves to immutable version evidence`);
        else if(!['production','superseded'].includes(version.state))problems.push(`sealed visual ${l.assetId} immutable version is no longer production/superseded`);
        else if(currentFingerprint(layerSnapshot({layerId:l.layerId,exactSku:l.exactSku,stateKey:l.stateKey,state:'available',reason:l.reason,assetId:l.assetId,checksumSha256:l.checksumSha256},assets,versionsByAsset))!==currentFingerprint(l))warnings.push(`Historical evidence metadata for sealed visual ${l.assetId} differs from the quote-time snapshot.`);
      }else if(!asset)warnings.push(`Browser-local registry evidence for sealed visual ${l.assetId} is no longer present.`);
    }
    const state=problems.length?'blocked':warnings.length?'verified-with-drift':'verified';
    return {schemaVersion,policy,purpose,state,problems,warnings,sealSha256:declared,sealedAt:saved.sealedAt||null,sealedBy:clone(saved.sealedBy||null),canonicalMaster:clone(sealedMaster),currentCanonicalMaster:currentMaster,referencePack:clone(saved.basis?.referencePack||null),resolvedLayers:clone(saved.basis?.resolvedLayers||[])};
  }
  return {schemaVersion,policy,purpose,renderSnapshot,renderHash,canonicalSnapshot,layerSnapshot,findCanonicalMaster,basis,seal,inspect};
});
