(function(root,factory){
  const req=name=>(typeof module==='object'&&module.exports)?require(name):null;
  const api=factory(req('./audit-integrity.js')||root.PRO4X4_AUDIT_INTEGRITY,req('./reference-provenance-attestation.js')||root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION,req('./visual-governance.js')||root.PRO4X4_VISUAL_GOVERNANCE);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_REFERENCE_REVIEW_DECISION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,attestation,visualGovernance){
  'use strict';
  const SCHEMA_VERSION='0.26.25';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='REFERENCE_REVIEW_DECISION';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(stable(v))):null;
  const actorSnapshot=a=>({actorId:a?.actorId||null,displayName:a?.displayName||a?.actorId||null,role:a?.role||null});
  function applicable(asset){return visualGovernance?.inferClass?.(asset)==='reference'||asset?.assetClass==='reference'}
  function evidenceBasis(asset){
    return stable({
      schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,assetId:asset?.assetId||null,vehicleId:asset?.vehicleId||null,viewId:asset?.viewId||null,
      source:asset?.source||null,file:{checksumSha256:asset?.file?.checksumSha256||null,mimeType:asset?.file?.mimeType||null,width:asset?.file?.width??null,height:asset?.file?.height??null},
      provenance:{sourceType:asset?.provenance?.sourceType||null,sourceUrl:asset?.provenance?.sourceUrl||null,licenceStatus:asset?.provenance?.licenceStatus||null,licenceNote:asset?.provenance?.licenceNote||null,rightsTag:asset?.provenance?.rightsTag||null},
      referenceEvidence:{authenticityRole:asset?.referenceEvidence?.authenticityRole||null,canonicalViewIds:[...(asset?.referenceEvidence?.canonicalViewIds||[])].sort(),productionEligible:asset?.referenceEvidence?.productionEligible===false?false:asset?.referenceEvidence?.productionEligible??null},
      referencePack:{packId:asset?.referencePack?.packId||null,manifestSha256:asset?.referencePack?.manifestSha256||null,declaredIndex:asset?.referencePack?.declaredIndex??null,canonicalViewIds:[...(asset?.referencePack?.canonicalViewIds||[])].sort()},
      provenanceAttestation:{attestationId:asset?.provenanceAttestation?.attestationId||null,basisSha256:asset?.provenanceAttestation?.basisSha256||null,attestationSha256:asset?.provenanceAttestation?.attestationSha256||null,freshness:attestation?.freshness?.(asset?.provenanceAttestation,asset)||'missing'}
    });
  }
  function build(asset,{decision='approved',decidedAt=new Date().toISOString(),decidedBy=null,notes=null,legacyMigration=false}={}){
    if(!applicable(asset))throw Object.assign(new Error('Reference review decisions apply only to reference evidence'),{status:422,code:'validation_error'});
    if(!['approved','returned'].includes(decision))throw Object.assign(new Error('Reference review decision must be approved or returned'),{status:422,code:'validation_error'});
    const basis=evidenceBasis(asset),payload={schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,decision,authority:'reference-review-evidence-only',productionEligible:false,decidedAt,decidedBy:actorSnapshot(decidedBy),notes:notes||null,legacyMigration:!!legacyMigration,basis,basisSha256:hash(basis)};
    return {...payload,decisionSha256:hash(payload)};
  }
  function integrityProblems(saved){
    if(!saved)return ['reference review decision is missing'];const copy=clone(saved),sha=copy.decisionSha256;delete copy.decisionSha256;const p=[];
    if(saved.schemaVersion!==SCHEMA_VERSION)p.push('reference review decision schema is stale');
    if(saved.policy!==POLICY||saved.purpose!==PURPOSE||saved.authority!=='reference-review-evidence-only'||saved.productionEligible!==false)p.push('reference review decision authority/policy metadata is invalid');
    if(!['approved','returned'].includes(saved.decision))p.push('reference review decision value is invalid');
    if(!saved.decidedBy?.actorId||!saved.decidedAt)p.push('reference review decision reviewer identity/timestamp is missing');
    if(hash(copy)!==sha)p.push('reference review decision SHA-256 integrity failed');
    if(hash(saved.basis)!==saved.basisSha256)p.push('reference review decision basis SHA-256 integrity failed');
    return p;
  }
  function freshness(saved,asset){if(!saved)return'missing';const p=integrityProblems(saved);if(p.some(x=>x.includes('integrity failed')||x.includes('authority/policy')||x.includes('value is invalid')))return'invalid';if(hash(evidenceBasis(asset))!==saved.basisSha256)return'stale';return p.length?'stale':'current'}
  function approvalProblems(saved,asset){const p=[];if(!applicable(asset))return p;const f=freshness(saved,asset);if(f!=='current')p.push(`reference review decision is ${f}`);if(saved?.decision!=='approved')p.push('reference review decision is not APPROVED');if(attestation?.freshness?.(asset?.provenanceAttestation,asset)!=='current')p.push('reference provenance attestation is not current');if(asset?.referenceEvidence?.productionEligible!==false)p.push('reference evidence must remain non-production');return [...new Set(p)]}
  function snapshot(asset){const d=asset?.referenceReviewDecision||null;return {decision:d?.decision||null,freshness:freshness(d,asset),decisionSha256:d?.decisionSha256||null,basisSha256:d?.basisSha256||null,decidedAt:d?.decidedAt||null,decidedBy:clone(d?.decidedBy||null),authority:d?.authority||'reference-review-evidence-only',productionEligible:false}}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,applicable,evidenceBasis,build,integrityProblems,freshness,approvalProblems,snapshot};
});
