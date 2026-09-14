(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const api=factory(integrity);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity){
  'use strict';
  const SCHEMA_VERSION='0.26.18';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='REFERENCE_SOURCE_RIGHTS_ATTESTATION';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  const sha=v=>/^[a-f0-9]{64}$/i.test(clean(v))?clean(v).toLowerCase():null;
  const isReference=r=>r?.assetClass==='reference'||r?.layerId==='reference';
  function basis(reference){
    if(!isReference(reference))return null;
    return stable({
      schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,
      reference:{assetId:reference.assetId||null,vehicleId:reference.vehicleId||null,viewId:reference.viewId||null,runtimeStatus:reference.status||null},
      source:{localPath:clean(reference.source)||null,url:clean(reference.provenance?.sourceUrl)||null,sourceType:clean(reference.provenance?.sourceType)||null,checksumSha256:sha(reference.file?.checksumSha256)},
      rights:{licenceStatus:clean(reference.provenance?.licenceStatus)||null,licenceNote:clean(reference.provenance?.licenceNote)||null,rightsTag:clean(reference.provenance?.rightsTag)||null},
      evidence:{authenticityRole:clean(reference.referenceEvidence?.authenticityRole)||null,canonicalViewIds:[...(reference.referenceEvidence?.canonicalViewIds||[])].filter(Boolean).sort(),productionEligible:reference.referenceEvidence?.productionEligible??null},
      referencePack:reference.referencePack?{packId:clean(reference.referencePack.packId)||null,manifestSha256:sha(reference.referencePack.manifestSha256),declaredIndex:reference.referencePack.declaredIndex??null}:null
    });
  }
  function build(reference,{attestedAt=null,attestedBy=null}={}){
    const b=basis(reference);if(!b)return null;
    const basisSha256=hash(b),actor=attestedBy?{actorId:clean(attestedBy.actorId)||null,displayName:clean(attestedBy.displayName)||clean(attestedBy.actorId)||null,role:clean(attestedBy.role)||null}:null;
    return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,attestationId:`${reference.assetId}-PROVENANCE-ATTESTATION`,authority:'reference-evidence-only',productionEligible:false,basisSha256,attestedAt:attestedAt||null,attestedBy:actor,basis:b};
  }
  function problems(saved,reference){
    if(!isReference(reference))return[];
    const p=[];
    if(!saved){p.push('reference provenance attestation is missing');return p}
    if(saved.schemaVersion!==SCHEMA_VERSION)p.push('reference provenance attestation schema is stale');
    if(saved.policy!==POLICY)p.push('reference provenance attestation policy mismatch');
    if(saved.purpose!==PURPOSE)p.push('reference provenance attestation purpose mismatch');
    if(saved.authority!=='reference-evidence-only'||saved.productionEligible!==false)p.push('reference provenance attestation must remain non-production evidence');
    if(!clean(saved.attestedBy?.actorId)&&!clean(saved.attestedBy?.displayName))p.push('reference provenance attestor identity is missing');
    const at=clean(saved.attestedAt);if(!at)p.push('reference provenance attestation timestamp is missing');else if(Number.isNaN(Date.parse(at)))p.push('reference provenance attestation timestamp is invalid');
    const savedBasisHash=hash(saved.basis||null),declared=sha(saved.basisSha256);if(!declared||savedBasisHash!==declared)p.push('reference provenance attestation fingerprint is invalid');
    const current=build(reference);if(current&&declared!==sha(current.basisSha256)){const legacy=clone(saved.basis||null);if(legacy?.reference&&Object.prototype.hasOwnProperty.call(legacy.reference,'governanceState'))delete legacy.reference.governanceState;const compatible=legacy&&hash(stable(legacy))===sha(current.basisSha256);if(!compatible)p.push('reference provenance attestation is stale against current source/rights evidence')}
    return [...new Set(p)];
  }
  function freshness(saved,reference){const p=problems(saved,reference);if(!saved)return 'missing';if(p.some(x=>x.includes('fingerprint is invalid')||x.includes('policy mismatch')||x.includes('purpose mismatch')||x.includes('must remain non-production')||x.includes('schema is stale')))return 'invalid';if(p.some(x=>x.includes('stale against current')))return 'stale';return p.length?'invalid':'current'}
  function snapshot(reference){const a=reference?.provenanceAttestation;return {assetId:reference?.assetId||null,freshness:freshness(a,reference),attestationId:a?.attestationId||null,basisSha256:sha(a?.basisSha256),attestedAt:a?.attestedAt||null,attestedBy:clone(a?.attestedBy||null),licenceStatus:reference?.provenance?.licenceStatus||null,sourceType:reference?.provenance?.sourceType||null,checksumSha256:sha(reference?.file?.checksumSha256),productionEligible:false}}
  function summary(references=[]){const rows=(references||[]).filter(isReference).map(snapshot);return {schemaVersion:SCHEMA_VERSION,policy:POLICY,total:rows.length,current:rows.filter(x=>x.freshness==='current').length,stale:rows.filter(x=>x.freshness==='stale').length,missing:rows.filter(x=>x.freshness==='missing').length,invalid:rows.filter(x=>x.freshness==='invalid').length,rows}}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,isReference,basis,build,problems,freshness,snapshot,summary};
});
