const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const pkg=require('../y62-r34-transparent-isolation-candidate');
const cams=require('../camera-profiles-y62');
const readiness=require('../y62-readiness-plan');
const {inspect}=require('../server/asset-vault');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
  assert.equal(pkg.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
  assert.equal(pkg.packageId,'Y62-R34-V1-CANDIDATE02-TRANSPARENT-ISOLATION-01');
  assert.equal(pkg.candidate.candidateId,'Y62-R34-V1-CANDIDATE-02');
  assert.equal(pkg.candidate.productionEligible,false);assert.equal(pkg.candidate.cameraMatched,false);assert.equal(pkg.candidate.hasAlpha,true);
  const owner=path.join(root,pkg.provenance.source);assert.ok(fs.existsSync(owner));assert.equal(sha(owner),pkg.provenance.sourceSha256);
  const mask=path.join(root,pkg.mask.source);assert.ok(fs.existsSync(mask));assert.equal(sha(mask),pkg.mask.sha256);
  const file=path.join(root,pkg.candidate.source);assert.ok(fs.existsSync(file));assert.equal(sha(file),pkg.candidate.sha256);
  const meta=inspect(fs.readFileSync(file));assert.equal(meta.mimeType,'image/png');assert.equal(meta.width,1672);assert.equal(meta.height,615);assert.equal(meta.hasAlpha,true);assert.equal(meta.transparencyVerified,true);
  const manifestPath=path.join(root,pkg.review.manifest);assert.ok(fs.existsSync(manifestPath));assert.equal(sha(manifestPath),pkg.review.manifestSha256);
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));assert.equal(manifest.candidateId,pkg.candidate.candidateId);assert.equal(manifest.candidate.sha256,pkg.candidate.sha256);assert.equal(manifest.verification.retainedRgbExactFraction,1);assert.equal(manifest.transformation.perspectiveWarp,false);assert.equal(manifest.transformation.syntheticGeometry,false);assert.equal(manifest.candidate.productionEligible,false);assert.equal(manifest.review.decision,'hold-for-clean-reconstruction-and-review');
  assert.ok(manifest.review.checks.some(x=>x.id==='edge-quality'&&x.result==='hold'));assert.ok(manifest.review.checks.some(x=>x.id==='clean-neutral-reconstruction'&&x.result==='fail'));assert.ok(manifest.review.checks.some(x=>x.id==='f34-family-alignment'&&x.result==='hold'));
  const board=path.join(root,pkg.review.board);assert.ok(fs.existsSync(board));assert.equal(sha(board),pkg.review.boardSha256);
  const cam=cams.get('rear34');assert.ok(cam);assert.equal(cam.state,'reconstruction-authorised');assert.equal(cam.transparentCandidate.productionEligible,false);assert.equal(cam.transparentCandidate.cameraMatched,false);assert.equal(cam.transparentCandidate.cleanNeutralReconstruction,'fail');
  const rr=readiness.canonicalMasters.rear34;assert.ok(['transparent-isolation-reviewable','candidate02-edge-returned','candidate03-edge-review-required','candidate03-edge-returned-targeted-cleanup','candidate04-edge-review-required','candidate04-edge-returned-second-targeted-cleanup','candidate05-edge-review-required'].includes(rr.state));assert.equal(rr.productionEligible,false);assert.ok(rr.passed.some(x=>/CANDIDATE-02/i.test(x)));assert.ok(rr.blocked.some(x=>/clean neutral reconstruction FAIL/i.test(x)));assert.ok(rr.blocked.some(x=>/F34 canonical family alignment/i.test(x)));
  for(const customerFile of ['index.html','builder.js','render-resolver.js']){const fp=path.join(root,customerFile);if(fs.existsSync(fp)){const txt=fs.readFileSync(fp,'utf8');assert.equal(txt.includes(pkg.candidate.source),false);assert.equal(txt.includes(pkg.candidate.candidateId),false)}}
  assert.equal(pkg.assess().productionEligible,false);
  console.log('WF3 Y62 R34 transparent isolation Candidate 02 Alpha 26: PASS');
})();
