(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_CANDIDATE03_ALPHA_EDGE_CLEANUP=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const packageDef={
  schemaVersion:'0.26.26',
  packageId:'Y62-R34-V1-CANDIDATE03-ALPHA-EDGE-CLEANUP-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'rear34',briefId:'Y62-R34-V1',
  candidate:{candidateId:'Y62-R34-V1-CANDIDATE-03',source:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03.png',preview:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03-preview.jpg',sha256:'1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7',width:1672,height:615,hasAlpha:true,governanceState:'master-draft',cameraMatched:false,productionEligible:false},
  mask:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-mask-v01.png',sha256:'c0d66588f0dbba6300383f7beffaf10524d93d6814aa7cb967a4324b708e0041',width:700,height:525},
  provenance:{primaryReferenceId:'OWNER-Y62-REAR34-01',source:'references/y62-owner/IMG_4540.jpeg',sourceSha256:'747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2',rights:'owner-project-approved',productionBinaryRights:'not-separately-recorded',lineageCandidateId:'Y62-R34-V1-CANDIDATE-02',lineageSha256:'b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346',transformation:'alpha-only inward anti-alias over the exact Candidate 02 alpha support; owner-source RGB retained exactly; no outward alpha support, crop, perspective warp, non-uniform scaling, RGB retouch or synthetic geometry'},
  verification:{retainedRgbExactFraction:1,retainedPixels:119584,alphaSupportAddedPixels:0,alphaSupportRemovedPixels:0,alphaSupportByteIdentical:true,alphaChangedPixels:1901,semiTransparentPixels:1901,perspectiveWarp:false,syntheticGeometry:false,externalProductionPixels:false},
  review:{state:'candidate03-edge-review-required',decision:'review-candidate03-exact-checksum-before-neutral-reconstruction',edgeQuality:'hold',sourceSceneBoundaryResidue:'hold',cleanNeutralReconstruction:'fail',f34FamilyAlignment:'hold',productionRights:'hold',masterApproval:'hold',wf5Promotion:'hold',productionEligible:false},
  artifacts:{manifest:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.json',sha256:'54def38d936e0d9b4d9d13a9cd763de4f5c632e8ea4becfb95ec5279886bd61e'},board:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-alpha-edge-cleanup-v01.png',sha256:'14a7887110ba53c1c29992ccb310aeff879c2e5c22f544c85c63d12d9abffc7e'}},
  externalReferencePolicy:'External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded; Candidate 03 contains no external exact-vehicle production pixels.',
  nextDependency:'F34 Candidate 05 remains first. For R34, perform fresh identified exact-checksum edge review of Candidate 03. Do not begin clean neutral/professional reconstruction until Candidate 03 edge quality is reviewed; production lock remains blocked behind F34-family alignment, production-binary rights, master approval and WF5.'
 };
 function assess(){return {packageId:packageDef.packageId,candidateId:packageDef.candidate.candidateId,reviewable:true,edgeQuality:'hold',cameraGeometryMatched:false,productionEligible:false,nextDependency:packageDef.nextDependency}}
 return {...packageDef,assess};
});
