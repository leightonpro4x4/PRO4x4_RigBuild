(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_CANONICAL_CANDIDATE_REVIEW=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  schemaVersion:'0.26.2',vehicleId:'nissan-y62-warrior-2025',viewId:'front34',briefId:'Y62-F34-V1',reviewId:'Y62-F34-V1-PREFLIGHT-001',status:'rejected-preflight',
  sourceReferenceId:'Y62-OWNER-F34-IMG4030',sourceFile:'references/y62-owner/IMG_4030.jpeg',attemptFile:'assets/rejected/Y62-F34-V1-owner-photo-cutout-preflight-rejected.png',
  process:'Owner-supplied exact-vehicle photo normalized to the locked 1672x615 canvas with automated subject isolation. No geometry was invented or synthesized.',
  findings:[
    {gate:'vehicle identity',result:'pass',note:'Exact owner-supplied 2025 Series 5 Y62 Warrior reference.'},
    {gate:'canvas',result:'pass',note:'Candidate normalized to 1672x615.'},
    {gate:'transparent isolation',result:'fail',note:'Automated segmentation retained shed/concrete background contamination; candidate is not safe for product-layer compositing.'},
    {gate:'camera match',result:'hold',note:'Useful front 3/4 reference, but perspective must be normalized in the canonical render rather than treated as a locked camera match.'},
    {gate:'production eligibility',result:'fail',note:'Rejected before registry promotion. It remains review evidence only.'}
  ],
  decision:'Do not register as canonical master candidate. Use IMG_4030 plus the owner reference pack as geometry evidence for the next reference-backed reconstruction/render pass.',
  nextDependency:'Create a clean reference-backed canonical reconstruction/render for Y62-F34-V1; do not rely on automatic photo cutout as the production master.'
 };
});
