(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_CANDIDATE02_EDGE_REVIEW=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const review={
  schemaVersion:'0.26.25',
  packageId:'Y62-R34-V1-CANDIDATE02-EDGE-REVIEW-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'rear34',briefId:'Y62-R34-V1',
  candidate:{candidateId:'Y62-R34-V1-CANDIDATE-02',source:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v02.png',sha256:'b9258e98454d49b11197e5c04d89796eb3ad35dd064892f01f21490f2147b346',width:1672,height:615,hasAlpha:true,governanceState:'master-draft',cameraMatched:false,productionEligible:false},
  reviewer:{reviewerId:'OPENAI-WF3-VISUAL-QA-02',reviewerClass:'model-vision-edge-qa',authority:'edge-review-return-only',identified:true,masterApprovalAuthority:false,productionPassAuthority:false},
  reviewedAt:'2026-09-14T16:05:02+09:30',
  ownerEvidence:['OWNER-Y62-REAR34-01','OWNER-Y62-REAR-01','OWNER-Y62-F34-01'],
  alphaEvidence:{bbox:[567,118,1025,462],uniqueAlphaValues:[0,255],opaquePixels:119584,semiTransparentPixels:0,transparentPixels:908696},
  checks:[
   {id:'exact-checksum',result:'pass'},
   {id:'owner-camera-lineage',result:'pass'},
   {id:'no-guessed-geometry',result:'pass'},
   {id:'roof-spoiler-edge',result:'return'},
   {id:'mirror-front-side-boundary',result:'return'},
   {id:'lower-bumper-tow-edge',result:'return'},
   {id:'clean-neutral-reconstruction',result:'fail'},
   {id:'f34-family-alignment',result:'hold'},
   {id:'production-binary-rights',result:'hold'},
   {id:'master-wf5',result:'hold'}
  ],
  decision:'return-edge-cleanup-before-neutral-reconstruction',edgeQuality:'return',reconstructionAllowed:true,cameraReviewAccepted:true,cameraGeometryMatched:false,productionEligible:false,
  manifest:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.json',sha256:'806f897506d0465ca44cc6430d74c310c66aa9841b477dc70d4aff9ae63cca1a'},
  board:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-02-edge-review-v01.png',sha256:'f5a2cb86e74645bc75a8155ade94d16d988cdd5ca5349ef7af9a0e6d18296ae6'},
  externalReferencePolicy:'External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded; no external exact-vehicle production pixels were introduced by Candidate 02 or this review.',
  nextDependency:'F34 Candidate 05 remains first. For R34, create a checksum-new alpha-edge-cleaned Candidate 03 from owner-source pixels only with no RGB repaint, perspective warp or synthetic geometry, then perform fresh exact-checksum edge review before clean neutral/professional reconstruction. Production lock remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
 };
 function assess(){return {packageId:review.packageId,candidateId:review.candidate.candidateId,decision:review.decision,edgeQuality:review.edgeQuality,cameraGeometryMatched:false,productionEligible:false,nextDependency:review.nextDependency}}
 return {...review,assess};
});
