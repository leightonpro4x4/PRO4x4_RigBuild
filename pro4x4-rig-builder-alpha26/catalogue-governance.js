(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PRO4X4_CATALOGUE_GOVERNANCE=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const POLICY_VERSION='0.26.8';
 const STATUSES=new Set(['confirmed','engineering','blocked']);
 const COMPONENTS=['parts','labour','paint','freight','engineering'];
 const VERIFIED_SOURCE_RE=/verified|authoritative|exact-sku|project-sourced|supplier-conflict-recorded/i;
 const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
 const text=v=>String(v??'').trim();
 const isFiniteNonNegative=v=>v==null||(Number.isFinite(Number(v))&&Number(v)>=0);
 const issue=(severity,code,field,message,recordId=null)=>({severity,code,field,message,recordId});
 const normaliseIds=v=>Array.isArray(v)?v.map(text).filter(Boolean):[];
 function validUrl(v){try{const u=new URL(text(v));return ['http:','https:'].includes(u.protocol)}catch{return false}}
 function sourceChecked(a){return VERIFIED_SOURCE_RE.test(text(a?.source?.verification))}
 function validateRecord(a,snapshot={},index=0){
   const id=text(a?.id)||`#${index+1}`,errors=[],warnings=[],vehicleId=text(snapshot?.vehicleId||snapshot?.vehicle?.id);
   const addE=(code,field,message)=>errors.push(issue('error',code,field,message,id));
   const addW=(code,field,message)=>warnings.push(issue('warning',code,field,message,id));
   for(const k of ['id','brand','name','sku','category','status','layer'])if(!text(a?.[k]))addE('required',k,`${k} is required`);
   if(!STATUSES.has(a?.status))addE('invalid_status','status','status must be confirmed, engineering or blocked');
   const pricing=a?.pricing;
   if(!pricing||typeof pricing!=='object'||Array.isArray(pricing))addE('pricing_required','pricing','pricing object is required');
   for(const k of COMPONENTS){const v=pricing?.[k];if(!isFiniteNonNegative(v))addE('invalid_price',`pricing.${k}`,`${k} price must be blank or ≥ 0`)}
   const pricingRequired=Array.isArray(a?.pricingRequired)?a.pricingRequired:[];
   for(const k of pricingRequired)if(!COMPONENTS.includes(k))addE('invalid_pricing_component','pricingRequired',`unknown required pricing component: ${k}`);
   if(new Set(pricingRequired).size!==pricingRequired.length)addE('duplicate_pricing_component','pricingRequired','required pricing components must be unique');
   const fit=a?.fitment;
   if(!fit||typeof fit!=='object'||Array.isArray(fit))addE('fitment_required','fitment','fitment object is required');
   const compatible=normaliseIds(fit?.compatibleVehicleIds),required=normaliseIds(fit?.requiredParts),anyOf=normaliseIds(fit?.anyOfRequiredParts),allIds=new Set((snapshot?.accessories||[]).map(x=>text(x?.id)).filter(Boolean));
   if(!Array.isArray(fit?.compatibleVehicleIds))addE('compatible_vehicle_array','fitment.compatibleVehicleIds','compatible vehicle list is required');
   if(fit?.requiredParts!=null&&!Array.isArray(fit.requiredParts))addE('required_parts_array','fitment.requiredParts','requiredParts must be an array');
   if(fit?.anyOfRequiredParts!=null&&!Array.isArray(fit.anyOfRequiredParts))addE('any_of_parts_array','fitment.anyOfRequiredParts','anyOfRequiredParts must be an array');
   if(fit?.conflicts!=null&&!Array.isArray(fit.conflicts))addE('conflicts_array','fitment.conflicts','conflicts must be an array');
   if(fit?.conditions!=null&&!Array.isArray(fit.conditions))addE('conditions_array','fitment.conditions','conditions must be an array');
   if(a?.status==='confirmed'&&vehicleId&&!compatible.includes(vehicleId))addE('confirmed_vehicle_unproven','fitment.compatibleVehicleIds',`confirmed item must explicitly include active vehicle ${vehicleId}`);
   if(['engineering','blocked'].includes(a?.status)&&fit?.reviewRequired!==true)addE('review_gate_required','fitment.reviewRequired',`${a.status} item must retain a staff review gate`);
   if(a?.status==='confirmed'&&fit?.reviewRequired===true)addW('confirmed_review_gate','fitment.reviewRequired','confirmed item still requires staff review; certainty is intentionally not inferred');
   for(const dep of required){
     if(dep===text(a?.id))addE('self_dependency','fitment.requiredParts','product cannot require itself');
     else if(!allIds.has(dep)){
       const msg=`required fitting part is not a selectable catalogue ID: ${dep}`;
       if(a?.status==='confirmed')addE('unknown_required_part','fitment.requiredParts',msg);else addW('unresolved_required_part','fitment.requiredParts',`${msg}; retained under ${a?.status||'review'} state`);
     }
   }
   if(anyOf.length){
     const unique=[...new Set(anyOf)];
     if(unique.length!==anyOf.length)addE('duplicate_any_of_part','fitment.anyOfRequiredParts','anyOfRequiredParts must contain unique catalogue IDs');
     for(const dep of anyOf){
       if(dep===text(a?.id))addE('self_dependency','fitment.anyOfRequiredParts','product cannot require itself');
       else if(!allIds.has(dep)){
         const msg=`alternative fitting part is not a selectable catalogue ID: ${dep}`;
         if(a?.status==='confirmed')addE('unknown_any_of_part','fitment.anyOfRequiredParts',msg);else addW('unresolved_any_of_part','fitment.anyOfRequiredParts',`${msg}; retained under ${a?.status||'review'} state`);
       }
     }
   }
   const src=a?.source;
   if(!text(src?.authority))addE('source_authority_required','source.authority','source authority is required');
   if(!text(src?.url))addE('source_url_required','source.url','source URL is required');else if(!validUrl(src.url))addE('source_url_invalid','source.url','source URL must be a valid http(s) URL');
   if(!text(src?.verification))addE('source_verification_required','source.verification','source verification state is required');
   if(!sourceChecked(a))addW('source_not_independently_verified','source.verification','source is not marked independently verified; retain engineering/review state unless evidence supports certainty');
   const req=pricingRequired.length?pricingRequired:COMPONENTS,pricingGaps=req.filter(k=>pricing?.[k]==null);
   if(pricingGaps.length)addW('pricing_incomplete','pricing',`${pricingGaps.length} required pricing component${pricingGaps.length===1?' is':'s are'} still quote-only: ${pricingGaps.join(', ')}`);
   if(a?.weightKg!=null&&!isFiniteNonNegative(a.weightKg))addE('invalid_weight','weightKg','weight must be blank or ≥ 0');
   const min=a?.install?.estimateHoursMin,max=a?.install?.estimateHoursMax;
   if(min!=null&&!isFiniteNonNegative(min))addE('invalid_install_min','install.estimateHoursMin','minimum install hours must be blank or ≥ 0');
   if(max!=null&&!isFiniteNonNegative(max))addE('invalid_install_max','install.estimateHoursMax','maximum install hours must be blank or ≥ 0');
   if(min!=null&&max!=null&&Number(min)>Number(max))addE('install_range_invalid','install','minimum install hours cannot exceed maximum install hours');
   return {id,errors,warnings,summary:{blocking:errors.length,warnings:warnings.length,sourceChecked:sourceChecked(a),pricingGapCount:pricingGaps.length,requiredPartCount:required.length,anyOfRequiredPartCount:anyOf.length}};
 }
 function validateCatalogue(snapshot,{vehicleId}={}){
   const s=snapshot||{},effectiveVehicle=text(vehicleId||s.vehicleId||s.vehicle?.id),errors=[],warnings=[],accessories=Array.isArray(s.accessories)?s.accessories:[];
   if(!effectiveVehicle)errors.push(issue('error','vehicle_required','vehicleId','catalogue vehicleId is required'));
   if(text(s.vehicleId)&&effectiveVehicle&&text(s.vehicleId)!==effectiveVehicle)errors.push(issue('error','vehicle_mismatch','vehicleId',`catalogue vehicleId ${text(s.vehicleId)} does not match ${effectiveVehicle}`));
   if(!accessories.length)errors.push(issue('error','accessories_required','accessories','at least one accessory is required'));
   const records=accessories.map((a,i)=>validateRecord(a,{...s,vehicleId:effectiveVehicle},i));
   for(const r of records){errors.push(...r.errors);warnings.push(...r.warnings)}
   const byId=new Map(),bySku=new Map();
   accessories.forEach((a,i)=>{
     const id=text(a?.id),sku=text(a?.sku).toLowerCase(),recordId=id||`#${i+1}`;
     if(id){if(byId.has(id)){const msg=`duplicate catalogue ID: ${id}`;errors.push(issue('error','duplicate_id','id',msg,recordId));errors.push(issue('error','duplicate_id','id',msg,byId.get(id)))}else byId.set(id,recordId)}
     if(sku){if(bySku.has(sku)){const msg=`duplicate SKU: ${text(a?.sku)}`;errors.push(issue('error','duplicate_sku','sku',msg,recordId));errors.push(issue('error','duplicate_sku','sku',msg,bySku.get(sku)))}else bySku.set(sku,recordId)}
   });
   const uniqueIssues=list=>{const seen=new Set();return list.filter(x=>{const k=[x.severity,x.code,x.field,x.message,x.recordId||''].join('|');if(seen.has(k))return false;seen.add(k);return true})};
   const e=uniqueIssues(errors),w=uniqueIssues(warnings),recordMap=new Map(records.map(r=>[r.id,r]));
   for(const x of e){if(x.recordId&&recordMap.has(x.recordId)&&!recordMap.get(x.recordId).errors.some(y=>y.code===x.code&&y.message===x.message))recordMap.get(x.recordId).errors.push(x)}
   for(const x of w){if(x.recordId&&recordMap.has(x.recordId)&&!recordMap.get(x.recordId).warnings.some(y=>y.code===x.code&&y.message===x.message))recordMap.get(x.recordId).warnings.push(x)}
   return {schemaVersion:POLICY_VERSION,policy:'source-backed-catalogue-fitment-governance',vehicleId:effectiveVehicle,accessoryCount:accessories.length,blocking:e.length>0,errors:e,warnings:w,records,summary:{errors:e.length,warnings:w.length,confirmed:accessories.filter(a=>a?.status==='confirmed').length,engineering:accessories.filter(a=>a?.status==='engineering').length,blocked:accessories.filter(a=>a?.status==='blocked').length,staffReview:accessories.filter(a=>a?.fitment?.reviewRequired===true).length,sourceChecked:accessories.filter(sourceChecked).length,pricingGapRecords:records.filter(r=>r.summary.pricingGapCount>0).length}};
 }
 function stamp(snapshot,{vehicleId,actor=null,stage='draft',at=null}={}){
   const out=clone(snapshot||{}),validation=validateCatalogue(out,{vehicleId});
   const when=at||new Date().toISOString(),who=actor?{actorId:text(actor.actorId)||null,displayName:text(actor.displayName)||null,role:text(actor.role)||null}:null;
   out.governance={...(out.governance||{}),policy:validation.policy,policyVersion:POLICY_VERSION,validation:{stage,validatedAt:when,validatedBy:who,blocking:validation.blocking,summary:clone(validation.summary),errors:clone(validation.errors),warnings:clone(validation.warnings)}};
   return {snapshot:out,validation};
 }
 function gateError(validation,stage='publish'){
   const e=new Error(`Catalogue ${stage} blocked by ${validation?.summary?.errors||0} governance error${validation?.summary?.errors===1?'':'s'}`);e.status=422;e.code='catalogue_governance_blocked';e.fieldErrors=(validation?.errors||[]).map(x=>({field:x.recordId?`accessories.${x.recordId}.${x.field}`:x.field,message:x.message,code:x.code}));e.validation=validation;return e;
 }
 return {schemaVersion:POLICY_VERSION,policyVersion:POLICY_VERSION,components:[...COMPONENTS],statuses:[...STATUSES],sourceChecked,validateRecord,validateCatalogue,stamp,gateError};
});
