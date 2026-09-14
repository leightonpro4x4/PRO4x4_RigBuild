const assert=require('assert');
const board=require('../workflow-board-data.js');
assert.ok(/^0\.(25|26)\./.test(board.version));
assert.equal(board.principles.visualMilestone,'Nissan Patrol Y62 Warrior');
assert.equal(board.principles.catalogueMilestone,'Next-Gen Ranger');
assert.ok(['NO_FAKE_RENDER_LAYERS','REFERENCE_BACKED_APPROVED_VISUALS_ONLY'].includes(board.principles.renderRule));
assert.equal(board.workstreams.length,5);
assert.deepEqual(board.workstreams.map(w=>w.id),['WF1','WF2','WF3','WF4','WF5']);
assert.equal(new Set(board.workstreams.map(w=>w.id)).size,5);
assert.ok(['BLOCKED_EXTERNAL_ASSET','REFERENCE_PACK_AVAILABLE','F34_CANDIDATE_REVIEW','F34_REVIEW_READY','F34_CANDIDATE_04_REVIEW','F34_CANDIDATE_04_RETURNED','F34_PRO_RECON_HANDOFF_READY'].includes(board.workstreams.find(w=>w.id==='WF3').status));
assert.equal(board.workstreams.find(w=>w.id==='WF5').status,'GATE');
assert(board.mergeGate.requiredChecks.some(x=>/no .*fallback/i.test(x)));
assert(board.mergeGate.requiredChecks.some(x=>/WF5 regression gate/i.test(x)));
for(const w of board.workstreams){
  assert(w.nextPackage&&w.owns.length&&w.excludes.length&&w.doneWhen.length,`${w.id} governance incomplete`);
}
console.log('Alpha 25 parallel workstream governance verified.');
