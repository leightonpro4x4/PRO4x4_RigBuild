(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_REVIEW_DECISION_01=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  schemaVersion:'0.26.22',
  decisionId:'Y62-R34-V1-REVIEW-DECISION-01',
  reviewId:'Y62-R34-V1-CAMERA-SEMANTIC-REVIEW-01',
  candidateId:'Y62-R34-V1-CANDIDATE-01',
  candidateSha256:'8d61ff21aa2bc0ec61122ab1641a232a6e2f3781c0601da6154593f15844a67b',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  reviewer:{reviewerId:'OPENAI-WF3-VISUAL-REVIEW-01',reviewerClass:'model-vision-semantic-review',authority:'camera-for-reconstruction-only',identified:true,masterApprovalAuthority:false,productionPassAuthority:false,note:'This reviewer may accept or return the owner-source R34 camera as a reconstruction target only. It cannot approve the canonical master, production rights, customer exposure or WF5 promotion.'},
  reviewedAt:'2026-09-14T13:04:00+09:30',
  decision:'accept-camera-for-reconstruction',
  cameraReviewAccepted:true,
  cameraGeometryMatched:false,
  reconstructionAllowed:true,
  productionEligible:false,
  primaryAuthenticityEvidence:['OWNER-Y62-REAR34-01','OWNER-Y62-REAR-01','OWNER-Y62-F34-01'],
  checks:[
   {id:'rear34-camera',result:'pass',note:'The direct owner rear-three-quarter camera is accepted deliberately as the reconstruction target. Its close perspective is source-authentic; no warp or silent perspective correction is authorised.'},
   {id:'rear-quarter-silhouette',result:'pass',note:'The visible quarter-panel, glasshouse, wheel-arch and body proportions are direct owner-source geometry and are suitable as reconstruction anchors.'},
   {id:'tail-lamp-anchor',result:'pass',note:'Tail-lamp placement and form are directly visible in OWNER-Y62-REAR34-01 and consistent with OWNER-Y62-REAR-01.'},
   {id:'tailgate-anchor',result:'pass',note:'Tailgate, garnish, rear-glass and wiper anchors are consistent between the rear-three-quarter and straight-rear owner sources.'},
   {id:'bumper-tow-anchor',result:'pass',note:'Rear bumper, lower valance and tow-area positions are directly supported by both owner views. These anchors are evidence only; removable/non-base equipment must be handled by the later reconstruction brief rather than silently retained or removed.'},
   {id:'no-invented-geometry',result:'pass',note:'Candidate 01 is a uniform-scale presentation of OWNER-Y62-REAR34-01 with no crop, perspective warp or synthetic geometry; acceptance does not authorise generative completion.'}
  ],
  observations:[
   'The near rear corner/wheel is visibly dominant because the owner photo was taken from a relatively close rear-quarter position. This perspective is accepted intentionally for reconstruction rather than corrected by warp.',
   'The accepted camera is broadly consistent in character with the owner F34 evidence, which is also a close quarter-view photograph, but final F34/R34 family scale and stance alignment remains a separate production-lock gate.',
   'Candidate 01 remains a background-preserving JPEG review board. Acceptance starts a transparent reconstruction attempt only; it is not a canonical master approval.'
  ],
  governance:{masterState:'master-draft',cameraProductionLock:false,productionEligible:false,customerExposure:'never',productionBinaryRights:'not-separately-recorded',wf5ExactChecksumGate:'not-run'},
  route:{nextState:'transparent-r34-reconstruction-authorised',nextDependency:'Create a transparent clean R34 reconstruction against the accepted owner-source camera without perspective warp or invented geometry, record exact provenance/rights, then generate fresh checksum-specific overlay/reviewer evidence. Keep production camera lock blocked until accepted F34-family alignment.'},
  externalExactVehicleImagesUsedForProduction:false
 };
});
