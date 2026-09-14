(function(root,factory){
  const value=factory();
  if(typeof module==='object'&&module.exports) module.exports=value;
  else root.PRO4X4_WORKSTREAMS=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  return {
    version:'0.26.21',
    alpha:'Merged Alpha 26 — WF4 persisted visual-governance package active',
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
        id:'WF3',name:'Y62 Visual Production',status:'F34_PRO_RECON_HANDOFF_READY',stage:'F34_PRO_RECON_HANDOFF_READY',cameraTransferStage:'F34_CANDIDATE05_CAMERA_TRANSFER_READY',reviewPipelineStage:'F34_CANDIDATE05_REVIEW_PIPELINE_READY',promotionReadinessStage:'F34_CANDIDATE05_PROMOTION_READINESS_READY',referenceIntakeStage:'EXTERNAL_3D_REFERENCE_ONLY_UNRESOLVED',secondaryStage:'SIDE_SOURCE_GAP_CONFIRMED',tertiaryStage:'R34_CANDIDATE05_EDGE_REVIEW_REQUIRED',priority:3,
        owns:['Y62 source-reference intake','canonical render briefs','canonical master vehicle views','camera/view contracts','visual readiness matrix','asset provenance','candidate validation','production promotion','render delivery health'],
        excludes:['unverified AI approximation','direct promotion of third-party reference photos','catalogue/UX blocking'],
        completedPackage:'F34 cumulative gate state — Y62-F34-V1-CANDIDATE05-INTAKE-01 remains ready; Y62-F34-V1-EXTERNAL-3D-REFERENCE-INTAKE-01 remains reference-only unresolved; A26-WF3-16/F34 adds Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01, checksum-locking the owner-backed 1672×615 coordinate frame, Candidate 04 alpha/silhouette mask and source-registration evidence for Candidate 05 without authorising warp, reframe, external geometry promotion or production use. A26-WF3-17/F34 adds Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01, which refuses inherited Candidate 04 approval and prepares fresh exact-checksum owner overlay + identified semantic review generation only after valid Candidate 05 intake. A26-WF3-20/F34 adds Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01, a fail-closed exact-checksum bridge to WF5 that requires owner-backed semantic PASS, production-binary rights and identified canonical master approval while retaining zero authority to promote or write production state.',
        secondaryCompletedPackage:'A26-WF3-12/SIDE — Y62-SIDE-V1-OWNER-REFERENCE-INTAKE-01 reverified the complete owner pack, classified the derivative design-board side view as reference-only, locked a no-warp/no-generative-geometry SIDE camera contract, and confirmed that no SIDE candidate can be created from the current evidence without guessing.',
        tertiaryCompletedPackage:'A26-WF3-27/R34 — Y62-R34-V1-CANDIDATE05-SECOND-TARGETED-ALPHA-CLEANUP-01 creates checksum-new Candidate 05 from exact Candidate 04 under Y62-R34-V1-CANDIDATE04-EDGE-REVIEW-01 authority. Cleanup is alpha-subtractive only inside the two residual owner-evidenced source-scene zones: 1,099 support pixels removed, 0 added, 1,099 alpha bytes changed, retained owner-source RGB remains 100% exact, and no RGB retouch, perspective warp, non-uniform scale, synthetic geometry, external production pixels or production promotion occurred. Fresh exact-checksum Candidate 05 edge review is required.',
        nextPackage:'A26-WF3-21/F34 — receive Y62-F34-V1-CANDIDATE-05 plus its completed intake manifest, run deterministic intake, then execute Y62-F34-V1-CANDIDATE05-REVIEW-PIPELINE-01 to generate fresh exact-checksum owner overlay/reviewer evidence; if that exact binary passes review/rights/master approval, evaluate Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01 before WF5. The Sketchfab source remains reference-only unresolved; SIDE remains source-blocked; R34 Candidate 05 second targeted alpha cleanup is generated from exact Candidate 04 under its exact-checksum return authority; it remains non-production and now requires fresh exact-checksum edge review before any neutral/professional reconstruction.',
        dependencies:['exact Sketchfab short-link target/model ID and licence/rights record if the external 3D source is to be used beyond reference-only','professionally reconstructed Candidate 05 returned against Y62-F34-V1-PRO-RECON-HANDOFF-01','completed Y62-F34-V1-CANDIDATE05-INTAKE-01 manifest with identified retoucher/provenance and explicit production-binary rights state','Y62-F34-V1-CAMERA-TRANSFER-CONTRACT-01 exact coordinate-frame/alpha PASS','deterministic binary/alpha intake PASS','fresh exact-checksum overlay/reviewer evidence for Candidate 05','Y62-F34-V1-CANDIDATE05-PROMOTION-READINESS-01 PASS against the exact Candidate 05 checksum',
            'WF5 exact-checksum promotion gate only after master approval','Y62-SIDE-V1-OWNER-REFERENCE-INTAKE-01 confirms clean raw square-on side geometry source is still missing','R34 Candidate 05 second targeted alpha cleanup exists and must pass fresh exact-checksum edge review; production camera lock remains blocked by clean reconstruction and accepted F34-family alignment'],
        doneWhen:['reference pack is provenance-logged','canonical brief is approved','F34/SIDE/R34 masters are reference-backed and reviewable','resolver returns available only for an approved canonical master or approved product layer']
      },
      {
        id:'WF4',name:'Platform / Staff Tools',status:'ACTIVE',stage:'PERSISTED_VISUAL_GOVERNANCE_V2',priority:4,
        owns:['staff catalogue/fitment editor','visual asset registry','reference/provenance intake','canonical view registry','review/approval workflow','render readiness controls','quote queue/project inspection','audit/production controls'],
        excludes:['speculative backend infrastructure','supplier content creation','customer visual design'],
        completedPackage:'A26-WF4-01 — persist owner reference packs and canonical-master slots into the hosted registry, with idempotent sync, protected staff-only reference delivery, class/governance filtering and evidence visibility.',
        nextPackage:'A26-WF4-02 — bind immutable candidate-version promotion to explicit master-approved / layer-approved governance transitions and reviewer audit evidence once WF3 supplies the first Y62-F34-V1 master candidate.',
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
