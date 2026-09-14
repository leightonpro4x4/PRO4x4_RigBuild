(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_CAMERA_SEMANTIC_REVIEW=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const review={
  schemaVersion:'0.26.22',
  reviewId:'Y62-R34-V1-CAMERA-SEMANTIC-REVIEW-01',
  packageId:'Y62-R34-V1-OWNER-SOURCE-CANDIDATE-01',
  decisionRecordId:'Y62-R34-V1-REVIEW-DECISION-01',
  candidateId:'Y62-R34-V1-CANDIDATE-01',
  candidateSha256:'8d61ff21aa2bc0ec61122ab1641a232a6e2f3781c0601da6154593f15844a67b',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  state:'camera-accepted-for-reconstruction',
  decision:'accept-camera-for-reconstruction',
  cameraReviewAccepted:true,
  cameraMatched:false,
  productionEligible:false,
  board:{file:'assets/y62-canonical-candidates/Y62-R34-V1-camera-semantic-review-pack-v01.png',sha256:'93cb7b97cdb90030195972025afc4dca06c9fcb0b6813714fd70663f62421c5c',width:1920,height:1080},
  decisionBoard:{file:'assets/y62-canonical-candidates/Y62-R34-V1-review-decision-v01.png',sha256:'32b6eb933b1a067b64a8d785dc439da9a0613ce0251c3c6e466abbb4e3dd4107',width:1920,height:1300},
  authenticityEvidence:[
   {id:'OWNER-Y62-REAR34-01',file:'references/y62-owner/IMG_4540.jpeg',sha256:'747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2',role:'primary direct R34 camera + rear-quarter geometry anchor'},
   {id:'OWNER-Y62-REAR-01',file:'references/y62-owner/IMG_4508.jpeg',sha256:'a72cb38fc92c95afd86c6eab513904d056ae80b3123ccea64eea9cbd5c01627a',role:'rear fascia / tailgate / lamp / bumper symmetry support'},
   {id:'OWNER-Y62-F34-01',file:'references/y62-owner/IMG_4030.jpeg',sha256:'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc',role:'family stance + factory Warrior rolling-stock support only'}
  ],
  preflight:{
   preparedBy:{reviewerId:'OPENAI-WF3-VISUAL-QA-01',reviewerClass:'automated-visual-qa',authority:'preflight-only',passAuthority:false},
   findings:[
    'Candidate 01 is a deterministic uniform-scale presentation of the owner R34 source; no crop, perspective warp or synthetic geometry was introduced.',
    'Vehicle identity, factory Warrior wheels/tyres and Premcar stance are directly supported by owner evidence.',
    'Rear lamp, tailgate, bumper and tow-area anchors are visible in the primary R34 image and cross-checkable against the straight rear owner image.',
    'The primary source is a close rear-quarter perspective in which the near rear corner/wheel is visibly dominant. This authentic source geometry has now been explicitly accepted as the reconstruction camera rather than silently corrected.'
   ],
   externalExactVehicleProductionPixelsUsed:false,
   automaticPromotionAllowed:false
  },
  requiredReviewerChecks:[
   {id:'rear34-camera',label:'Accept the owner-source rear-three-quarter camera/perspective as the R34 reconstruction target',state:'pass'},
   {id:'rear-quarter-silhouette',label:'Accept visible rear-quarter silhouette and body proportions as authentic to the owner vehicle',state:'pass'},
   {id:'tail-lamp-anchor',label:'Tail-lamp placement/form is consistent with owner rear support',state:'pass'},
   {id:'tailgate-anchor',label:'Tailgate / garnish / rear-glass anchors are consistent with owner rear support',state:'pass'},
   {id:'bumper-tow-anchor',label:'Rear bumper / lower valance / tow-area anchors are consistent with owner rear support',state:'pass'},
   {id:'no-invented-geometry',label:'Reviewer confirms no inferred/warped geometry is being approved by this packet',state:'pass'}
  ],
  evidenceBackedChecks:[
   {id:'identity',result:'pass',basis:'owner-source exact vehicle'},
   {id:'factory-wheels',result:'pass',basis:'owner-source visible rolling stock'},
   {id:'stance',result:'pass',basis:'owner-source visible Warrior/Premcar stance'},
   {id:'source-transform',result:'pass',basis:'uniform scale + centre only; no crop/warp/synthesis'}
  ],
  reviewer:{reviewerId:'OPENAI-WF3-VISUAL-REVIEW-01',reviewerClass:'model-vision-semantic-review',reviewedAt:'2026-09-14T13:04:00+09:30',decision:'accept-camera-for-reconstruction',authority:'camera-for-reconstruction-only',masterApprovalAuthority:false,productionPassAuthority:false},
  reconstructionGate:{allowed:true,authorisedBy:'Y62-R34-V1-REVIEW-DECISION-01',transparentMasterRequired:true,cleanReconstructionRequired:true,geometryWarpAllowed:false,generativeCompletionAllowed:false},
  productionGate:{allowed:false,requires:['accepted F34 family alignment','clean transparent R34 reconstruction','fresh exact-checksum overlay/reviewer evidence','production-binary rights recorded','master approval','WF5 exact-checksum gate']},
  externalReferencePolicy:{exactVehicleExternalImages:'reference-only unless source-specific rights are separately recorded',productionPixelsAllowed:false},
  nextDependency:'Create a transparent clean R34 reconstruction against the accepted owner-source camera without perspective warp or invented geometry. Record exact provenance/rights and generate fresh exact-checksum overlay/reviewer evidence. Keep production camera lock blocked until accepted F34-family alignment.'
 };
 function assess(){return {reviewId:review.reviewId,state:review.state,decision:review.decision,cameraReviewAccepted:true,cameraMatched:false,reconstructionAllowed:true,productionEligible:false,nextDependency:review.nextDependency}}
 return {...review,assess};
});
