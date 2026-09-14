window.Y62_RENDER_MANIFEST = {
  schemaVersion: '0.22.0',
  vehicleId: 'nissan-y62-warrior-2025',
  sourceReview: {
    reviewedAt: '2026-09-13',
    outcome: 'reference-only-assets-still-insufficient-for-production-compositing',
    sources: [
      { label:'Nissan Australia MY25 Patrol', url:'https://www.nissan.com.au/about-nissan/news-and-events/news/2025/may/tech-meets-tough-introducing-the-2025-nissan-patrol.html', supports:['Black Obsidian MY25 paint availability'] },
      { label:'SLX Extreme X-1 Y62 S5 GEN-X', url:'https://www.slx4x4.com.au/products/extreme-series-bullbar-x-1-nissan-y62-patrol-s5-black-powdercoat-gen-x', supports:['exact bullbar SKU/reference'] },
      { label:'Offroad Animal Scout Y62', url:'https://offroadanimal.com.au/scout-roof-rack-to-suit-nissan-patrol-y62-2013-on/', supports:['exact rack SKU/reference'] },
      { label:'GME AE4705B', url:'https://www.gme.net.au/au/antennas/ae4705b/', supports:['exact aerial SKU/reference'] }
    ]
  },
  compositingPolicy: {
    rule: 'Never substitute an approximate product visual for an exact product layer.',
    productionReadyDefinition: 'A layer is production-ready only when it is a transparent, view-matched asset tied to the exact SKU or validated vehicle state.',
    referenceOnlyDefinition: 'A full-raster build image may guide art direction but must not be treated as an independent togglable layer.',
    customerFallbackPolicy: 'none — if an exact server-approved production layer is unavailable, the customer compositor must show it as missing/blocked and render no stand-in artwork.'
  },
  zOrder: ['base','stance','wheels','rear','sides','front','electrical-front','roof','foreground-ui'],
  views: {
    front34: {
      label: '3/4 FRONT',
      baseAsset: 'assets/y62-slx-front.png',
      baseAssetMode: 'stage-reference',
      layers: [
        { id:'base', label:'Warrior base vehicle', source:'assets/y62-slx-front.png', status:'reference-only', exactSku:null, renderState:{paintId:'black-obsidian'}, priority:1, note:'Current image is a complete stage render, not a clean factory base.' },
        { id:'stance', label:'Suspension / stance delta', source:null, status:'asset-needed', exactSku:'ALLOWANCE-HBMC-Y62', priority:2, note:'Requires exact sidewall/arch/ride-height matched layer after engineering path is validated.' },
        { id:'wheels', label:'Wheel + tyre package', source:null, status:'asset-needed', exactSku:'FACTORY-WARRIOR-18X9-G015', renderState:{wheelTyreId:'factory-warrior'}, priority:3, note:'Factory rolling stock is data-locked but not isolated as a transparent layer.' },
        { id:'front', label:'SLX Extreme X-1 bullbar', source:'assets/y62-slx-front.png', status:'reference-only', exactSku:'Y62 S5 GEN-X', priority:4, note:'Visible in the stage reference; transparent exact-SKU extraction still required.' },
        { id:'electrical-front', label:'GME aerial + bonnet bracket', source:null, status:'asset-needed', exactSku:'AE4705B + BB-015P', priority:5, note:'Must be aligned to passenger-side bonnet position used in the approved concept.' },
        { id:'roof', label:'Offroad Animal Scout rack', source:'assets/y62-slx-front.png', status:'reference-only', exactSku:'RR-NPT-Y62-13-SCT-ASM0', priority:6, note:'Visible in stage reference; needs isolated transparent exact-SKU layer.' },
        { id:'sides', label:'Clearview Power Boards concept', source:null, status:'blocked-fitment', exactSku:'PB-NN-003', priority:7, note:'Do not generate production layer until Warrior fitment path is verified.' }
      ]
    },
    side: {
      label: 'SIDE',
      baseAsset: 'assets/y62-profile-board.png',
      baseAssetMode: 'reference-board',
      layers: [
        { id:'base', label:'Warrior side baseline', source:'assets/y62-profile-board.png', status:'reference-only', exactSku:null, renderState:{paintId:'black-obsidian'}, priority:1, note:'Profile board is a multi-view reference image rather than a clean single-view base.' },
        { id:'stance', label:'Suspension / stance delta', source:null, status:'asset-needed', exactSku:'ALLOWANCE-HBMC-Y62', priority:2, note:'Side view is the calibration view for ride height and tyre-to-guard relationship.' },
        { id:'wheels', label:'Wheel + tyre package', source:null, status:'asset-needed', exactSku:'FACTORY-WARRIOR-18X9-G015', renderState:{wheelTyreId:'factory-warrior'}, priority:3, note:'Transparent wheel/tyre mask needed.' },
        { id:'sides', label:'Power board / side step', source:null, status:'blocked-fitment', exactSku:'PB-NN-003', priority:4, note:'Warrior suitability unresolved.' },
        { id:'roof', label:'Scout roof rack', source:null, status:'asset-needed', exactSku:'RR-NPT-Y62-13-SCT-ASM0', priority:5, note:'Clean side layer needed.' },
        { id:'front', label:'SLX front protection', source:null, status:'asset-needed', exactSku:'Y62 S5 GEN-X', priority:6, note:'Side silhouette layer required.' },
        { id:'rear', label:'Raslarr rear bar + carrier set', source:null, status:'asset-needed', exactSku:'NIPATY62RB04', priority:7, note:'Side overhang and carrier geometry must match rear-view assets.' }
      ]
    },
    rear34: {
      label: 'REAR 3/4',
      baseAsset: 'assets/y62-raslarr-rear.png',
      baseAssetMode: 'stage-reference',
      layers: [
        { id:'base', label:'Warrior rear baseline', source:'assets/y62-raslarr-rear.png', status:'reference-only', exactSku:null, renderState:{paintId:'black-obsidian'}, priority:1, note:'Current image is a full build-stage reference.' },
        { id:'stance', label:'Suspension / stance delta', source:null, status:'asset-needed', exactSku:'ALLOWANCE-HBMC-Y62', priority:2, note:'Rear quarter ride-height layer needed.' },
        { id:'wheels', label:'Wheel + tyre package', source:null, status:'asset-needed', exactSku:'FACTORY-WARRIOR-18X9-G015', renderState:{wheelTyreId:'factory-warrior'}, priority:3, note:'Transparent rear-quarter rolling-stock layer needed.' },
        { id:'rear', label:'Raslarr V2 rear bar', source:'assets/y62-raslarr-rear.png', status:'reference-only', exactSku:'NIPATY62RB04', priority:4, note:'Visible in stage reference; isolated exact-SKU layer still required.' },
        { id:'rear-wheel', label:'Raslarr wheel carrier', source:'assets/y62-raslarr-rear.png', status:'reference-only', exactSku:'NIPATY62WC02', priority:5, note:'Reference available; isolate only when the carrier option is selected.' },
        { id:'rear-jerry', label:'Raslarr dual jerry carrier', source:null, status:'asset-needed', exactSku:'NIPATY62DJ01', priority:6, note:'Separate transparent carrier layer required.' },
        { id:'rear-camera', label:'Camera relocation state', source:null, status:'asset-needed', exactSku:'RASLY62CK-1', priority:7, note:'Small but functionally important layer/state marker.' },
        { id:'roof', label:'Scout roof rack', source:null, status:'asset-needed', exactSku:'RR-NPT-Y62-13-SCT-ASM0', priority:8, note:'Rear-quarter roof layer required.' }
      ]
    }
  }
};
