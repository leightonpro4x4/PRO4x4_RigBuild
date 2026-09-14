(function(root,factory){
  const value=factory();
  if(typeof module==='object'&&module.exports) module.exports=value;
  else root.PRO4X4_WORKSTREAMS=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  return {
    version:'0.26.26',
    alpha:'Merged Alpha 26 — WF4 persisted canonical source-gap decision controls active',
    principles:{
      design:'PRO4X4 dark digital-workshop / premium 4WD retail interface',
      visualMilestone:'Nissan Patrol Y62 Warrior',
      catalogueMilestone:'Next-Gen Ranger',
      renderRule:'REFERENCE_BACKED_APPROVED_VISUALS_ONLY',
      promotionModel:'ONE_ALPHA_ONE_BACKBONE'
    },
    mergeGate:{
      branchPolicy:'workstream packages may advance independently but may not create separate product/runtime backbones',
      requiredChecks:[
        'package has exactly one owning workstream',
        'package includes verification evidence',
        'shared contracts remain backward-compatible or include a migration',
        'Y62 visual requests resolve exact approved / missing / blocked state with no unapproved fallback',
        'immutable project/revision/quote lineage remains intact',
        'WF5 regression gate passes before Alpha promotion'
      ]
    },
    workstreams:[
      {
        id:'WF1',name:'Customer Configurator / UX',status:'ACTIVE',priority:1,
        owns:['customer builder shell','category/manufacturer/product browsing','product cards','pre-selection dependency/conflict messaging','build summary','save/share/quote customer flow','visual preview eligibility messaging'],
        excludes:['supplier research','canonical visual approval','backend expansion not required by customer flow'],
        nextPackage:'A26-WF1-01 — finish category → manufacturer/vendor → product accordions, surface compatibility/dependency explanations before ADD, and expose visual state as approved / priced-only / staff-review.',
        dependencies:['existing merged Ranger/Y62 project contract','visual readiness status contract from WF3/WF4'],
        doneWhen:['customer can browse gear without flat-list overload','blocked/required/conflicting selections are explained before selection','visual preview never implies coverage that is not approved','save/share/quote regression remains green']
      },
      {
        id:'WF2',name:'Catalogue + Fitment Data',status:'ACTIVE',priority:2,
        owns:['supplier/product records','SKU/RRP/install/weight normalization','vehicle fitment','dependencies/conflicts','required fitting parts','staff review gates','visual-readiness metadata per product'],
        excludes:['customer layout/presentation','canonical render creation','quote UI'],
        nextPackage:'A26-WF2-01 — expand verified Next-Gen Ranger catalogue beyond the recovered 20 products and add visualisable / supportedViews / layerRequired / referenceAvailable fields to the shared product contract.',
        dependencies:['source-backed supplier data','visual metadata schema agreed with WF3/WF4'],
        doneWhen:['records are source-backed and deduplicated','vehicle applicability is explicit','unknown engineering/fitment states remain gated rather than inferred','every governed product has an explicit visual-readiness state']
      },
      {
        id:'WF3',name:'Y62 Visual Production',status:'REFERENCE_PACK_AVAILABLE',stage:'CANONICAL_SLOTS_READY',priority:3,
        owns:['Y62 source-reference intake','canonical render briefs','canonical master vehicle views','camera/view contracts','visual readiness matrix','asset provenance','candidate validation','production promotion','render delivery health'],
        excludes:['unverified AI approximation','direct promotion of third-party reference photos','catalogue/UX blocking'],
        nextPackage:'A26-WF3-01 — lock the 2025 Series 5 Y62 Warrior reference board from owner-supplied photos, classify third-party exact-vehicle images as reference-only, then issue canonical briefs for F34 / SIDE / R34.',
        dependencies:['owner approval for supplied photos as project reference','commercially safe reference/provenance records','clean side geometry source or verified multi-reference reconstruction'],
        doneWhen:['reference pack is provenance-logged','canonical brief is approved','F34/SIDE/R34 masters are reference-backed and reviewable','resolver returns available only for an approved canonical master or approved product layer']
      },
      {
        id:'WF4',name:'Platform / Staff Tools',status:'ACTIVE',stage:'CANONICAL_SOURCE_GAP_DECISION_V1',priority:4,
        owns:['staff catalogue/fitment editor','visual asset registry','reference/provenance intake','canonical view registry','review/approval workflow','render readiness controls','quote queue/project inspection','audit/production controls'],
        excludes:['speculative backend infrastructure','supplier content creation','customer visual design'],
        completedPackage:'A26-WF4-28 — required canonical geometry gaps now use a dedicated SHA-256 decision boundary. SIDE is OPEN against exact required owner-reference/view-pack evidence; generic review metadata cannot approve it. APPROVED reviewed-reconstruction requires locked view contract + checksum candidate + ready WF3 handoff + claimed reviewer + camera match. Explicit decisions stale on evidence drift and are never auto-rewritten by sync.',
        nextPackage:'A26-WF4-14B — exercise the sealed owner reference → Y62-F34-V1 canonical master → identified reviewer → immutable production → quote-inspection chain on the first clean WF3 candidate; do not promote unsupported geometry.',
        dependencies:['first WF3 canonical master candidate for end-to-end reviewer workflow','existing asset vault/version lineage'],
        doneWhen:['staff can inspect/edit governed fitment data','visual references and canonical masters are separately governed and persisted','owner reference sources are staff-only in hosted mode','changes are auditable','customer-facing contracts consume approved state only']
      },
      {
        id:'WF5',name:'QA / Integration Gate',status:'GATE',stage:'ACTIVE',priority:5,
        owns:['regression testing','integration verification','visual-governance validation','promotion decision','locked-package register'],
        excludes:['feature implementation','catalogue research','visual asset creation'],
        nextPackage:'A26-WF5-01 — add visual-governance acceptance tests, gate WF1–WF4 independently, then run the full Alpha chain before promotion.',
        dependencies:['candidate packages from WF1–WF4'],
        doneWhen:['package-specific acceptance tests pass','full regression chain passes','unapproved references/masters/layers cannot reach customer output','verified packages are locked unless a concrete regression is found']
      }
    ]
  };
});
