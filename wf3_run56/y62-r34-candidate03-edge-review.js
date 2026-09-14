(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_CANDIDATE03_EDGE_REVIEW=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const review={
  schemaVersion:'0.26.27',
  packageId:'Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'rear34',briefId:'Y62-R34-V1',
  candidate:{candidateId:'Y62-R34-V1-CANDIDATE-03',source:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v03.png',sha256:'1260362df7d22c70dafbfd3deba3f767150496093fdaeb8178b826e0470fd6b7',width:1672,height:615,hasAlpha:true,governanceState:'master-draft',cameraMatched:false,productionEligible:false},
  reviewer:{reviewerId:'OPENAI-WF3-VISUAL-QA-03',reviewerClass:'model-vision-edge-qa',authority:'edge-review-return-and-alpha-cleanup-authorisation-only',identified:true,masterApprovalAuthority:false,productionPassAuthority:false},
  reviewedAt:'2026-09-14T17:58:54+09:30',
  ownerEvidence:['OWNER-Y62-REAR34-01','OWNER-Y62-REAR-01','OWNER-Y62-F34-01'],
  alphaEvidence:{bbox:[567,118,1025,462],uniqueAlphaValues:[0,142,198,255],opaquePixels:117683,semiTransparentPixels:1901,transparentPixels:908696,nonzeroSupportPixels:119584,supportAddedPixelsVsCandidate02:0,supportRemovedPixelsVsCandidate02:0},
  checks:[
   {id:'exact-checksum',result:'pass'},
   {id:'owner-camera-lineage',result:'pass'},
   {id:'no-guessed-geometry',result:'pass'},
   {id:'antialias-improvement',result:'pass'},
   {id:'roof-spoiler-edge',result:'pass'},
   {id:'mirror-front-side-boundary',result:'return'},
   {id:'wheel-underbody-boundary',result:'return'},
   {id:'lower-bumper-tow-edge',result:'pass'},
   {id:'clean-neutral-reconstruction',result:'fail'},
   {id:'f34-family-alignment',result:'hold'},
   {id:'production-binary-rights',result:'hold'},
   {id:'master-wf5',result:'hold'}
  ],
  decision:'return-targeted-alpha-residue-cleanup-before-neutral-reconstruction',edgeQuality:'return-targeted-cleanup',targetedCleanupAuthorised:true,
  targetedCleanupConstraints:{alphaSubtractiveOnly:true,outwardSupportAdditionAllowed:false,rgbRetouchAllowed:false,perspectiveWarpAllowed:false,nonUniformScaleAllowed:false,syntheticGeometryAllowed:false,permittedRegions:['near-side mirror/front-side photographed background residue','running-board/rear-wheel underbody photographed road/ground residue'],authority:'owner-source evidence only; do not remove uncertain vehicle pixels'},
  reconstructionAllowed:false,cameraReviewAccepted:true,cameraGeometryMatched:false,productionEligible:false,
  manifest:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.json',sha256:'caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c'},
  board:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-03-edge-review-v01.png',sha256:'b386fe73a73805ec29e1f7a9cec6dc870f04e785fff90b4e44bd5aa8f4319a74'},
  externalReferencePolicy:'External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded; no external exact-vehicle production pixels were introduced by Candidate 03 or this review.',
  nextDependency:'F34 Candidate 05 remains first. If still unavailable, create checksum-new Y62-R34-V1-CANDIDATE-04 by alpha-subtractive cleanup only in the two owner-evidenced residue zones; do not add alpha support, repaint RGB, warp perspective or invent geometry. Then perform a fresh exact-checksum edge review before any clean neutral/professional reconstruction. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
 };
 function assess(){return {packageId:review.packageId,candidateId:review.candidate.candidateId,decision:review.decision,edgeQuality:review.edgeQuality,targetedCleanupAuthorised:true,reconstructionAllowed:false,cameraGeometryMatched:false,productionEligible:false,nextDependency:review.nextDependency}}
 return {...review,assess};
});
