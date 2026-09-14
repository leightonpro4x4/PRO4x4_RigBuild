const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const h=require('../y62-f34-professional-reconstruction-handoff');
const refs=require('../y62-reference-pack');
const brief=require('../y62-f34-reconstruction-brief');
const cands=require('../y62-canonical-candidates');
const review=require('../y62-f34-candidate-04-review');
const cams=require('../camera-profiles-y62');
const readiness=require('../y62-readiness-plan');
const board=require('../workflow-board-data');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
 assert.equal(h.handoffId,'Y62-F34-V1-PRO-RECON-HANDOFF-01');assert.equal(h.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
 assert.equal(h.sourceCandidate.id,'Y62-F34-V1-CANDIDATE-04');assert.equal(h.sourceCandidate.sha256,'bab5e059a6da3a4b7455777c9e23e593ed851fcedb709d44e10bbe54847b6bd1');
 assert.equal(sha(path.join(root,h.sourceCandidate.file)),h.sourceCandidate.sha256);
 assert.deepEqual(h.authenticityReferences.map(x=>x.id),['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01','OWNER-Y62-FRONT-02']);
 for(const r of h.authenticityReferences){const rr=refs.references.find(x=>x.id===r.id);assert.ok(rr);assert.equal(rr.sourceType,'owner-supplied');assert.equal(sha(path.join(root,r.file)),r.sha256)}
 assert.equal(h.reservedOutput.candidateId,'Y62-F34-V1-CANDIDATE-05');assert.equal(h.reservedOutput.initialGovernanceState,'master-draft');assert.equal(h.reservedOutput.productionEligible,false);assert.equal(h.currentState.candidate05Received,false);assert.equal(h.currentState.rightsRecorded,false);assert.equal(h.currentState.productionEligible,false);
 assert.ok(h.reconstructionInstructions.prohibited.some(x=>/perspective warp/i.test(x)));assert.ok(h.reconstructionInstructions.prohibited.some(x=>/external exact-vehicle imagery/i.test(x)));assert.ok(h.acceptanceGates.some(x=>x.id==='rights'));assert.ok(h.acceptanceGates.some(x=>x.id==='wf5'));
 const bad=h.assessSubmission({});assert.equal(bad.submissionStructurallyReady,false);assert.equal(bad.productionEligible,false);
 const good=h.assessSubmission({candidateId:'Y62-F34-V1-CANDIDATE-05',mimeType:'image/png',width:1672,height:615,hasAlpha:true,sha256:'f'.repeat(64),alphaByteIdenticalToCandidate04:true,externalExactVehicleProductionSourcesUsed:false,retoucherId:'RET-001',methodRecorded:true});assert.equal(good.submissionStructurallyReady,true);assert.equal(good.productionEligible,false);assert.equal(good.nextGate,'fresh-exact-checksum-overlay-review');
 assert.deepEqual(brief.primaryReferenceIds,h.authenticityReferences.map(x=>x.id));assert.equal(brief.handoffId,h.handoffId);assert.equal(brief.primaryReferenceIds.includes('OWNER-Y62-FRONT-04'),false);
 const c=cands.getLatest('front34');assert.equal(c.candidateId,'Y62-F34-V1-CANDIDATE-04');assert.equal(c.governance.state,'master-draft');assert.equal(cands.productionEligible(c),false);
 assert.equal(review.professionalReconstructionHandoff.handoffId,h.handoffId);assert.equal(review.professionalReconstructionHandoff.state,'ready');assert.equal(review.professionalReconstructionHandoff.candidate05Received,false);
 const cam=cams.get('front34').transparentCandidate;const ch=cam.overlayPrecheck.neutralReconstruction.professionalReconstructionHandoff;assert.equal(ch.handoffId,h.handoffId);assert.equal(ch.reservedCandidateId,'Y62-F34-V1-CANDIDATE-05');assert.equal(ch.candidateReceived,false);
 assert.equal(readiness.canonicalMasters.front34.state,'candidate-04-returned-pro-recon-handoff-ready');assert.ok(readiness.canonicalMasters.front34.passed.some(x=>/PRO-RECON-HANDOFF-01/.test(x)));assert.equal(readiness.canonicalMasters.side.state,'queued');assert.equal(readiness.canonicalMasters.rear34.productionEligible,false);
 const wf3=board.workstreams.find(x=>x.id==='WF3');assert.equal(wf3.stage,'F34_PRO_RECON_HANDOFF_READY');assert.match(wf3.nextPackage,/Candidate-05|CANDIDATE-05/i);
 const artifact=path.join(root,'assets/y62-canonical-candidates/Y62-F34-V1-professional-reconstruction-handoff-v01.json');assert.ok(fs.existsSync(artifact));const a=JSON.parse(fs.readFileSync(artifact,'utf8'));assert.equal(a.handoffId,h.handoffId);assert.equal(a.currentState.productionEligible,false);
 const manifestPath=path.join(root,'handoff/Y62-F34-V1-PRO-RECON-HANDOFF-01/MANIFEST.json');assert.ok(fs.existsSync(manifestPath));const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));assert.equal(m.handoffId,h.handoffId);assert.equal(m.rightsState,'pending');for(const f of m.files){const fp=path.join(root,'handoff/Y62-F34-V1-PRO-RECON-HANDOFF-01',f.name);assert.ok(fs.existsSync(fp));assert.equal(sha(fp),f.sha256)}
 const customer=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.equal(customer.includes(h.handoffId),false);assert.equal(customer.includes('CANDIDATE-05'),false);
 const staff=fs.readFileSync(path.join(root,'y62-canonical-review.html'),'utf8');assert.ok(staff.includes(h.handoffId));assert.ok(staff.includes('Candidate 05'));
 console.log('WF3 Y62 F34 professional reconstruction handoff Alpha 26: PASS');
})();
