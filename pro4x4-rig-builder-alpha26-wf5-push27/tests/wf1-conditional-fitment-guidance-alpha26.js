const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');

// WF1 must expose manufacturer conditions before selection rather than imply fitment certainty.
assert.match(app,/function fitmentConditions\(p\)/);
assert.match(app,/CHECK YOUR VEHICLE SETUP/);
assert.match(app,/PRO4X4 WILL VERIFY/);
assert.match(app,/The configurator does not assume they are already satisfied/);
assert.match(app,/mp-fitment-conditions/);
assert.match(app,/ADD FOR REVIEW/);
assert.match(app,/ADD — CHECK SETUP/);

// Selected-build summary must retain setup conditions distinctly from hard conflicts/review gates.
assert.match(app,/VEHICLE SETUP CHECK:/);
assert.match(app,/setupCheckCount/);
assert.match(app,/VEHICLE SETUP CHECK\$\{setupCheckCount>1\?'S':''\}/);
assert.match(css,/\.mp-fitment-conditions/);
assert.match(css,/\.build-condition/);

// Quote submission may proceed, but open setup checks remain explicit to staff/customer.
assert.match(app,/vehicle setup check\$\{setupChecks>1\?'s':''\} remain visible to staff for fitment confirmation/);

// The shared immutable snapshot already carries the source fitment conditions; WF1 does not invent answers.
const context={};context.window=context;context.globalThis=context;
vm.runInNewContext(fs.readFileSync(path.join(root,'merged-project-contract.js'),'utf8'),context,{filename:'merged-project-contract.js'});
const contract=context.PRO4X4_MERGED_PROJECT;
const selected=contract.selection({id:'conditional-demo',brand:'Demo',name:'Conditional fitment',sku:'DEMO-1',status:'confirmed',category:'Touring',price:1,fitment:{reviewRequired:false,conditions:['factory tow bar required'],conflicts:[]}},'ford-ranger-nextgen-2025');
assert.deepEqual(Array.from(selected.fitment.conditions),['factory tow bar required']);
assert.equal(Object.prototype.hasOwnProperty.call(selected.fitment,'customerConfirmed'),false);

console.log('WF1 Alpha 26 conditional fitment guidance: PASS');
