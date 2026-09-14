(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_SIDE_REFERENCE_INTAKE=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const intake={
  schemaVersion:'0.26.16',
  intakeId:'Y62-SIDE-V1-OWNER-REFERENCE-INTAKE-01',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  vehicleId:'nissan-y62-warrior-2025',
  viewId:'side',
  briefId:'Y62-SIDE-V1',
  purpose:'Determine whether the owner-supplied 2025 Series 5 Y62 Warrior pack contains sufficient direct geometry evidence to create the first SIDE canonical master without guessing or importing unlicensed exact-vehicle pixels.',
  sourceAssessment:[
   {referenceId:'OWNER-Y62-DESIGNBOARD-01',role:'secondary-orientation-reference',sourceClass:'owner-supplied-derivative-composite',directSideViewPresent:true,rawCameraSource:false,productionPixelUse:'prohibited',geometryAuthority:'secondary-only',note:'Contains a square-on side presentation inside a composite design board, but the embedded side image is not a clean raw owner photograph and its upstream pixel provenance is not separately recorded.'},
   {referenceId:'OWNER-Y62-F34-01',role:'primary-authenticity-support',sourceClass:'owner-supplied-raw-photo',directSideViewPresent:false,rawCameraSource:true,productionPixelUse:'internal-development-only',geometryAuthority:'support-only',note:'Confirms MY25 Series 5 Warrior identity, stance, wheel/tyre state, front-door/arch proportions and driver-side detail from an oblique view.'},
   {referenceId:'OWNER-Y62-F34-02',role:'support-authenticity',sourceClass:'owner-supplied-raw-photo',directSideViewPresent:false,rawCameraSource:true,productionPixelUse:'internal-development-only',geometryAuthority:'support-only'},
   {referenceId:'OWNER-Y62-REAR34-01',role:'primary-rear-authenticity-support',sourceClass:'owner-supplied-raw-photo',directSideViewPresent:false,rawCameraSource:true,productionPixelUse:'internal-development-only',geometryAuthority:'support-only',note:'Confirms rear quarter, rear wheel/arch, beltline and tail geometry, but perspective is oblique and cannot be rectified into a canonical side master without geometry inference.'},
   {referenceId:'OWNER-Y62-REAR-01',role:'rear-authenticity-support',sourceClass:'owner-supplied-raw-photo',directSideViewPresent:false,rawCameraSource:true,productionPixelUse:'internal-development-only',geometryAuthority:'support-only'}
  ],
  sufficiency:{
   cleanRawSquareOnOwnerSide:false,
   derivativeSideReferenceAvailable:true,
   multiAngleRawOwnerEvidenceAvailable:true,
   candidateCreationAllowed:false,
   cameraLockAllowed:false,
   productionPromotionAllowed:false,
   decision:'SOURCE_GAP_CONFIRMED',
   reason:'The current pack has strong owner-backed identity/stance evidence and a derivative square-on design-board image, but no clean raw square-on side owner photograph. Creating or rectifying a SIDE binary now would require unsupported geometry or unrecorded derivative pixels.'
  },
  cameraViewContract:{
   contractId:'Y62-SIDE-V1-VIEW-CONTRACT-01',
   targetCanvas:{width:1672,height:615,background:'transparent'},
   framing:'true square-on full driver-side profile; complete vehicle; centred; matched scale family to F34 once F34 is accepted',
   camera:'orthographic-like side presentation with level horizon; front and rear faces must not be exposed beyond natural body depth',
   requiredGeometryEvidence:['clean square-on raw owner side photograph OR separately rights-cleared measured reconstruction source','factory Warrior wheel/tyre geometry','Premcar stance/ride height','unambiguous front/rear overhang and wheel-centre positions'],
   prohibitions:['no perspective warp of F34/R34 photographs into side view','no generative completion/extrapolation of hidden body geometry','no wheelbase/body-length inference from the derivative design board alone','no external exact-vehicle production pixels unless source-specific production rights are recorded','no production promotion from source-intake completion alone'],
   acceptance:['source provenance and rights ledger complete','camera source is square-on enough for semantic reviewer acceptance','candidate alpha/silhouette is checksum-pinned','identified reviewer confirms body silhouette, wheel centres, roofline/beltline, front/rear overhangs, Warrior rolling stock and stance','WF5 exact-checksum promotion only after master approval'],
   state:'source-blocked'
  },
  artifact:{board:'assets/y62-canonical-candidates/Y62-SIDE-V1-owner-reference-intake-v01.png',boardSha256:'7096474cdb955ad662c92709752a7b216ed2d51690723709a2845f2b85de1705',manifest:'assets/y62-canonical-candidates/Y62-SIDE-V1-owner-reference-intake-v01.json',manifestSha256:'9afaa290fcce58a5ec295a104bd552077630af7ab16179a83b088537c873d6d4'},
  nextDependency:'Supply a clean square-on raw owner photo of the 2025 Series 5 Y62 Warrior driver side, or a separately rights-cleared measured reconstruction source with explicit provenance. Until then, SIDE remains non-candidate and non-production.'
 };
 function assess(){return {intakeId:intake.intakeId,decision:intake.sufficiency.decision,candidateCreationAllowed:false,productionEligible:false,nextDependency:intake.nextDependency};}
 return {...intake,assess};
});
