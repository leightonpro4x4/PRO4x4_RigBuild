const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const review=require('../y62-r34-candidate02-edge-review');
const isolation=require('../y62-r34-transparent-isolation-candidate');
const readiness=require('../y62-readiness-plan');
const cams=require('../camera-profiles-y62');
const {inspect}=require('../server/asset-vault');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
 assert.equal(review.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
 assert.equal(review.packageId,'Y62-R34-V1-CANDIDATE02-EDGE-REVIEW-01');
 assert.equal(review.candidate.candidateId,'Y62-R34-V1-CANDIDATE-02');
 assert.equal(review.candidate.sha256,isolation.candidate.sha256);
 const candidate=path.join(root,review.candidate.source);assert.ok(fs.existsSync(candidate));assert.equal(sha(candidate),review.candidate.sha256);
 const meta=inspect(fs.readFileSync(candidate));assert.equal(meta.mimeType,'image/png');assert.equal(meta.width,1672);assert.equal(meta.height,615);assert.equal(meta.hasAlpha,true);
 const manifestPath=path.join(root,review.manifest.source);assert.ok(fs.existsSync(manifestPath));assert.equal(sha(manifestPath),review.manifest.sha256);
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));assert.equal(manifest.candidate.sha256,review.candidate.sha256);assert.equal(manifest.decision,review.decision);assert.equal(manifest.reviewer.reviewerId,review.reviewer.reviewerId);assert.equal(manifest.reviewer.authority,'edge-review-return-only');
 assert.deepEqual(manifest.alphaEvidence.uniqueAlphaValues,[0,255]);assert.equal(manifest.alphaEvidence.semiTransparentPixels,0);
 for(const id of ['roof-spoiler-edge','mirror-front-side-boundary','lower-bumper-tow-edge']) assert.ok(manifest.checks.some(x=>x.id===id&&x.result==='return'));
 assert.ok(manifest.checks.some(x=>x.id==='clean-neutral-reconstruction'&&x.result==='fail'));
 assert.ok(manifest.checks.some(x=>x.id==='no-guessed-geometry'&&x.result==='pass'));
 const board=path.join(root,review.board.source);assert.ok(fs.existsSync(board));assert.equal(sha(board),review.board.sha256);
 const rr=readiness.canonicalMasters.rear34;assert.equal(rr.productionEligible,false);assert.ok(rr.passed.some(x=>x.includes(review.packageId)));assert.ok(['candidate02-edge-returned','candidate03-edge-review-required','candidate03-edge-returned-targeted-cleanup','candidate04-edge-review-required','candidate04-edge-returned-second-targeted-cleanup','candidate05-edge-review-required'].includes(rr.state));
 const cam=cams.get('rear34');assert.equal(cam.transparentCandidate.productionEligible,false);assert.equal(cam.transparentCandidate.cameraMatched,false);assert.ok(['Y62-R34-V1-CANDIDATE-02','Y62-R34-V1-CANDIDATE-03','Y62-R34-V1-CANDIDATE-04','Y62-R34-V1-CANDIDATE-05'].includes(cam.transparentCandidate.id));
 assert.equal(review.reviewer.masterApprovalAuthority,false);assert.equal(review.reviewer.productionPassAuthority,false);assert.equal(review.productionEligible,false);assert.equal(review.cameraGeometryMatched,false);
 for(const customerFile of ['index.html','builder.js','render-resolver.js']){const fp=path.join(root,customerFile);if(fs.existsSync(fp)){const txt=fs.readFileSync(fp,'utf8');assert.equal(txt.includes(review.board.source),false);assert.equal(txt.includes(review.packageId),false)}}
 assert.equal(review.assess().productionEligible,false);
 console.log('WF3 Y62 R34 Candidate 02 exact-checksum edge review Alpha 26: PASS');
})();
