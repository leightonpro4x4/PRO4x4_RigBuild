window.RANGER_DATA = {
  "schemaVersion": "0.26.6",
  "vehicle": {
    "id": "ford-ranger-nextgen-2025",
    "yearRange": "2022–26",
    "make": "Ford",
    "model": "Ranger Next-Gen",
    "trim": "Dual Cab 4WD",
    "bodyStyle": "Dual Cab",
    "drivetrain": "4WD",
    "baseline": {
      "paint": "Graphite",
      "wheel": "Factory wheel/tyre package"
    },
    "views": {
      "front34": {
        "label": "CONCEPT FRONT"
      },
      "side": {
        "label": "SIDE"
      },
      "rear34": {
        "label": "REAR"
      }
    },
    "paints": [
      {
        "id": "graphite",
        "label": "Graphite",
        "swatch": "#3d4144",
        "validated": true,
        "visualReady": false
      }
    ],
    "wheelTyres": [
      {
        "id": "factory",
        "label": "Factory Ranger wheel + tyre",
        "price": 0,
        "validated": true,
        "sku": "FORD-RANGER-FACTORY-WHEEL"
      }
    ]
  },
  "accessories": [
    {
      "id": "mcc-707-01",
      "brand": "MCC 4x4",
      "name": "707-01 Falcon Bull Bar — Single Stainless Loop",
      "sku": "707-01",
      "category": "Protection",
      "price": 2340,
      "install": 650,
      "weightKg": null,
      "status": "engineering",
      "note": "Official MCC catalogue listing; exact Ranger variant fitment requires PRO4X4 confirmation.",
      "group": "front-bar",
      "requires": []
    },
    {
      "id": "oa-predator",
      "brand": "Offroad Animal",
      "name": "Predator Bull Bar — Ford Ranger Next Gen RA 2022 on",
      "sku": "FB-FRA-NG-22-PR-ASM0",
      "category": "Protection",
      "price": 3100,
      "install": null,
      "weightKg": 65,
      "status": "confirmed",
      "note": "Official Offroad Animal Next-Gen Ranger fitment. Current official catalogue price, 65 kg manufacturer-listed product weight and 5–6 hour manufacturer fitting time verified 2026-09-13; PRO4X4 labour price remains to be quoted.",
      "group": "front-bar",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen RA 2022-current",
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar"
      },
      "installTimeHours": {
        "min": 5,
        "max": 6,
        "source": "manufacturer"
      },
      "installDifficulty10": 4
    },
    {
      "id": "mcc-309bsbk",
      "brand": "MCC 4x4",
      "name": "309BSBK All Black Side Step Package",
      "sku": "309BSBK",
      "category": "Protection",
      "price": 1090,
      "install": 390,
      "weightKg": 39,
      "status": "engineering",
      "note": "2mm steel frame, non-slip aluminium step plate, removable end caps and fitting kit.",
      "group": "side-step",
      "requires": []
    },
    {
      "id": "mcc-022-01",
      "brand": "MCC 4x4",
      "name": "022-01 Rocker Rear Bar Package",
      "sku": "022-01",
      "category": "Protection",
      "price": 1890,
      "install": 850,
      "weightKg": 45,
      "status": "engineering",
      "note": "Steel rear bar with integrated tow bar, LED reverse/indicator lights and jacking points.",
      "group": "rear-bar",
      "requires": []
    },
    {
      "id": "mcc-808-01",
      "brand": "MCC 4x4",
      "name": "808-01 Phoenix Bull Bar — Single Black Loop",
      "sku": "808-01",
      "category": "Protection",
      "price": 2940,
      "install": 650,
      "weightKg": null,
      "status": "engineering",
      "note": "Official MCC catalogue listing; exact vehicle variant fitment requires confirmation.",
      "group": "front-bar",
      "requires": []
    },
    {
      "id": "mcc-recovery",
      "brand": "MCC 4x4",
      "name": "Front Rated Recovery Points",
      "sku": "MCC-RANGER-RECOVERY",
      "category": "Protection",
      "price": 389,
      "install": 250,
      "weightKg": null,
      "status": "engineering",
      "note": "Red powder-coated dual recovery points with published 5.5-tonne dual rating.",
      "group": null,
      "requires": []
    },
    {
      "id": "mcc-bash",
      "brand": "MCC 4x4",
      "name": "Three-Piece Bash Plate",
      "sku": "MCC-RANGER-BASH-3PC",
      "category": "Protection",
      "price": 699,
      "install": 300,
      "weightKg": null,
      "status": "engineering",
      "note": "Three-piece 3mm steel protection for steering, sump and transmission.",
      "group": null,
      "requires": []
    },
    {
      "id": "mcc-309bs",
      "brand": "MCC 4x4",
      "name": "309BS Side Step Package — Chrome Step Plate",
      "sku": "309BS",
      "category": "Protection",
      "price": 1090,
      "install": 390,
      "weightKg": 39,
      "status": "engineering",
      "note": "2mm steel side steps with non-slip aluminium chrome step plate.",
      "group": "side-step",
      "requires": []
    },
    {
      "id": "mcc-309rp",
      "brand": "MCC 4x4",
      "name": "309RP Side Rail Only",
      "sku": "309RP",
      "category": "Protection",
      "price": 450,
      "install": 250,
      "weightKg": 9,
      "status": "engineering",
      "note": "50mm side rails designed to pair with compatible MCC heavy-duty steps; cut to suit selected bull bar.",
      "group": null,
      "requires": [
        "mcc-309bsbk"
      ]
    },
    {
      "id": "mcc-039absr808",
      "brand": "MCC 4x4",
      "name": "039ABSR808 All Black Side Step + Rail Package",
      "sku": "039ABSR808",
      "category": "Protection",
      "price": 1590,
      "install": 550,
      "weightKg": 48,
      "status": "engineering",
      "note": "Integrated all-black side steps and 60mm bull-bar rails.",
      "group": "side-step",
      "requires": []
    },
    {
      "id": "mcc-808-02",
      "brand": "MCC 4x4",
      "name": "808-02 Phoenix A-Frame Bar Package",
      "sku": "808-02",
      "category": "Protection",
      "price": 2690,
      "install": 650,
      "weightKg": 46,
      "status": "engineering",
      "note": "ADR-approved 3–5mm steel A-frame bar with LED fog lights, under-protection plate and winch cradle.",
      "group": "front-bar",
      "requires": []
    },
    {
      "id": "mcc-909",
      "brand": "MCC 4x4",
      "name": "909 Single Low Loop",
      "sku": "909",
      "category": "Protection",
      "price": 280,
      "install": 120,
      "weightKg": null,
      "status": "engineering",
      "note": "Vehicle-specific low-loop accessory listed for Next-Gen Ranger applications.",
      "group": null,
      "requires": []
    },
    {
      "id": "mcc-707-02",
      "brand": "MCC 4x4",
      "name": "707-02 Falcon Black A-Frame Bar",
      "sku": "707-02",
      "category": "Protection",
      "price": 2290,
      "install": 650,
      "weightKg": 42,
      "status": "engineering",
      "note": "ADR-approved 3–5mm steel A-frame bar with LED fog lights, under-protection plate and winch cradle.",
      "group": "front-bar",
      "requires": []
    },
    {
      "id": "mcc-022-03",
      "brand": "MCC 4x4",
      "name": "022-03 Jack Rear Bar Package",
      "sku": "022-03",
      "category": "Protection",
      "price": 1390,
      "install": 850,
      "weightKg": null,
      "status": "engineering",
      "note": "4–6mm steel rear bar with removable carrier-arm provision, LED lighting and rated tow-bar provision.",
      "group": "rear-bar",
      "requires": []
    },
    {
      "id": "mcc-022-02-base",
      "brand": "MCC 4x4",
      "name": "022-02 Rear Wheel Carrier Bar Only Package",
      "sku": "022-02-BASE",
      "category": "Protection",
      "price": 2390,
      "install": 950,
      "weightKg": null,
      "status": "engineering",
      "note": "Carrier-ready rear bar with rated tow bar, LED lighting, jacking points and optional removable arms.",
      "group": "rear-bar",
      "requires": []
    },
    {
      "id": "mcc-022-02-dualwheel",
      "brand": "MCC 4x4",
      "name": "022-02 Dual Wheels Carrier Package",
      "sku": "022-02-DUAL-WHEEL",
      "category": "Protection",
      "price": 2990,
      "install": 1050,
      "weightKg": null,
      "status": "engineering",
      "note": "Complete carrier-ready rear bar package with dual removable wheel-carrier arms.",
      "group": "rear-bar-package",
      "requires": []
    },
    {
      "id": "mcc-022-02-wheeljerry",
      "brand": "MCC 4x4",
      "name": "022-02 Wheel + Single Jerry Holder Package",
      "sku": "022-02-WHEEL-JERRY",
      "category": "Protection",
      "price": 2990,
      "install": 1050,
      "weightKg": null,
      "status": "engineering",
      "note": "Complete rear bar package with one wheel carrier and one removable jerry-can holder.",
      "group": "rear-bar-package",
      "requires": []
    },
    {
      "id": "mcc-022-02-doublejerry",
      "brand": "MCC 4x4",
      "name": "022-02 Wheel + Double Jerry Holder Package",
      "sku": "022-02-WHEEL-2JERRY",
      "category": "Protection",
      "price": 3090,
      "install": 1050,
      "weightKg": null,
      "status": "engineering",
      "note": "Complete rear bar package with one wheel carrier and removable two-jerry-can holder.",
      "group": "rear-bar-package",
      "requires": []
    },
    {
      "id": "mcc-022-lh-wheel",
      "brand": "MCC 4x4",
      "name": "022 Left-Hand Pick-Up Wheel Carrier Arm",
      "sku": "022-LH-WHEEL",
      "category": "Protection",
      "price": 550,
      "install": 180,
      "weightKg": null,
      "status": "engineering",
      "note": "Removable left-hand swing-away wheel carrier arm.",
      "group": "rear-left-arm",
      "requires": [
        "mcc-022-02-base"
      ]
    },
    {
      "id": "mcc-022-rh-wheel",
      "brand": "MCC 4x4",
      "name": "022 Right-Hand Pick-Up Wheel Carrier Arm",
      "sku": "022-RH-WHEEL",
      "category": "Protection",
      "price": 550,
      "install": 180,
      "weightKg": null,
      "status": "engineering",
      "note": "Removable right-hand swing-away wheel carrier arm.",
      "group": "rear-right-arm",
      "requires": [
        "mcc-022-02-base"
      ]
    },
    {
      "id": "oa-toro-ranger",
      "brand": "Offroad Animal",
      "name": "Toro Bull Bar — Ford Ranger Next Gen RA 2022 on",
      "sku": "FB-FRA-NG-22-TOR-ASM0",
      "category": "Protection",
      "price": 3770,
      "install": null,
      "weightKg": 76,
      "status": "confirmed",
      "note": "Official Offroad Animal product. Manufacturer states it suits all P703/PU Ranger variants from 2022 on; 76 kg product weight and 5–6 hour fitting time verified 2026-09-13. PRO4X4 labour price remains to be quoted.",
      "group": "front-bar",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen RA/P703/PU 2022-current",
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar"
      },
      "installTimeHours": {
        "min": 5,
        "max": 6,
        "source": "manufacturer"
      },
      "installDifficulty10": 4
    },
    {
      "id": "oa-scout-rack-ranger",
      "brand": "Offroad Animal",
      "name": "Scout Roof Rack — Next Gen Ranger 2022 to current",
      "sku": "RR-FRA-PU-22-SCT-ASM0",
      "category": "Touring",
      "price": 1520,
      "install": null,
      "weightKg": null,
      "status": "confirmed",
      "note": "Official Offroad Animal Scout roof rack listing for Next-Gen Ranger; installation priced by PRO4X4.",
      "group": "roof-rack",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen 2022-current",
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34",
          "side",
          "rear34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "roof-rack"
      }
    },
    {
      "id": "oa-rear-protection-ranger",
      "brand": "Offroad Animal",
      "name": "Rear Protection Bumper — Ford Ranger RA Next Gen 2022 on",
      "sku": "RB-FRA-NG-22-ASM0",
      "category": "Protection",
      "price": 1940,
      "install": null,
      "weightKg": 36,
      "status": "engineering",
      "note": "Official listing suits XLS/XLT/Wildtrak/Platinum with the factory tow bar. Factory tow bar is required; Hayman Reece tow bars are not compatible. Manufacturer lists 36 kg and 1–2 hour fitting time; PRO4X4 labour price remains to be quoted.",
      "group": "rear-bar",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/rear-protection-bumper-ford-ranger-ra-next-gen-2022-on/",
      "fitment": {
        "reviewRequired": true,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen 2022-current",
        "conditions": [
          "factory tow bar required",
          "not compatible with Hayman Reese tow bars"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "rear34"
        ],
        "visualLayerRequired": true,
        "status": "staff-review",
        "referenceAvailable": true,
        "fitmentConfidence": "conditional",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "rear-bar"
      },
      "installTimeHours": {
        "min": 1,
        "max": 2,
        "source": "manufacturer"
      },
      "installDifficulty10": 4
    },
    {
      "id": "oa-rock-sliders-ranger",
      "brand": "Offroad Animal",
      "name": "Rock Sliders — Ford Ranger Next Gen 2022 to current",
      "sku": "RSW-FRA-NG-22-ASM0",
      "category": "Protection",
      "price": 1895,
      "install": null,
      "weightKg": 60,
      "status": "confirmed",
      "note": "Official Offroad Animal Ranger listing for all Dual Cab Ranger 2022-current variants named XL/XLS/XLT/Wildtrak. Manufacturer lists 60 kg and 3 hour fitting time; PRO4X4 labour price remains to be quoted.",
      "group": "side-step",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/rock-sliders-ford-ranger-next-gen-2022-to-current/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen 2022-current",
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34",
          "side"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "side-step"
      },
      "installTimeHours": {
        "min": 3,
        "max": 3,
        "source": "manufacturer"
      },
      "installDifficulty10": 4
    },
    {
      "id": "oa-ausb-sports-bar-ranger",
      "brand": "Offroad Animal",
      "name": "Actually Useful Sports Bar (A.U.S.B) — Next Gen Ranger",
      "sku": "SB-COM-MED-ASM0",
      "category": "Touring",
      "price": 2675,
      "install": null,
      "weightKg": 28,
      "status": "confirmed",
      "note": "Official manufacturer fitment confirms Next Gen Ranger when mounted to roller-shutter T-slot tracks; tub-clamp mounting is not compatible on this Ranger fitment. Installation priced by PRO4X4.",
      "group": "sports-bar",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/actually-useful-sports-bar-a-u-s-b/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen 2022-current",
        "conditions": [
          "use roller-shutter T-slot track mounting on Next Gen Ranger",
          "tub-clamp mounting not compatible for this Ranger fitment"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34",
          "side",
          "rear34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "sports-bar"
      }
    },
    {
      "id": "oa-adventure-rack-ranger",
      "brand": "Offroad Animal",
      "name": "Adventure Rack — Universal Dual Cab Ute",
      "sku": "ADVR-DC-COM-ASM0",
      "category": "Touring",
      "price": 1365,
      "install": null,
      "weightKg": 24,
      "status": "engineering",
      "note": "Official universal dual-cab ute product. Ranger-specific mounting route still requires PRO4X4 confirmation before quote approval; no model-specific certainty is inferred from the universal listing.",
      "group": "tub-rack",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/adventure-rack-universal-fit-all-aussie-utes/",
      "fitment": {
        "reviewRequired": true,
        "source": "manufacturer",
        "vehicleRange": "Universal dual cab ute — Ranger application to be confirmed",
        "conditions": [
          "mounting method depends on tub / roller-shutter configuration"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34",
          "side",
          "rear34"
        ],
        "visualLayerRequired": true,
        "status": "staff-review",
        "referenceAvailable": true,
        "fitmentConfidence": "conditional",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "tub-rack"
      }
    },
    {
      "id": "oa-lower-bash-ranger",
      "brand": "Offroad Animal",
      "name": "Lower Bash / Skid Plate — Next Gen Ranger / Everest",
      "sku": "BP-FRA-NG-22-ASM0",
      "category": "Protection",
      "price": 420,
      "install": null,
      "weightKg": 5,
      "status": "confirmed",
      "note": "Manufacturer-confirmed Next Gen Ranger/Everest plate. Only fits with Offroad Animal Predator or Toro bars; not compatible with factory bumper/stone guard. Required on Tremor when using the Offroad Animal bar route.",
      "group": null,
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/lower-bash-skid-plate-to-suit-next-gen-ford-ranger-everest/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen 2022-current",
        "anyOfRequiredParts": [
          "oa-predator",
          "oa-toro-ranger"
        ],
        "conditions": [
          "Offroad Animal Predator or Toro bar required",
          "not compatible with factory bumper or factory stone guard"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "bash-plate"
      }
    },
    {
      "id": "oa-camera-relocation-ranger",
      "brand": "Offroad Animal",
      "name": "Next Gen Camera Relocation Kit",
      "sku": "FB-FRA-NG-22-PR-ASM5",
      "category": "Protection",
      "price": 165,
      "install": null,
      "weightKg": 1,
      "status": "confirmed",
      "note": "Manufacturer-confirmed Ranger/Raptor/Everest Next Gen camera relocation kit. Only needed when bar hoops or lighting obscure the factory camera; angle-gauge setup or Ford calibration is required.",
      "group": null,
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/next-gen-camera-relocation-kit/",
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger/Raptor/Everest Next Gen",
        "conditions": [
          "use when bull-bar hoops or lights obstruct the factory camera",
          "camera angle must be correctly set after relocation"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": false,
        "supportedViews": [],
        "visualLayerRequired": false,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": null
      }
    },
    {
      "id": "oa-brush-rails-ranger",
      "brand": "Offroad Animal",
      "name": "Brush Rails — Ford Ranger RA Next Gen 2022-current",
      "sku": "SR-FRA-NG-22-ASM0",
      "category": "Protection",
      "price": 790,
      "install": null,
      "weightKg": 12,
      "status": "confirmed",
      "note": "Manufacturer-confirmed for all Ford Ranger RA Dual Cab models. This brush-rail pair requires the Offroad Animal Toro bull bar and Offroad Animal steel rock sliders to complete the kit. PRO4X4 labour price remains to be quoted.",
      "group": "brush-rail",
      "requires": [
        "oa-toro-ranger",
        "oa-rock-sliders-ranger"
      ],
      "sourceUrl": "https://offroadanimal.com.au/brush-rails-to-suit-ford-ranger-ra-next-gen-2022-current/",
      "installTimeHours": {
        "min": 2,
        "max": 3,
        "source": "manufacturer"
      },
      "installDifficulty10": 5,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger RA Dual Cab 2022-current",
        "requiredParts": [
          "oa-toro-ranger",
          "oa-rock-sliders-ranger"
        ],
        "conditions": [
          "requires Offroad Animal Toro bull bar",
          "requires Offroad Animal steel rock sliders"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34",
          "side"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "brush-rail"
      }
    },
    {
      "id": "oa-egr-flare-endcaps-ranger",
      "brand": "Offroad Animal",
      "name": "EGR Flare End Caps — Ranger RA Toro / Predator",
      "sku": "FLEC-FRA-NG-22-ASM0",
      "category": "Protection",
      "price": 150,
      "install": null,
      "weightKg": 1,
      "status": "confirmed",
      "note": "Manufacturer-confirmed for RA Ranger 2022-current with EGR branded flares and either an Offroad Animal Toro or Predator bar. Other flare brands are not treated as verified. Staff review remains required until the build records EGR flare fitment.",
      "group": null,
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/egr-flare-end-caps-to-suit-offroad-animal-ranger-ra-bull-bars-toro-and-predator/",
      "installTimeHours": {
        "min": 0.25,
        "max": 0.25,
        "source": "manufacturer"
      },
      "installDifficulty10": 1,
      "fitment": {
        "reviewRequired": true,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger RA 2022-current",
        "anyOfRequiredParts": [
          "oa-predator",
          "oa-toro-ranger"
        ],
        "requiredExternalParts": [
          "EGR branded flares"
        ],
        "conditions": [
          "EGR branded flares required for verified fitment",
          "either Offroad Animal Predator or Toro bull bar required",
          "other flare brands remain unverified"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34",
          "side"
        ],
        "visualLayerRequired": true,
        "status": "staff-review",
        "referenceAvailable": true,
        "fitmentConfidence": "conditional",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "flare-end-cap"
      }
    },
    {
      "id": "oa-toro-indicator-harness-ranger",
      "brand": "Offroad Animal",
      "name": "Ranger Toro Indicator Piggy Back Harness",
      "sku": "LM-FRA-NG-IND",
      "category": "Electrical",
      "price": 80,
      "install": null,
      "weightKg": 1,
      "status": "confirmed",
      "note": "Manufacturer accessory specifically for wiring indicators on the Next Gen Ranger Toro bar. Manufacturer fitting-time figure was not found, so installation time and PRO4X4 labour price remain unknown.",
      "group": null,
      "requires": [
        "oa-toro-ranger"
      ],
      "sourceUrl": "https://offroadanimal.com.au/ranger-toro-indicator-piggy-back-harness/",
      "installTimeHours": null,
      "installDifficulty10": null,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen with Offroad Animal Toro bull bar",
        "requiredParts": [
          "oa-toro-ranger"
        ],
        "conditions": [
          "Toro bull bar required"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": false,
        "supportedViews": [],
        "visualLayerRequired": false,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": null
      }
    },
    {
      "id": "oa-predator-stealth-top-ranger",
      "brand": "Offroad Animal",
      "name": "Stealth Top Type A — Predator Style",
      "sku": "TB-COM-PR-ASM0",
      "category": "Protection",
      "price": 235,
      "install": null,
      "weightKg": 4,
      "status": "confirmed",
      "note": "Manufacturer states this Type A hoop suits Offroad Animal bull bars including Ranger and bolts directly to the bumper. Ranger mapping is constrained to the confirmed Predator bar dependency; PRO4X4 labour price remains to be quoted.",
      "group": "predator-top-hoop",
      "requires": [
        "oa-predator"
      ],
      "sourceUrl": "https://offroadanimal.com.au/stealth-top-suit-type-a-led-light-predator-style/",
      "installTimeHours": {
        "min": 0.5,
        "max": 0.5,
        "source": "manufacturer"
      },
      "installDifficulty10": 2,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen with Offroad Animal Predator bull bar",
        "requiredParts": [
          "oa-predator"
        ],
        "conditions": [
          "Offroad Animal Predator bull bar required",
          "accepts up to 22-inch single-row LED light bar"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar-hoop"
      }
    },
    {
      "id": "oa-predator-round-top-ranger",
      "brand": "Offroad Animal",
      "name": "Predator Round Top Tube",
      "sku": "TB-COM-PR-RD-ASM0",
      "category": "Protection",
      "price": 365,
      "install": null,
      "weightKg": 3,
      "status": "confirmed",
      "note": "Manufacturer states this hoop bolts to Predator bars and excludes Wrangler JK/JL, Navara and Ram; the Next Gen Ranger Predator is not excluded. PRO4X4 labour price remains to be quoted.",
      "group": "predator-top-hoop",
      "requires": [
        "oa-predator"
      ],
      "sourceUrl": "https://offroadanimal.com.au/predator-round-top-tube/",
      "installTimeHours": {
        "min": 0.5,
        "max": 0.5,
        "source": "manufacturer"
      },
      "installDifficulty10": 2,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen with Offroad Animal Predator bull bar",
        "requiredParts": [
          "oa-predator"
        ],
        "conditions": [
          "Offroad Animal Predator bull bar required"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar-hoop"
      }
    },
    {
      "id": "oa-tray-slide-wide-ranger",
      "brand": "Offroad Animal",
      "name": "Full Extension Tray Slide / Bed Slide — Wide RA Ranger",
      "sku": "TRS-DC-COM-WIDE-ASM0",
      "category": "Touring",
      "price": 2780,
      "install": null,
      "weightKg": 51,
      "status": "confirmed",
      "note": "Manufacturer explicitly lists universal fit for Next Gen RA Ranger, Raptor and Amarok Dual Cab utes and identifies the wide version for Next-Gen Ranger. Assembly and fitting times are recorded separately; PRO4X4 labour price remains to be quoted.",
      "group": "tub-storage-slide",
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/full-extension-tray-slide-bed-slide-wide-size-to-suit-ra-ranger/",
      "installTimeHours": {
        "min": 1,
        "max": 1,
        "source": "manufacturer"
      },
      "assemblyTimeHours": {
        "min": 2,
        "max": 2,
        "source": "manufacturer"
      },
      "installDifficulty10": 5,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen RA Dual Cab 2022-current",
        "conditions": [
          "wide tray slide variant is manufacturer-listed for Next Gen RA Ranger"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": false,
        "supportedViews": [],
        "visualLayerRequired": false,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": null
      }
    },
    {
      "id": "oa-rally-hoop-stedi-pro-ranger",
      "brand": "Offroad Animal",
      "name": "Rally Hoop — Stedi Type X Pro — Next Gen Ranger",
      "sku": "TB-COM-RAL-STE-2XPRO-ASM0",
      "category": "Protection",
      "price": 330,
      "install": null,
      "weightKg": 4,
      "status": "confirmed",
      "note": "Manufacturer fitment table explicitly lists Ford Ranger RA 2022-on on the Next Gen Predator bar. The hoop sits very close to the grille and the Offroad Animal camera relocation kit is required. Designed only for a pair of Stedi Type X Pro driving lights; PRO4X4 labour time/price remains unknown.",
      "group": "predator-top-hoop",
      "requires": [
        "oa-predator",
        "oa-camera-relocation-ranger"
      ],
      "sourceUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-pro/",
      "installTimeHours": null,
      "installDifficulty10": null,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger RA Next Gen 2022-current with Offroad Animal Predator bull bar",
        "requiredParts": [
          "oa-predator",
          "oa-camera-relocation-ranger"
        ],
        "conditions": [
          "Offroad Animal Predator bull bar required",
          "Offroad Animal camera relocation kit required",
          "manufacturer notes hoop is very close to the grille",
          "designed only around two Stedi Type X Pro driving lights"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar-hoop"
      }
    },
    {
      "id": "oa-rally-hoop-9in-ranger",
      "brand": "Offroad Animal",
      "name": "Rally Hoop — Offroad Animal 9-inch Arse Kicker — Next Gen Ranger",
      "sku": "TB-COM-RAL-ORA-2X9-ASM0",
      "category": "Protection",
      "price": 330,
      "install": null,
      "weightKg": 4,
      "status": "confirmed",
      "note": "Manufacturer fitment table explicitly lists Ford Ranger RA 2022-on on the Next Gen Predator bar and requires Offroad Animal camera relocation. This hoop is designed only around a pair of Offroad Animal 9-inch Arse Kicker lights; PRO4X4 labour time/price remains unknown.",
      "group": "predator-top-hoop",
      "requires": [
        "oa-predator",
        "oa-camera-relocation-ranger"
      ],
      "sourceUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-to-suit-offroad-animal-9-inch-arse-kicker-lights/",
      "installTimeHours": null,
      "installDifficulty10": null,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger RA Next Gen 2022-current with Offroad Animal Predator bull bar",
        "requiredParts": [
          "oa-predator",
          "oa-camera-relocation-ranger"
        ],
        "conditions": [
          "Offroad Animal Predator bull bar required",
          "Offroad Animal camera relocation kit required",
          "designed only around two Offroad Animal 9-inch Arse Kicker driving lights"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar-hoop"
      }
    },
    {
      "id": "oa-rally-hoop-7in-ranger",
      "brand": "Offroad Animal",
      "name": "Rally Hoop — Offroad Animal Butt Kicker 7-inch — Next Gen Ranger",
      "sku": "TB-COM-RAL-ORA-2X7-ASM0",
      "category": "Protection",
      "price": 315,
      "install": null,
      "weightKg": 8,
      "status": "confirmed",
      "note": "Manufacturer fitment table explicitly lists Ford Ranger RA 2022-on on the Next Gen Predator bar and requires Offroad Animal camera relocation. This hoop is designed only around a pair of Offroad Animal Butt Kicker 7-inch lights; PRO4X4 labour time/price remains unknown.",
      "group": "predator-top-hoop",
      "requires": [
        "oa-predator",
        "oa-camera-relocation-ranger"
      ],
      "sourceUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/",
      "installTimeHours": null,
      "installDifficulty10": null,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger RA Next Gen 2022-current with Offroad Animal Predator bull bar",
        "requiredParts": [
          "oa-predator",
          "oa-camera-relocation-ranger"
        ],
        "conditions": [
          "Offroad Animal Predator bull bar required",
          "Offroad Animal camera relocation kit required",
          "designed only around two Offroad Animal Butt Kicker 7-inch driving lights"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-bar-hoop"
      }
    },
    {
      "id": "oa-22in-slim-lightbar-ranger",
      "brand": "Offroad Animal",
      "name": "22-inch Slim LED Light Bar — Ranger Bull Bar Support",
      "sku": "ORA-ALO-S5D1-20",
      "category": "Electrical",
      "price": 200,
      "install": null,
      "weightKg": 2,
      "status": "confirmed",
      "note": "Manufacturer describes this 22-inch light bar as fitting inside Offroad Animal bull bars/top hoops; both the confirmed Next Gen Ranger Predator and Toro manufacturer pages offer the 22-inch light bar. Fitment is therefore constrained to those mapped bar routes rather than inferred as a stand-alone vehicle fitment. PRO4X4 labour time/price remains unknown.",
      "group": null,
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/offroad-animal-22-slim-led-light-bar/",
      "installTimeHours": null,
      "installDifficulty10": null,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger RA Next Gen 2022-current with confirmed Offroad Animal front bar",
        "anyOfRequiredParts": [
          "oa-predator",
          "oa-toro-ranger"
        ],
        "conditions": [
          "confirmed Ranger Predator or Toro bull bar required for this governed mapping",
          "light bar is an accessory component, not a stand-alone Ranger fitment claim"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": true,
        "supportedViews": [
          "front34"
        ],
        "visualLayerRequired": true,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": "front-lighting"
      }
    },
    {
      "id": "oa-deep-dish-floor-mats-ranger",
      "brand": "Offroad Animal",
      "name": "Deep Dish Floor Mats — Next Gen Ranger MY22+",
      "sku": "FM-FRA-NG-22",
      "category": "Interior",
      "price": 250,
      "install": null,
      "weightKg": 5,
      "status": "confirmed",
      "note": "Exact manufacturer product for Next Gen Ranger MY22+ with vehicle-specific retention clips and precision moulded fit. No manufacturer installation time was found; PRO4X4 labour remains unset rather than inferred.",
      "group": null,
      "requires": [],
      "sourceUrl": "https://offroadanimal.com.au/deep-dish-floor-matts-to-suit-next-gen-ranger-my22/",
      "installTimeHours": null,
      "installDifficulty10": null,
      "fitment": {
        "reviewRequired": false,
        "source": "manufacturer",
        "vehicleRange": "Ford Ranger Next Gen MY22+",
        "conditions": [
          "vehicle-specific manufacturer fitment"
        ],
        "conflicts": []
      },
      "visual": {
        "visualisable": false,
        "supportedViews": [],
        "visualLayerRequired": false,
        "status": "priced-only",
        "referenceAvailable": true,
        "fitmentConfidence": "confirmed",
        "vehicleId": "ford-ranger-nextgen-2025",
        "layerId": null
      }
    }
  ]
};
