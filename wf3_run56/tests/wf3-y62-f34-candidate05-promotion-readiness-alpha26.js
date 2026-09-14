const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const gate=require('../y62-f34-candidate05-promotion-readiness');
const readiness=require('../y62-readiness-plan');
const brief=require('../y62-canonical-briefs');
const board=require('../workflow-board-data');
const refs=require('../y62-reference-pack');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(function(){
 assert.equal(gate.gateId,'Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01');
 assert.equal(gate.policy,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');
 assert.equal(gate.candidateId,'Y62-F34-V1-CANDIDATE-05');
 assert.equal(gate.authorityBoundary.mayWriteProductionRegistry,false);
 assert.equal(gate.authorityBoundary.maySetProductionEligible,false);
 assert.equal(gate.currentState.productionEligible,false);
 assert.equal(gate.requiredSemanticCheckIds.length,12);
 assert.equal(gate.primaryAuthenticityEvidence[0].id,'OWNER-Y62-F34-01');
 const owner=refs.references.find(x=>x.id==='OWNER-Y62-F34-01');
 assert.equal(owner.sha256,gate.primaryAuthenticityEvidence[0].sha256);

 const pending=gate.evaluate({});
 assert.equal(pending.readyForWF5,false);assert.equal(pending.productionEligible,false);assert.equal(pending.productionRegistryWriteAllowed,false);assert.ok(pending.issues.length>10);

 const semantic=Object.fromEntries(gate.requiredSemanticCheckIds.map(id=>[id,'pass']));
 const good={policy:gate.policy,candidateId:gate.candidateId,handoffId:gate.requiredLineage.handoffId,intakeContractId:gate.requiredLineage.intakeContractId,cameraTransferContractId:gate.requiredLineage.cameraTransferContractId,reviewPipelineId:gate.requiredLineage.reviewPipelineId,intakeStructurallyReady:true,candidateSha256:'candidate05-new-sha',intakeBinarySha256:'candidate05-new-sha',reviewCandidateSha256:'candidate05-new-sha',masterApprovalCandidateSha256:'candidate05-new-sha',width:1672,height:615,hasAlpha:true,alphaRawSha256:gate.requiredLineage.expectedAlphaRawSha256,reviewEvidenceGenerated:true,reviewerId:'IDENTIFIED-REVIEWER',reviewerAuthority:'identified-semantic-review',reviewerDecision:'pass',cameraGeometryMatched:true,semanticChecks:semantic,productionBinaryRightsReady:true,externalProductionSourcesUsed:false,masterApproverId:'IDENTIFIED-MASTER-APPROVER',masterApproverAuthority:'canonical-master-approval',masterApproved:true,masterState:'master-approved'};
 const ok=gate.evaluate(good);assert.equal(ok.readyForWF5,true);assert.equal(ok.nextGate,'WF5 exact-checksum production promotion gate');assert.equal(ok.productionEligible,false);assert.equal(ok.productionRegistryWriteAllowed,false);
 const c04=gate.evaluate({...good,candidateSha256:gate.requiredLineage.forbiddenPriorBinarySha256,intakeBinarySha256:gate.requiredLineage.forbiddenPriorBinarySha256,reviewCandidateSha256:gate.requiredLineage.forbiddenPriorBinarySha256,masterApprovalCandidateSha256:gate.requiredLineage.forbiddenPriorBinarySha256});
 assert.equal(c04.readyForWF5,false);assert.ok(c04.issues.some(x=>/Candidate 04/.test(x)));
 const badExternal=gate.evaluate({...good,externalProductionSourcesUsed:true,externalSourceRights:[{sourceId:'EXT-01',rightsRecorded:true,commercialDerivativeUse:false,productionPixelUse:true}]});
 assert.equal(badExternal.readyForWF5,false);assert.ok(badExternal.issues.some(x=>/external production source/.test(x)));
 const geometryException=gate.evaluate({...good,alphaRawSha256:'changed'});assert.equal(geometryException.readyForWF5,false);assert.ok(geometryException.issues.some(x=>/new reviewed promotion contract/.test(x)));

 const art=path.join(root,'assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-promotion-readiness-v01.png');
 const man=path.join(root,'assets/y62-canonical-candidates/Y62-F34-V1-candidate-05-promotion-readiness-v01.json');
 assert.ok(fs.existsSync(art)&&fs.existsSync(man));
 assert.equal(sha(art),'41de59395c6d9638d1ca06e26f058937ef851db31ba6891f9d694216c8dacb1e');
 assert.equal(sha(man),'b87ab132b57233e205bcf68a7c0bf3d1377e31e1d9e337143674ae90ab0f646b');
 const mj=JSON.parse(fs.readFileSync(man,'utf8'));assert.equal(mj.state,'READY_WAITING_CANDIDATE05');assert.equal(mj.authority.productionEligible,false);assert.equal(mj.authority.productionRegistryWriteAllowed,false);
 assert.equal(brief.briefs.front34.candidate05PromotionReadinessId,gate.gateId);
 assert.equal(readiness.canonicalMasters.front34.promotionReadiness.gateId,gate.gateId);assert.equal(readiness.canonicalMasters.front34.promotionReadiness.readyForWF5,false);assert.equal(readiness.canonicalMasters.front34.productionEligible,false);
 const wf3=board.workstreams.find(x=>x.id==='WF3');assert.equal(wf3.promotionReadinessStage,'F34_CANDIDATE05_PROMOTION_READINESS_READY');assert.match(wf3.completedPackage,/CANDIDATE05-PROMOTION-READINESS-01/);assert.match(wf3.nextPackage,/PROMOTION-READINESS-01/);
 const customer=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const token of [gate.gateId,'Y62-F34-V1-candidate-05-promotion-readiness-v01.png'])assert.equal(customer.includes(token),false);
 console.log('WF3 Y62 F34 Candidate 05 promotion readiness Alpha 26: PASS');
})();
