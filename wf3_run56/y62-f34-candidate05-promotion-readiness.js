(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_F34_CANDIDATE05_PROMOTION_READINESS_01=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const requiredSemanticCheckIds=[
  'vehicle-identity-series5-warrior','factory-warrior-wheel-tyre','premcar-stance','f34-camera-perspective','silhouette','roofline-glasshouse','front-fascia-bumper','headlamp-grille-anchors','wheel-centres-stance','edge-alpha-quality','clean-reconstruction','no-invented-geometry'
 ];
 const gate={
  schemaVersion:'0.26.24',
  gateId:'Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',viewId:'front34',cameraProfileId:'Y62-F34-V1',candidateId:'Y62-F34-V1-CANDIDATE-05',
  purpose:'Fail-closed WF3 bridge from a valid Candidate 05 exact-checksum review to WF5. This gate can declare readiness for WF5 but can never write production state or promote a binary itself.',
  primaryAuthenticityEvidence:[
   {id:'OWNER-Y62-F34-01',sha256:'400a6e3f7fddeb5dba175173491ddd2bab62c0cea6fd286b5c4e6119d9a72fdc',role:'primary-f34'},
   {id:'OWNER-Y62-F34-02',sha256:'5a3f5209582446cb21622c7c4a5b2741437c55095c7ce7276a9c22e6adb1dfd4',role:'support-f34'},
   {id:'OWNER-Y62-FRONT-01',sha256:'96e9d873a7fc7eeff48a95eab46896e4572549c8e6a8e286e631a269d42cfb8e',role:'primary-front'},
   {id:'OWNER-Y62-FRONT-02',sha256:'8fabad7df166ce1ac3e95b5fe38f13572e1d86e2c2d21343917a0842321d5739',role:'support-front'}
  ],
  requiredLineage:{
   handoffId:'Y62-F34-V1-PRO-RECON-HANDOFF-01',
   intakeContractId:'Y62-F34-V1-CANDIDATE05-INTAKE-01',
   cameraTransferContractId:'Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01',
   reviewPipelineId:'Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01',
   expectedCanvas:{width:1672,height:615,hasAlpha:true},
   expectedAlphaRawSha256:'f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05',
   forbiddenPriorBinarySha256:'bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1'
  },
  requiredSemanticCheckIds,
  rightsPolicy:{
   ownerReferences:'primary authenticity evidence; owner-project-approved internal canonical development',
   externalExactVehicleSources:'reference-only unless source-specific production rights are separately recorded',
   externalRightsDoNotGrantGeometryAuthority:true,
   productionBinaryRightsRequired:true
  },
  authorityBoundary:{
   mayDeclareReadyForWF5:true,
   maySetCameraGeometryMatched:false,
   maySetMasterApproved:false,
   mayWriteProductionRegistry:false,
   maySetProductionEligible:false,
   finalPromotionAuthority:'WF5 exact-checksum production promotion gate only'
  },
  currentState:{candidate05Received:false,intakePassed:false,exactChecksumReviewPassed:false,productionRightsReady:false,masterApproved:false,readyForWF5:false,productionEligible:false},
  nextDependency:'Receive professionally reconstructed Y62-F34-V1-CANDIDATE-05 plus completed intake/provenance/rights manifest; run deterministic intake and exact-checksum review before evaluating this gate.'
 };
 function normState(v){return String(v||'').trim().toLowerCase();}
 function externalRightsComplete(input){
  if(input.externalProductionSourcesUsed!==true)return true;
  if(!Array.isArray(input.externalSourceRights)||input.externalSourceRights.length===0)return false;
  return input.externalSourceRights.every(x=>x&&x.sourceId&&x.rightsRecorded===true&&x.commercialDerivativeUse===true&&x.productionPixelUse===true);
 }
 function semanticPasses(input){
  const checks=input.semanticChecks||{};
  return requiredSemanticCheckIds.every(id=>normState(checks[id])==='pass');
 }
 function evaluate(input={}){
  const issues=[];
  if(input.policy!==gate.policy)issues.push(`policy must remain ${gate.policy}`);
  if(input.candidateId!==gate.candidateId)issues.push(`candidateId must be ${gate.candidateId}`);
  if(input.handoffId!==gate.requiredLineage.handoffId)issues.push('professional reconstruction handoff mismatch');
  if(input.intakeContractId!==gate.requiredLineage.intakeContractId)issues.push('Candidate 05 intake contract mismatch');
  if(input.cameraTransferContractId!==gate.requiredLineage.cameraTransferContractId)issues.push('camera-transfer contract mismatch');
  if(input.reviewPipelineId!==gate.requiredLineage.reviewPipelineId)issues.push('Candidate 05 review pipeline mismatch');
  if(input.intakeStructurallyReady!==true)issues.push('deterministic Candidate 05 intake must report structurallyReady=true');
  const hashes=[input.candidateSha256,input.intakeBinarySha256,input.reviewCandidateSha256,input.masterApprovalCandidateSha256].filter(Boolean);
  if(hashes.length!==4||new Set(hashes).size!==1)issues.push('candidate/intake/review/master-approval SHA-256 values must all exist and match exactly');
  if(input.candidateSha256===gate.requiredLineage.forbiddenPriorBinarySha256)issues.push('Candidate 04 binary cannot be reused as Candidate 05');
  if(input.width!==1672||input.height!==615||input.hasAlpha!==true)issues.push('candidate must remain 1672x615 with alpha');
  if(input.alphaRawSha256!==gate.requiredLineage.expectedAlphaRawSha256)issues.push('locked owner-backed alpha/camera coordinate frame must match; geometry exceptions require a new reviewed promotion contract');
  if(input.reviewEvidenceGenerated!==true)issues.push('fresh Candidate 05 exact-checksum review evidence is required');
  if(!input.reviewerId)issues.push('identified semantic reviewer is required');
  if(input.reviewerAuthority!=='identified-semantic-review')issues.push('reviewer authority must be identified-semantic-review');
  if(input.reviewerDecision!=='pass')issues.push('identified semantic reviewer decision must be pass');
  if(input.cameraGeometryMatched!==true)issues.push('cameraGeometryMatched must be explicitly true from identified review');
  if(!semanticPasses(input))issues.push('all 12 Candidate 05 semantic/edge/clean-reconstruction checks must pass');
  if(input.productionBinaryRightsReady!==true)issues.push('production-binary rights must be explicitly ready');
  if(!externalRightsComplete(input))issues.push('every external production source must have source-specific recorded commercial derivative and production-pixel rights');
  if(!input.masterApproverId)issues.push('identified master approver is required');
  if(input.masterApproverAuthority!=='canonical-master-approval')issues.push('master approver authority must be canonical-master-approval');
  if(input.masterApproved!==true||input.masterState!=='master-approved')issues.push('exact Candidate 05 checksum must be master-approved');
  const readyForWF5=issues.length===0;
  return {gateId:gate.gateId,candidateId:gate.candidateId,readyForWF5,issues,nextGate:readyForWF5?'WF5 exact-checksum production promotion gate':'resolve listed WF3 readiness blockers',productionEligible:false,productionRegistryWriteAllowed:false};
 }
 return {...gate,evaluate};
});
