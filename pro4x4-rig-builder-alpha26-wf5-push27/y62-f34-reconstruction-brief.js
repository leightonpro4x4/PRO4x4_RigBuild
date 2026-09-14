(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Y62_F34_RECONSTRUCTION_BRIEF=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){return {
  schemaVersion:'0.26.3',
  briefId:'Y62-F34-V1-RECON',
  vehicleId:'nissan-y62-warrior-2025',
  vehicle:'2025 Series 5 Nissan Patrol Warrior',
  viewId:'front34',
  purpose:'Create a clean canonical master from owner-approved authenticity references; do not clone third-party listing artwork into production.',
  primaryReferenceIds:['OWNER-Y62-F34-01','OWNER-Y62-FRONT-03','OWNER-Y62-FRONT-04'],
  target:{canvas:{width:1672,height:615},background:'transparent',wheels:'factory Warrior',stance:'owner-reference-backed',body:'MY25 Series 5 Warrior',paint:'Black Obsidian',cameraProfileId:'Y62-F34-V1'},
  requiredGates:[
    {id:'identity',label:'MY25 Series 5 Warrior identity',required:true},
    {id:'geometry',label:'Canonical F34 camera/perspective match',required:true},
    {id:'body',label:'No invented body/fascia geometry',required:true},
    {id:'rolling-stock',label:'Factory Warrior wheel/tyre geometry preserved',required:true},
    {id:'transparency',label:'Clean alpha / zero source-background contamination',required:true},
    {id:'rights',label:'Production binary rights recorded as owned/licensed',required:true},
    {id:'overlay',label:'Manual locked-profile overlay verification',required:true},
    {id:'governance',label:'Reviewer state master-approved',required:true}
  ],
  candidatePolicy:{initialState:'master-draft',productionStatus:'candidate',fallbackPolicy:'none',prohibitUntil:['all required gates pass','server production gate passes','WF5 integration gate passes']},
  sideEffect:'This brief creates no production binary and does not alter customer render availability.'
};});
