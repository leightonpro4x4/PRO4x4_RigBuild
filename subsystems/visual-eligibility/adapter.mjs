export const assets={base:'ranger-static-front-rear.glb',factoryFront:'factory-front.glb',factoryRear:'factory-rear.glb',predator:'predator.glb',rally:'rally-hoop-v3.glb',lights:'butt-kicker-7-pair-v1.glb',scout:'scout.glb',powerboards:'powerboards.glb',tubrack:'tubrack.glb',rearbumper:'rearbumper.glb'};
// Only caller-supplied, trusted production records can elevate the preserved preview.
// This stage supplies no approvals, and never derives them from mesh load success.
export function eligibility({decision,mapping,profile='catalogue',trustedApprovals=[],assetHashes={}}) {
  const ranger=profile==='checkpoint'?decision.vehicleId==='alpha93-regression-only':decision.vehicleId===mapping.vehicleId;
  const state={vehicleId:decision.vehicleId,profile,baseState:ranger?'preview':'unavailable',productionApproved:false,fallback:'none',layers:{}};
  for(const [layer,file] of Object.entries(assets))state.layers[layer]={file,visible:false,state:'unavailable'};
  if(!ranger)return state;
  if(decision.outcome==='blocked'){state.baseState='blocked';for(const l of Object.values(state.layers))l.state='blocked';return state;}
  const selected=new Set(decision.selected);
  for(const row of mapping.mappings){
    const id=profile==='checkpoint'?`alpha93-regression-only::${row.visualProductId}`:row.catalogueIdentity;
    const product=decision.products.find(p=>p.identity===id);
    const denied=product?.reasons.some(r=>['fitment-blocked','conflict','all-of-missing','any-of-choice','identity-invalid'].includes(r.code));
    const layer=state.layers[row.visualProductId];
    layer.visible=!!id&&selected.has(id)&&!!product&&!denied;
    layer.state=denied?'blocked':id?'preview':'unavailable';
  }
  // Exact Alpha93 mesh placement contract, not commercial dependency rules.
  // Toro/other mount geometry has no matching asset: suppress, never auto-add parts.
  for(const [layer,mounts] of Object.entries({rally:['predator'],lights:['predator','rally']}))if(state.layers[layer].visible&&!mounts.every(m=>state.layers[m].visible)){
    state.layers[layer].visible=false;state.layers[layer].state='unavailable';state.layers[layer].reason='No exact preserved asset for the selected mounting assembly.';
  }
  state.layers.base.visible=true;
  state.layers.factoryFront.visible=!state.layers.predator.visible;
  state.layers.factoryRear.visible=!state.layers.rearbumper.visible;
  for(const name of ['base','factoryFront','factoryRear'])state.layers[name].state='preview';
  for(const layer of Object.values(state.layers)){
    const approval=trustedApprovals.find(a=>a.status==='production-approved'&&a.recordId&&a.vehicleId===decision.vehicleId&&a.file===layer.file&&a.sha256&&a.sha256===assetHashes[layer.file]);
    if(approval&&layer.state==='preview')layer.state='approved';
  }
  state.baseState=state.layers.base.state;
  state.productionApproved=Object.values(state.layers).filter(l=>l.visible).every(l=>l.state==='approved');
  return state;
}
