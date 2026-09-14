(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_F34_EXTERNAL_3D_REFERENCE_INTAKE_01=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  schemaVersion:'0.26.19',
  intakeId:'Y62-F34-V1-EXTERNAL-3D-REFERENCE-INTAKE-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',
  vehicle:'2025 Series 5 Nissan Patrol Warrior by Premcar',
  priority:'F34-first-then-SIDE-R34',
  source:{
   sourceType:'user-supplied-external-3d-pointer',provider:'Sketchfab',url:'https://skfb.ly/onCVs',exactModelUrl:null,modelId:null,title:null,creator:null,downloadableFileReceived:false
  },
  resolution:{
   state:'unresolved-origin-403',checkedAt:'2026-09-14T09:58:22+09:30',httpStatusObserved:403,targetResolved:false,sameAssetSearchMatchFound:false,
   guardrail:'Do not substitute another publicly indexed Y62 Sketchfab model for this exact owner-supplied pointer unless identity is proven.'
  },
  authenticity:{
   primaryAuthority:'owner-supplied 2025 Series 5 Y62 Warrior reference pack',external3dGeometryAuthority:'none-until-resolved-and-compared',mayOverrideOwnerEvidence:false,
   mandatoryChecks:['MY25 Series 5 fascia','glasshouse proportions','wheelbase/body length','wheel arches','factory Warrior wheels/tyres','Premcar stance']
  },
  rights:{
   licenseState:'unknown-not-recorded',commercialDerivativeRightsRecorded:false,productionMeshUseAllowed:false,productionPixelUseAllowed:false,productionBinaryRightsReady:false,
   rule:'External exact-vehicle imagery or mesh remains reference-only unless source-specific rights are separately recorded.'
  },
  workflowRole:{
   state:'pending-provenance-and-authenticity',
   couldAssist:['F34 clean reconstruction','SIDE measured geometry source gap','R34 family camera consistency'],
   cannotDoYet:['replace Candidate 05 intake requirements','authorise camera geometry','supply production pixels/mesh','unlock SIDE candidate creation','promote a canonical master']
  },
  artifacts:{
   manifest:'assets/y62-canonical-candidates/Y62-F34-V1-external-3d-reference-intake-v01.json',manifestSha256:'cba781780f2ceec4d82998a89929867ae8fbd1c6dcf2b64903d9fbc6a24191b7',
   board:'assets/y62-canonical-candidates/Y62-F34-V1-external-3d-reference-intake-v01.png',boardSha256:'fdaf06f6c3ffc6fa7781a5be3d4abd7351d54d9ef54ab783d9c815f4bcbadd29'
  },
  decision:{state:'REFERENCE_ONLY_UNRESOLVED',candidateGenerated:false,cameraLockChanged:false,productionPromotionAllowed:false,productionEligible:false},
  requiredBeforeUse:[
   'resolve exact Sketchfab model URL/model ID','record title, creator/rightsholder and source-specific licence','obtain actual mesh/file or rights-cleared production access if production use is intended',
   'compare vehicle generation and Warrior-specific geometry against the owner reference pack','record whether any production pixels/materials/mesh are imported','regenerate exact-checksum review evidence for any resulting project-owned/licensed canonical output'
  ],
  nextDependency:'Resolve https://skfb.ly/onCVs to the exact model identity and record its licence/rights. If rights and Series 5 Warrior geometry are verified, ingest the mesh as a separately governed reconstruction source; otherwise keep the existing Candidate 05 professional reconstruction path unchanged.'
 };
});
