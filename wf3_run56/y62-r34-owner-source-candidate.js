(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_R34_OWNER_SOURCE_CANDIDATE=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const packageDef={
  schemaVersion:'0.26.23',
  packageId:'Y62-R34-V1-OWNER-SOURCE-CANDIDATE-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'rear34',briefId:'Y62-R34-V1',
  decision:'REVIEWABLE_OWNER_SOURCE_CANDIDATE_READY',
  primaryReference:{id:'OWNER-Y62-REAR34-01',file:'references/y62-owner/IMG_4540.jpeg',sha256:'747c9edf7b39fca2cb9fa9dde0bf329cdbec8dc2c08643d873317b50c27d28e2',geometryAuthority:'primary-for-r34-source-camera'},
  supportingReferences:[
   {id:'OWNER-Y62-REAR-01',file:'references/y62-owner/IMG_4508.jpeg',sha256:'a72cb38fc92c95afd86c6eab513904d056ae80b3123ccea64eea9cbd5c01627a',role:'rear-fascia-tailgate-bumper-symmetry'},
   {id:'OWNER-Y62-F34-01',file:'references/y62-owner/IMG_4030.jpeg',sha256:'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc',role:'family-stance-and-factory-warrior-rolling-stock'}
  ],
  candidate:{candidateId:'Y62-R34-V1-CANDIDATE-01',source:'assets/y62-canonical-candidates/Y62-R34-V1-owner-source-v01.jpg',manifest:'assets/y62-canonical-candidates/Y62-R34-V1-owner-source-candidate-v01.json',sha256:'8d61ff21aa2bc0ec61122ab1641a232a6e2f3781c0601da6154593f15844a67b',manifestSha256:'b6c77f43233b053ea9004027263cb3faf5c4e64037ff2b16153ff37a3bd5f4b0',width:1672,height:615,hasAlpha:false,governanceState:'master-draft',productionEligible:false},
  transformation:{operation:'uniform-scale-and-centre-on-review-canvas',sourcePhotoScaledTo:{width:700,height:525},sourcePhotoPlacement:{x:486,y:45},crop:'none',perspectiveWarp:false,geometrySynthesis:false},
  cameraViewContract:{
   contractId:'Y62-R34-V1-VIEW-CONTRACT-01',state:'reconstruction-authorised',cameraLock:false,targetCanvas:{width:1672,height:615},
   requirements:['retain owner-source rear-three-quarter azimuth/elevation as direct authenticity anchor','use rear owner photo to verify tailgate, tail-lamp, bumper and tow-area symmetry','match accepted F34 family scale/stance before any production lock','fresh transparent reconstruction must be overlay-reviewed against owner source'],
   prohibitions:['no perspective warp of the owner photograph into a different rear-three-quarter camera','no generative completion or invented rear/side geometry','no use of external exact-vehicle production pixels without separately recorded source-specific rights','no production promotion from this background-preserving review board']
  },
  externalReferencePolicy:{asset:'assets/y62-raslarr-rear.png',status:'reference-only-not-used-in-candidate',productionRightsRecorded:false,productionPixelUse:'prohibited'},
  review:{state:'camera-accepted-for-reconstruction',reviewId:'Y62-R34-V1-CAMERA-SEMANTIC-REVIEW-01',decisionRecordId:'Y62-R34-V1-REVIEW-DECISION-01',board:'assets/y62-canonical-candidates/Y62-R34-V1-camera-semantic-review-pack-v01.png',boardSha256:'93cb7b97cdb90030195972025afc4dca06c9fcb0b6813714fd70663f62421c5c',manifest:'assets/y62-canonical-candidates/Y62-R34-V1-camera-semantic-review-v01.json',manifestSha256:'143d40b48bcbda993c0e40921ac748a382809c70695190696abbfa9d53a502f6',decisionBoard:'assets/y62-canonical-candidates/Y62-R34-V1-review-decision-v01.png',decisionBoardSha256:'32b6eb933b1a067b64a8d785dc439da9a0613ce0251c3c6e466abbb4e3dd4107',required:['rear34-camera','rear-quarter-silhouette','tail-lamp-anchor','tailgate-anchor','bumper-tow-anchor','no-invented-geometry'],decision:'accept-camera-for-reconstruction',cameraMatched:false,reconstructionAllowed:true,productionEligible:false},
  nextDependency:'Candidate 02 transparent owner-source isolation now exists and remains non-production. Next: exact-checksum edge review and clean neutral/professional reconstruction; production camera lock still requires accepted F34-family alignment plus rights/master/WF5 gates.'
 };
 function assess(){return {packageId:packageDef.packageId,decision:packageDef.decision,reviewReady:true,cameraLocked:false,productionEligible:false,nextDependency:packageDef.nextDependency}}
 return {...packageDef,assess};
});
