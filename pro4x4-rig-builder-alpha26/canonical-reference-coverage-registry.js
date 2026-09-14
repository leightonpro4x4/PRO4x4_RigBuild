(function(root,factory){
  const req=name=>(typeof module==='object'&&module.exports)?require(name):null;
  const api=factory(
    req('./audit-integrity.js')||root.PRO4X4_AUDIT_INTEGRITY,
    req('./reference-pack-governance.js')||root.PRO4X4_REFERENCE_PACK_GOVERNANCE,
    req('./reference-provenance-attestation.js')||root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION,
    req('./reference-review-decision.js')||root.PRO4X4_REFERENCE_REVIEW_DECISION,
    req('./y62-reference-pack.js')||root.Y62_REFERENCE_PACK,
    req('./y62-canonical-briefs.js')||root.Y62_CANONICAL_BRIEFS,
    req('./canonical-source-gap-resolution.js')||root.PRO4X4_CANONICAL_SOURCE_GAP_RESOLUTION
  );
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_CANONICAL_REFERENCE_COVERAGE_REGISTRY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,packGovernance,attestation,reviewDecision,y62Pack,canonicalBriefs,sourceGapResolution){
  'use strict';
  const SCHEMA_VERSION='0.26.28';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const PURPOSE='CANONICAL_REFERENCE_COVERAGE_REGISTRY';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(stable(v))):null;
  const canonical=a=>a?.assetClass==='canonical-master'&&a?.layerId==='base'&&!!a?.canonicalView?.briefId;
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  function manifest(){return packGovernance?.manifest?.(y62Pack,canonicalBriefs?.briefs||{})||null;}
  function declaredRow(id,m){return (m?.references||[]).find(x=>x.id===id)||null;}
  function refSnapshot(id,master,references=[],m=manifest()){
    const ref=(references||[]).find(x=>x?.assetId===id)||null,d=declaredRow(id,m),briefId=master?.canonicalView?.briefId||null;
    const attFresh=ref?attestation?.freshness?.(ref.provenanceAttestation,ref)||'missing':'missing';
    const reviewFresh=ref?reviewDecision?.freshness?.(ref.referenceReviewDecision,ref)||'missing':'missing';
    return stable({
      assetId:id,present:!!ref,declaredInPack:!!d,declaredChecksumSha256:d?.sha256||null,checksumSha256:ref?.file?.checksumSha256||null,checksumMatch:!!ref&&!!d&&ref.file?.checksumSha256===d.sha256,
      packBindingCurrent:!!ref&&!!m&&ref.referencePack?.packId===m.packId&&ref.referencePack?.manifestSha256===m.manifestSha256,
      canonicalBindingDeclared:!!d&&(d.canonicalViewIds||[]).includes(briefId),canonicalViewIds:clone(d?.canonicalViewIds||ref?.referenceEvidence?.canonicalViewIds||[]),
      sourceView:d?.view||ref?.viewId||null,quality:d?.quality||ref?.referenceEvidence?.authenticityRole||null,width:d?.width??ref?.file?.width??null,height:d?.height??ref?.file?.height??null,
      sourceType:ref?.provenance?.sourceType||null,rights:ref?.provenance?.licenceStatus||null,referenceApproved:ref?.governance?.state==='reference-approved',nonProductionLocked:ref?.status==='reference-only'&&ref?.referenceEvidence?.productionEligible===false,
      attestationFreshness:attFresh,attestationSha256:ref?.provenanceAttestation?.attestationSha256||null,reviewDecisionFreshness:reviewFresh,reviewDecision:ref?.referenceReviewDecision?.decision||null,reviewDecisionSha256:ref?.referenceReviewDecision?.decisionSha256||null
    });
  }
  function matchingGaps(master,m=manifest()){
    const viewId=master?.viewId||master?.canonicalView?.viewId||null,briefId=master?.canonicalView?.briefId||null,declared=(m?.gaps||[]).filter(g=>g?.view===viewId||g?.view===briefId);
    const persisted=master?.canonicalView?.referenceGap?[master.canonicalView.referenceGap]:[];
    const rows=[...declared,...persisted].map(g=>stable({view:g?.view||viewId,severity:g?.severity||'unknown',note:g?.note||null}));
    const seen=new Set();return rows.filter(x=>{const k=JSON.stringify(x);if(seen.has(k))return false;seen.add(k);return true});
  }
  function evidenceProblems(rows=[]){const out=[];for(const r of rows){if(!r.present)out.push(`${r.assetId}: reference is not registered`);if(!r.declaredInPack)out.push(`${r.assetId}: reference is not declared by the active pack`);if(!r.checksumMatch)out.push(`${r.assetId}: checksum does not match the active pack`);if(!r.packBindingCurrent)out.push(`${r.assetId}: persisted pack binding is stale`);if(!r.canonicalBindingDeclared)out.push(`${r.assetId}: active pack does not declare this reference for the canonical view`);if(!r.referenceApproved)out.push(`${r.assetId}: reference approval is not current`);if(!r.nonProductionLocked)out.push(`${r.assetId}: reference is not locked as non-production evidence`);if(r.attestationFreshness!=='current')out.push(`${r.assetId}: source/rights attestation is ${r.attestationFreshness}`);if(r.reviewDecisionFreshness!=='current'||r.reviewDecision!=='approved')out.push(`${r.assetId}: evidence review decision is not current/approved`);}return unique(out);}
  function basis(master,references=[]){
    const m=manifest(),required=unique(master?.referencePack?.requiredReferenceIds||master?.canonicalView?.referenceIds||[]),rows=required.map(id=>refSnapshot(id,master,references,m)),gaps=matchingGaps(master,m);
    return stable({schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,assetId:master?.assetId||null,vehicleId:master?.vehicleId||null,viewId:master?.viewId||null,briefId:master?.canonicalView?.briefId||null,referencePack:{packId:master?.referencePack?.packId||null,manifestSha256:master?.referencePack?.manifestSha256||null,activePackId:m?.packId||null,activeManifestSha256:m?.manifestSha256||null},requiredReferenceIds:required,references:rows,gaps,sourceGapResolution:sourceGapResolution?.snapshot?.(master?.canonicalSourceGapResolution,master,references)||null});
  }
  function assessBasis(b){
    const evidence=evidenceProblems(b?.references||[]),gapRows=(b?.gaps||[]).filter(g=>g?.severity==='required'),gapApproved=!gapRows.length||(b?.sourceGapResolution?.freshness==='current'&&b?.sourceGapResolution?.decision==='approved'),gapProblems=gapApproved?[]:gapRows.map(g=>`required source gap retained: ${g.note||g.view||'source evidence gap'}; governed source-gap decision ${b?.sourceGapResolution?.decision||'missing'}/${b?.sourceGapResolution?.freshness||'missing'}`),problems=[...evidence,...gapProblems],status=evidence.length?'blocked-evidence':!gapApproved?'blocked-source-gap':'complete';
    const refs=b?.references||[];return {status,problems:unique(problems),summary:{required:refs.length,registered:refs.filter(x=>x.present).length,checksumMatched:refs.filter(x=>x.checksumMatch).length,packBound:refs.filter(x=>x.packBindingCurrent).length,attested:refs.filter(x=>x.attestationFreshness==='current').length,reviewApproved:refs.filter(x=>x.reviewDecisionFreshness==='current'&&x.reviewDecision==='approved').length,requiredGaps:gapRows.length}};
  }
  function build(master,references=[],{generatedAt=new Date().toISOString(),generatedBy=null}={}){const b=basis(master,references),assessment=assessBasis(b),basisSha256=hash(b),payload={schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,coverageId:`${b.briefId||b.assetId||'canonical'}-REFERENCE-COVERAGE-V1`,authority:'reference-coverage-evidence-only',productionEligible:false,generatedAt,generatedBy:clone(generatedBy),basis:b,basisSha256,status:assessment.status,summary:assessment.summary,problems:assessment.problems};return {...payload,coverageSha256:hash(payload)};}
  function integrityProblems(saved){if(!saved)return ['canonical reference coverage is missing'];const copy=clone(saved),sha=copy.coverageSha256;delete copy.coverageSha256;const p=[];if(saved.schemaVersion!==SCHEMA_VERSION)p.push('canonical reference coverage schema is stale');if(saved.policy!==POLICY||saved.purpose!==PURPOSE||saved.authority!=='reference-coverage-evidence-only'||saved.productionEligible!==false)p.push('canonical reference coverage authority/policy metadata is invalid');if(hash(copy)!==sha)p.push('canonical reference coverage SHA-256 integrity failed');if(hash(saved.basis)!==saved.basisSha256)p.push('canonical reference coverage basis SHA-256 integrity failed');return p;}
  function freshness(saved,master,references=[]){if(!saved)return'missing';const p=integrityProblems(saved);if(p.some(x=>x.includes('integrity failed')||x.includes('authority/policy')))return'invalid';if(hash(basis(master,references))!==saved.basisSha256)return'stale';return p.length?'stale':'current';}
  function readinessProblems(saved,master,references=[]){const fresh=freshness(saved,master,references),out=[];if(fresh!=='current')out.push(`canonical reference coverage is ${fresh}`);if(saved?.status&&saved.status!=='complete')out.push(...(saved.problems||[`canonical reference coverage status is ${saved.status}`]));if(!saved)out.push('canonical reference coverage evidence is not persisted');return unique(out);}
  function summary(masters=[],references=[]){const rows=(masters||[]).filter(canonical).map(m=>({assetId:m.assetId,briefId:m.canonicalView?.briefId||null,viewId:m.viewId,status:m.canonicalReferenceCoverage?.status||null,freshness:freshness(m.canonicalReferenceCoverage,m,references),coverageSha256:m.canonicalReferenceCoverage?.coverageSha256||null,required:m.canonicalReferenceCoverage?.summary?.required??0,registered:m.canonicalReferenceCoverage?.summary?.registered??0,requiredGaps:m.canonicalReferenceCoverage?.summary?.requiredGaps??0}));return {schemaVersion:SCHEMA_VERSION,policy:POLICY,total:rows.length,current:rows.filter(x=>x.freshness==='current').length,complete:rows.filter(x=>x.freshness==='current'&&x.status==='complete').length,blockedSourceGap:rows.filter(x=>x.freshness==='current'&&x.status==='blocked-source-gap').length,blockedEvidence:rows.filter(x=>x.freshness==='current'&&x.status==='blocked-evidence').length,stale:rows.filter(x=>x.freshness==='stale').length,invalid:rows.filter(x=>x.freshness==='invalid').length,missing:rows.filter(x=>x.freshness==='missing').length,rows};}
  return {schemaVersion:SCHEMA_VERSION,policy:POLICY,purpose:PURPOSE,canonical,manifest,refSnapshot,matchingGaps,basis,assessBasis,build,integrityProblems,freshness,readinessProblems,summary};
});
