(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_VISUAL_GOVERNANCE=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const states=['reference-only','reference-approved','brief-approved','master-draft','master-approved','layer-draft','layer-approved','held','blocked','production-live'];
 const classes=['reference','canonical-master','product-layer'];
 function inferClass(a){if(classes.includes(a?.assetClass))return a.assetClass;if(a?.layerId==='base'||a?.layerId==='wheels'&&String(a?.exactSku||'').startsWith('FACTORY-'))return 'canonical-master';return 'product-layer'}
 function inferState(a){if(states.includes(a?.governance?.state))return a.governance.state;if(a?.status==='reference-only')return 'reference-only';if(a?.status==='blocked-fitment')return 'blocked';if(a?.status==='production-ready')return inferClass(a)==='canonical-master'?'master-approved':'layer-approved';if(a?.status==='candidate')return inferClass(a)==='canonical-master'?'master-draft':'layer-draft';return 'held'}
 function productionEligible(a){const cls=inferClass(a),s=inferState(a);if(cls==='reference')return false;return cls==='canonical-master'?['master-approved','production-live'].includes(s):['layer-approved','production-live'].includes(s)}
 function normalize(a){return {...a,assetClass:inferClass(a),governance:{...(a.governance||{}),state:inferState(a)}}}
 return {schemaVersion:'0.26.2',states,classes,inferClass,inferState,productionEligible,normalize};
});
