(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Y62_F34_OVERLAY_REVIEW=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const contract={schemaVersion:'0.26.4',reviewContractId:'Y62-F34-V1-OVERLAY-01',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',cameraProfileId:'Y62-F34-V1',requiredReferenceIds:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01'],targetCanvas:{width:1672,height:615},tolerances:{wheelCentrePx:10,bodySilhouettePx:14,rooflinePx:10,bumperCornerPx:12,headlampAnchorPx:8},checks:[
  {id:'identity',required:true,label:'Series 5 Warrior fascia, flares, trim and body identity match the owner reference pack'},
  {id:'stance',required:true,label:'Premcar Warrior stance and tyre-to-arch relationship match references without synthetic lift/drop'},
  {id:'wheel-centres',required:true,label:'Front/rear visible wheel centres align within tolerance'},
  {id:'silhouette',required:true,label:'Bonnet, roof, glasshouse, guards and bumper silhouette align within tolerance'},
  {id:'factory-wheels',required:true,label:'Factory Warrior wheel/tyre geometry is reference-backed'},
  {id:'transparency',required:true,label:'Background is fully transparent with no source-scene contamination'},
  {id:'edge-quality',required:true,label:'Vehicle boundary is clean enough for accessory-layer compositing'},
  {id:'no-invented-accessories',required:true,label:'No accessory, decal, rack, bar or trim is invented beyond the verified base vehicle'}
 ],promotionRule:'All required checks pass, candidate is master-approved by an identified reviewer, rights are owned/licensed, SHA-256 and vault identity match, transparency is server-verified, and cameraGeometry.matched is true.',failureRule:'Any failed required check keeps the candidate master-draft or rejected; customer resolver remains missing.',customerExposure:'never-before-production-ready'};
 function assess(results){const byId=new Map((results||[]).map(x=>[x.id,x]));const failures=contract.checks.filter(c=>c.required&&byId.get(c.id)?.result!=='pass');return {passed:failures.length===0,failures:failures.map(x=>x.id)} }
 return {...contract,assess};
});
