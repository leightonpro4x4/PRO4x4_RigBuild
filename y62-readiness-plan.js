(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Y62_READINESS_PLAN=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const vehicleId='nissan-y62-warrior-2025';
  const views=[
    {id:'front34',label:'3/4 FRONT',cameraProfileId:'Y62-F34-V1',cameraState:'locked',launchPriority:1},
    {id:'side',label:'SIDE',cameraProfileId:'Y62-SIDE-V1',cameraState:'reference-calibration',launchPriority:2},
    {id:'rear34',label:'REAR 3/4',cameraProfileId:'Y62-R34-V1',cameraState:'reference-calibration',launchPriority:3}
  ];
  const paints=[
    {id:'black-obsidian',label:'Black Obsidian',validated:true,priority:1},
    {id:'gun-metallic',label:'Gun Metallic',validated:true,priority:2},
    {id:'moonstone-white',label:'Moonstone White',validated:true,priority:3},
    {id:'brilliant-silver',label:'Brilliant Silver',validated:true,priority:4}
  ];
  const wheelTyres=[
    {id:'factory-warrior',label:'Warrior 18 × 9J + 295/70R18 G015',validated:true,sku:'FACTORY-WARRIOR-18X9-G015',priority:1}
  ];
  function safeId(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
  function expectedSlots(){
    const slots=[];
    for(const view of views){
      for(const paint of paints.filter(x=>x.validated))slots.push({slotId:`${view.id}:base:paint:${paint.id}`,vehicleId,viewId:view.id,layerId:'base',exactSku:null,stateType:'paint',stateId:paint.id,stateKey:`paint:${paint.id}`,renderState:{paintId:paint.id},label:`${view.label} · ${paint.label} base`,cameraProfileId:view.cameraProfileId,cameraState:view.cameraState,assetIdHint:`Y62-${safeId(view.id)}-BASE-PAINT-${safeId(paint.id)}`,launchPriority:view.launchPriority*10+paint.priority});
      for(const wheel of wheelTyres.filter(x=>x.validated))slots.push({slotId:`${view.id}:wheels:wheel:${wheel.id}`,vehicleId,viewId:view.id,layerId:'wheels',exactSku:wheel.sku,stateType:'wheelTyre',stateId:wheel.id,stateKey:`wheel:${wheel.id}`,renderState:{wheelTyreId:wheel.id},label:`${view.label} · ${wheel.label}`,cameraProfileId:view.cameraProfileId,cameraState:view.cameraState,assetIdHint:`Y62-${safeId(view.id)}-WHEELS-${safeId(wheel.id)}`,launchPriority:view.launchPriority*10+wheel.priority});
    }
    return slots.sort((a,b)=>a.launchPriority-b.launchPriority||a.slotId.localeCompare(b.slotId));
  }
  const thresholds={telemetryWindowHours:24,green:{loadSuccessRateMin:0.99,retryRateMax:0.02},amber:{loadSuccessRateMin:0.95,retryRateMax:0.08}};
  return {schemaVersion:'0.23.0',vehicleId,views,paints,wheelTyres,thresholds,expectedSlots};
});
