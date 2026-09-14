// Pure shared decision engine: no DOM, filesystem, persistence, renderer or network.
const unique = a => [...new Set(a)];
const list = a => Array.isArray(a) ? a : [];
const key = (v,id) => `${v}::${id}`;
export function createEngine(catalogue) {
  catalogue=JSON.parse(JSON.stringify(catalogue));
  const rows = new Map(catalogue.products.map(p=>[p.identity,p]));
  if(rows.size!==catalogue.products.length) throw new Error('Duplicate product identity');
  const copy = x=>JSON.parse(JSON.stringify(x));
  function requirements(row,selected,context) {
    const p=row.data,f=p.fitment||{}, scope=id=>key(row.vehicleId,id);
    const allOf=unique([...list(p.requires),...list(f.requiredParts),...list(f.routeRequiredParts)]).map(scope);
    const anyOf=[f.anyOfRequiredParts,f.requiresAnyOf].filter(x=>list(x).length).map(g=>unique(g).map(scope));
    // Only explicit requiredParts become dependencies. Compatible/candidate/additional
    // parts and free-text conditions remain evidence, never invented hard requirements.
    for(const route of list(f.routeDependencies)) if(route.parentId && selected.has(scope(route.parentId))) allOf.push(...list(route.requiredParts).map(scope));
    for(const route of list(f.mountingRoutes)) if(context.routes?.[row.identity]===route.route) allOf.push(...list(route.requiredParts).map(scope));
    return {allOf:unique(allOf),anyOf};
  }
  function evaluate({vehicleId,selected=[],context={}}) {
    const ids=unique(selected).sort(),set=new Set(ids),reasons=[],products=[];
    const reason=(code,productId,message,detail={})=>{const r={code,productId,message,...detail};reasons.push(r);return r;};
    if(!catalogue.vehicles.some(v=>v.vehicleId===vehicleId)) reason('vehicle-unknown',null,'Choose a governed vehicle.');
    for(const id of ids) {
      const row=rows.get(id);
      if(!row || row.vehicleId!==vehicleId){reason('identity-invalid',id,'Product identity is absent or belongs to another vehicle.');continue;}
      const p=row.data,f=p.fitment||{},before=reasons.length,req=requirements(row,set,context);
      // Exact source-backed towbar predicates only; no free-text inference.
      const conditions=list(f.conditions);
      const towbarBlocked=(conditions.includes('factory tow bar required')&&context.factoryTowbar===false)||(conditions.includes('not compatible with Hayman Reese tow bars')&&context.towbarManufacturer==='Hayman Reese');
      const blocked=p.status==='blocked'||towbarBlocked||(list(f.compatibleVehicleIds).length&&!f.compatibleVehicleIds.includes(vehicleId))||list(f.excludedTrims).includes(context.trim)||list(f.excludedConfigurations).some(c=>list(context.configurations).includes(c));
      if(blocked) reason('fitment-blocked',id,'This item is incompatible or blocked for the selected vehicle/setup.',{sourceStatus:p.status});
      for(const otherId of ids) {
        if(otherId===id)continue;const other=rows.get(otherId);if(!other||other.vehicleId!==vehicleId)continue;
        if((p.group&&p.group===other.data.group)||list(f.conflicts).includes(other.data.id)||list(other.data.fitment?.conflicts).includes(p.id)) reason('conflict',id,`Remove ${other.data.name||otherId} before selecting ${p.name||id}.`,{conflictingId:otherId,action:{type:'remove',identity:otherId}});
      }
      for(const dependency of req.allOf) if(!set.has(dependency)) {
        const exists=rows.has(dependency);
        reason(exists?'all-of-missing':'dependency-unresolved',id,`Requires ${rows.get(dependency)?.data.name||dependency}.`,{requiredIdentity:dependency,additionMode:exists?'automatic':'staff-review'});
      }
      for(const choices of req.anyOf) if(!choices.some(c=>set.has(c))) reason('any-of-choice',id,'Choose one compatible supporting product; no alternative is selected automatically.',{alternatives:choices.map(c=>({identity:c,name:rows.get(c)?.data.name||c,available:rows.has(c)&&rows.get(c).data.status!=='blocked'})),additionMode:'explicit-customer-choice'});
      if(p.status!=='confirmed'||f.reviewRequired) reason('staff-review',id,'PRO4X4 review is required; draft selection is not fitment approval.',{sourceStatus:p.status||'unknown'});
      for(const condition of list(f.conditions)) reason('conditional-fitment',id,condition,{state:'unverified',sourceField:'fitment.conditions'});
      // Preserve every richer rule field as unresolved evidence until explicitly modeled.
      const handled=new Set(['source','vehicleRange','compatibleVehicleIds','requiredParts','anyOfRequiredParts','requiresAnyOf','reviewRequired','conflicts','conditions','optionalParts']);
      for(const [field,value] of Object.entries(f)) if(!handled.has(field)&&value!=null&&(!Array.isArray(value)||value.length)) reason('fitment-evidence-review',id,`Verify ${field} against the source evidence.`,{sourceField:`fitment.${field}`,evidence:copy(value)});
      for(const external of list(f.conflicts).filter(c=>!rows.has(key(vehicleId,c)))) reason('external-fitment-constraint',id,`Verify external constraint ${external}.`,{constraint:external});
      const price=p.pricing?p.pricing.parts:p.price;
      if(!Number.isFinite(price)) reason('price-unresolved',id,'Authoritative parts price remains unknown; no fixture price is substituted.');
      const own=reasons.slice(before),hard=own.some(r=>['fitment-blocked','conflict'].includes(r.code));
      const missing=own.some(r=>['all-of-missing','any-of-choice'].includes(r.code));
      products.push({identity:id,requirements:req,fitment:blocked?'blocked':own.some(r=>r.code==='staff-review')?'staff-review':own.some(r=>r.code.includes('fitment')||r.code==='dependency-unresolved')?'conditional':'confirmed',
        commercial:{selectable:!hard&&!missing,state:hard?'blocked':missing?'requires-prerequisite':own.length?'draft-review':'selectable',partsPrice:Number.isFinite(price)?price:null},
        visual:{eligible:false,state:blocked?'blocked':'unavailable',reason:'Production visual eligibility requires a governed exact asset/base; catalogue availability does not authorize rendering.'},reasons:own});
    }
    const hard=reasons.some(r=>['vehicle-unknown','identity-invalid','fitment-blocked','conflict'].includes(r.code));
    return {schemaVersion:1,engineVersion:'alpha94-stage4',vehicleId,selected:ids,products,reasons,
      outcome:hard?'blocked':reasons.some(r=>r.code==='any-of-choice')?'requires-choice':reasons.some(r=>r.code==='all-of-missing')?'requires-prerequisites':reasons.some(r=>r.code==='staff-review')?'staff-review':reasons.length?'needs-review':'ready',
      valid:reasons.length===0,commercialDraftAllowed:!hard&&!reasons.some(r=>['all-of-missing','any-of-choice'].includes(r.code)),productionVisualEligible:false};
  }
  function transition({vehicleId,selected=[],action,context={}}) {
    const original=unique(selected),next=new Set(original),added=[],removed=[];
    if(!action||!['add','remove'].includes(action.type)) throw new Error('Expected add/remove action');
    if(!rows.has(action.identity)||rows.get(action.identity).vehicleId!==vehicleId) return {applied:false,selected:original,automaticAdditions:[],cascadingRemovals:[],decision:evaluate({vehicleId,selected:[...original,action.identity],context})};
    if(action.type==='add') {
      next.add(action.identity);let changed=true;
      while(changed){changed=false;for(const id of [...next]){const row=rows.get(id);if(!row||row.vehicleId!==vehicleId)continue;for(const dep of requirements(row,next,context).allOf)if(rows.has(dep)&&!next.has(dep)){next.add(dep);added.push(dep);changed=true;}}}
    } else {
      next.delete(action.identity);let changed=true;
      // Cascade only dependencies made missing by this removal. Any-of dependants stay
      // selected with a choice gate, following WF1's stranded-alternative workflow.
      const lost=new Set([action.identity]);
      while(changed){changed=false;for(const id of [...next]){const row=rows.get(id);if(!row)continue;const req=requirements(row,new Set(original),context);if(req.allOf.some(dep=>lost.has(dep))){next.delete(id);lost.add(id);removed.push(id);changed=true;}}}
    }
    const decision=evaluate({vehicleId,selected:[...next],context});
    const applied=action.type==='remove'||(decision.outcome!=='blocked'&&!['requires-choice','requires-prerequisites'].includes(decision.outcome));
    return {applied,selected:applied?[...next].sort():original.sort(),automaticAdditions:applied?unique(added).sort():[],cascadingRemovals:unique(removed).sort(),decision};
  }
  return Object.freeze({evaluate,transition});
}
