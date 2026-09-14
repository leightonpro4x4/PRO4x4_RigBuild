(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_F34_CANDIDATE_02_REVIEW=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  schemaVersion:'0.26.5',
  reviewId:'Y62-F34-V1-CANDIDATE-02-REVIEW-001',
  candidateId:'Y62-F34-V1-CANDIDATE-02',
  briefId:'Y62-F34-V1',
  overlayContractId:'Y62-F34-V1-OVERLAY-01',
  vehicleId:'nissan-y62-warrior-2025',
  viewId:'front34',
  status:'review-evidence-only',
  promotionDecision:'returned-to-wf3',
  sourceReferenceId:'OWNER-Y62-F34-01',
  sourceFile:'references/y62-owner/IMG_4030.jpeg',
  candidateFile:'assets/y62-canonical-candidates/Y62-F34-V1-transparent-isolation-v02.png',
  process:'Non-generative owner-photo isolation preflight. Source pixels were uniformly scaled and alpha-masked onto the locked 1672x615 canvas. No body, wheel, stance, fascia, trim or accessory geometry was synthesized or perspective-warped.',
  verification:{
    canvas:{result:'pass',expected:'1672x615',actual:'1672x615'},
    alphaChannel:{result:'pass',note:'PNG contains verified transparent pixels; alpha capability alone does not satisfy the clean-isolation gate.'},
    checksum:{result:'pass',sha256:'a353980a92131b960fed91baa46609bc63c1ec07a485fd4612fa305f0f7cea28'},
    ownerReference:{result:'pass',referenceId:'OWNER-Y62-F34-01',rights:'owner-project-approved for internal canonical development'},
    geometryDerivation:{result:'pass',note:'Uniform scale only; no synthetic geometry or perspective warp.'}
  },
  gateResults:[
    {id:'identity',result:'pass',note:'Exact owner-supplied MY25 Series 5 Y62 Warrior source.'},
    {id:'stance',result:'pass',note:'Owner-source Warrior/Premcar stance preserved without lift/drop alteration.'},
    {id:'factory-wheels',result:'pass',note:'Factory Warrior wheel/tyre pixels preserved from owner source.'},
    {id:'no-invented-accessories',result:'pass',note:'No accessory or trim geometry added.'},
    {id:'transparency',result:'fail',note:'Alpha exists, but visible source-scene contamination remains around the rear/underbody boundary; clean transparent isolation is not yet achieved.'},
    {id:'edge-quality',result:'fail',note:'Boundary quality is not yet suitable for accessory-layer compositing.'},
    {id:'silhouette',result:'hold',note:'Source geometry is preserved, but the locked canonical F34 overlay has not been independently accepted.'},
    {id:'wheel-centres',result:'hold',note:'No independent canonical target has yet been signed off for pixel-tolerance scoring.'},
    {id:'clean-reconstruction',result:'fail',note:'Owner-photo reflections/source-scene appearance remain; this is an isolation preflight, not a neutral canonical reconstruction.'},
    {id:'rights-for-production-binary',result:'hold',note:'Owner pack authorises internal canonical development; explicit production-binary rights are not recorded for direct photo-pixel promotion.'}
  ],
  blockers:[
    'clean transparent isolation / edge cleanup is incomplete',
    'source-scene reflections remain and are not a neutral canonical reconstruction',
    'locked-profile overlay acceptance is still pending',
    'production-binary rights for a direct photo-derived master are not separately recorded',
    'reviewer approval state remains master-draft'
  ],
  acceptedUse:['staff review','geometry/authenticity evidence','masking/reconstruction reference'],
  prohibitedUse:['customer resolver','quote imagery','product-layer compositing','production catalogue','master-approved promotion'],
  nextDependency:'Produce a clean reference-backed F34 reconstruction or professional isolation/retouch candidate that removes source-scene contamination without inventing geometry, then run the locked Y62-F34-V1 overlay contract and reviewer approval workflow.'
 };
});
