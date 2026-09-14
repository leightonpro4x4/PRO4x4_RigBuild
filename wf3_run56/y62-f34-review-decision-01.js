(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_F34_REVIEW_DECISION_01=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  schemaVersion:'0.26.13',
  decisionId:'Y62-F34-V1-REVIEW-DECISION-01',
  gateId:'Y62-F34-V1-REVIEW-DECISION-GATE-01',
  reviewPacketId:'Y62-F34-V1-REVIEWER-SIGNOFF-02',
  overlayEvidenceId:'Y62-F34-V1-OVERLAY-EVIDENCE-02',
  candidateId:'Y62-F34-V1-CANDIDATE-04',
  candidateSha256:'bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1',
  policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
  reviewer:{reviewerId:'OPENAI-WF3-VISUAL-QA-01',reviewerClass:'automated-visual-qa',authority:'return-only',identified:true,passAuthority:false,note:'Automated QA may conservatively RETURN a candidate; it is not authorised to issue master approval or a production PASS.'},
  reviewedAt:'2026-09-14T04:01:25+09:30',
  decision:'return',
  cameraGeometryMatched:false,
  primaryAuthenticityEvidence:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
  checks:[
   {id:'identity',result:'pass',note:'Candidate identity is directly derived from the owner-supplied 2025 Series 5 Y62 Warrior source chain.'},
   {id:'stance',result:'pass',note:'Stance is source-preserved; no suspension/ride-height geometry was synthesized.'},
   {id:'factory-wheels',result:'pass',note:'Visible rolling stock matches the owner reference chain and was not replaced or regenerated.'},
   {id:'wheel-centres',result:'pass',note:'Exact-checksum registration and source-preserved geometry support the existing wheel-centre alignment.'},
   {id:'silhouette',result:'pass',note:'Candidate 04 retains Candidate 03 alpha byte-for-byte; no silhouette pixels changed.'},
   {id:'roofline',result:'pass',note:'Roofline remains source-preserved and registration evidence is within the locked F34 tolerance.'},
   {id:'bumper-corner',result:'pass',note:'Front bumper/corner geometry remains source-preserved; no coordinate warp or repaint geometry was introduced.'},
   {id:'headlamp-anchor',result:'pass',note:'Headlamp/fascia anchors remain source-preserved and align with the owner reference set.'},
   {id:'edge-quality',result:'pass',note:'Transparency structure is one connected foreground component with no canvas-boundary contact; no blocking source-background spill is visible at review scale.'},
   {id:'no-invented-accessories',result:'pass',note:'No new accessory/body/wheel geometry was introduced; candidate pixels remain on the owner-derived provenance chain.'},
   {id:'clean-reconstruction',result:'return',note:'Strong source-scene reflection bands remain visible across the side glass/paint and additional photographed environment reflections remain on the windscreen/bonnet. Candidate 04 is not a neutral canonical master.'}
  ],
  observations:[
   'The roller-door/corrugated-building reflection pattern from OWNER-Y62-F34-01 remains materially visible in Candidate 04 across the passenger-side glasshouse and bodywork.',
   'Photographed sky/building reflections remain on the windscreen and bonnet. Removing these safely would require a rights-cleared professional reconstruction rather than widening the automated retouch envelope.',
   'The RETURN is driven by clean-reconstruction quality only; geometry evidence remains useful and is retained as reference-backed review evidence.'
  ],
  governance:{masterState:'master-draft',productionEligible:false,customerExposure:'never',promotionBlocked:true,productionBinaryRights:'not-separately-recorded',wf5ExactChecksumGate:'not-run'},
  route:{nextState:'rights-cleared-professional-reconstruction-required',nextDependency:'Create a professionally reconstructed F34 candidate against the locked owner-backed camera/silhouette/wheel geometry. Do not widen the existing automated retouch envelope or infer unsupported surfaces. Then regenerate exact-checksum overlay/reviewer evidence.'},
  externalExactVehicleImagesUsedForProduction:false
 };
});
