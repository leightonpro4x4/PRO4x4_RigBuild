const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const pack=require(path.join(root,'y62-reference-pack.js'));
const briefs=require(path.join(root,'y62-canonical-briefs.js'));
const cams=require(path.join(root,'camera-profiles-y62.js'));
const cands=require(path.join(root,'y62-canonical-candidates.js'));
(function(){
 const c=cands.get('front34'); assert.ok(c); assert.equal(c.candidateId,'Y62-F34-V1-CANDIDATE-01');
 assert.equal(c.governance.state,'master-draft'); assert.equal(c.file.width,1672); assert.equal(c.file.height,615); assert.equal(c.file.hasAlpha,false);
 assert.equal(cands.productionEligible(c),false);
 assert.equal(briefs.briefs.front34.briefId,c.briefId);
 assert.deepEqual(c.provenance.referenceIds,briefs.briefs.front34.referenceIds);
 for(const id of c.provenance.referenceIds) assert.ok(pack.references.some(r=>r.id===id&&r.rights==='owner-project-approved'));
 const f=path.join(root,c.source); assert.ok(fs.existsSync(f)); const sha=crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); assert.equal(sha,c.file.checksumSha256);
 assert.equal(cams.get('front34').candidateAsset.id,c.candidateId); assert.equal(cams.get('front34').candidateAsset.hasAlpha,false);
 assert.ok(c.review.blockers.length>=2); assert.ok(c.review.checks.some(x=>x.id==='camera'&&x.state==='manual-review-required')); assert.ok(c.review.checks.some(x=>x.id==='isolation'&&x.state==='not-started'));
 assert.ok(fs.existsSync(path.join(root,'y62-canonical-review.html')));
 console.log('WF3 Y62 F34 candidate Alpha 26: PASS');
})();
