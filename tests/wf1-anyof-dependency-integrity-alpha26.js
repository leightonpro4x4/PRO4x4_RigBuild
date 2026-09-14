'use strict';
const assert=require('node:assert');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const contract=require('../merged-project-contract');
const root=path.join(__dirname,'..');
function loadBrowser(file,ctx={}){ctx.window=ctx;ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});return ctx}
(function(){
  const c={};loadBrowser('data-ranger.js',c);loadBrowser('product-visual-contract.js',c);
  const data=c.RANGER_DATA, products=data.accessories;
  const bash=products.find(x=>x.sku==='BP-FRA-NG-22-ASM0');
  const predator=products.find(x=>x.id==='oa-predator');
  const toro=products.find(x=>x.id==='oa-toro-ranger');
  assert(bash&&predator&&toro,'Ranger any-of dependency fixtures missing');

  const pre=c.PRO4X4_PRODUCT_VISUALS.selectionGate(bash,products,new Set());
  assert.equal(pre.allowed,false,'bash plate must be blocked before one support bar is selected');
  assert.equal(pre.resolutionActions.filter(x=>x.type==='add').length,2,'both verified alternatives must be offered without auto-selecting either');
  assert.equal(c.PRO4X4_PRODUCT_VISUALS.selectionGate(bash,products,new Set([predator.id])).allowed,true);
  assert.equal(c.PRO4X4_PRODUCT_VISUALS.selectionGate(bash,products,new Set([toro.id])).allowed,true);

  const stranded=contract.buildSnapshot({data,selectedProducts:[bash],lead:{name:'WF1 QA'},reference:'P4X4-WF1-ANYOF'});
  const gate=stranded.gates.find(x=>x.type==='dependency-any-of'&&x.productId===bash.id);
  assert(gate,'unsatisfied OR dependency must become a durable project/quote gate');
  assert.deepEqual(gate.requiredAnyOf,[predator.id,toro.id]);
  assert.deepEqual(gate.alternatives.map(x=>x.id),[predator.id,toro.id]);
  assert.match(gate.note,/Predator.+OR.+Toro/i,'gate must name the verified alternatives');
  assert.equal(stranded.workflow.status,'needs-fitment-review');
  assert.deepEqual(stranded.selections[0].fitment.anyOfRequiredParts,[predator.id,toro.id]);

  for(const support of [predator,toro]){
    const valid=contract.buildSnapshot({data,selectedProducts:[bash,support],lead:{name:'WF1 QA'},reference:`P4X4-WF1-${support.id}`});
    assert(!valid.gates.some(x=>x.type==='dependency-any-of'&&x.productId===bash.id),`${support.id} must satisfy the OR dependency`);
  }

  const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
  assert.match(app,/unresolvedAnyOfGates\(\)/,'customer state must revalidate OR dependencies after mutation');
  assert.match(app,/REQUIRED SUPPORT CHOICE/,'customer build summary must expose a missing support choice');
  assert.match(app,/unresolved dependency gate/,'quote confirmation must acknowledge persisted dependency gates');
  assert.doesNotMatch(app,/state\.selected\.add\(.*anyOfRequiredParts/,'WF1 must not silently invent an OR-dependency choice');
  console.log('WF1 any-of dependency integrity Alpha 26: PASS');
})();
