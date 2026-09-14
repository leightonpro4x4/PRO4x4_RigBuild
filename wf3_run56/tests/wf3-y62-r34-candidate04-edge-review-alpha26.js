const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const review=require('../y62-r34-candidate04-edge-review');
const c4=require('../y62-r34-candidate04-targeted-alpha-cleanup');
const readiness=require('../y62-readiness-plan');
const cams=require('../camera-profiles-y62');
const candidates=require('../y62-canonical-candidates');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
 assert.equal(review.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
 assert.equal(review.packageId,'Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01');
 assert.equal(review.candidate.candidateId,c4.candidate.candidateId);assert.equal(review.candidate.sha256,c4.candidate.sha256);
 assert.equal(review.reviewer.identified,true);assert.equal(review.reviewer.masterApprovalAuthority,false);assert.equal(review.reviewer.productionPassAuthority,false);
 assert.equal(review.alphaEvidence.supportAddedPixelsVsCandidate03,0);assert.equal(review.alphaEvidence.supportRemovedPixelsVsCandidate03,1880);assert.equal(review.alphaEvidence.retainedRgbExactFraction,1);
 assert.equal(review.checks.find(x=>x.id==='roof-spoiler-edge').result,'pass');assert.equal(review.checks.find(x=>x.id==='mirror-front-side-boundary').result,'return');assert.equal(review.checks.find(x=>x.id==='wheel-underbody-boundary').result,'return');assert.equal(review.checks.find(x=>x.id==='lower-bumper-tow-edge').result,'pass');
 assert.equal(review.decision,'return-second-targeted-alpha-residue-cleanup-before-neutral-reconstruction');assert.equal(review.targetedCleanupAuthorised,true);assert.equal(review.targetedCleanupConstraints.alphaSubtractiveOnly,true);assert.equal(review.targetedCleanupConstraints.outwardSupportAdditionAllowed,false);assert.equal(review.targetedCleanupConstraints.rgbRetouchAllowed,false);assert.equal(review.targetedCleanupConstraints.perspectiveWarpAllowed,false);assert.equal(review.targetedCleanupConstraints.syntheticGeometryAllowed,false);assert.equal(review.reconstructionAllowed,false);assert.equal(review.productionEligible,false);
 for(const a of [review.manifest,review.board]){const p=path.join(root,a.source);assert.ok(fs.existsSync(p));assert.equal(sha(p),a.sha256)}
 const manifest=JSON.parse(fs.readFileSync(path.join(root,review.manifest.source),'utf8'));assert.equal(manifest.candidate.sha256,review.candidate.sha256);assert.equal(manifest.decision,review.decision);assert.equal(manifest.targetedCleanupAuthorised,true);assert.equal(manifest.productionEligible,false);assert.equal(manifest.lineage.generationManifestSha256,review.lineage.generationManifestSha256);
 const rr=readiness.canonicalMasters.rear34;assert.ok(['Y62-R34-V1-CANDIDATE-04','Y62-R34-V1-CANDIDATE-05'].includes(rr.latestCandidateId));assert.ok(['candidate04-edge-returned-second-targeted-cleanup','candidate05-edge-review-required'].includes(rr.state));assert.equal(rr.productionEligible,false);assert.ok(rr.passed.some(x=>x.includes('CANDIDATE04-EDGE-REVIEW-01')));
 const cam=cams.get('rear34');assert.equal(cam.transparentCandidate.productionEligible,false);assert.equal(cam.transparentCandidate.cameraMatched,false);
 const hist=candidates.listHistory('rear34');const reviewed=hist.find(x=>x.candidateId===c4.candidate.candidateId);assert.ok(reviewed);assert.equal(reviewed.review.state,'candidate04-edge-returned-second-targeted-cleanup');assert.equal(reviewed.review.reviewId,review.packageId);assert.equal(reviewed.review.decision,review.decision);assert.equal(candidates.productionEligible(reviewed),false);
 for(const customerFile of ['index.html','builder.js','render-resolver.js']){const fp=path.join(root,customerFile);if(fs.existsSync(fp)){const txt=fs.readFileSync(fp,'utf8');assert.equal(txt.includes(review.board.source),false);assert.equal(txt.includes(review.packageId),false)}}
 assert.equal(review.assess().productionEligible,false);assert.equal(review.assess().reconstructionAllowed,false);
 console.log('WF3 Y62 R34 Candidate 04 exact-checksum edge review Alpha 26: PASS');
})();
