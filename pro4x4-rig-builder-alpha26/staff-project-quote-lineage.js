(function(root,factory){
  const visualSeal=(typeof module==='object'&&module.exports)?require('./quote-visual-governance-seal.js'):root.PRO4X4_QUOTE_VISUAL_GOVERNANCE_SEAL;
  const api=factory(visualSeal);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_STAFF_LINEAGE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(visualSeal){
  const schemaVersion='0.26.20';
  const approvedGovernanceStates=new Set(['master-approved','layer-approved','production-live']);
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const pointer=q=>({projectId:q?.project?.id||null,revisionId:q?.project?.revisionId||null});
  const shareState=s=>s?.revokedAt?'revoked':s?.expiresAt&&Date.parse(s.expiresAt)<Date.now()?'expired':'active';
  function evidenceForLayer(layer,assets,versionsByAsset){
    const base={layerId:layer?.layerId||null,exactSku:layer?.exactSku??null,stateKey:layer?.stateKey||null,state:layer?.state||'missing',reason:layer?.reason||null,assetId:layer?.assetId||null,checksumSha256:layer?.checksumSha256||null,evidenceState:'not-required',assetClass:null,registryStatus:null,governanceState:null,versionId:null,versionState:null,reviewedBy:null,reviewedAt:null,approvalPath:null,canonicalBriefId:null,referenceIds:[],licenceStatus:null,cameraMatched:null};
    if(base.state!=='available')return base;
    if(!base.assetId||!base.checksumSha256)return {...base,evidenceState:'available-layer-unsealed'};
    const asset=(assets||[]).find(a=>a.assetId===base.assetId)||null;
    const versions=(versionsByAsset&&versionsByAsset[base.assetId])||[];
    const version=versions.find(v=>v.checksumSha256===base.checksumSha256)||null;
    const payload=version?.payload||asset||{};
    const gov=payload.governance||{};
    const review=payload.approval?.reviewEvidence||asset?.approval?.reviewEvidence||{};
    const cls=payload.assetClass||asset?.assetClass||null;
    const approved=approvedGovernanceStates.has(gov.state);
    const immutableVersion=!!version&&['production','superseded'].includes(version.state);
    const reviewComplete=!!(review.reviewedBy||gov.reviewedBy)&&!!(review.reviewedAt||gov.reviewedAt);
    const referenceOnly=cls==='reference'||payload.status==='reference-only';
    let evidenceState='verified';
    if(referenceOnly)evidenceState='reference-output-rejected';
    else if(!asset)evidenceState='asset-record-missing';
    else if(!version)evidenceState='checksum-version-unresolved';
    else if(!immutableVersion)evidenceState='non-production-version';
    else if(!approved)evidenceState='approval-state-invalid';
    else if(!reviewComplete)evidenceState='review-evidence-missing';
    return {...base,evidenceState,assetClass:cls,registryStatus:asset?.status||payload.status||null,governanceState:gov.state||null,versionId:version?.versionId||null,versionState:version?.state||null,reviewedBy:review.reviewedBy||gov.reviewedBy||null,reviewedAt:review.reviewedAt||gov.reviewedAt||null,approvalPath:review.promotionPath||null,canonicalBriefId:payload.canonicalView?.briefId||payload.cameraGeometry?.profileId||null,referenceIds:[...(payload.canonicalView?.referenceIds||payload.provenance?.referenceIds||[])],licenceStatus:payload.provenance?.licenceStatus||null,cameraMatched:payload.cameraGeometry?.matched??null};
  }
  function inspect({quote,project=null,assets=[],versionsByAsset={},quoteEvents=[],projectEvents=[]}={}){
    if(!quote)throw new Error('Quote is required for lineage inspection');
    const p=pointer(quote),warnings=[],blockers=[];
    let revision=null;
    if(p.projectId&&project?.id===p.projectId)revision=(project.revisions||[]).find(r=>r.id===p.revisionId)||null;
    let projectState='unversioned';
    if(p.projectId||p.revisionId){
      if(!p.projectId||!p.revisionId){projectState='broken-pointer';blockers.push('Quote carries an incomplete project/revision pointer.');}
      else if(!project){projectState='project-missing';blockers.push(`Linked project ${p.projectId} could not be resolved.`);}
      else if(!revision){projectState='revision-missing';blockers.push(`Linked immutable revision ${p.revisionId} could not be resolved.`);}
      else projectState='verified';
    } else warnings.push('Legacy/unversioned quote: no immutable project revision is linked.');
    const seal=quote.quoteLineage||null;
    let sealState='legacy-unsealed';
    if(!p.projectId&&!p.revisionId)sealState='not-applicable';
    else if(seal){
      const pointerMatch=seal.sourceProjectId===p.projectId&&seal.sourceRevisionId===p.revisionId;
      const checksumMatch=!revision||!seal.sourceRevisionChecksum||seal.sourceRevisionChecksum===revision.checksum;
      if(pointerMatch&&checksumMatch)sealState='verified';
      else{sealState='mismatch';if(!pointerMatch)blockers.push('Persisted quote lineage seal does not match the quote project/revision pointer.');if(!checksumMatch)blockers.push('Persisted source revision checksum does not match the immutable project revision.');}
    } else if(projectState==='verified')warnings.push('Project revision resolves, but this legacy quote predates the persisted lineage seal.');
    const visualGovernance=visualSeal?.inspect?visualSeal.inspect(quote.visualGovernanceSeal,{quote,assets,versionsByAsset}):{state:'unavailable',problems:[],warnings:['Visual-governance seal inspector is unavailable.']};
    for(const x of visualGovernance.problems||[])blockers.push(`Visual governance: ${x}`);
    for(const x of visualGovernance.warnings||[])warnings.push(`Visual governance: ${x}`);
    const layers=(quote.render?.layers||[]).map(l=>evidenceForLayer(l,assets,versionsByAsset));
    const available=layers.filter(l=>l.state==='available'),missing=layers.filter(l=>l.state==='missing'),blocked=layers.filter(l=>l.state==='blocked');
    for(const l of available){if(l.evidenceState!=='verified')blockers.push(`Available visual ${l.layerId}${l.exactSku?` / ${l.exactSku}`:''} failed immutable evidence check: ${l.evidenceState}.`)}
    if(quote.render?.fallbackPolicy&&quote.render.fallbackPolicy!=='none')blockers.push(`Quote render snapshot requests unsupported fallback policy: ${quote.render.fallbackPolicy}.`);
    if(quote.render?.exactMatchRequired===false)blockers.push('Quote render snapshot does not require exact visual-state matching.');
    const shares=project&&p.revisionId?(project.shares||[]).filter(s=>s.revisionId===p.revisionId).map(s=>({role:s.role,createdAt:s.createdAt,expiresAt:s.expiresAt,revokedAt:s.revokedAt,state:shareState(s),tokenHint:s.tokenHint||null})):[];
    const sourceRevision=revision?{id:revision.id,number:revision.number,checksum:revision.checksum,createdAt:revision.createdAt,source:revision.source,actor:clone(revision.actor||null),summary:clone(revision.summary||null)}:null;
    const projectView=project?{id:project.id,title:project.title,currentRevisionId:project.currentRevisionId,version:project.version,linkedRevisionId:p.revisionId,linkedRevisionIsCurrent:project.currentRevisionId===p.revisionId,revisionCount:(project.revisions||[]).length,sourceRevision,shares}:null;
    const render={view:quote.render?.view||null,productionReady:quote.render?.productionReady===true,exactMatchRequired:quote.render?.exactMatchRequired!==false,fallbackPolicy:quote.render?.fallbackPolicy||'none',resolverVersion:quote.render?.resolverVersion||quote.render?.manifestVersion||null,counts:{available:available.length,missing:missing.length,blocked:blocked.length,total:layers.length},layers};
    const status=blockers.length?'blocked':warnings.length?'verified-with-warnings':'verified';
    return {schemaVersion,policy:'immutable-project-revision-share-quote-visual-lineage',generatedAt:new Date().toISOString(),status,blockers,warnings,quote:{reference:quote.reference,status:quote.workflow?.status||null,finalisationStatus:quote.quoteFinalisation?.status||null,quoteNumber:quote.quoteFinalisation?.quoteNumber||null,projectId:p.projectId,revisionId:p.revisionId,catalogueRevision:quote.catalogue?.revision||null},project:projectView,seal:{state:sealState,sourceProjectId:seal?.sourceProjectId||null,sourceRevisionId:seal?.sourceRevisionId||null,sourceRevisionChecksum:seal?.sourceRevisionChecksum||null,submittedSnapshotChecksum:seal?.submittedSnapshotChecksum||null,sealedAt:seal?.sealedAt||null,sealedBy:clone(seal?.sealedBy||null)},visualGovernance,render,audit:{quoteEvents:clone(quoteEvents||[]),projectEvents:clone(projectEvents||[])}};
  }
  return {schemaVersion,policy:'immutable-project-revision-share-quote-visual-lineage',inspect,evidenceForLayer};
});
