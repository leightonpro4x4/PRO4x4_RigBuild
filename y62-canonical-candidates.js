(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Y62_CANONICAL_CANDIDATES=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const candidates={
    front34:{
      candidateId:'Y62-F34-V1-CANDIDATE-01',
      briefId:'Y62-F34-V1',
      vehicleId:'nissan-y62-warrior-2025',
      viewId:'front34',
      assetClass:'canonical-master',
      governance:{state:'master-draft'},
      candidateType:'owner-source-normalized-geometry-board',
      source:'assets/y62-canonical-candidates/Y62-F34-V1-owner-source-v01.jpg',
      file:{mimeType:'image/jpeg',width:1672,height:615,hasAlpha:false,checksumSha256:'9fbd9aa622de77dba6ff016a8fdd6833b6e0c8f44dea051e5cac8e7bbaca8110'},
      provenance:{
        sourceType:'owner-reference-derived',
        rights:'owner-project-approved',
        primaryReferenceId:'OWNER-Y62-F34-01',
        referenceIds:['OWNER-Y62-F34-01','OWNER-Y62-F34-02','OWNER-Y62-FRONT-01'],
        transformation:'source image scaled and centred on the locked 1672×615 review canvas; no body geometry, wheel geometry, trim or accessory pixels synthesized',
        productionUse:'prohibited-until-master-approved'
      },
      review:{
        state:'ready-for-manual-review',
        purpose:'Lock F34 camera/perspective/stance against genuine owner evidence before transparent canonical reconstruction.',
        checks:[
          {id:'identity',label:'MY25 Series 5 Warrior identity/body/fascia matches owner vehicle',state:'evidence-backed'},
          {id:'wheels',label:'Factory Warrior wheel/tyre state is genuine owner-source geometry',state:'evidence-backed'},
          {id:'stance',label:'Warrior/Premcar stance is represented without synthetic change',state:'evidence-backed'},
          {id:'camera',label:'Perspective acceptable as the F34 canonical family target',state:'manual-review-required'},
          {id:'isolation',label:'Transparent background produced and edge quality approved',state:'not-started'},
          {id:'reconstruction',label:'Clean canonical master reconstructed without source background/reflections',state:'not-started'},
          {id:'overlay',label:'Manual overlay against locked F34 profile passed',state:'not-started'}
        ],
        blockers:['candidate is background-preserving JPEG, not a transparent production master','manual camera/perspective approval required before reconstruction'],
        nextAction:'Use this owner-backed geometry board as the locked visual target for the first transparent Y62-F34-V1 canonical reconstruction candidate.'
      }
    }
  };
  function get(viewId){return candidates[viewId]||null}
  function list(){return Object.values(candidates)}
  function productionEligible(c){return ['master-approved','production-live'].includes(c?.governance?.state)&&c?.file?.hasAlpha===true}
  return {schemaVersion:'0.26.2',candidates,get,list,productionEligible};
});
