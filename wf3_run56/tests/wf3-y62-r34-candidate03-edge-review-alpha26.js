const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const review=require('../y62-r34-candidate03-edge-review');
const c3=require('../y62-r34-candidate03-alpha-edge-cleanup');
const readiness=require('../y62-readiness-plan');
const cams=require('../camera-profiles-y62');
const candidates=require('../y62-canonical-candidates');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
 assert.equal(review.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
 assert.equal(review.packageId,'Y62-R34-V1-CANDIDATE03-EDGE-REVIEW-01');
 assert.equal(review.candidate.candidateId,c3.candidate.candidateId);assert.equal(review.candidate.sha256,c3.candidate.sha256);
 assert.equal(review.reviewer.identified,true);assert.equal(review.reviewer.masterApprovalAuthority,false);assert.equal(review.reviewer.productionPassAuthority,false);
 assert.equal(review.alphaEvidence.semiTransparentPixels,1901);assert.equal(review.alphaEvidence.supportAddedPixelsVsCandidate02,0);assert.equal(review.alphaEvidence.supportRemovedPixelsVsCandidate02,0);
 assert.equal(review.checks.find(x=>x.id==='roof-spoiler-edge').result,'pass');assert.equal(review.checks.find(x=>x.id==='mirror-front-side-boundary').result,'return');assert.equal(review.checks.find(x=>x.id==='wheel-underbody-boundary').result,'return');assert.equal(review.checks.find(x=>x.id==='lower-bumper-tow-edge').result,'pass');
 assert.equal(review.decision,'return-targeted-alpha-residue-cleanup-before-neutral-reconstruction');assert.equal(review.targetedCleanupAuthorised,true);assert.equal(review.targetedCleanupConstraints.alphaSubtractiveOnly,true);assert.equal(review.targetedCleanupConstraints.outwardSupportAdditionAllowed,false);assert.equal(review.targetedCleanupConstraints.rgbRetouchAllowed,false);assert.equal(review.targetedCleanupConstraints.syntheticGeometryAllowed,false);assert.equal(review.reconstructionAllowed,false);assert.equal(review.productionEligible,false);
 for(const a of [review.manifest,review.board]){const p=path.join(root,a.source);assert.ok(fs.existsSync(p));assert.equal(sha(p),a.sha256)}
 const manifest=JSON.parse(fs.readFileSync(path.join(root,review.manifest.source),'utf8'));assert.equal(manifest.candidate.sha256,review.candidate.sha256);assert.equal(manifest.decision,review.decision);assert.equal(manifest.targetedCleanupAuthorised,true);assert.equal(manifest.productionEligible,false);
 const rr=readiness.canonicalMasters.rear34;assert.ok(['Y62-R34-V1-CANDIDATE-03','Y62-R34-V1-CANDIDATE-04','Y62-R34-V1-CANDIDATE-05'].includes(rr.latestCandidateId));assert.ok(['candidate03-edge-returned-targeted-cleanup','candidate04-edge-review-required','candidate04-edge-returned-second-targeted-cleanup','candidate05-edge-review-required'].includes(rr.state));assert.equal(rr.productionEligible,false);assert.ok(rr.passed.some(x=>x.includes('CANDIDATE03-EDGE-REVIEW-01')||x.includes('Candidate 03')));
 const cam=cams.get('rear34');assert.equal(cam.transparentCandidate.productionEligible,false);assert.equal(cam.transparentCandidate.cameraMatched,false);if(cam.transparentCandidate.id==='Y62-R34-V1-CANDIDATE-04'){assert.equal(cam.transparentCandidate.lineage.authorisingReviewId,review.packageId);assert.equal(cam.transparentCandidate.lineage.authorisingReviewSha256,review.manifest.sha256)}
 const hist=candidates.listHistory('rear34');const reviewed=hist.find(x=>x.candidateId===c3.candidate.candidateId);assert.ok(reviewed);assert.equal(reviewed.review.state,'candidate03-edge-returned-targeted-cleanup');assert.equal(reviewed.review.reviewId,review.packageId);assert.equal(candidates.productionEligible(reviewed),false);
 for(const customerFile of ['index.html','builder.js','render-resolver.js']){const fp=path.join(root,customerFile);if(fs.existsSync(fp)){const txt=fs.readFileSync(fp,'utf8');assert.equal(txt.includes(review.board.source),false);assert.equal(txt.includes(review.packageId),false)}}
 assert.equal(review.assess().productionEligible,false);assert.equal(review.assess().reconstructionAllowed,false);
 console.log('WF3 Y62 R34 Candidate 03 exact-checksum edge review Alpha 26: PASS');
})();
