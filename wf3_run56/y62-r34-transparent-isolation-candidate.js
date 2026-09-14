(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_TRANSPARENT_ISOLATION=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const packageDef={
  schemaVersion:'0.26.23',
  packageId:'Y62-R34-V1-CANDIDATE02-TRANSPARENT-ISOLATION-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'rear34',briefId:'Y62-R34-V1',
  candidate:{candidateId:'Y62-R34-V1-CANDIDATE-02',source:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png',preview:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02-preview.jpg',sha256:'b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346',width:1672,height:615,hasAlpha:true,governanceState:'master-draft',cameraMatched:false,productionEligible:false},
  mask:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-alpha-mask-v01.png',sha256:'33571a82c811f6ad2d4d1a338f1bdaf0ffe92aafa91f8164b3cc00665c173859',width:700,height:525},
  provenance:{primaryReferenceId:'OWNER-Y62-REAR34-01',source:'references/y62-owner/IMG_4540.jpeg',sourceSha256:'747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2',rights:'owner-project-approved',productionBinaryRights:'not-separately-recorded',transformation:'alpha-only owner-source isolation after uniform 700x525 resize and fixed placement x486/y45 on 1672x615 canvas; retained RGB is exact; no crop, perspective warp, non-uniform scaling, RGB retouch or synthetic geometry'},
  verification:{retainedRgbExactFraction:1,retainedPixels:119584,perspectiveWarp:false,syntheticGeometry:false,externalProductionPixels:false},
  review:{state:'reviewable-isolation-preflight',decision:'hold-for-clean-reconstruction-and-review',manifest:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-review-v01.json',manifestSha256:'1977d6138afdacf7b285d7bdbbf6ddfedb80041feaa4ba911cb47763ef4eeb9c',board:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-review-v01.png',boardSha256:'bae653b23fef7ae9961011a867f9dc6f32b468f691af71e0fdc7622d5703f385',edgeQuality:'hold',cleanNeutralReconstruction:'fail',f34FamilyAlignment:'hold',productionRights:'hold',masterApproval:'hold',wf5Promotion:'hold',productionEligible:false},
  externalReferencePolicy:'External exact-vehicle images/3D remain reference-only unless source-specific rights are separately recorded; no external production pixels are present in Candidate 02.',
  nextDependency:'F34 Candidate 05 remains first. For R34, perform identified exact-checksum edge review, then a clean neutral/professional reconstruction against this accepted owner-source camera. Keep production camera lock blocked until accepted F34-family alignment, production-binary rights, master approval and WF5.'
 };
 function assess(){return {packageId:packageDef.packageId,candidateId:packageDef.candidate.candidateId,reviewable:true,cameraMatched:false,productionEligible:false,nextDependency:packageDef.nextDependency}}
 return {...packageDef,assess};
});
