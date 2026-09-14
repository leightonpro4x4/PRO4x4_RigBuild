(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_VISUAL_GOVERNANCE=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const states=['reference-only','reference-approved','brief-approved','master-draft','master-approved','layer-draft','layer-approved','held','blocked','production-live'];
 const classes=['reference','canonical-master','product-layer'];
 const canonicalBriefIds=new Set(['Y62-F34-V1','Y62-SIDE-V1','Y62-R34-V1']);
 function inferClass(a){if(classes.includes(a?.assetClass))return a.assetClass;if(a?.layerId==='base'||a?.layerId==='wheels'&&String(a?.exactSku||'').startsWith('FACTORY-'))return 'canonical-master';return 'product-layer'}
 function inferState(a){if(states.includes(a?.governance?.state))return a.governance.state;if(a?.status==='reference-only')return 'reference-only';if(a?.status==='blocked-fitment')return 'blocked';if(a?.status==='production-ready')return inferClass(a)==='canonical-master'?'master-approved':'layer-approved';if(a?.status==='candidate')return inferClass(a)==='canonical-master'?'master-draft':'layer-draft';return 'held'}
 function productionEligible(a){const cls=inferClass(a),s=inferState(a);if(cls==='reference')return false;return cls==='canonical-master'?['master-approved','production-live'].includes(s):['layer-approved','production-live'].includes(s)}
 function normalize(a){return {...a,assetClass:inferClass(a),governance:{...(a.governance||{}),state:inferState(a)}}}
 function referenceProblems(raw){const a=normalize(raw||{});if(a.assetClass!=='reference')return[];const p=[],state=inferState(a),e=a.referenceEvidence||{},prov=a.provenance||{},hasLocal=!!String(a.source||'').trim(),hasUrl=!!String(prov.sourceUrl||'').trim();
   if(a.status!=='reference-only')p.push('reference assets must remain reference-only at runtime');
   if(a.layerId!=='reference')p.push('reference assets must use the reference layer');
   if(a.exactSku) p.push('reference assets cannot carry an exact production SKU');
   if(!['reference-only','reference-approved'].includes(state))p.push('reference governance must be reference-only or reference-approved');
   if(e.productionEligible!==false)p.push('reference evidence must explicitly record productionEligible false');
   if(!['primary','support'].includes(e.authenticityRole))p.push('reference authenticity role must be primary or support');
   if(!Array.isArray(e.canonicalViewIds))p.push('reference evidence canonicalViewIds must be an array');
   else if(e.canonicalViewIds.some(id=>!canonicalBriefIds.has(id)))p.push('reference evidence contains an unsupported canonical master ID');
   if(!String(prov.sourceType||'').trim()||prov.sourceType==='unknown')p.push('reference source type is required');
   if(!String(prov.licenceStatus||'').trim()||prov.licenceStatus==='unknown')p.push('reference rights status is required');
   if(!String(prov.licenceNote||'').trim())p.push('reference rights/provenance note is required');
   if(!hasLocal&&!hasUrl)p.push('reference source file/path or source URL is required');
   if(hasLocal&&!/^[a-f0-9]{64}$/i.test(a.file?.checksumSha256||''))p.push('local reference evidence requires a valid SHA-256 checksum');
   if(state==='reference-approved'){
     const reviewer=String(a.governance?.reviewedBy||'').trim(),reviewedAt=String(a.governance?.reviewedAt||'').trim();
     if(!reviewer)p.push('approved reference reviewer identity is required');
     if(!reviewedAt)p.push('approved reference review timestamp is required');else if(Number.isNaN(Date.parse(reviewedAt)))p.push('approved reference review timestamp is invalid');
   }
   return p;
 }
 return {schemaVersion:'0.26.7',states,classes,canonicalBriefIds:[...canonicalBriefIds],inferClass,inferState,productionEligible,normalize,referenceProblems};
});
