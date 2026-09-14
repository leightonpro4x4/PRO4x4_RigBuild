(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Y62_F34_REVIEW_DECISION_GATE=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const requiredSemanticChecks=[
    'identity','stance','factory-wheels','wheel-centres','silhouette','roofline','bumper-corner','headlamp-anchor','edge-quality','no-invented-accessories','clean-reconstruction'
  ];
  const gate={
    schemaVersion:'0.26.13',
    gateId:'Y62-F34-V1-REVIEW-DECISION-GATE-01',
    vehicleId:'nissan-y62-warrior-2025',
    viewId:'front34',
    candidateId:'Y62-F34-V1-CANDIDATE-04',
    candidateSha256:'bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1',
    reviewPacketId:'Y62-F34-V1-REVIEWER-SIGNOFF-02',
    reviewPacketArtifactSha256:'045c9891828df526e8336f13aab7428952d0b687e89aa0c63357482bdf759fab',
    overlayEvidenceId:'Y62-F34-V1-OVERLAY-EVIDENCE-02',
    overlayEvidenceSha256:'6b53745a23aaaedaf18d6f476381e0ff7192438e99d5dab7b556a7ff4d4afd96',
    policy:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
    primaryAuthenticityEvidence:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02'],
    machineLockedChecks:[
      {id:'candidate-checksum',state:'pass',note:'Decision must target Candidate 04 exact SHA-256.'},
      {id:'transparency-structure',state:'pass',note:'One connected foreground component; no canvas-boundary contact.'},
      {id:'geometry-registration',state:'pass',note:'Candidate 04 exact-checksum overlay machine precheck passed; this is not semantic reviewer approval.'},
      {id:'external-production-source-use',state:'pass',note:'No external exact-vehicle image contributes Candidate 04 production pixels or approval evidence.'}
    ],
    requiredSemanticChecks,
    decisionRules:{
      reviewerIdentityRequired:true,
      reviewedAtRequired:true,
      allowedCheckResults:['pass','return'],
      allowedDecisions:['pass','return'],
      passRequiresEverySemanticCheck:'pass',
      passRequiresCameraGeometryMatched:true,
      passDoesNotPromote:true,
      note:'A reviewer PASS only closes the semantic/camera/edge/clean-reconstruction review gate. Production-binary rights and WF5 exact-checksum promotion remain separate mandatory gates.'
    },
    cleanReconstructionRule:'Reviewer must explicitly PASS or RETURN the remaining photographed reflection/detail residue. RETURN routes to rights-cleared professional reconstruction; the geometry-lock/retouch envelope must not be widened by inference.',
    currentState:{reviewerId:'OPENAI-WF3-VISUAL-QA-01',reviewerClass:'automated-visual-qa',reviewerAuthority:'return-only',reviewedAt:'2026-09-14T04:01:25+09:30',decision:'return',decisionRecordId:'Y62-F34-V1-REVIEW-DECISION-01',cameraGeometryMatched:false,productionBinaryRights:'not-separately-recorded',wf5ExactChecksumGate:'not-run',masterState:'master-draft',productionEligible:false},
    artifact:{file:'assets/y62-canonical-candidates/Y62-F34-V1-review-decision-gate-v01.png',sha256:'97021196e2129573d6b6f1ca26d6421d67642de570c80f5e9938ab410761e763'},
    customerExposure:'never',
    nextDependency:'Y62-F34-V1-REVIEW-DECISION-01 returned Candidate 04 on clean reconstruction. Produce a rights-cleared professional reconstruction against the locked owner-backed geometry, then regenerate exact-checksum overlay/reviewer evidence. Do not widen the automated geometry lock by inference.'
  };
  function validIso(value){if(typeof value!=='string'||!value.trim())return false;const t=Date.parse(value);return Number.isFinite(t)&&value.includes('T')}
  function evaluate(decision){
    const d=decision||{},errors=[];
    if(d.candidateId!==gate.candidateId)errors.push('candidateId must match Candidate 04');
    if(d.candidateSha256!==gate.candidateSha256)errors.push('candidateSha256 must match Candidate 04 exact checksum');
    if(typeof d.reviewerId!=='string'||!d.reviewerId.trim())errors.push('identified reviewerId required');
    if(!validIso(d.reviewedAt))errors.push('reviewedAt must be an ISO date-time');
    if(!gate.decisionRules.allowedDecisions.includes(d.decision))errors.push('decision must be pass or return');
    const checks=Array.isArray(d.checks)?d.checks:[];const byId=new Map(checks.map(x=>[x&&x.id,x]));
    for(const id of gate.requiredSemanticChecks){const r=byId.get(id);if(!r||!gate.decisionRules.allowedCheckResults.includes(r.result))errors.push(`${id} requires pass or return`)}
    const allPass=gate.requiredSemanticChecks.every(id=>byId.get(id)?.result==='pass');
    if(d.decision==='pass'&&!allPass)errors.push('pass decision requires every semantic check to pass');
    if(d.decision==='return'&&allPass)errors.push('return decision must identify at least one returned semantic check');
    if(d.decision==='pass'&&d.cameraGeometryMatched!==true)errors.push('pass decision requires cameraGeometryMatched=true');
    if(d.decision==='return'&&d.cameraGeometryMatched===true)errors.push('returned candidate cannot set cameraGeometryMatched=true');
    return {valid:errors.length===0,errors,reviewGatePassed:errors.length===0&&d.decision==='pass',productionEligible:false,nextGate:errors.length?'review-decision-correction':(d.decision==='pass'?'production-binary-rights':'rights-cleared-professional-reconstruction')};
  }
  return {...gate,evaluate};
});
