const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const decision=require('../y62-r34-review-decision-01');
const review=require('../y62-r34-camera-semantic-review');
const candidates=require('../y62-canonical-candidates');
const readiness=require('../y62-readiness-plan');
const board=require('../workflow-board-data');
const cams=require('../camera-profiles-y62');
const briefs=require('../y62-canonical-briefs');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
  assert.equal(decision.decisionId,'Y62-R34-V1-REVIEW-DECISION-01');
  assert.equal(decision.reviewId,'Y62-R34-V1-CAMERA-SEMANTIC-REVIEW-01');
  assert.equal(decision.candidateId,'Y62-R34-V1-CANDIDATE-01');
  assert.equal(decision.candidateSha256,'8d61ff21aa2bc0ec61122ab1641a232a6e2f3781c0601da6154593f15844a67b');
  assert.equal(decision.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
  assert.equal(decision.reviewer.identified,true);
  assert.equal(decision.reviewer.authority,'camera-for-reconstruction-only');
  assert.equal(decision.reviewer.masterApprovalAuthority,false);
  assert.equal(decision.reviewer.productionPassAuthority,false);
  assert.equal(decision.decision,'accept-camera-for-reconstruction');
  assert.equal(decision.cameraReviewAccepted,true);
  assert.equal(decision.cameraGeometryMatched,false);
  assert.equal(decision.reconstructionAllowed,true);
  assert.equal(decision.productionEligible,false);
  const required=['rear34-camera','rear-quarter-silhouette','tail-lamp-anchor','tailgate-anchor','bumper-tow-anchor','no-invented-geometry'];
  for(const id of required){const c=decision.checks.find(x=>x.id===id);assert.ok(c,`missing ${id}`);assert.equal(c.result,'pass');}
  assert.equal(decision.externalExactVehicleImagesUsedForProduction,false);
  assert.equal(decision.governance.masterState,'master-draft');
  assert.equal(decision.governance.cameraProductionLock,false);
  assert.equal(decision.governance.productionEligible,false);

  const candidate=candidates.listHistory('rear34').find(x=>x.candidateId==='Y62-R34-V1-CANDIDATE-01');assert.ok(candidate);
  assert.equal(candidate.candidateId,decision.candidateId);
  assert.equal(candidate.file.checksumSha256,decision.candidateSha256);
  assert.equal(candidate.governance.state,'master-draft');
  assert.equal(candidate.file.hasAlpha,false);
  assert.equal(candidate.review.state,'camera-accepted-for-reconstruction');
  assert.equal(candidate.review.decisionRecordId,decision.decisionId);
  assert.equal(candidate.review.decision,'accept-camera-for-reconstruction');
  assert.equal(candidate.review.reconstructionAllowed,true);
  assert.equal(candidate.review.cameraMatched,false);
  assert.equal(candidates.productionEligible(candidate),false);
  assert.equal(sha(path.join(root,candidate.source)),decision.candidateSha256);

  assert.equal(review.state,'camera-accepted-for-reconstruction');
  assert.equal(review.decisionRecordId,decision.decisionId);
  assert.equal(review.reconstructionGate.allowed,true);
  assert.equal(review.reconstructionGate.geometryWarpAllowed,false);
  assert.equal(review.reconstructionGate.generativeCompletionAllowed,false);
  assert.equal(review.productionGate.allowed,false);
  assert.equal(review.productionEligible,false);
  const assessed=review.assess();
  assert.equal(assessed.reconstructionAllowed,true);
  assert.equal(assessed.cameraMatched,false);
  assert.equal(assessed.productionEligible,false);

  const cam=cams.get('rear34');
  assert.equal(cam.state,'reconstruction-authorised');
  assert.equal(cam.candidateAsset.reviewState,'camera-accepted-for-reconstruction');
  assert.equal(cam.candidateAsset.cameraMatched,false);
  assert.equal(cam.candidateAsset.productionEligible,false);
  assert.equal(cam.reviewPacket.decision,'accept-camera-for-reconstruction');
  assert.equal(cam.reviewPacket.decisionRecordId,decision.decisionId);
  assert.equal(cam.reviewPacket.reconstructionAllowed,true);
  assert.equal(cam.reviewPacket.productionEligible,false);

  assert.equal(briefs.briefs.rear34.candidateCreation,'transparent-reconstruction-authorised');
  assert.match(briefs.briefs.rear34.reviewGate,/REVIEW-DECISION-01/);
  assert.match(briefs.briefs.rear34.reviewGate,/No perspective warp/i);

  const r=readiness.canonicalMasters.rear34;
  assert.ok(['transparent-isolation-reviewable','candidate02-edge-returned','candidate03-edge-review-required','candidate03-edge-returned-targeted-cleanup','candidate04-edge-review-required','candidate04-edge-returned-second-targeted-cleanup','candidate05-edge-review-required'].includes(r.state));
  assert.equal(r.productionEligible,false);
  assert.equal(r.sourcePackage.reviewPacket.decisionRecordId,decision.decisionId);
  assert.equal(r.sourcePackage.reviewPacket.reconstructionAllowed,true);
  assert.equal(r.sourcePackage.reviewPacket.cameraMatched,false);
  assert.equal(r.sourcePackage.decision.decisionId,decision.decisionId);
  assert.equal(r.sourcePackage.decision.masterApprovalAuthority,false);
  assert.equal(r.sourcePackage.decision.productionPassAuthority,false);
  assert.ok(r.blocked.some(x=>/F34 canonical family alignment/i.test(x)));

  const wf3=board.workstreams.find(x=>x.id==='WF3');
  assert.ok(['R34_CAMERA_ACCEPTED_RECONSTRUCTION_READY','R34_CANDIDATE02_EDGE_RETURNED','R34_CANDIDATE03_EDGE_REVIEW_REQUIRED','R34_CANDIDATE03_EDGE_RETURNED_TARGETED_CLEANUP','R34_CANDIDATE04_EDGE_REVIEW_REQUIRED','R34_CANDIDATE05_EDGE_REVIEW_REQUIRED'].includes(wf3.tertiaryStage));
  assert.ok(/REVIEW-DECISION-01|CANDIDATE02-EDGE-REVIEW-01|CANDIDATE03-ALPHA-EDGE-CLEANUP-01|CANDIDATE03-EDGE-REVIEW-01|CANDIDATE04-TARGETED-ALPHA-CLEANUP-01|CANDIDATE05-SECOND-TARGETED-ALPHA-CLEANUP-01/.test(wf3.tertiaryCompletedPackage));
  assert.match(wf3.nextPackage,/CANDIDATE-05/i);

  const decisionBoard=path.join(root,'assets/y62-canonical-candidates/Y62-R34-V1-review-decision-v01.png');
  assert.equal(sha(decisionBoard),'32b6eb933b1a067b64a8d785dc439da9a0613ce0251c3c6e466abbb4e3dd4107');
  const customer=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.equal(customer.includes(decision.decisionId),false);
  assert.equal(customer.includes('Y62-R34-V1-review-decision-v01.png'),false);
  const staff=fs.readFileSync(path.join(root,'y62-canonical-review.html'),'utf8');
  assert.ok(staff.includes(decision.decisionId));
  assert.match(staff,/ACCEPT CAMERA FOR RECONSTRUCTION/);

  const f34=candidates.getLatest('front34');
  assert.equal(f34.candidateId,'Y62-F34-V1-CANDIDATE-04');
  assert.equal(f34.file.checksumSha256,'bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1');
  assert.equal(f34.review.state,'returned-professional-reconstruction-required');
  assert.equal(readiness.canonicalMasters.side.sourceIntake.candidateCreationAllowed,false);
  console.log('WF3 Y62 R34 review decision 01 Alpha 26: PASS');
})();
