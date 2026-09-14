(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api; else root.PRO4X4_CUSTOMER_NAV=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ALL='ALL';
  const clean=v=>String(v==null?'':v).trim();
  const categoryOf=p=>(clean(p?.category)||'OTHER').toUpperCase();
  const vendorOf=p=>clean(p?.brand)||'OTHER';
  const selectedSet=selectedIds=>selectedIds instanceof Set?selectedIds:new Set(Array.isArray(selectedIds)?selectedIds:[]);
  function categories(products){return [ALL,...new Set((products||[]).map(categoryOf))]}
  function categoryRows(products,selectedIds){
    const selected=selectedSet(selectedIds),list=products||[],rows=[];
    for(const id of categories(list)){
      const scoped=id===ALL?list:list.filter(p=>categoryOf(p)===id);
      rows.push({id,label:id===ALL?'ALL GEAR':id,count:scoped.length,selectedCount:scoped.filter(p=>selected.has(p.id)).length});
    }
    return rows;
  }
  function vendors(products,category=ALL){
    const cat=clean(category).toUpperCase()||ALL;
    const filtered=(products||[]).filter(p=>cat===ALL||categoryOf(p)===cat);
    const counts=new Map();
    for(const p of filtered){const v=vendorOf(p);counts.set(v,(counts.get(v)||0)+1)}
    return [{id:ALL,label:'ALL MANUFACTURERS',count:filtered.length},...[...counts.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([id,count])=>({id,label:id,count}))];
  }
  function vendorRows(products,category=ALL,selectedIds){
    const selected=selectedSet(selectedIds),cat=clean(category).toUpperCase()||ALL;
    return vendors(products,cat).map(row=>{
      const scoped=visibleProducts(products,cat,row.id);
      return {...row,selectedCount:scoped.filter(p=>selected.has(p.id)).length};
    });
  }
  function visibleProducts(products,category=ALL,vendor=ALL){
    const cat=clean(category).toUpperCase()||ALL, ven=clean(vendor)||ALL;
    return (products||[]).filter(p=>(cat===ALL||categoryOf(p)===cat)&&(ven===ALL||vendorOf(p)===ven));
  }
  function validVendor(products,category,vendor){
    const ven=clean(vendor)||ALL;
    if(ven===ALL)return ALL;
    return vendors(products,category).some(v=>v.id===ven)?ven:ALL;
  }
  function path(category=ALL,vendor=ALL){
    const cat=clean(category).toUpperCase()||ALL,ven=clean(vendor)||ALL;
    const out=['ALL GEAR'];
    if(cat!==ALL)out.push(cat);
    if(ven!==ALL)out.push(ven);
    return out;
  }
  function visibleSelectionCount(products,category=ALL,vendor=ALL,selectedIds){
    const selected=selectedSet(selectedIds);
    return visibleProducts(products,category,vendor).filter(p=>selected.has(p.id)).length;
  }
  return {schemaVersion:'0.26.16',ALL,categoryOf,vendorOf,categories,categoryRows,vendors,vendorRows,visibleProducts,visibleSelectionCount,validVendor,path};
});
