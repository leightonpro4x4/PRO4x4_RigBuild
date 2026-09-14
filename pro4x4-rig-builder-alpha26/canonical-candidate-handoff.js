(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const api=factory(integrity);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_CANONICAL_CANDIDATE_HANDOFF=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity){
  'use strict';
  const SCHEMA_VERSION='0.26.14';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const HANDOFF_POLICY='WF3_CANONICAL_CANDIDATE_HANDOFF_NO_IMPLICIT_PROMOTION';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  const latestFor=(candidates,viewId,briefId)=>{
    if(!candidates)return null;
    const history=typeof candidates.listHistory==='function'?candidates.listHistory(viewId):[];
    const rows=(history||[]).filter(c=>(!briefId||c?.briefId===briefId)&&(!viewId||c?.viewId===viewId));
    if(rows.length)return rows[rows.length-1];
    const direct=typeof candidates.getLatest==='function'?candidates.getLatest(viewId):null;
    return direct&&(!briefId||direct.briefId===briefId)?direct:null;
  };
  function reviewFor(candidate,externalReview){
    if(!candidate)return null;
    if(externalReview&&externalReview.candidateId===candidate.candidateId)return externalReview;
    return candidate.review||null;
  }
  function blockersFor(candidate,review){
    if(!candidate)return ['WF3 has not supplied a canonical candidate for this master.'];
    const out=[...(candidate.review?.blockers||[]),...(review?.blockers||[])];
    const decision=review?.promotionDecision||candidate.review?.decision||null;
    const productionRights=candidate?.provenance?.productionBinaryRights||candidate?.provenance?.productionUse||null;
    if(decision==='returned-to-wf3')out.push('WF3 review decision returned this candidate for reconstruction / correction.');
    if(candidate?.governance?.state!=='master-approved')out.push(`Candidate governance remains ${candidate?.governance?.state||'unset'}; this handoff cannot grant approval.`);
    if(candidate?.file?.hasAlpha!==true)out.push('Transparent candidate binary is not yet verified.');
    if(['not-separately-recorded','prohibited'].includes(productionRights))out.push('Production-binary rights are not cleared for direct promotion.');
    return unique(out);
  }
  function stateFor(candidate,review,blockers){
    if(!candidate)return 'awaiting-wf3-candidate';
    const decision=review?.promotionDecision||candidate.review?.decision||null;
    if(decision==='returned-to-wf3'||decision==='rejected')return 'blocked-upstream';
    if(blockers.length)return 'received-with-blockers';
    return 'ready-for-wf4-review';
  }
  function basis({master,candidate,review,referencePack}={}){
    const b=master?.canonicalView||{},candidateReview=reviewFor(candidate,review),blockers=blockersFor(candidate,candidateReview),state=stateFor(candidate,candidateReview,blockers);
    return stable({
      schemaVersion:SCHEMA_VERSION,
      policy:POLICY,
      handoffPolicy:HANDOFF_POLICY,
      canonicalMasterAssetId:master?.assetId||null,
      briefId:b.briefId||candidate?.briefId||null,
      viewId:master?.viewId||candidate?.viewId||null,
      reviewContractId:b.reviewContractId||null,
      requiredReviewChecks:clone(b.reviewContractRequiredChecks||[]),
      referencePack:{packId:referencePack?.packId||master?.referencePack?.packId||null,manifestSha256:referencePack?.manifestSha256||master?.referencePack?.manifestSha256||null,requiredReferenceIds:clone(master?.referencePack?.requiredReferenceIds||b.referenceIds||[])},
      candidate:candidate?{
        candidateId:candidate.candidateId||null,
        candidateType:candidate.candidateType||null,
        source:candidate.source||null,
        preview:candidate.preview||null,
        governanceState:candidate.governance?.state||null,
        checksumSha256:candidate.file?.checksumSha256||null,
        mimeType:candidate.file?.mimeType||null,
        width:candidate.file?.width??null,
        height:candidate.file?.height??null,
        hasAlpha:candidate.file?.hasAlpha??null,
        productionEligible:false,
        referenceIds:clone(candidate.provenance?.referenceIds||[])
      }:null,
      provenance:candidate?{
        sourceType:candidate.provenance?.sourceType||null,
        rights:candidate.provenance?.rights||null,
        productionBinaryRights:candidate.provenance?.productionBinaryRights||null,
        productionUse:candidate.provenance?.productionUse||null,
        transformation:candidate.provenance?.transformation||null,
        primaryReferenceId:candidate.provenance?.primaryReferenceId||null,
        referenceIds:clone(candidate.provenance?.referenceIds||[])
      }:null,
      upstreamReview:candidateReview?{
        reviewId:candidateReview.reviewId||candidate?.review?.reviewId||null,
        status:candidateReview.status||candidate?.review?.state||null,
        decision:candidateReview.promotionDecision||candidate?.review?.decision||null,
        checks:clone(candidateReview.gateResults||candidate?.review?.checks||[]),
        acceptedUse:clone(candidateReview.acceptedUse||[]),
        prohibitedUse:clone(candidateReview.prohibitedUse||[]),
        nextDependency:candidateReview.nextDependency||candidate?.review?.nextAction||null
      }:null,
      intake:{state,blockers,nextAction:candidateReview?.nextDependency||candidate?.review?.nextAction||(!candidate?'Await WF3 canonical candidate handoff.':null),productionEligible:false,implicitPromotionAllowed:false}
    });
  }
  function build({master,candidates,review,referencePack}={}){
    const briefId=master?.canonicalView?.briefId||null,viewId=master?.viewId||master?.canonicalView?.viewId||null,candidate=latestFor(candidates,viewId,briefId),b=basis({master,candidate,review,referencePack});
    return {...b,handoffId:`${briefId||master?.assetId||'CANONICAL'}-WF3-HANDOFF`,handoffSha256:hash(b)};
  }
  function problems(handoff,master){
    const p=[];
    if(!handoff)return ['candidate handoff metadata is missing'];
    if(handoff.policy!==POLICY)p.push('candidate handoff visual policy mismatch');
    if(handoff.handoffPolicy!==HANDOFF_POLICY)p.push('candidate handoff policy mismatch');
    if(handoff.intake?.productionEligible!==false||handoff.intake?.implicitPromotionAllowed!==false)p.push('candidate handoff must remain non-production and non-promoting');
    if(master?.assetId&&handoff.canonicalMasterAssetId!==master.assetId)p.push('candidate handoff canonical master binding mismatch');
    if(master?.canonicalView?.briefId&&handoff.briefId!==master.canonicalView.briefId)p.push('candidate handoff canonical brief mismatch');
    if(master?.referencePack?.packId&&handoff.referencePack?.packId!==master.referencePack.packId)p.push('candidate handoff reference-pack ID mismatch');
    if(master?.referencePack?.manifestSha256&&handoff.referencePack?.manifestSha256!==master.referencePack.manifestSha256)p.push('candidate handoff reference-pack manifest checksum is stale');
    const expected=hash(stable(Object.fromEntries(Object.entries(handoff).filter(([k])=>!['handoffId','handoffSha256'].includes(k)))));
    if(!/^[a-f0-9]{64}$/i.test(clean(handoff.handoffSha256))||expected!==handoff.handoffSha256)p.push('candidate handoff fingerprint is invalid');
    if(handoff.candidate){
      if(!/^[a-f0-9]{64}$/i.test(clean(handoff.candidate.checksumSha256)))p.push('candidate checksum is missing or invalid');
      if(handoff.candidate.productionEligible!==false)p.push('candidate handoff cannot mark the WF3 candidate production eligible');
      const required=new Set(master?.referencePack?.requiredReferenceIds||master?.canonicalView?.referenceIds||[]),candidateRefs=new Set(handoff.candidate.referenceIds||[]);
      for(const id of required)if(!candidateRefs.has(id))p.push(`candidate handoff is missing required reference ${id}`);
    }
    return unique(p);
  }
  function summary(masters=[]){
    const rows=(masters||[]).map(m=>m?.candidateHandoff).filter(Boolean);
    return {schemaVersion:SCHEMA_VERSION,policy:POLICY,total:rows.length,withCandidate:rows.filter(x=>!!x.candidate).length,awaitingCandidate:rows.filter(x=>x.intake?.state==='awaiting-wf3-candidate').length,blockedUpstream:rows.filter(x=>x.intake?.state==='blocked-upstream').length,receivedWithBlockers:rows.filter(x=>x.intake?.state==='received-with-blockers').length,readyForWf4Review:rows.filter(x=>x.intake?.state==='ready-for-wf4-review').length};
  }
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,handoffPolicy:HANDOFF_POLICY,latestFor,basis,build,problems,summary};
});
