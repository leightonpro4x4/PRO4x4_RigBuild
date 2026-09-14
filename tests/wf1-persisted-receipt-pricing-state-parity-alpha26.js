'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const receipt=require('../customer-handoff-receipt.js');
const contract=require('../merged-project-contract.js');
global.window=global;
require('../data-ranger.js');
const data=global.RANGER_DATA;
assert.equal(data.vehicle.id,'ford-ranger-nextgen-2025');
const lower=data.accessories.find(p=>p.id==='oa-lower-bash-ranger');
const steps=data.accessories.find(p=>p.id==='mcc-309bsbk');
assert(lower&&steps,'governed Ranger persisted-pricing fixtures must exist');
const snapshot=contract.buildSnapshot({
  data,
  selectedProducts:[lower,steps],
  lead:{name:'WF1 Pricing State',phone:'0400000000'},
  reference:'P4X4-WF1-PRICING-STATE',
  renderResolution:{productionReady:false,fallbackPolicy:'none',exactMatchRequired:true,layers:[]}
});
snapshot.project={id:'P4X4-PROJ-PRICING',revisionId:'R0025',revisionNumber:25,savedAt:'2026-09-14T09:00:00.000Z',source:'merged-customer-builder',projectVersion:25};
assert.equal(snapshot.pricing.knownSubtotal,1900);
assert.equal(snapshot.pricing.components.parts,1510);
assert.equal(snapshot.pricing.components.labour,390);
assert.equal(snapshot.pricing.unpricedComponentCounts.labour,1);
assert.equal(snapshot.pricing.isComplete,false);
const before=JSON.stringify(snapshot);
const model=receipt.build(snapshot,{mode:'quote',queueReference:'P4X4-Q-R0025'});
assert.equal(JSON.stringify(snapshot),before,'pricing receipt derivation must not mutate the persisted revision');
assert.equal(model.schemaVersion,'0.26.29');
assert.equal(model.pricingState.snapshotSource,'persisted-revision.pricing');
assert.equal(model.pricingState.reconciliationSource,'persisted-revision.selections');
assert.equal(model.pricingState.currency,'AUD');
assert.equal(model.pricingState.taxMode,'retail-gst-inclusive-where-sourced');
assert.equal(model.pricingState.savedKnownSubtotal,1900);
assert.equal(model.pricingState.rowKnownSubtotal,1900);
assert.equal(model.pricingState.componentKnownSubtotal,1900);
assert.equal(model.pricingState.savedMissingRequiredCount,1);
assert.equal(model.pricingState.rowMissingRequiredCount,1);
assert.equal(model.pricingState.rowSubtotalMatches,true);
assert.equal(model.pricingState.componentSubtotalMatches,true);
assert.equal(model.pricingState.missingCountMatches,true);
assert.equal(model.pricingState.pricingState,'persisted-pricing-tbc');
assert.equal(model.verification.find(x=>x.type==='pricing')?.state,'open');
assert.match(model.verification.find(x=>x.type==='pricing')?.detail||'',/1 required pricing component remains TBC/);
// Presentation stays pinned after caller-owned persisted data is changed later.
snapshot.pricing.knownSubtotal=9999;
snapshot.pricing.components.parts=9999;
snapshot.pricing.unpricedComponentCounts.labour=0;
snapshot.selections[0].pricing.parts=7777;
assert.equal(model.pricingState.savedKnownSubtotal,1900);
assert.equal(model.pricingState.components.parts,1510);
assert.equal(model.pricingState.savedMissingRequiredCount,1);
assert.equal(model.pricingState.rowKnownSubtotal,1900);
// A persisted internal pricing mismatch is surfaced for review, never silently repaired from current catalogue data.
const mismatch=contract.buildSnapshot({data,selectedProducts:[lower,steps],renderResolution:{productionReady:false,layers:[]}});
mismatch.pricing.knownSubtotal=2000;
const mismatchModel=receipt.build(mismatch,{mode:'save'});
assert.equal(mismatchModel.pricingState.pricingState,'persisted-summary-mismatch');
assert.equal(mismatchModel.pricingState.rowSubtotalMatches,false);
assert.equal(mismatchModel.pricingState.componentSubtotalMatches,false);
assert.equal(mismatchModel.verification.find(x=>x.type==='pricing-integrity')?.state,'open');
assert.match(mismatchModel.verification.find(x=>x.type==='pricing-integrity')?.detail||'',/does not reconcile/);
const tbcMismatch=contract.buildSnapshot({data,selectedProducts:[lower,steps],renderResolution:{productionReady:false,layers:[]}});
tbcMismatch.pricing.unpricedComponentCounts.labour=0;
assert.equal(receipt.build(tbcMismatch,{mode:'save'}).pricingState.pricingState,'persisted-summary-mismatch','saved TBC count disagreement must be visible');
// A fully priced persisted revision can be shown as reconciled without consulting current catalogue values.
const complete=contract.buildSnapshot({data,selectedProducts:[steps],renderResolution:{productionReady:false,layers:[]}});
const completeModel=receipt.build(complete,{mode:'save'});
assert.equal(completeModel.pricingState.savedKnownSubtotal,1480);
assert.equal(completeModel.pricingState.rowKnownSubtotal,1480);
assert.equal(completeModel.pricingState.pricingState,'persisted-pricing-complete');
assert.equal(completeModel.verification.find(x=>x.type==='pricing')?.state,'clear');
// Missing persisted aggregate fields stay missing instead of being rebuilt from mutable/current catalogue data.
const incomplete=contract.buildSnapshot({data,selectedProducts:[steps],renderResolution:{productionReady:false,layers:[]}});
delete incomplete.pricing.components;
const incompleteModel=receipt.build(incomplete,{mode:'save'});
assert.equal(incompleteModel.pricingState.pricingState,'persisted-summary-incomplete');
assert.equal(incompleteModel.pricingState.componentKnownSubtotal,null);
assert.equal(incompleteModel.verification.find(x=>x.type==='pricing')?.state,'open');
const root=path.join(__dirname,'..');
const receiptSource=fs.readFileSync(path.join(root,'customer-handoff-receipt.js'),'utf8');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(receiptSource,/function pricingDetail\(pricing=\{\},bom=\{\}\)/);
const pricingStart=receiptSource.indexOf('function pricingDetail(pricing={},bom={})'),pricingEnd=receiptSource.indexOf('\n  function missingPricing',pricingStart);
assert(pricingStart>=0&&pricingEnd>pricingStart,'pricing detail model must exist');
const pricingBlock=receiptSource.slice(pricingStart,pricingEnd);
assert.doesNotMatch(pricingBlock,/products\(|current\(|catalogue-store|backend|fetch\(|saveProject|createBuild|createProjectShare/,'persisted pricing model must not refresh current catalogue/backend state or write project state');
assert.match(app,/function renderReceiptPricingState\(/);
assert.match(app,/PRICING STATE LOCKED TO THIS REVISION/);
assert.match(app,/Current catalogue prices, promotions and later staff adjustments are not backfilled/);
assert.match(app,/SAVED PRICING RECORD NEEDS REVIEW/);
assert.match(app,/\$\{renderReceiptPricingState\(model\)\}\$\{renderReceiptBom\(model\)\}/);
const renderStart=app.indexOf('function renderReceiptPricingState('),renderEnd=app.indexOf('\nfunction renderReceiptBom',renderStart);
assert(renderStart>=0&&renderEnd>renderStart,'receipt pricing renderer block must exist');
const renderBlock=app.slice(renderStart,renderEnd);
assert.doesNotMatch(renderBlock,/products\(|current\(|selectedProducts|resolveRenderStack|saveProject|createBuild|createProjectShare/,'receipt pricing UI must not refresh catalogue/backend state or write project state');
assert.match(css,/\.merge-receipt-pricing/);
assert.match(css,/\.merge-receipt-pricing-state\.persisted-summary-mismatch/);
console.log('WF1 Alpha 26 persisted receipt pricing-state parity: PASS');
