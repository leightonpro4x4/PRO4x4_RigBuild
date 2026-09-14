(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api; else root.PRO4X4_CUSTOMER_PRODUCT_GUIDANCE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function asSet(values){return values instanceof Set?values:new Set(values||[])}
  function unique(values){return [...new Set((values||[]).filter(Boolean))]}
  function groupLabel(group){return String(group||'selection').replaceAll('-',' ').replace(/\b\w/g,m=>m.toUpperCase())}
  function replacementImpact(product,products,selected){
    const group=String(product?.group||'').trim();
    if(!group||selected.has(product.id))return {group:null,replacements:[],affected:[]};
    const replacements=products.filter(p=>p.id!==product.id&&p.group===group&&selected.has(p.id));
    if(!replacements.length)return {group,replacements:[],affected:[]};
    const next=new Set(selected);for(const p of replacements)next.delete(p.id);next.add(product.id);
    const affected=[];
    for(const dep of products.filter(p=>next.has(p.id)&&p.id!==product.id)){
      const required=unique([...(dep.requires||[]),...(dep.fitment?.requiredParts||[])]);
      const missingRequired=required.filter(id=>!next.has(id));
      const anyOf=unique(dep.fitment?.anyOfRequiredParts||[]),anyOfOpen=anyOf.length&&!anyOf.some(id=>next.has(id));
      if(missingRequired.length||anyOfOpen)affected.push({productId:dep.id,name:dep.name||dep.id,missingRequired,anyOfOpen,anyOf});
    }
    return {group,replacements:replacements.map(p=>({id:p.id,name:p.name||p.id,sku:p.sku||null})),affected};
  }
  function compatibility(product,allProducts,selectedIds){
    const selected=asSet(selectedIds), products=Array.isArray(allProducts)?allProducts:[], byId=new Map(products.map(p=>[p.id,p]));
    const rows=[];
    const required=unique([...(product.requires||[]),...(product.fitment?.requiredParts||[])]);
    for(const id of required){
      const dep=byId.get(id);
      if(!dep){
        rows.push({kind:'review',code:'required-missing',label:`REQUIRED PART NEEDS STAFF REVIEW: ${id}`,detail:'This dependency is not yet a selectable governed catalogue item. PRO4X4 will verify it rather than infer a substitute.'});
        continue;
      }
      if(dep.status==='blocked'){
        rows.push({kind:'blocked',code:'required-blocked',productId:id,label:`REQUIRED PART BLOCKED: ${dep.name}`,detail:'A valid fitment path is not currently approved for the required supporting item.'});
        continue;
      }
      if(selected.has(id)) rows.push({kind:'satisfied',code:'required-selected',productId:id,label:`REQUIRED SUPPORT SELECTED: ${dep.name}`,detail:'This required supporting item is already in your build.'});
      else rows.push({kind:'required',code:'required-auto',productId:id,label:`REQUIRES: ${dep.name}`,detail:'This verified supporting item will be added automatically with this product.'});
    }

    const anyOf=unique(product.fitment?.anyOfRequiredParts||[]);
    if(anyOf.length){
      const known=anyOf.map(id=>byId.get(id)).filter(Boolean), chosen=known.find(p=>selected.has(p.id));
      if(chosen) rows.push({kind:'satisfied',code:'anyof-selected',productId:chosen.id,label:`SUPPORT CHOICE MET: ${chosen.name}`,detail:'One verified alternative is already selected.'});
      else if(known.length) rows.push({kind:'required',code:'anyof-required',productIds:known.map(p=>p.id),label:`REQUIRES ONE OF: ${known.map(p=>p.name).join(' OR ')}`,detail:'Choose one verified alternative. The configurator will not choose between alternatives for you.'});
      else rows.push({kind:'review',code:'anyof-missing',productIds:anyOf,label:`SUPPORT CHOICE NEEDS STAFF REVIEW: ${anyOf.join(' OR ')}`,detail:'The requirement is preserved, but no governed selectable alternative is currently available.'});
    }

    for(const id of unique(product.fitment?.conflicts||[])){
      const conflict=byId.get(id);
      if(!conflict){
        rows.push({kind:'review',code:'conflict-unmapped',label:`FITMENT CONSTRAINT NEEDS STAFF REVIEW: ${id}`,detail:'This manufacturer constraint is preserved exactly; there is no selectable governed catalogue record to resolve it automatically.'});
        continue;
      }
      if(selected.has(id)) rows.push({kind:'blocked',code:'conflict-active',productId:id,label:`ACTIVE CONFLICT: ${conflict.name}`,detail:'Remove the conflicting selected product before adding this item.'});
      else rows.push({kind:'conflict',code:'conflict-known',productId:id,label:`CANNOT COMBINE WITH: ${conflict.name}`,detail:'This incompatibility is shown before selection so the build path is clear.'});
    }

    const replacement=replacementImpact(product,products,selected);
    if(replacement.replacements.length){
      const names=replacement.replacements.map(x=>x.name).join(' + ');
      rows.push({kind:'replacement',code:'exclusive-replacement',productIds:replacement.replacements.map(x=>x.id),group:replacement.group,label:`REPLACES SELECTED: ${names}`,detail:`Only one ${groupLabel(replacement.group)} option can be active. Choosing this product will replace the selected option shown above; nothing is silently kept in the same selection group.`});
      for(const affected of replacement.affected){
        const detail=affected.anyOfOpen
          ? `After this replacement, ${affected.name} will need one of its governed supporting alternatives selected again.`
          : `After this replacement, ${affected.name} will be missing required support: ${affected.missingRequired.map(id=>byId.get(id)?.name||id).join(' + ')}.`;
        rows.push({kind:'replacement',code:'replacement-opens-requirement',productId:affected.productId,label:`REPLACEMENT OPENS A REQUIREMENT: ${affected.name}`,detail});
      }
    }
    return {rows,hasConstraints:rows.length>0,blocking:rows.filter(r=>r.kind==='blocked').length,review:rows.filter(r=>r.kind==='review').length,replacement};
  }
  return {schemaVersion:'0.26.15',compatibility,replacementImpact};
});
