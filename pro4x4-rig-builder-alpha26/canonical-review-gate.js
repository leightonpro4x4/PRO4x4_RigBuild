(function(root,factory){
  const attestation=(typeof module==='object'&&module.exports)?require('./reference-provenance-attestation.js'):root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION;
  const referenceReviewDecision=(typeof module==='object'&&module.exports)?require('./reference-review-decision.js'):root.PRO4X4_REFERENCE_REVIEW_DECISION;
  const sourceGapResolution=(typeof module==='object'&&module.exports)?require('./canonical-source-gap-resolution.js'):root.PRO4X4_CANONICAL_SOURCE_GAP_RESOLUTION;
  const api=factory(attestation,referenceReviewDecision,sourceGapResolution);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_CANONICAL_REVIEW_GATE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(attestation,referenceReviewDecision,sourceGapResolution){
  const SCHEMA_VERSION='0.26.28';
  const sha=v=>/^[a-f0-9]{64}$/i.test(String(v||''))?String(v).toLowerCase():null;
  const clean=v=>String(v??'').trim();
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const inferClass=a=>a?.assetClass||(a?.layerId==='base'?'canonical-master':null);
  const inferState=a=>a?.governance?.state||null;
  const referenceState=r=>r?.governance?.state||null;
  const governedCanonical=a=>inferClass(a)==='canonical-master'&&a?.layerId==='base'&&!!clean(a?.canonicalView?.briefId);
  function referenceMap(references=[]){return new Map((references||[]).filter(Boolean).map(r=>[r.assetId,r]))}
  function requiredReferenceIds(asset){return [...new Set([...(asset?.canonicalView?.referenceIds||[]),...(asset?.provenance?.referenceIds||[])].filter(Boolean))]}
  function draftResults(asset){return new Map((asset?.canonicalReview?.results||[]).map(x=>[x.id,x]))}
  function evidenceResults(asset){return new Map((asset?.canonicalReviewEvidence?.results||[]).map(x=>[x.id,x]))}
  function requiredChecks(asset){return [...new Set(asset?.canonicalView?.reviewContractRequiredChecks||[])]}
  function referenceProblems(asset,references=[]){
    if(!governedCanonical(asset))return[];
    const problems=[],refs=referenceMap(references),ids=requiredReferenceIds(asset),pack=asset?.referencePack||null;
    if(!asset?.canonicalView?.briefId)problems.push('canonical brief identity missing');
    if(!ids.length)problems.push('canonical reference pack is empty');
    if(pack&&(!clean(pack.packId)||!sha(pack.manifestSha256)))problems.push('canonical master reference-pack binding is incomplete');
    for(const id of ids){
      const r=refs.get(id);
      if(!r){problems.push(`required reference ${id} is not registered`);continue}
      if(inferClass(r)!=='reference')problems.push(`required reference ${id} is not governed as reference evidence`);
      if(r.status!=='reference-only')problems.push(`required reference ${id} must remain reference-only`);
      if(referenceState(r)!=='reference-approved')problems.push(`required reference ${id} is not reference-approved`);
      if(r.referenceEvidence?.productionEligible!==false)problems.push(`required reference ${id} must record productionEligible false`);
      if(!sha(r.file?.checksumSha256))problems.push(`required reference ${id} has no valid SHA-256`);
      const attestationProblems=attestation?.problems?.(r.provenanceAttestation,r)||[];if(attestationProblems.length)problems.push(`required reference ${id} provenance attestation is not current`);
      const referenceReviewProblems=referenceReviewDecision?.approvalProblems?.(r.referenceReviewDecision,r)||[];if(referenceReviewProblems.length)problems.push(`required reference ${id} review decision is not current/approved`);
      if(pack){
        if(r.referencePack?.packId!==pack.packId)problems.push(`required reference ${id} is not bound to canonical pack ${pack.packId||'unknown'}`);
        if(sha(r.referencePack?.manifestSha256)!==sha(pack.manifestSha256))problems.push(`required reference ${id} carries a stale canonical reference-pack manifest`);
      }
    }
    return [...new Set(problems)];
  }
  function draftProblems(asset,references=[]){
    if(!governedCanonical(asset))return[];
    const problems=[...referenceProblems(asset,references)],review=asset?.canonicalReview||{},checks=requiredChecks(asset),results=draftResults(asset),contractId=asset?.canonicalView?.reviewContractId||null;
    if(contractId&&review.contractId!==contractId)problems.push(`canonical review contract must be ${contractId}`);
    for(const id of checks){const r=results.get(id);if(!r)problems.push(`required review check ${id} is missing`);else if(r.result!=='pass')problems.push(`required review check ${id} must pass`)}
    const gap=asset?.canonicalView?.referenceGap;if(gap?.severity==='required'){const gp=sourceGapResolution?.approvalProblems?.(asset?.canonicalSourceGapResolution,asset,references)||['required canonical source gap has no governed approved resolution'];if(gp.length)problems.push(...gp.map(x=>`source gap: ${x}`))}
    if(!sha(asset?.file?.checksumSha256))problems.push('canonical candidate checksum is missing');
    if(inferState(asset)==='master-approved'){
      if(!clean(asset?.governance?.reviewedBy))problems.push('canonical reviewer identity is missing');
      const at=clean(asset?.governance?.reviewedAt);if(!at)problems.push('canonical review timestamp is missing');else if(Number.isNaN(Date.parse(at)))problems.push('canonical review timestamp is invalid');
    }
    return [...new Set(problems)];
  }
  function buildEvidence(asset,references=[]){
    const problems=draftProblems(asset,references);if(problems.length)return {evidence:null,problems};
    const refs=referenceMap(references),ids=requiredReferenceIds(asset),checks=requiredChecks(asset),results=draftResults(asset),review=asset.canonicalReview||{};
    const evidence={
      schemaVersion:SCHEMA_VERSION,
      verdict:'pass',briefId:asset.canonicalView?.briefId||null,viewId:asset.viewId,
      contractId:asset.canonicalView?.reviewContractId||review.contractId||null,
      candidateChecksumSha256:sha(asset.file?.checksumSha256),reviewedBy:clean(asset.governance?.reviewedBy)||null,reviewedAt:clean(asset.governance?.reviewedAt)||null,
      requiredCheckIds:checks,
      results:checks.map(id=>({id,result:'pass',note:clean(results.get(id)?.note)||null})),
      referenceSnapshots:ids.map(id=>{const r=refs.get(id),att=attestation?.snapshot?.(r)||null,decision=referenceReviewDecision?.snapshot?.(r)||null;return {assetId:id,checksumSha256:sha(r?.file?.checksumSha256),governanceState:referenceState(r),sourceType:r?.provenance?.sourceType||null,licenceStatus:r?.provenance?.licenceStatus||null,authenticityRole:r?.referenceEvidence?.authenticityRole||null,referencePackId:r?.referencePack?.packId||null,referencePackManifestSha256:sha(r?.referencePack?.manifestSha256),provenanceAttestation:att,referenceReviewDecision:decision}}),
      referencePack:asset.referencePack?{packId:asset.referencePack.packId||null,manifestSha256:sha(asset.referencePack.manifestSha256),requiredReferenceIds:clone(asset.referencePack.requiredReferenceIds||[])}:null,
      sourceGapResolution:sourceGapResolution?.snapshot?.(asset?.canonicalSourceGapResolution,asset,references)||null
    };
    return {evidence,problems:[]};
  }
  function evidenceProblems(asset,references=[]){
    if(!governedCanonical(asset))return[];
    const problems=[...referenceProblems(asset,references)],e=asset?.canonicalReviewEvidence,refs=referenceMap(references),ids=requiredReferenceIds(asset),checks=requiredChecks(asset);
    if(!e){problems.push('persisted canonical review evidence missing');return [...new Set(problems)]}
    if(e.verdict!=='pass')problems.push('canonical review verdict is not pass');
    if((asset?.canonicalView?.reviewContractId||null)!==(e.contractId||null))problems.push('canonical review contract evidence does not match canonical view');
    if(e.briefId!==asset?.canonicalView?.briefId)problems.push('canonical review brief evidence does not match canonical view');
    if(sha(e.candidateChecksumSha256)!==sha(asset?.file?.checksumSha256))problems.push('canonical review evidence checksum does not match candidate binary');
    if(clean(e.reviewedBy)!==clean(asset?.governance?.reviewedBy))problems.push('canonical review evidence reviewer does not match governance reviewer');
    if(clean(e.reviewedAt)!==clean(asset?.governance?.reviewedAt))problems.push('canonical review evidence timestamp does not match governance review timestamp');
    if(asset?.referencePack){
      if(e.referencePack?.packId!==asset.referencePack.packId)problems.push('persisted canonical review reference-pack identity does not match canonical master');
      if(sha(e.referencePack?.manifestSha256)!==sha(asset.referencePack.manifestSha256))problems.push('persisted canonical review reference-pack manifest does not match canonical master');
    }
    const results=evidenceResults(asset);for(const id of checks){if(results.get(id)?.result!=='pass')problems.push(`persisted required review check ${id} is not pass`)}
    const snaps=new Map((e.referenceSnapshots||[]).map(x=>[x.assetId,x]));
    for(const id of ids){
      const r=refs.get(id),s=snaps.get(id);if(!s){problems.push(`persisted reference snapshot ${id} is missing`);continue}
      if(sha(s.checksumSha256)!==sha(r?.file?.checksumSha256))problems.push(`reference ${id} changed after canonical review`);
      if(s.governanceState!=='reference-approved')problems.push(`persisted reference ${id} was not approved at review time`);
      const currentAtt=attestation?.snapshot?.(r)||null;if(s.provenanceAttestation?.basisSha256!==currentAtt?.basisSha256||s.provenanceAttestation?.freshness!=='current'||currentAtt?.freshness!=='current')problems.push(`reference ${id} provenance attestation changed or became stale after canonical review`);
      const currentDecision=referenceReviewDecision?.snapshot?.(r)||null;if(s.referenceReviewDecision?.decision!=='approved'||s.referenceReviewDecision?.freshness!=='current'||currentDecision?.decision!=='approved'||currentDecision?.freshness!=='current'||sha(s.referenceReviewDecision?.decisionSha256)!==sha(currentDecision?.decisionSha256)||sha(s.referenceReviewDecision?.basisSha256)!==sha(currentDecision?.basisSha256))problems.push(`reference ${id} review decision changed or became stale after canonical review`);
      if(asset?.referencePack){
        if(s.referencePackId!==asset.referencePack.packId)problems.push(`persisted reference ${id} pack identity does not match canonical master`);
        if(sha(s.referencePackManifestSha256)!==sha(asset.referencePack.manifestSha256))problems.push(`persisted reference ${id} pack manifest does not match canonical master`);
      }
    }
    const gap=asset?.canonicalView?.referenceGap;if(gap?.severity==='required'){const current=sourceGapResolution?.snapshot?.(asset?.canonicalSourceGapResolution,asset,references)||null;if(!current||current.freshness!=='current'||current.decision!=='approved')problems.push('required canonical source gap has no current governed approved resolution');if(e?.sourceGapResolution?.resolutionSha256!==current?.resolutionSha256||e?.sourceGapResolution?.basisSha256!==current?.basisSha256)problems.push('persisted canonical review source-gap evidence does not match the current governed resolution')} 
    return [...new Set(problems)];
  }
  return {schemaVersion:SCHEMA_VERSION,governedCanonical,requiredReferenceIds,requiredChecks,referenceProblems,draftProblems,buildEvidence,evidenceProblems};
});
