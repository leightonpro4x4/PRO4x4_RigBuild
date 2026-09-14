'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const receipt=require('../customer-handoff-receipt.js');
const contract=require('../merged-project-contract.js');
global.window=global;
require('../data-ranger.js');
const data=global.RANGER_DATA;
const product=data.accessories.find(x=>x.sku==='BP-FRA-NG-22-ASM0')||data.accessories[0];
assert(product,'governed Ranger product fixture required');
const snap=contract.buildSnapshot({
  data,
  selectedProducts:[product],
  lead:{name:'WF1 Share Receipt',phone:'0400000000'},
  reference:'P4X4-WF1-SHARE-ACCESS',
  renderResolution:{schemaVersion:'0.22.0',productionReady:false,exactMatchRequired:true,fallbackPolicy:'none',layers:[{layerId:'base',state:'missing',reason:'approved-master-not-available'}]}
});
snap.project={id:'P4X4-PROJ-SHARE',revisionId:'R0021',revisionNumber:21,savedAt:'2026-09-14T05:30:00.000Z',source:'merged-customer-builder',projectVersion:21};
const shareResult={
  revisionId:'R0021',
  createdAt:'2026-09-14T05:31:00.000Z',
  expiresAt:'2026-10-14T05:31:00.000Z',
  tokenHint:'ABC123',
  token:'VERY-SENSITIVE-BEARER-TOKEN'
};
const model=receipt.build(snap,{mode:'share',projectId:'P4X4-PROJ-SHARE',revisionId:'R0021',share:shareResult});
assert.equal(model.schemaVersion,'0.26.29');
assert.equal(model.mode,'share');
assert.equal(model.share.revisionId,'R0021');
assert.equal(model.share.createdAt,shareResult.createdAt);
assert.equal(model.share.expiresAt,shareResult.expiresAt);
assert.equal(model.share.tokenHint,'ABC123');
assert.equal(Object.prototype.hasOwnProperty.call(model.share,'token'),false,'receipt presentation model must never retain the bearer token');
assert.doesNotMatch(JSON.stringify(model),/VERY-SENSITIVE-BEARER-TOKEN/,'bearer token must not enter receipt model serialization');
assert.equal(model.visual.fallbackPolicy,'none');
assert.equal(model.customerVisualRule,'REFERENCE_BACKED_APPROVED_VISUALS_ONLY');

const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
function block(start,end){const a=app.indexOf(start);assert.ok(a>=0,`missing ${start}`);const b=app.indexOf(end,a+start.length);assert.ok(b>a,`missing ${end}`);return app.slice(a,b)}

for(const id of ['handoffReceiptCopyShare','handoffReceiptOpenShare'])assert.match(html,new RegExp(`id="${id}"`),`${id} control required`);
assert.match(css,/merge-receipt-share-access/,'share-access receipt styling required');
assert.match(app,/function projectShareUrl\(token\)/,'share URL must be derived only after share creation');
assert.match(app,/function copyCustomerText\(text\)/,'copy recovery helper required');
assert.match(app,/try\{await navigator\.clipboard\.writeText\(text\);return 'clipboard'\}catch\{\}/,'clipboard denial must fall back without invalidating an already-created share');
assert.match(app,/function renderReceiptShareAccess\(model,runtime=\{\}\)/);
assert.match(app,/The full share token is <b>not written into the immutable project snapshot or receipt model<\/b>/);
assert.match(app,/state\.handoffReceipt=\{model,shareUrl\}/,'full URL may exist only in transient receipt runtime state');
assert.match(app,/function closeHandoffReceipt\(\).*state\.handoffReceipt=null/,'closing receipt must discard transient share-link access state');
assert.match(app,/window\.open\(runtime\.shareUrl,'_blank','noopener,noreferrer'\)/,'open action must use the exact already-created share URL without creating another share');

const copyBlock=block('async function copyHandoffReceiptShare()','function openHandoffReceiptShare()');
assert.doesNotMatch(copyBlock,/createProjectShare|saveProjectRevision|createBuild|resolveRenderStack|localStorage/,'copy-again must be presentation-only');
const openBlock=block('function openHandoffReceiptShare()','function renderHandoffReceipt(model)');
assert.doesNotMatch(openBlock,/createProjectShare|saveProjectRevision|createBuild|resolveRenderStack|localStorage/,'open-share must be presentation-only');
const receiptBlock=block('function showHandoffReceipt(review,result)','async function confirmHandoffReview()');
assert.doesNotMatch(receiptBlock,/localStorage|saveProjectRevision|createBuild|createProjectShare/,'receipt runtime assembly must not persist the bearer URL or mutate the immutable backbone');
const shareBlock=block('async function shareBuild(revisionIdOverride=null)','function applySnapshot');
assert.equal((shareBlock.match(/createProjectShare/g)||[]).length,1,'share creation must remain a single backend action');
assert.match(shareBlock,/revisionId:targetRevision/,'share must remain pinned to the exact requested immutable revision');
assert.match(shareBlock,/return share/,'copy failure must not erase a successfully created share result');
assert.doesNotMatch(app,/fallbackPolicy\s*:\s*['"]approx/i,'WF1 must never add approximate production visual fallback');
console.log('WF1 Alpha 26 revision-locked share receipt access + copy recovery: PASS');
