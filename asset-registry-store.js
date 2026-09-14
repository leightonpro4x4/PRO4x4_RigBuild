(function(){
  const KEY='asset-registry:y62:v2';
  const P=window.PRO4X4_PERSISTENCE?.local;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const now=()=>new Date().toISOString();
  const camera={front34:'Y62-F34-V1',side:'Y62-SIDE-V1',rear34:'Y62-R34-V1'};
  function fromReferences(){
    const pack=window.Y62_REFERENCE_PACK;if(!pack?.references)return[];
    return pack.references.map(r=>({
      schemaVersion:'0.26.2',assetId:r.id,assetClass:'reference',vehicleId:pack.vehicleId,viewId:r.view,layerId:'reference',exactSku:null,status:'reference-only',source:r.file,
      provenance:{sourceType:r.sourceType,sourceUrl:null,licenceStatus:r.rights,licenceNote:pack.usageBasis,capturedAt:null},
      file:{checksumSha256:r.sha256,mimeType:'image/jpeg',width:r.width,height:r.height,hasAlpha:false},
      cameraGeometry:{profileId:null,matched:false,notes:`${r.quality} authenticity/reference evidence; not a production render layer.`},
      fitmentScope:[pack.vehicleId],approval:{state:'approved-reference',approvedBy:'owner-source-intake',approvedAt:null,notes:'Reference evidence only.'},
      governance:{state:'reference-approved'},history:[{at:now(),action:'reference.registered',note:'Owner reference registered as authenticity evidence.'}]
    }));
  }
  function canonicalSlots(){
    const briefs=window.Y62_CANONICAL_BRIEFS?.briefs||{};
    return Object.entries(briefs).map(([viewId,b])=>({
      schemaVersion:'0.26.2',assetId:`${b.briefId}-MASTER`,assetClass:'canonical-master',vehicleId:b.vehicleId,viewId,layerId:'base',exactSku:null,status:'candidate',source:null,
      provenance:{sourceType:'reference-derived-canonical',sourceUrl:null,licenceStatus:'pending-render',licenceNote:'Canonical master must be newly created from approved references; raw references are not production layers.',capturedAt:null,referenceIds:[...(b.referenceIds||[])]},
      file:{checksumSha256:null,mimeType:null,width:b.canvas?.width||null,height:b.canvas?.height||null,hasAlpha:null},
      cameraGeometry:{profileId:b.briefId,matched:false,notes:b.camera},fitmentScope:[b.vehicleId,'vehicle-state'],
      approval:{state:'not-reviewed',approvedBy:null,approvedAt:null,notes:b.reviewGate||'Awaiting canonical master candidate.'},
      governance:{state:'master-draft'},history:[{at:now(),action:'canonical.slot-created',note:`Governed canonical slot created from ${b.briefId}; no image promoted.`}]
    }));
  }
  function fromManifest(){
    const manifest=window.Y62_RENDER_MANIFEST,records=[];
    Object.entries(manifest.views).forEach(([viewId,view])=>view.layers.forEach((layer,index)=>{
      records.push({
        schemaVersion:'0.26.2',assetId:`Y62-${viewId.toUpperCase()}-${String(index+1).padStart(2,'0')}-${layer.id.toUpperCase()}`,
        assetClass:layer.id==='base'||layer.id==='wheels'?'canonical-master':'product-layer',vehicleId:manifest.vehicleId,viewId,layerId:layer.id,exactSku:layer.exactSku||null,status:layer.status,source:layer.source||null,
        provenance:{sourceType:layer.source?'pro4x4-existing-project':'unknown',sourceUrl:null,licenceStatus:layer.source?'reference-only':'unknown',
          licenceNote:layer.source?'Existing project image is retained as reference evidence only until independently approved under v2 governance.':'Source and usage rights must be recorded before candidate approval.',capturedAt:manifest.sourceReview.reviewedAt||null},
        file:{checksumSha256:null,mimeType:layer.source?.endsWith('.png')?'image/png':null,width:null,height:null,hasAlpha:null},
        cameraGeometry:{profileId:camera[viewId],matched:false,notes:'Must be matched to the locked Y62 canonical view before production approval.'},
        fitmentScope:[manifest.vehicleId,layer.exactSku||'vehicle-state'],
        approval:{state:layer.status==='reference-only'?'approved-reference':'not-reviewed',approvedBy:null,approvedAt:null,notes:layer.note||''},
        governance:{state:layer.status==='reference-only'?'reference-only':layer.status==='blocked-fitment'?'blocked':'held'},
        history:[{at:now(),action:'registry.seeded',note:`Seeded from Y62 render manifest status: ${layer.status}.`}]
      });
    }));
    return [...fromReferences(),...canonicalSlots(),...records];
  }
  function load(){const saved=P?.get(KEY,null);return Array.isArray(saved)&&saved.length?saved:fromManifest()}
  function save(records){P?.set(KEY,records);return records}
  function upsert(record){const records=load(),i=records.findIndex(x=>x.assetId===record.assetId),next=clone(record);next.schemaVersion='0.26.2';next.history=[...(next.history||[]),{at:now(),action:'asset.updated',note:'Asset registry record updated.'}];if(i>=0)records[i]=next;else records.push(next);save(records);return next}
  function summary(records=load()){const out={total:records.length,reference:0,'canonical-master':0,'product-layer':0,productionEligible:0};for(const r of records){out[r.assetClass]=(out[r.assetClass]||0)+1;if(window.PRO4X4_VISUAL_GOVERNANCE?.productionEligible?.(r))out.productionEligible++}return out}
  window.PRO4X4_ASSET_REGISTRY={schemaVersion:'0.26.2',fromManifest,fromReferences,canonicalSlots,load,save,upsert,summary};
})();
