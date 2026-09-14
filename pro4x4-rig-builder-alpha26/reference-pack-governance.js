(function(root,factory){
  const integrity=(typeof module==='object'&&module.exports)?require('./audit-integrity.js'):root.PRO4X4_AUDIT_INTEGRITY;
  const attestation=(typeof module==='object'&&module.exports)?require('./reference-provenance-attestation.js'):root.PRO4X4_REFERENCE_PROVENANCE_ATTESTATION;
  const reviewDecision=(typeof module==='object'&&module.exports)?require('./reference-review-decision.js'):root.PRO4X4_REFERENCE_REVIEW_DECISION;
  const api=factory(integrity,attestation,reviewDecision);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PRO4X4_REFERENCE_PACK_GOVERNANCE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(integrity,attestation,reviewDecision){
  'use strict';
  const SCHEMA_VERSION='0.26.13';
  const PACK_ID='Y62-OWNER-REFERENCE-PACK-V1';
  const POLICY='REFERENCE_BACKED_APPROVED_VISUALS_ONLY';
  const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
  const clean=v=>String(v??'').trim();
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const stable=v=>integrity?.canonicalize?integrity.canonicalize(v):v;
  const hash=v=>integrity?.sha256Hex?integrity.sha256Hex(integrity.stableStringify(v)):null;
  function canonicalBindings(pack,briefs){
    const byRef=new Map((pack?.references||[]).map(r=>[r.id,[]]));
    Object.values(briefs||{}).forEach(b=>(b.referenceIds||[]).forEach(id=>{if(byRef.has(id))byRef.get(id).push(b.briefId)}));
    return Object.fromEntries([...byRef.entries()].map(([id,ids])=>[id,unique(ids).sort()]));
  }
  function basis(pack,briefs){
    const bindings=canonicalBindings(pack,briefs);
    return stable({
      schemaVersion:SCHEMA_VERSION,
      packId:pack?.packId||PACK_ID,
      policy:POLICY,
      vehicleId:pack?.vehicleId||null,
      vehicleIdentity:clone(pack?.vehicleIdentity||null),
      usageBasis:pack?.usageBasis||null,
      status:pack?.status||null,
      references:(pack?.references||[]).map((r,index)=>({index,id:r.id,file:r.file,sourceType:r.sourceType,rights:r.rights,view:r.view,quality:r.quality,width:r.width,height:r.height,sha256:r.sha256,canonicalViewIds:bindings[r.id]||[]})),
      gaps:clone(pack?.gaps||[])
    });
  }
  function manifest(pack,briefs){
    const b=basis(pack,briefs),manifestSha256=hash(b),bindings=canonicalBindings(pack,briefs),refs=b.references||[];
    return {...b,manifestSha256,declaredReferenceCount:refs.length,declaredPrimaryCount:refs.filter(r=>r.quality==='primary').length,declaredSupportCount:refs.filter(r=>r.quality!=='primary').length,declaredGapCount:(b.gaps||[]).length,canonicalBindings:bindings};
  }
  function membership(ref,manifest){
    const row=(manifest?.references||[]).find(r=>r.id===ref?.assetId||r.id===ref?.id);if(!row)return null;
    return {schemaVersion:SCHEMA_VERSION,packId:manifest.packId,manifestSha256:manifest.manifestSha256,declaredIndex:row.index,declaredReferenceCount:manifest.declaredReferenceCount,authenticityRole:row.quality==='primary'?'primary':'support',canonicalViewIds:[...(row.canonicalViewIds||[])],productionEligible:false};
  }
  function masterBinding(brief,manifest){
    const required=unique(brief?.referenceIds||[]);
    return {schemaVersion:SCHEMA_VERSION,packId:manifest.packId,manifestSha256:manifest.manifestSha256,declaredReferenceCount:manifest.declaredReferenceCount,requiredReferenceIds:required,vehicleIdentity:clone(manifest.vehicleIdentity),usageBasis:manifest.usageBasis,gaps:clone((manifest.gaps||[]).filter(g=>g.view===brief?.viewId||g.view===brief?.briefId||g.view===brief?.id))};
  }
  function assess(packManifest,records=[]){
    const refs=(records||[]).filter(r=>r?.assetClass==='reference'),byId=new Map(refs.map(r=>[r.assetId,r])),problems=[],rows=[];
    for(const declared of packManifest?.references||[]){
      const r=byId.get(declared.id),row={assetId:declared.id,present:!!r,expectedChecksumSha256:declared.sha256,checksumSha256:r?.file?.checksumSha256||null,expectedRights:declared.rights,licenceStatus:r?.provenance?.licenceStatus||null,expectedSourceType:declared.sourceType,sourceType:r?.provenance?.sourceType||null,governanceState:r?.governance?.state||null,status:r?.status||null,productionEligible:r?.referenceEvidence?.productionEligible??null,packId:r?.referencePack?.packId||null,manifestSha256:r?.referencePack?.manifestSha256||null,canonicalViewIds:clone(r?.referenceEvidence?.canonicalViewIds||[])};
      row.provenanceAttestation=attestation?.snapshot?.(r)||null;
      row.reviewDecision=reviewDecision?.snapshot?.(r)||null;
      rows.push(row);
      if(!r){problems.push({code:'REFERENCE_MISSING',assetId:declared.id,message:`Declared reference ${declared.id} is not registered.`});continue}
      if(r.assetClass!=='reference'||r.status!=='reference-only'||r.referenceEvidence?.productionEligible!==false)problems.push({code:'REFERENCE_RUNTIME_STATE',assetId:declared.id,message:`${declared.id} is not locked as non-production reference evidence.`});
      if(r.governance?.state!=='reference-approved')problems.push({code:'REFERENCE_APPROVAL',assetId:declared.id,message:`${declared.id} is not reference-approved.`});
      const reviewProblems=reviewDecision?.approvalProblems?.(r.referenceReviewDecision,r)||[];
      if(reviewProblems.length)problems.push({code:'REFERENCE_REVIEW_DECISION',assetId:declared.id,message:`${declared.id} reference review decision is not current/approved: ${reviewProblems.join(' · ')}`});
      const attestationProblems=attestation?.problems?.(r.provenanceAttestation,r)||[];
      if(attestationProblems.length)problems.push({code:'PROVENANCE_ATTESTATION',assetId:declared.id,message:`${declared.id} provenance attestation is not current: ${attestationProblems.join(' · ')}`});
      if(r.file?.checksumSha256!==declared.sha256)problems.push({code:'CHECKSUM_MISMATCH',assetId:declared.id,message:`${declared.id} checksum does not match the declared owner reference pack.`});
      if(r.provenance?.sourceType!==declared.sourceType)problems.push({code:'SOURCE_TYPE_MISMATCH',assetId:declared.id,message:`${declared.id} source type does not match the declared pack.`});
      if(r.provenance?.licenceStatus!==declared.rights)problems.push({code:'RIGHTS_MISMATCH',assetId:declared.id,message:`${declared.id} rights state does not match the declared pack.`});
      if(r.referencePack?.packId!==packManifest.packId||r.referencePack?.manifestSha256!==packManifest.manifestSha256)problems.push({code:'PACK_BINDING_STALE',assetId:declared.id,message:`${declared.id} does not carry the current persisted reference-pack binding.`});
    }
    const unexpected=refs.filter(r=>r.referencePack?.packId===packManifest.packId&&!packManifest.references.some(x=>x.id===r.assetId)).map(r=>r.assetId);
    unexpected.forEach(assetId=>problems.push({code:'UNDECLARED_PACK_MEMBER',assetId,message:`${assetId} claims membership in ${packManifest.packId} but is not declared by the manifest.`}));
    const status=problems.length?'blocked':'complete';
    return {schemaVersion:SCHEMA_VERSION,policy:POLICY,packId:packManifest.packId,manifestSha256:packManifest.manifestSha256,status,declaredReferenceCount:packManifest.declaredReferenceCount,registeredReferenceCount:rows.filter(r=>r.present).length,approvedReferenceCount:rows.filter(r=>r.governanceState==='reference-approved').length,attestedReferenceCount:rows.filter(r=>r.provenanceAttestation?.freshness==='current').length,reviewApprovedReferenceCount:rows.filter(r=>r.reviewDecision?.freshness==='current'&&r.reviewDecision?.decision==='approved').length,primaryCount:packManifest.declaredPrimaryCount,supportCount:packManifest.declaredSupportCount,gaps:clone(packManifest.gaps||[]),vehicleIdentity:clone(packManifest.vehicleIdentity),usageBasis:packManifest.usageBasis,references:rows,unexpectedReferenceIds:unexpected,problems};
  }
  function bindingProblems(asset,references=[],packManifest=null){
    if(!asset?.referencePack)return ['canonical master reference-pack binding is missing'];
    const p=[],binding=asset.referencePack,required=unique(asset?.canonicalView?.referenceIds||asset?.provenance?.referenceIds||binding.requiredReferenceIds||[]),byId=new Map((references||[]).map(r=>[r.assetId,r]));
    if(packManifest&&binding.packId!==packManifest.packId)p.push('canonical master reference-pack ID does not match the active manifest');
    if(packManifest&&binding.manifestSha256!==packManifest.manifestSha256)p.push('canonical master reference-pack manifest checksum is stale');
    for(const id of required){const r=byId.get(id);if(!r){p.push(`required reference ${id} is missing from the registered pack`);continue}if(r.referencePack?.packId!==binding.packId)p.push(`required reference ${id} belongs to a different reference pack`);if(r.referencePack?.manifestSha256!==binding.manifestSha256)p.push(`required reference ${id} carries a stale reference-pack manifest checksum`);const ap=attestation?.problems?.(r.provenanceAttestation,r)||[];if(ap.length)p.push(`required reference ${id} provenance attestation is not current`);const rp=reviewDecision?.approvalProblems?.(r.referenceReviewDecision,r)||[];if(rp.length)p.push(`required reference ${id} review decision is not current/approved`)}
    return unique(p);
  }
  return {schemaVersion:SCHEMA_VERSION,PACK_ID,POLICY,basis,manifest,membership,masterBinding,assess,bindingProblems};
});
