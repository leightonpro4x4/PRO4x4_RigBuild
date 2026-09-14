const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const contract=require('../y62-f34-neutral-reconstruction-contract');
const review=require('../y62-f34-candidate-03-review');
const cands=require('../y62-canonical-candidates');
const cams=require('../camera-profiles-y62');
const readiness=require('../y62-readiness-plan');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
  assert.equal(contract.contractId,'Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01');
  assert.equal(contract.candidateId,'Y62-F34-V1-CANDIDATE-03');
  assert.equal(contract.candidateSha256,'67fae4a0bec8ab714a852a8841e8ca5610cdb32fbf58506900e3fd1ec28bb64e');
  assert.deepEqual(contract.referenceIds,['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02']);
  assert.equal(contract.externalExactVehicleProductionSourcesUsed,false);
  assert.equal(contract.immutableRules.alphaChangesAllowed,false);
  assert.equal(contract.immutableRules.geometryWarpAllowed,false);
  assert.equal(contract.immutableRules.wheelOrTyreReplacementAllowed,false);
  assert.equal(contract.immutableRules.accessoryGeometryAllowed,false);
  assert.equal(contract.immutableRules.newBodyLinesAllowed,false);
  assert.equal(contract.immutableRules.rgbNeutralisationInsideEnvelopeOnly,true);
  assert.equal(contract.immutableRules.productionPromotionAllowedByThisContract,false);
  assert.equal(contract.productionEligible,false);
  assert.equal(contract.metrics.envelopeTouchesSilhouetteBuffer,false);
  assert.ok(contract.metrics.eligibleInteriorPixels>30000);
  assert.ok(contract.metrics.eligiblePctOfForeground>10 && contract.metrics.eligiblePctOfForeground<20);
  assert.equal(contract.rightsState.directPhotoDerivedProductionBinaryRights,'not-separately-recorded');
  assert.equal(contract.rightsState.futureRetouchProductionRights,'must-be-recorded-before-promotion');

  const cand=cands.listHistory('front34').find(x=>x.candidateId===contract.candidateId);
  assert.equal(cand.candidateId,contract.candidateId);
  assert.equal(cand.governance.state,'master-draft');
  assert.equal(cands.productionEligible(cand),false);
  assert.equal(sha(path.join(root,cand.source)),contract.candidateSha256);
  assert.ok(cand.review.checks.some(x=>x.id==='neutral-reconstruction-contract'&&x.state==='pass'));
  assert.ok(cand.review.blockers.some(x=>/Candidate 04 neutral reconstruction/.test(x)));

  const env=path.join(root,contract.artifacts.envelopeFile),board=path.join(root,contract.artifacts.boardFile);
  assert.ok(fs.existsSync(env)); assert.ok(fs.existsSync(board));
  assert.equal(sha(env),contract.artifacts.envelopeSha256);
  assert.equal(sha(board),contract.artifacts.boardSha256);
  const meta=JSON.parse(fs.readFileSync(path.join(root,'assets/y62-canonical-candidates/Y62-F34-V1-neutral-reconstruction-map-v01.json'),'utf8'));
  assert.equal(meta.candidateSha256,contract.candidateSha256);
  assert.equal(meta.artifacts.envelopeSha256,contract.artifacts.envelopeSha256);
  assert.equal(meta.artifacts.boardSha256,contract.artifacts.boardSha256);
  assert.equal(meta.productionEligible,false);

  assert.equal(review.verification.neutralReconstructionContract.contractId,contract.contractId);
  assert.equal(review.verification.neutralReconstructionContract.alphaChangesAllowed,false);
  assert.equal(review.verification.neutralReconstructionContract.geometryWarpAllowed,false);
  assert.equal(review.verification.neutralReconstructionContract.productionEligible,false);
  assert.ok(review.gateResults.some(x=>x.id==='neutral-reconstruction-contract'&&x.result==='pass'));
  assert.ok(review.prohibitedUse.includes('customer resolver'));

  const cam=cams.get('front34');
  assert.equal(cam.transparentCandidate.id,'Y62-F34-V1-CANDIDATE-04');
  assert.equal(cam.transparentCandidate.overlayPrecheck.neutralReconstruction.contractId,contract.contractId);
  assert.equal(cam.transparentCandidate.overlayPrecheck.neutralReconstruction.alphaChangesAllowed,false);
  assert.equal(cam.transparentCandidate.overlayPrecheck.neutralReconstruction.geometryWarpAllowed,false);
  assert.equal(cam.transparentCandidate.overlayPrecheck.neutralReconstruction.productionEligible,false);
  assert.equal(cam.transparentCandidate.cameraMatched,false);
  assert.equal(cam.transparentCandidate.productionEligible,false);

  assert.equal(readiness.canonicalMasters.front34.productionEligible,false);
  assert.ok(readiness.canonicalMasters.front34.passed.includes('checksum-pinned RGB-only neutral-reconstruction retouch contract'));
  assert.ok(readiness.canonicalMasters.front34.passed.includes('Candidate 04 RGB changes confined to approved retouch envelope'));
  assert.ok(readiness.canonicalMasters.front34.passed.includes('Candidate 04 exact-checksum locked overlay evidence bundle'));

  const reviewHtml=fs.readFileSync(path.join(root,'y62-canonical-review.html'),'utf8');
  assert.match(reviewHtml,/Y62-F34-V1-NEUTRAL-RECONSTRUCTION-01/);
  assert.match(reviewHtml,/NOT CUSTOMER VISIBLE/);
  const customer=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.equal(customer.includes(contract.contractId),false);
  assert.equal(customer.includes(contract.artifacts.boardFile),false);
  assert.equal(customer.includes(contract.artifacts.envelopeFile),false);
  console.log('WF3 Y62 F34 neutral reconstruction contract Alpha 26: PASS');
})();
