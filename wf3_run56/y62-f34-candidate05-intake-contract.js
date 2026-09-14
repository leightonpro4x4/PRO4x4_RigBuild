(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_F34_CANDIDATE05_INTAKE_CONTRACT=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const contract={
  schemaVersion:'0.26.20',
  contractId:'Y62-F34-V1-CANDIDATE05-INTAKE-01',
  handoffId:'Y62-F34-V1-PRO-RECON-HANDOFF-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',
  viewId:'front34',
  cameraProfileId:'Y62-F34-V1',
  expectedCandidateId:'Y62-F34-V1-CANDIDATE-05',
  predecessor:{candidateId:'Y62-F34-V1-CANDIDATE-04',sha256:'bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1',file:'assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-v04.png'},
  expectedBinary:{mimeType:'image/png',width:1672,height:615,hasAlpha:true,alphaPolicy:'byte-identical-to-candidate-04-unless-pre-authorised-geometry-exception',cameraTransferContractId:'Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01',alphaRawSha256:'f8c0c48381120ddb1eef0c225959955820e1f4753a3905ec96d1e87506602d05',maskFile:'assets/y62-canonical-candidates/Y62-F34-V1-camera-transfer-mask-v01.png',maskSha256:'0d236325f3eb03489fa35bbab8c48a839c3f70ed1fc93770d2d01064101a0d6b'},
  authenticityReferenceIds:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
  requiredSubmissionFields:[
   'candidateId','binaryFile','cameraTransferContractId','retoucher.id','retoucher.name','retoucher.organisation','completedAt','toolsAndMethod','productionPixelSources','externalExactVehicleProductionSources','declarations.noCameraReframe','rights.productionBinaryState','rights.productionBinaryBasis','rights.recordedBy','rights.recordedAt'
  ],
  allowedProductionBinaryRightsStates:['project-owned','licensed-for-project-production','pending','insufficient'],
  productionRightsReadyStates:['project-owned','licensed-for-project-production'],
  validationStages:[
   {id:'manifest-structure',automatable:true,required:true},
   {id:'binary-dimensions-format',automatable:true,required:true},
   {id:'exact-checksum',automatable:true,required:true},
   {id:'alpha-silhouette-lock',automatable:true,required:true},
   {id:'camera-transfer-coordinate-frame',automatable:true,required:true},
   {id:'external-source-rights-ledger',automatable:true,required:true},
   {id:'owner-authenticity-chain',automatable:true,required:true},
   {id:'semantic-geometry-review',automatable:false,required:true},
   {id:'clean-reconstruction-review',automatable:false,required:true},
   {id:'camera-overlay-review',automatable:false,required:true},
   {id:'production-rights',automatable:false,required:true},
   {id:'wf5-exact-checksum-promotion',automatable:false,required:true}
  ],
  prohibitions:[
   'No customer exposure from intake success alone.',
   'No master-approved transition from manifest/binary validation alone.',
   'No inference that alpha equality proves internal body/wheel/trim geometry correctness.',
   'No production use of external exact-vehicle pixels without a source-by-source production rights record.',
   'No fallback to Candidate 04 or any reference-only image if Candidate 05 fails intake.'
  ],
  currentState:{intakeGateReady:true,cameraTransferContractReady:true,candidate05Received:false,binaryValidated:false,provenanceValidated:false,rightsReady:false,semanticReviewPassed:false,productionEligible:false},
  nextDependency:'Receive Candidate 05 plus completed intake manifest. Validate exact alpha/canvas against Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01, then regenerate exact-checksum overlay and identified reviewer evidence.'
 };
 function assessManifest(meta={}){
  const issues=[];
  const r=meta.retoucher||{}, rights=meta.rights||{};
  if(meta.candidateId!==contract.expectedCandidateId)issues.push(`candidateId must be ${contract.expectedCandidateId}`);
  if(!meta.binaryFile)issues.push('binaryFile required');
  if(!r.id||!r.name)issues.push('identified retoucher id and name required');
  if(!r.organisation)issues.push('retoucher organisation / accountable production entity required');
  if(!meta.completedAt)issues.push('completedAt required');
  if(!meta.toolsAndMethod)issues.push('toolsAndMethod required');
  if(!Array.isArray(meta.productionPixelSources)||!meta.productionPixelSources.length)issues.push('productionPixelSources ledger required');
  if(!Array.isArray(meta.externalExactVehicleProductionSources))issues.push('externalExactVehicleProductionSources must be an explicit array, including [] when none were used');
  else for(const src of meta.externalExactVehicleProductionSources){if(!src||!src.sourceId||!src.productionRightsState||!contract.productionRightsReadyStates.includes(src.productionRightsState))issues.push('every external exact-vehicle production source requires sourceId and production-ready rights state')}
  if(!contract.allowedProductionBinaryRightsStates.includes(rights.productionBinaryState))issues.push('rights.productionBinaryState must be explicitly recorded');
  if(!rights.productionBinaryBasis)issues.push('rights.productionBinaryBasis required');
  if(!rights.recordedBy||!rights.recordedAt)issues.push('rights recordedBy and recordedAt required');
  const rightsReady=contract.productionRightsReadyStates.includes(rights.productionBinaryState)&&(!meta.externalExactVehicleProductionSources?.length||meta.externalExactVehicleProductionSources.every(s=>contract.productionRightsReadyStates.includes(s.productionRightsState)));
  return {contractId:contract.contractId,manifestStructurallyReady:issues.length===0,rightsReady,issues,productionEligible:false,nextGate:issues.length?'complete-intake-manifest':'deterministic-binary-alpha-validation'};
 }
 return {...contract,assessManifest};
});
