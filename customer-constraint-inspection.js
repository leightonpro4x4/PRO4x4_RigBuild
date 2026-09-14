(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api; else root.PRO4X4_CUSTOMER_CONSTRAINT_INSPECTION=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const clean=v=>String(v==null?'':v).trim();
  function browseContext(input={}){
    return {
      category:clean(input.category).toUpperCase()||'ALL',
      vendor:clean(input.vendor)||'ALL',
      focusProductId:clean(input.focusProductId)||null
    };
  }
  function createFrame({originProduct,targetProduct,browse={},issueLabel='RELATED FITMENT ITEM'}={}){
    if(!originProduct?.id||!targetProduct?.id||originProduct.id===targetProduct.id)return null;
    return Object.freeze({
      originProductId:originProduct.id,
      targetProductId:targetProduct.id,
      originBrowse:Object.freeze({...browseContext({...browse,focusProductId:originProduct.id})}),
      issueLabel:clean(issueLabel)||'RELATED FITMENT ITEM'
    });
  }
  function activeFor(trail,targetProductId,products=[]){
    const frames=Array.isArray(trail)?trail:[],frame=frames.at(-1);
    if(!frame||frame.targetProductId!==targetProductId)return null;
    const origin=products.find(p=>p.id===frame.originProductId),target=products.find(p=>p.id===frame.targetProductId);
    if(!origin||!target)return null;
    return {frame,origin,target,depth:frames.length};
  }
  function returnStep(trail,products=[]){
    const frames=Array.isArray(trail)?trail:[];
    if(!frames.length)return {frame:null,trail:[]};
    const frame=frames.at(-1),origin=products.find(p=>p.id===frame.originProductId);
    if(!origin)return {frame:null,trail:[]};
    return {frame,origin,trail:frames.slice(0,-1)};
  }
  return {schemaVersion:'0.26.20',browseContext,createFrame,activeFor,returnStep};
});
