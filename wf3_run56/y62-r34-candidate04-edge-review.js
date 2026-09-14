(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_CANDIDATE04_EDGE_REVIEW=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const review={
  schemaVersion:'0.26.29',packageId:'Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01',policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'rear34',briefId:'Y62-R34-V1',
  candidate:{candidateId:'Y62-R34-V1-CANDIDATE-04',source:'assets/y62-canonical-candidates/Y62-R34-V1-transparent-isolation-v04.png',sha256:'b81f9fbd476db73dc87bdabd80427eb8441ea2db2223fda8421cee51a859cc18',width:1672,height:615,hasAlpha:true,governanceState:'master-draft',cameraMatched:false,productionEligible:false},
  reviewer:{reviewerId:'OPENAI-WF3-VISUAL-QA-04',reviewerClass:'model-vision-edge-qa',authority:'edge-review-return-and-second-targeted-alpha-cleanup-authorisation-only',identified:true,masterApprovalAuthority:false,productionPassAuthority:false},
  reviewedAt:'2026-09-14T19:58:45+09:30',
  ownerEvidence:['OWNER-Y62-REAR34-01','OWNER-Y62-REAR-01','OWNER-Y62-F34-01'],
  lineage:{generationPackageId:'Y62-R34-V1-CANDIDATE04-TARGETED-ALPHA-CLEANUP-01',generationManifestSha256:'a9e44c975f7feacabdfab8324ed390595e088001960ec1809368606ca7b4701c',authorisingPriorReviewId:'Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01',authorisingPriorReviewSha256:'caf4cd3bb1d1ff050bdecd178dfd8a99d593676c8846466b45bdf873e58d8e7c'},
  alphaEvidence:{bbox:[567,118,1025,462],uniqueAlphaValueCount:144,opaquePixels:115108,semiTransparentPixels:2596,transparentPixels:910576,nonzeroSupportPixels:117704,supportAddedPixelsVsCandidate03:0,supportRemovedPixelsVsCandidate03:1880,retainedRgbExactFraction:1},
  checks:[
   {id:'exact-checksum',result:'pass'},{id:'owner-camera-lineage',result:'pass'},{id:'candidate03-review-authority',result:'pass'},{id:'outward-alpha-support',result:'pass'},{id:'retained-owner-rgb',result:'pass'},{id:'roof-spoiler-edge',result:'pass'},{id:'mirror-front-side-boundary',result:'return'},{id:'wheel-underbody-boundary',result:'return'},{id:'lower-bumper-tow-edge',result:'pass'},{id:'clean-neutral-reconstruction',result:'fail'},{id:'f34-family-alignment',result:'hold'},{id:'production-binary-rights',result:'hold'},{id:'master-wf5',result:'hold'}
  ],
  decision:'return-second-targeted-alpha-residue-cleanup-before-neutral-reconstruction',edgeQuality:'return-targeted-cleanup',targetedCleanupAuthorised:true,
  targetedCleanupConstraints:{alphaSubtractiveOnly:true,outwardSupportAdditionAllowed:false,rgbRetouchAllowed:false,perspectiveWarpAllowed:false,nonUniformScaleAllowed:false,syntheticGeometryAllowed:false,permittedRegions:['unambiguous photographed foliage/background spike immediately above/behind the near-side mirror; exclude mirror housing, A-pillar and uncertain vehicle pixels','unambiguous detached photographed road/kerb remnant below/left of rear wheel and source-ground residue below running board; exclude tyre, mudflap, running board and uncertain underbody pixels'],authority:'owner-source evidence only; remove only pixels that are clearly source scene and retain uncertain vehicle pixels'},
  reconstructionAllowed:false,cameraReviewAccepted:true,cameraGeometryMatched:false,productionEligible:false,
  manifest:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-edge-review-v01.json',sha256:'775dd37da1e6bdfb1d288a160458c9e73f37c091e6e603cad414ade156691bd3'},
  board:{source:'assets/y62-canonical-candidates/Y62-R34-V1-candidate-04-edge-review-v01.png',sha256:'79335e10eebccf683d375dc25e37e282fdd25e11a4de77bc78ac6c5143ca6345'},
  externalReferencePolicy:'External exact-vehicle images/3D remain reference-only unless source-specific production rights are separately recorded; no external exact-vehicle production pixels were introduced by Candidate 04 or this review.',
  nextDependency:'F34 Candidate 05 remains first. If still unavailable, create checksum-new Y62-R34-V1-CANDIDATE-05 using alpha-subtractive cleanup only for the two residual owner-evidenced source-scene areas authorised by this exact-checksum review. Do not add alpha support, repaint RGB, warp perspective, rescale non-uniformly or invent geometry. Then perform another fresh exact-checksum edge review before clean neutral/professional reconstruction. Production remains blocked behind accepted F34-family alignment, production-binary rights, master approval and WF5.'
 };
 function assess(){return {packageId:review.packageId,candidateId:review.candidate.candidateId,decision:review.decision,edgeQuality:review.edgeQuality,targetedCleanupAuthorised:true,reconstructionAllowed:false,cameraGeometryMatched:false,productionEligible:false,nextDependency:review.nextDependency}}
 return {...review,assess};
});
