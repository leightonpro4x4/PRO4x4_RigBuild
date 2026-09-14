const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const c3=require('../y62-r34-candidate03-alpha-edge-cleanup');
const c2=require('../y62-r34-transparent-isolation-candidate');
const readiness=require('../y62-readiness-plan');
const cams=require('../camera-profiles-y62');
const candidates=require('../y62-canonical-candidates');
const {inspect}=require('../server/asset-vault');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
 assert.equal(c3.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
 assert.equal(c3.packageId,'Y62-R34-V1-CANDIDATE03-ALPHA-EDGE-CLEANUP-01');
 assert.equal(c3.candidate.candidateId,'Y62-R34-V1-CANDIDATE-03');
 assert.equal(c3.provenance.lineageCandidateId,c2.candidate.candidateId);
 assert.equal(c3.provenance.lineageSha256,c2.candidate.sha256);
 assert.equal(c3.verification.alphaSupportAddedPixels,0);assert.equal(c3.verification.alphaSupportRemovedPixels,0);assert.equal(c3.verification.alphaSupportByteIdentical,true);
 assert.equal(c3.verification.retainedRgbExactFraction,1);assert.ok(c3.verification.semiTransparentPixels>0);assert.equal(c3.verification.syntheticGeometry,false);assert.equal(c3.verification.perspectiveWarp,false);assert.equal(c3.verification.externalProductionPixels,false);
 const candidate=path.join(root,c3.candidate.source);assert.ok(fs.existsSync(candidate));assert.equal(sha(candidate),c3.candidate.sha256);
 const meta=inspect(fs.readFileSync(candidate));assert.equal(meta.mimeType,'image/png');assert.equal(meta.width,1672);assert.equal(meta.height,615);assert.equal(meta.hasAlpha,true);
 const mask=path.join(root,c3.mask.source);assert.ok(fs.existsSync(mask));assert.equal(sha(mask),c3.mask.sha256);
 for(const a of [c3.artifacts.manifest,c3.artifacts.board]){const p=path.join(root,a.source);assert.ok(fs.existsSync(p));assert.equal(sha(p),a.sha256)}
 const manifest=JSON.parse(fs.readFileSync(path.join(root,c3.artifacts.manifest.source),'utf8'));assert.equal(manifest.candidate.sha256,c3.candidate.sha256);assert.equal(manifest.verification.alphaSupportAddedPixels,0);assert.equal(manifest.verification.alphaSupportRemovedPixels,0);assert.equal(manifest.verification.retainedRgbExactFraction,1);assert.equal(manifest.review.productionEligible,false);
 const rr=readiness.canonicalMasters.rear34;assert.equal(rr.productionEligible,false);assert.ok(['Y62-R34-V1-CANDIDATE-03','Y62-R34-V1-CANDIDATE-04','Y62-R34-V1-CANDIDATE-05'].includes(rr.latestCandidateId));assert.ok(['hold','return-targeted-cleanup'].includes(rr.transparentCandidate.edgeQuality));
 const cam=cams.get('rear34');assert.ok(['Y62-R34-V1-CANDIDATE-03','Y62-R34-V1-CANDIDATE-04','Y62-R34-V1-CANDIDATE-05'].includes(cam.transparentCandidate.id));assert.ok(['hold','return-targeted-cleanup'].includes(cam.transparentCandidate.edgeQuality));assert.equal(cam.transparentCandidate.productionEligible,false);assert.equal(cam.transparentCandidate.cameraMatched,false);
 assert.ok(candidates.listHistory('rear34').some(x=>x.candidateId===c3.candidate.candidateId));assert.equal(candidates.productionEligible(c3),false);assert.equal(candidates.productionEligible(candidates.get('rear34')),false);
 for(const customerFile of ['index.html','builder.js','render-resolver.js']){const fp=path.join(root,customerFile);if(fs.existsSync(fp)){const txt=fs.readFileSync(fp,'utf8');assert.equal(txt.includes(c3.candidate.source),false);assert.equal(txt.includes(c3.packageId),false)}}
 assert.equal(c3.assess().productionEligible,false);
 console.log('WF3 Y62 R34 Candidate 03 alpha-edge cleanup Alpha 26: PASS');
})();
