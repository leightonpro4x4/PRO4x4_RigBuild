(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api; else root.PRO4X4_CUSTOMER_BUILD_TRACE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const clean=v=>String(v==null?'':v).trim();
  const categoryOf=p=>(clean(p?.category)||'OTHER').toUpperCase();
  const vendorOf=p=>clean(p?.brand)||'OTHER';
  function targetForProduct(product){
    if(!product?.id)return null;
    const category=categoryOf(product),vendor=vendorOf(product);
    return {productId:product.id,category,vendor,path:['ALL GEAR',category,vendor]};
  }
  function gateOwnerId(gate,products=[]){
    if(gate?.productId)return gate.productId;
    const id=clean(gate?.id);
    if(!id)return null;
    if(products.some(p=>p.id===id))return id;
    const prefix=id.split(':')[0];
    return products.some(p=>p.id===prefix)?prefix:null;
  }
  function targetForGate(gate,products=[]){
    const id=gateOwnerId(gate,products);
    return id?targetForProduct(products.find(p=>p.id===id)):null;
  }
  return {schemaVersion:'0.26.11',categoryOf,vendorOf,targetForProduct,gateOwnerId,targetForGate};
});
