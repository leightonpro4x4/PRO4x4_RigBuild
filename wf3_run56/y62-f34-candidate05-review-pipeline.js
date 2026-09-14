(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_F34_CANDIDATE05_REVIEW_PIPELINE_01=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const pipeline={
  schemaVersion:'0.26.21',
  pipelineId:'Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'front34',cameraProfileId:'Y62-F34-V1',
  purpose:'Make the first Candidate 05 review deterministic and checksum-specific immediately after valid intake, without granting geometry, rights, master or production approval.',
  requiredInputs:{
   candidateId:'Y62-F34-V1-CANDIDATE-05',
   intakeContractId:'Y62-F34-V1-CANDIDATE05-INTAKE-01',
   cameraTransferContractId:'Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01',
   handoffId:'Y62-F34-V1-PRO-RECON-HANDOFF-01',
   primaryReference:{id:'OWNER-Y62-F34-01',file:'references/y62-owner/IMG_4030.jpeg',sha256:'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc'},
   supportingReferenceIds:['OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
   expectedCanvas:{width:1672,height:615,hasAlpha:true},
   expectedAlphaRawSha256:'f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05'
  },
  reviewGenerationRules:[
   'Candidate review evidence may only be generated for Y62-F34-V1-CANDIDATE-05 after deterministic intake reports structurallyReady=true.',
   'The candidate SHA-256 used by the review packet must exactly match the intake result binary SHA-256.',
   'The locked 1672x615 alpha/camera-transfer frame must match before overlay evidence is generated unless a pre-authorised geometry exception is separately recorded.',
   'Owner-supplied 2025 Series 5 Y62 Warrior references remain the primary authenticity evidence.',
   'External exact-vehicle sources remain reference-only unless source-specific production rights are separately recorded; no external source gains geometry authority automatically.',
   'Machine registration is evidence only and can never set cameraGeometryMatched=true, master-approved or productionEligible=true.',
   'A new Candidate 05 checksum requires a new review packet; no Candidate 04 reviewer decision or overlay may be inherited.'
  ],
  machinePrecheck:{
   method:'SIFT + Lowe ratio 0.60 + RANSAC partial affine, owner-source-to-candidate evidence only',
   thresholds:{minimumGoodMatches:300,minimumInliers:250,minimumInlierRatio:0.90,maximumResidualP95Px:2.0,maximumAbsRotationDeg:0.10},
   authority:'preflight-only',cameraGeometryMatched:false,productionEligible:false
  },
  requiredReviewerChecks:[
   {id:'vehicle-identity-series5-warrior',label:'2025 Series 5 Patrol Warrior identity',authority:'owner-reference'},
   {id:'factory-warrior-wheel-tyre',label:'Factory Warrior wheel/tyre geometry retained',authority:'owner-reference'},
   {id:'premcar-stance',label:'Warrior/Premcar stance retained',authority:'owner-reference'},
   {id:'f34-camera-perspective',label:'F34 camera perspective matches owner-backed canonical family',authority:'identified-reviewer'},
   {id:'silhouette',label:'Body silhouette/arches/overhangs remain reference-backed',authority:'identified-reviewer'},
   {id:'roofline-glasshouse',label:'Roofline and glasshouse proportions remain reference-backed',authority:'identified-reviewer'},
   {id:'front-fascia-bumper',label:'Series 5 front fascia and bumper geometry remain reference-backed',authority:'identified-reviewer'},
   {id:'headlamp-grille-anchors',label:'Headlamp/grille anchor positions remain reference-backed',authority:'identified-reviewer'},
   {id:'wheel-centres-stance',label:'Wheel centres and stance remain locked to approved coordinate frame',authority:'identified-reviewer'},
   {id:'edge-alpha-quality',label:'Transparent edge/alpha quality is production-clean',authority:'identified-reviewer'},
   {id:'clean-reconstruction',label:'No photographed environment/reflection residue compromises canonical use',authority:'identified-reviewer'},
   {id:'no-invented-geometry',label:'No guessed, warped or unsupported geometry introduced',authority:'identified-reviewer'}
  ],
  postReviewGates:[
   'identified reviewer PASS on all mandatory semantic checks',
   'production-binary rightsReady=true with source-by-source external production rights where applicable',
   'master approval recorded against the exact Candidate 05 checksum',
   'WF5 exact-checksum production promotion gate'
  ],
  currentState:{reviewPipelineReady:true,candidate05Received:false,intakePassed:false,reviewEvidenceGenerated:false,reviewerDecision:'pending',cameraGeometryMatched:false,masterApproved:false,productionEligible:false},
  nextDependency:'Receive Candidate 05 plus completed intake manifest, obtain structurallyReady=true from Y62-F34-V1-CANDIDATE05-INTAKE-01, then run the exact-checksum review generator and identified semantic review.'
 };
 function assessReviewGeneration(input={}){
  const issues=[];
  if(input.candidateId!==pipeline.requiredInputs.candidateId)issues.push(`candidateId must be ${pipeline.requiredInputs.candidateId}`);
  if(input.intakeContractId!==pipeline.requiredInputs.intakeContractId)issues.push('Candidate 05 intake contract mismatch');
  if(input.cameraTransferContractId!==pipeline.requiredInputs.cameraTransferContractId)issues.push('camera-transfer contract mismatch');
  if(input.structurallyReady!==true)issues.push('deterministic Candidate 05 intake must report structurallyReady=true');
  if(!input.candidateSha256||input.candidateSha256!==input.intakeBinarySha256)issues.push('candidate SHA-256 must equal intake result binary SHA-256');
  if(input.width!==1672||input.height!==615||input.hasAlpha!==true)issues.push('candidate must remain 1672x615 RGBA');
  if(input.alphaRawSha256!==pipeline.requiredInputs.expectedAlphaRawSha256&&!input.preAuthorisedGeometryException)issues.push('locked alpha/camera coordinate frame mismatch');
  return {pipelineId:pipeline.pipelineId,reviewGenerationAllowed:issues.length===0,issues,cameraGeometryMatched:false,masterApproved:false,productionEligible:false,nextGate:issues.length?'candidate05-intake-or-coordinate-remediation':'generate-new-exact-checksum-overlay-and-review-packet'};
 }
 return {...pipeline,assessReviewGeneration};
});
