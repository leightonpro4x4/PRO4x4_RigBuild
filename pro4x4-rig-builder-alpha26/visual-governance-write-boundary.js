(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const api=factory(integrity);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_VISUAL_GOVERNANCE_WRITE_BOUNDARY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity){
  'use strict';
  const SCHEMA_VERSION='0.26.28';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='GOVERNANCE_MANAGED_METADATA_WRITE_BOUNDARY';
  const IDENTITY_PATHS=['assetId','vehicleId','viewId','layerId','exactSku','assetClass'];
  const GOVERNED_PATHS=['referencePack','canonicalView','canonicalViewContract','canonicalReferenceCoverage','canonicalSourceGapResolution','candidateHandoff','compositeEligibility','governanceDossier','reviewWorkflow','canonicalReviewDecision','governanceAttention','canonicalMasterSetRegistry','referenceReviewDecision','readinessAssessment','canonicalReviewEvidence','provenanceAttestation','lineage','approval.reviewEvidence','governanceWriteBoundary'];
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const get=(o,path)=>String(path).split('.').reduce((v,k)=>v==null?undefined:v[k],o);
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const same=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));
  function protectedPaths(existing){
    if(!existing)return[];
    const paths=[...IDENTITY_PATHS,...GOVERNED_PATHS];
    if(existing?.assetClass==='reference'&&existing?.referencePack?.packId)paths.push('referenceEvidence');if(existing?.assetClass==='reference')paths.push('governance','approval.state','approval.approvedBy','approval.approvedAt');
    return [...new Set(paths)];
  }
  function changes(existing,incoming,{allowPaths=[]}={}){
    if(!existing)return[];
    const allow=new Set(allowPaths||[]),changed=[];
    for(const path of protectedPaths(existing)){
      if(allow.has(path))continue;
      const before=get(existing,path),after=get(incoming,path);
      if(!same(before,after))changed.push({path,before:clone(before),after:clone(after)});
    }
    return changed;
  }
  function problems(existing,incoming,opts={}){
    return changes(existing,incoming,opts).map(x=>`${x.path} is governance-managed and must be changed through its dedicated workflow`);
  }
  function assertWritable(existing,incoming,opts={}){
    const changed=changes(existing,incoming,opts);
    if(!changed.length)return {ok:true,policy:POLICY,purpose:PURPOSE,changed:[]};
    const e=new Error(`Governance-managed metadata write blocked: ${changed.map(x=>x.path).join(', ')}`);
    e.status=409;e.code='governance_metadata_protected';e.fieldErrors=changed.map(x=>({field:x.path,message:`${x.path} is governance-managed and must be changed through its dedicated workflow`}));e.changedPaths=changed.map(x=>x.path);throw e;
  }
  function summary(existing){return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,protectedPaths:protectedPaths(existing),authority:'system-workflow-only',customerExposure:'none'}}
  function metadataProblems(saved,record){
    if(!saved)return ['governance write-boundary metadata is missing'];
    const expected=summary(record),p=[];
    if(saved.schemaVersion!==SCHEMA_VERSION)p.push('governance write-boundary schema is stale');
    if(saved.policy!==POLICY)p.push('governance write-boundary policy mismatch');
    if(saved.purpose!==PURPOSE||saved.authority!=='system-workflow-only'||saved.customerExposure!=='none')p.push('governance write-boundary authority metadata is invalid');
    if(!same(saved.protectedPaths||[],expected.protectedPaths||[]))p.push('governance write-boundary protected-field set is stale');
    return p;
  }
  function freshness(saved,record){const p=metadataProblems(saved,record);if(!saved)return 'missing';if(p.some(x=>x.includes('policy mismatch')||x.includes('authority metadata is invalid')))return 'invalid';return p.length?'stale':'current'}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,IDENTITY_PATHS:[...IDENTITY_PATHS],GOVERNED_PATHS:[...GOVERNED_PATHS],protectedPaths,changes,problems,assertWritable,summary,metadataProblems,freshness};
});
