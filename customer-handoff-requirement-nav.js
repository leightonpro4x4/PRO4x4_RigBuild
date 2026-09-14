(function(root,factory){
  const trace=typeof module==='object'&&module.exports?require('./customer-build-trace.js'):(root?root.PRO4X4_CUSTOMER_BUILD_TRACE:null);
  const api=factory(trace);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.PRO4X4_HANDOFF_REQUIREMENT_NAV=api;
})(typeof window!=='undefined'?window:null,function(trace){
  const clean=v=>String(v==null?'':v).trim();
  function targetForId(productId,products=[]){
    const product=products.find(p=>p.id===productId);
    return product&&trace?.targetForProduct?trace.targetForProduct(product):null;
  }
  function dedupe(actions=[]){
    const seen=new Set();
    return actions.filter(action=>{
      const key=`${action.role}:${action.productId}`;
      if(!action.productId||seen.has(key))return false;
      seen.add(key);return true;
    });
  }
  function gateActions(gate={},products=[]){
    const actions=[];
    const owner=trace?.targetForGate?.(gate,products);
    if(owner)actions.push({...owner,role:'source',label:'REVIEW SOURCE PRODUCT'});
    if(gate.requiredId){
      const required=targetForId(gate.requiredId,products);
      if(required)actions.push({...required,role:'required',label:'VIEW REQUIRED PART'});
    }
    const alternatives=Array.isArray(gate.requiredAnyOf)?gate.requiredAnyOf:[];
    alternatives.forEach((id,index)=>{
      const target=targetForId(id,products);
      if(target)actions.push({...target,role:'option',label:`VIEW SUPPORT OPTION${alternatives.length>1?` ${index+1}`:''}`});
    });
    return dedupe(actions);
  }
  function setupActions(check={},products=[]){
    const target=targetForId(check.productId,products);
    return target?[{...target,role:'setup-source',label:'REVIEW SETUP SOURCE'}]:[];
  }
  function issueLabel(record={},fallback='OPEN HANDOFF REQUIREMENT'){
    return clean(record.note)||clean(record.productName)||clean(record.id)||fallback;
  }
  return {schemaVersion:'0.26.21',gateActions,setupActions,issueLabel};
});
