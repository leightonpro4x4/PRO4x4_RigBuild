window.Y62_RENDER_CONTRACTS = {
  schemaVersion:'0.22.0',
  vehicleId:'nissan-y62-warrior-2025',
  stateModel:{
    version:'Y62-STATE-V1',
    dimensions:{
      paint:{selectionField:'paint',layerId:'base',assetStateField:'paintId',required:true},
      wheelTyre:{selectionField:'wheelTyre',layerId:'wheels',assetStateField:'wheelTyreId',required:true}
    },
    policy:'Exact state match is required for state-bound layers. A different paint or wheel state is never a visual substitute.'
  },
  contracts:{
    front34:{
      contractId:'Y62-F34-CONTRACT-V2', cameraProfileId:'Y62-F34-V1', width:1672, height:615,
      requiredOrder:['base','stance','wheels','front','electrical-front','roof','sides'],
      requiredCore:['base','wheels'],
      optionalBySelection:['stance','front','electrical-front','roof','sides'],
      stateBindings:{base:{paintId:'$paint'},wheels:{wheelTyreId:'$wheelTyre'}},
      selectableStatePolicy:'validated-selections-may-be-chosen-even-when-visual-is-missing',
      preloadPolicy:'base-first-then-z-order',
      loadPolicy:{maxAttempts:3,retryDelaysMs:[0,350,900],timeoutMs:8000,telemetry:true},
      failurePolicy:'show-explicit-missing-or-load-failed-state-never-substitute',
      notes:'Customer production stack must contain only exact server-approved binaries on the locked Y62 front 3/4 canvas, including exact paint and wheel/tyre state.'
    },
    side:{contractId:'Y62-SIDE-CONTRACT-V1',cameraProfileId:null,requiredOrder:['base','stance','wheels','sides','roof','front','rear'],requiredCore:['base','wheels'],optionalBySelection:['stance','sides','roof','front','rear'],stateBindings:{base:{paintId:'$paint'},wheels:{wheelTyreId:'$wheelTyre'}},preloadPolicy:'base-first-then-z-order',loadPolicy:{maxAttempts:3,retryDelaysMs:[0,350,900],timeoutMs:8000,telemetry:true},failurePolicy:'show-explicit-missing-or-load-failed-state-never-substitute',status:'calibration-pending'},
    rear34:{contractId:'Y62-R34-CONTRACT-V1',cameraProfileId:null,requiredOrder:['base','stance','wheels','rear','rear-wheel','rear-jerry','rear-camera','roof'],requiredCore:['base','wheels'],optionalBySelection:['stance','rear','rear-wheel','rear-jerry','rear-camera','roof'],stateBindings:{base:{paintId:'$paint'},wheels:{wheelTyreId:'$wheelTyre'}},preloadPolicy:'base-first-then-z-order',loadPolicy:{maxAttempts:3,retryDelaysMs:[0,350,900],timeoutMs:8000,telemetry:true},failurePolicy:'show-explicit-missing-or-load-failed-state-never-substitute',status:'calibration-pending'}
  }
};
