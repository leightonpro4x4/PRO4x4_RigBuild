window.RIG_DATA = {
  "schemaVersion": "0.12.0",
  "wf2Revision": "0.26.25",
  "vehicle": {
    "id": "nissan-y62-warrior-2025",
    "yearRange": "2025",
    "make": "Nissan",
    "model": "Patrol Y62",
    "series": "Series 5 / MY25",
    "trim": "Warrior by Premcar",
    "bodyStyle": "4WD Wagon",
    "drivetrain": "4WD",
    "wheelbaseMm": 3075,
    "baseline": {
      "paint": "Black Obsidian",
      "wheel": "18 x 9J Patrol Warrior",
      "tyre": "Yokohama Geolandar G015 295/70R18",
      "factoryLiftMm": 50
    },
    "weights": {
      "kerbMassKg": 2884,
      "gvmKg": 3620,
      "nominalPayloadKg": 736,
      "confidence": "planning-guide",
      "source": {
        "authority": "2025 Patrol Warrior published specification cross-check",
        "url": "https://www.carexpert.com.au/car-reviews/2025-nissan-patrol-review"
      },
      "note": "Planning estimate only. Final GVM/axle/load compliance must be confirmed against the exact vehicle and weighbridge data."
    },
    "constraints": [
      "Warrior already includes a factory 50 mm total lift; additional suspension height requires engineering review.",
      "Clearview PB-NN-003 supplier suitability does not cover Warrior; custom-fit path must be verified before formal quote."
    ],
    "source": {
      "authority": "Premcar Warrior specification",
      "url": "https://premcar.au/announcement-nissan-patrol-warrior-by-premcar-detailed/"
    },
    "views": {
      "front34": {
        "label": "3/4 FRONT",
        "src": "assets/y62-slx-front.png"
      },
      "side": {
        "label": "SIDE",
        "src": "assets/y62-profile-board.png"
      },
      "rear34": {
        "label": "REAR 3/4",
        "src": "assets/y62-raslarr-rear.png"
      }
    },
    "paints": [
      {
        "id": "black-obsidian",
        "label": "Black Obsidian",
        "swatch": "#111214",
        "validated": true,
        "visualReady": true,
        "renderStateKey": "paint:black-obsidian",
        "source": "Nissan Australia MY25 palette"
      },
      {
        "id": "gun-metallic",
        "label": "Gun Metallic",
        "swatch": "#65686a",
        "validated": true,
        "visualReady": false,
        "renderStateKey": "paint:gun-metallic",
        "source": "Nissan Australia MY25 palette"
      },
      {
        "id": "moonstone-white",
        "label": "Moonstone White",
        "swatch": "#e8e7e1",
        "validated": true,
        "visualReady": false,
        "renderStateKey": "paint:moonstone-white",
        "source": "Nissan Australia MY25 palette"
      },
      {
        "id": "brilliant-silver",
        "label": "Brilliant Silver",
        "swatch": "#b8bec3",
        "validated": true,
        "visualReady": false,
        "renderStateKey": "paint:brilliant-silver",
        "source": "Nissan Australia MY25 palette"
      }
    ],
    "wheelTyres": [
      {
        "id": "factory-warrior",
        "label": "Warrior 18 × 9J + 295/70R18 G015",
        "price": 0,
        "validated": true,
        "sku": "FACTORY-WARRIOR-18X9-G015",
        "renderStateKey": "wheel:factory-warrior"
      },
      {
        "id": "aftermarket-pending",
        "label": "Aftermarket wheel + tyre package",
        "price": null,
        "validated": false,
        "sku": null
      }
    ]
  },
  "accessories": [
    {
      "id": "scout-rack",
      "brand": "Offroad Animal",
      "name": "Scout Roof Rack",
      "sku": "RR-NPT-Y62-13-SCT-ASM0",
      "category": "Touring",
      "status": "confirmed",
      "selected": true,
      "layer": "roof",
      "pricing": {
        "parts": 1850,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": 32,
      "install": {
        "estimateHoursMin": 1,
        "estimateHoursMax": 2,
        "sourceVerified": true
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/scout-roof-rack-to-suit-nissan-patrol-y62-2013-on/",
        "verification": "authoritative-verified-2026-09-13"
      },
      "note": "Retail confirmed. Rack weight 32 kg and 1–2 hour fitting estimate are source-verified; labour and freight remain quote items."
    },
    {
      "id": "slx-x1",
      "brand": "SLX 4x4",
      "name": "Extreme X-1 Bullbar",
      "sku": "Y62 S5 GEN-X",
      "category": "Protection",
      "status": "confirmed",
      "selected": true,
      "layer": "front",
      "pricing": {
        "parts": 3569,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [
          "oa-y62-toro-frontbar",
          "oa-y62-cobra-frontbar"
        ],
        "reviewRequired": false
      },
      "group": "front-bar",
      "finishOptions": [
        "Black powdercoat",
        "Colour coded — quote"
      ],
      "weightKg": 40,
      "sourceProductWeightKg": 63,
      "removedVehicleMassKg": 23,
      "install": {
        "estimateHoursMin": 4,
        "estimateHoursMax": 4,
        "sourceVerified": true
      },
      "source": {
        "authority": "SLX 4x4",
        "url": "https://www.slx4x4.com.au/products/extreme-series-bullbar-x-1-nissan-y62-patrol-s5-black-powdercoat-gen-x",
        "verification": "authoritative-verified-2026-09-13"
      },
      "note": "Base bar retail loaded. Source lists 63 kg total product, 23 kg removed during fitment and 40 kg net mass added to vehicle; 4 hour install timeframe is source-verified. Payload planning uses the 40 kg net added mass."
    },
    {
      "id": "hbmc-lift",
      "brand": "PRO4X4",
      "name": "Further 50 mm HBMC Lift Allowance",
      "sku": "ALLOWANCE-HBMC-Y62",
      "category": "Suspension",
      "status": "engineering",
      "selected": true,
      "layer": "stance",
      "pricing": {
        "parts": null,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": 2755.4
      },
      "provisionalComponents": [
        "engineering"
      ],
      "pricingRequired": [
        "parts",
        "labour",
        "engineering"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [
          "factory-warrior-50mm-lift"
        ],
        "reviewRequired": true
      },
      "finishOptions": [],
      "weightKg": null,
      "source": {
        "authority": "Project allowance / Ride Master reference",
        "url": "https://www.4wddepot.com.au/lift-kit-for-nissan-patrol-y62-hbmc-with-2-springs",
        "verification": "allowance-only"
      },
      "note": "Current project allowance only. Warrior already has 50 mm factory lift; final system and engineered fitment require validation."
    },
    {
      "id": "clearview-powerboards",
      "brand": "Clearview",
      "name": "Power Boards",
      "sku": "PB-NN-003",
      "category": "Touring",
      "status": "blocked",
      "selected": true,
      "layer": "sides",
      "pricing": {
        "parts": 1649,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [],
        "requiredParts": [
          "custom-warrior-adaptation"
        ],
        "conflicts": [
          "supplier-excludes-warrior"
        ],
        "reviewRequired": true
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": null,
      "source": {
        "authority": "Clearview Accessories",
        "url": "https://www.clearviewaccessories.com.au/product/power-boards-pair-nissan-patrol-y62/",
        "verification": "supplier-conflict-recorded"
      },
      "note": "Supplier suitability conflict for Warrior. Retail retained for concept reference only; no fitted quote until custom path is verified."
    },
    {
      "id": "raslarr-rear",
      "brand": "Raslarr",
      "name": "V2 Rear Bar",
      "sku": "NIPATY62RB04",
      "category": "Protection",
      "status": "confirmed",
      "selected": true,
      "layer": "rear",
      "pricing": {
        "parts": 2750,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Black",
        "Colour coded"
      ],
      "weightKg": null,
      "source": {
        "authority": "Raslarr Engineering",
        "url": "https://www.raslarr.com.au/products/s5-y62-nissan-patrol-v2-rear-bar",
        "verification": "project-sourced"
      },
      "note": "Base rear bar retail loaded. Labour/freight remain quote items."
    },
    {
      "id": "raslarr-wheel",
      "brand": "Raslarr",
      "name": "Wheel Carrier",
      "sku": "NIPATY62WC02",
      "category": "Storage",
      "status": "confirmed",
      "selected": false,
      "layer": "rear-wheel",
      "pricing": {
        "parts": 850,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "raslarr-rear"
        ],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Black",
        "Colour coded with carrier set"
      ],
      "weightKg": null,
      "source": {
        "authority": "Raslarr Engineering",
        "url": "https://www.raslarr.com.au/products/lhs-wheel-carrier",
        "verification": "project-sourced"
      },
      "note": "One carrier; requires Raslarr rear bar. Matching spare wheel/tyre additional."
    },
    {
      "id": "raslarr-jerry",
      "brand": "Raslarr",
      "name": "Dual Jerry Carrier",
      "sku": "NIPATY62DJ01",
      "category": "Storage",
      "status": "confirmed",
      "selected": false,
      "layer": "rear-jerry",
      "pricing": {
        "parts": 950,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "raslarr-rear"
        ],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Black",
        "Colour coded with carrier set"
      ],
      "weightKg": null,
      "source": {
        "authority": "Raslarr Engineering",
        "url": "https://www.raslarr.com.au/products/lhs-dual-jerry-can-holder",
        "verification": "project-sourced"
      },
      "note": "Holder only; requires Raslarr rear bar. Jerry cans additional."
    },
    {
      "id": "raslarr-colour",
      "brand": "Raslarr",
      "name": "Rear Bar Colour Coding",
      "sku": "RY62RBC",
      "category": "Protection",
      "status": "confirmed",
      "selected": false,
      "layer": "rear",
      "pricing": {
        "parts": null,
        "labour": null,
        "paint": 790,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "paint"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "raslarr-rear"
        ],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Non-pearl colour code"
      ],
      "weightKg": null,
      "source": {
        "authority": "Raslarr Engineering",
        "url": "https://www.raslarr.com.au/products/s5-y62-nissan-patrol-v2-rear-bar",
        "verification": "project-sourced"
      },
      "note": "Non-pearl paint service price loaded. Exact paint code required; pearl may add cost."
    },
    {
      "id": "raslarr-camera",
      "brand": "Raslarr",
      "name": "Camera Relocation Kit",
      "sku": "RASLY62CK-1",
      "category": "Electrical",
      "status": "confirmed",
      "selected": false,
      "layer": "rear-camera",
      "pricing": {
        "parts": 295,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "raslarr-rear"
        ],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [],
      "weightKg": null,
      "source": {
        "authority": "Raslarr Engineering",
        "url": "https://www.raslarr.com.au/products/s4-5-y62-nissan-patrol-camera-relocation-kit",
        "verification": "project-sourced"
      },
      "note": "Optional camera relocation hardware. Requires Raslarr rear bar; labour still quote item."
    },
    {
      "id": "gme-aerial",
      "brand": "GME",
      "name": "AE4705B UHF Aerial",
      "sku": "AE4705B",
      "category": "Electrical",
      "status": "confirmed",
      "selected": true,
      "layer": "electrical-front",
      "pricing": {
        "parts": 369,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "gmf-bracket"
        ],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": null,
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false
      },
      "source": {
        "authority": "GME",
        "url": "https://www.gme.net.au/au/antennas/ae4705b/",
        "verification": "authoritative-verified-2026-09-13"
      },
      "note": "Exact AE4705B specification and RRP verified against GME. Current Y62 concept uses GMF4x4 bonnet bracket; installation labour still quote item."
    },
    {
      "id": "gmf-bracket",
      "brand": "GMF4x4",
      "name": "Bonnet Aerial Bracket",
      "sku": "BB-015P",
      "category": "Electrical",
      "status": "confirmed",
      "selected": true,
      "layer": "electrical-front",
      "pricing": {
        "parts": 85,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [],
        "reviewRequired": false
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": 0.3,
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false
      },
      "source": {
        "authority": "GMF4x4 / Overland 4WD exact listing",
        "url": "https://www.overland4wd.com.au/product/gmf-4x4-bonnet-aerial-uhf-antenna-bracket-y62/",
        "verification": "exact-sku-retailer-verified-2026-09-13"
      },
      "note": "Passenger-side bonnet bracket."
    },
    {
      "id": "oa-y62-toro-frontbar",
      "brand": "Offroad Animal",
      "name": "Toro Bull Bar — Nissan Patrol Y62 Series 5",
      "sku": "FB-NPT-Y62-19-TOR-ASM0",
      "category": "Protection",
      "status": "confirmed",
      "selected": false,
      "layer": "front",
      "group": "front-bar",
      "pricing": {
        "parts": 3990,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 3990,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "oa-y62-warrior-lower-bash"
        ],
        "conflicts": [
          "slx-x1",
          "oa-y62-cobra-frontbar"
        ],
        "reviewRequired": true,
        "staffReviewGates": [
          "Manufacturer states the Warrior replacement lower bash plate is required; exact lower-bash parent naming is cross-checked separately.",
          "Manufacturer copy states MY22 vehicles require grille cut; whether that statement means MY22-only or MY22-on is not explicit, so MY25 grille-cut scope remains fitting-instruction/staff confirmation.",
          "PRO4X4 labour, freight and any camera-relocation requirement remain quote/install checks.",
          "Current manufacturer fitting-partner prices are bundle options only; do not derive standalone PRO4X4 winch or lighting labour by subtraction."
        ],
        "optionalParts": [
          "oa-y62-22in-slim-lightbar",
          "oa-y62-ass-kicker-9-pair",
          "oa-y62-night-slapper-9-pair",
          "oa-y62-butt-kicker-7-pair",
          "runva-11expedition-y62-toro"
        ],
        "currentManufacturerOptionSet": {
          "sourceState": "confirmed-current-toro-configurator",
          "lighting": [
            "oa-y62-22in-slim-lightbar",
            "oa-y62-ass-kicker-9-pair",
            "oa-y62-night-slapper-9-pair",
            "oa-y62-butt-kicker-7-pair"
          ],
          "recovery": [
            "runva-11expedition-y62-toro"
          ],
          "warriorMandatorySupport": [
            "oa-y62-warrior-lower-bash"
          ],
          "note": "Exact current Toro PDP exposes these named product choices. This confirms selectable product identity/parent route only; it does not prove standalone wiring labour, spotlight bracket geometry, or non-published accessory SKUs."
        },
        "installationPricingEvidence": {
          "source": "Offroad Animal current Y62 Toro fitting-partner configurator",
          "scope": "bundle-only-do-not-derive-standalone-pro4x4-labour",
          "frontBarOnlyAud": 900,
          "frontBarPlusOneLightBarOrDrivingLightsAud": 1200,
          "frontBarPlusLightBarAndDrivingLightsAud": 1350,
          "frontBarPlusWinchAud": 1200,
          "frontBarPlusOneLightBarOrDrivingLightsAndWinchAud": 1500,
          "frontBarPlusLightBarDrivingLightsAndWinchAud": 1650,
          "standaloneWinchLabourAud": null,
          "standaloneLightingLabourAud": null
        }
      },
      "finishOptions": [
        "Matte Black Powder Coat",
        "Colour code — quote"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 77,
      "install": {
        "estimateHoursMin": 5,
        "estimateHoursMax": 6,
        "sourceVerified": true,
        "difficulty10": 5,
        "labourPriceAud": null
      },
      "fittingParts": {
        "mandatory": [
          "oa-y62-warrior-lower-bash"
        ],
        "conditional": [
          {
            "state": "engineering",
            "item": "camera-relocation",
            "reason": "No Warrior-specific mandatory camera-relocation SKU is stated on the Toro PDP."
          }
        ]
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Exact product references exist, but no governed/approved Y62 Toro visual layer has been created."
      },
      "note": "Exact Series 5/current Y62 product identity is manufacturer-backed. Current manufacturer price is verified but the PDP MSRP field is blank, so no RRP is inferred. Storefront-listed 77 kg is retained separately because the page does not label it as installed/net-added mass."
    },
    {
      "id": "runva-11expedition-y62-toro",
      "brand": "Runva",
      "name": "11EXPEDITION 12V Winch with Synthetic Rope — Y62 Toro Route",
      "sku": "11EXPEDITION12V",
      "category": "Recovery",
      "status": "confirmed",
      "selected": false,
      "layer": "front-winch",
      "group": "winch",
      "pricing": {
        "parts": 1295,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": 1295,
        "currentManufacturerPriceAud": 1295,
        "currentOffroadAnimalPriceAud": 1295,
        "priceState": "manufacturer-direct-price-and-offroad-animal-price-match",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "oa-y62-toro-frontbar"
        ],
        "conflicts": [],
        "reviewRequired": true,
        "source": "manufacturer-cross-confirmed",
        "routeScope": "Exact current Y62 Toro PDP offers Runva 11Expedition winch 12V; separate Runva and Offroad Animal product pages identify SKU 11EXPEDITION12V. Toro accepts low-mount winches up to 12,000 lb and this winch is 11,000 lb.",
        "conditions": [
          "requires governed Y62 Toro bull bar FB-NPT-Y62-19-TOR-ASM0",
          "Warrior route separately requires governed lower bash kit oa-y62-warrior-lower-bash",
          "Toro page includes number-plate flip as standard and states winches up to 12,000 lb require no extra bar-mount kit",
          "winch mounting pattern is 254 x 114.3 mm using four M10 bolts",
          "battery routing, terminal protection and any PRO4X4-standard isolator remain installer checks; no isolation SKU is inferred"
        ],
        "installationPricingEvidence": {
          "source": "Offroad Animal current Y62 Toro fitting-partner configurator",
          "frontBarOnlyAud": 900,
          "frontBarPlusWinchAud": 1200,
          "frontBarPlusOneLightBarOrDrivingLightsAndWinchAud": 1500,
          "frontBarPlusLightBarDrivingLightsAndWinchAud": 1650,
          "standaloneWinchLabourAud": null,
          "reason": "Published values are bundle options. The arithmetic difference is not a guaranteed standalone PRO4X4 winch labour price."
        },
        "staffReviewGates": [
          "Confirm physical clutch-handle/control-box access after final Toro fitment and accessory selection; no separate Y62-specific control-box bracket SKU is published.",
          "Confirm battery lead routing, terminal protection and workshop isolation standard; do not invent an isolator SKU from generic practice.",
          "Do not treat fitting-partner bundle deltas as standalone PRO4X4 labour.",
          "Warrior lower-bash dependency is governed under the front bar, not duplicated as a winch-specific fitting part."
        ]
      },
      "finishOptions": [
        "Black Powder Coat"
      ],
      "weightKg": 29,
      "storefrontListedWeightKg": 31,
      "shippingWeightKg": 39,
      "weightNormalization": {
        "basis": "Runva direct manufacturer explicitly publishes FITTED WEIGHT 29KG. Offroad Animal separately exposes 31.00 KGS storefront weight and 39 kg shipping weight; these are retained without overriding direct fitted weight.",
        "confidence": "manufacturer-explicit-fitted-weight"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "standalone Y62 winch installation duration/labour not published; Toro bundle options are retained as package evidence only"
      },
      "specifications": {
        "ratedLinePullLb": 11000,
        "ratedLinePullKg": 4990,
        "voltageV": 12,
        "ingressRating": "IP67",
        "gearRatio": "191:1",
        "rope": {
          "type": "synthetic",
          "diameterMm": 11,
          "lengthM": 25,
          "ratingLb": 25250
        },
        "mountingBoltPatternMm": {
          "width": 254,
          "depth": 114.3,
          "hardware": "4 x M10 bolts"
        },
        "dimensionsMm": {
          "length": 574,
          "width": 160,
          "height": 190
        },
        "batteryLeads": "2 x 1.8 m heavy-duty leads",
        "remote": "wireless rechargeable remote"
      },
      "fittingParts": {
        "includedOrWinchSupplied": [
          "synthetic rope / guided-hook fairlead system",
          "4 x M10-pattern winch mounting hardware per Runva specification",
          "2 x 1.8 m heavy-duty battery leads",
          "wireless rechargeable remote"
        ],
        "parentSupplied": [
          "Y62 Toro winch cradle / low-mount provision",
          "Y62 Toro number-plate flip"
        ],
        "unresolvedExternalParts": [
          "exact battery isolation hardware if PRO4X4 installation standard requires one",
          "any additional cable protection/extension required by final battery routing"
        ]
      },
      "source": {
        "authority": "Runva + Offroad Animal",
        "url": "https://www.runvawinch.com.au/11expedition-12v-with-synthetic-rope",
        "secondaryUrl": "https://offroadanimal.com.au/runva-11expedition-winch-12v/",
        "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "manufacturer-cross-confirmed-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [],
      "visual": {
        "status": "non-visual",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Winch is recessed within the front bar and this WF2 package creates no customer render layer. Product remains governed for quote/fitment logic only."
      },
      "note": "Runva direct manufacturer identity/SKU/AUD $1,295 price and 29 kg fitted weight are verified. Offroad Animal lists the same SKU/product at $1,295 and the current Y62 Toro PDP explicitly offers Runva 11Expedition 12V. Standalone labour/time and any battery-isolation SKU remain unknown."
    },
    {
      "id": "oa-y62-cobra-frontbar",
      "brand": "Offroad Animal",
      "name": "Cobra Bull Bar — Nissan Patrol Y62 Series 5",
      "sku": "FB-NPT-Y62-19-PR-ASM0",
      "category": "Protection",
      "status": "confirmed",
      "selected": false,
      "layer": "front",
      "group": "front-bar",
      "pricing": {
        "parts": 3415,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 3415,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "oa-y62-warrior-lower-bash"
        ],
        "conflicts": [
          "slx-x1",
          "oa-y62-toro-frontbar"
        ],
        "reviewRequired": true,
        "staffReviewGates": [
          "Manufacturer states the Warrior replacement lower bash plate is required.",
          "The lower-bash PDP uses legacy/generic “Predator” parent wording while the current Y62 bar is sold as Cobra; retain staff review rather than silently equating the names.",
          "Manufacturer copy states MY22 vehicles require grille cut; MY25 scope is not explicit and must be confirmed from current fitting instructions before quote release.",
          "Camera relocation is not universally mandatory on the bare Cobra. Exact kit TB-COM-NIS-CAM-BRKIT is now source-resolved for Cobra/Predator bars when a Rally Hoop or 22-inch Stealth Hoop is fitted; route-specific requirement must be applied only when that top-hoop configuration is selected."
        ]
      },
      "finishOptions": [
        "Matte Black Powder Coat",
        "Colour code — quote"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 65,
      "install": {
        "estimateHoursMin": 4,
        "estimateHoursMax": 4,
        "sourceVerified": true,
        "difficulty10": 5,
        "labourPriceAud": null
      },
      "fittingParts": {
        "mandatory": [
          "oa-y62-warrior-lower-bash"
        ],
        "conditional": [
          {
            "state": "conditional-confirmed",
            "item": "oa-y62-camera-relocation-kit",
            "sku": "TB-COM-NIS-CAM-BRKIT",
            "condition": "Required on Y62 S5 Cobra when fitted with Rally Hoop or 22-inch Stealth Hoop; not a universal bare-bar requirement.",
            "reason": "Rev B manufacturer camera-relocation instruction explicitly identifies Y62 Series 5 Cobra/Predator + Rally/Stealth Hoop applicability and excludes Toro."
          }
        ]
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Exact product references exist, but no governed/approved Y62 Cobra visual layer has been created."
      },
      "note": "Exact Series 5/current Y62 product identity is manufacturer-backed. Current manufacturer price is verified but the PDP MSRP field is blank, so no RRP is inferred. Storefront-listed 65 kg is retained separately because the page does not label it as installed/net-added mass."
    },
    {
      "id": "oa-y62-warrior-lower-bash",
      "brand": "Offroad Animal",
      "name": "Y62 Lower Bash Plate Kit to suit Warrior",
      "sku": "FB-NPT-Y62-19-PR-ASM6",
      "category": "Protection",
      "status": "confirmed",
      "selected": false,
      "layer": "underbody",
      "pricing": {
        "parts": 420,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 420,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "requiresAnyOf": [
          "oa-y62-toro-frontbar",
          "oa-y62-cobra-frontbar"
        ],
        "conflicts": [
          "slx-x1"
        ],
        "reviewRequired": true,
        "staffReviewGates": [
          "Manufacturer explicitly says this kit is required on Warrior, but its PDP says it works with Toro and Predator bars while the current Y62 second bar is named Cobra.",
          "Use only with an Offroad Animal front bar; do not release as a standalone/bash-only Warrior fitment.",
          "Exact installation duration and PRO4X4 labour remain unknown."
        ]
      },
      "finishOptions": [
        "Texture Grey Powder Coat"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 8,
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null
      },
      "material": {
        "type": "steel",
        "thicknessMm": 3
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/y62-lower-bash-plate-kit-to-suit-warrior/",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [],
      "visual": {
        "status": "non-visual",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Underbody support part is governed for fitment/quote logic only; no customer render layer is required in this package."
      },
      "note": "Manufacturer explicitly identifies the kit as required for Warrior and only compatible with Offroad Animal bars. Current manufacturer price is verified, MSRP is blank, and the storefront 8 kg value is preserved without treating it as installed/net-added mass."
    },
    {
      "id": "oa-y62-window-panel",
      "brand": "Offroad Animal",
      "name": "Window Accessory Panel — Nissan Patrol Y62",
      "sku": "WP-NPT-Y62-13-XX-ASM0",
      "category": "Touring",
      "status": "confirmed",
      "selected": false,
      "layer": "window-panel",
      "pricing": {
        "parts": 635,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 635,
        "priceState": "verified-current-manufacturer-base-price-msrp-blank",
        "priceScope": "single-panel/base-option price; both-side option price not source-resolved",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "scout-rack"
        ],
        "conflicts": [],
        "reviewRequired": true,
        "exclusiveParent": {
          "productId": "scout-rack",
          "sku": "RR-NPT-Y62-13-SCT-ASM0",
          "rule": "Manufacturer fitting instructions state the panel is not compatible with any other roof rack variant."
        },
        "staffReviewGates": [
          "Confirm RH or LH side at quote/workshop release. The live PDP uses generic SKU WP-NPT-Y62-13-XX-ASM0; the current fitting instruction explicitly identifies RH assembly SKU WP-NPT-Y62-13-RH-ASM0, while no authoritative LH assembly SKU was source-resolved in this package.",
          "Resolve the published load-rating conflict before treating 25 kg as valid: the live PDP says rated for 25 kg per panel, while Rev A fitting instructions dated 20/05/2026 say do not exceed 20 kg. Use 20 kg as the conservative workshop ceiling pending manufacturer clarification.",
          "PRO4X4 labour and freight remain quote items; manufacturer install time covers the panel only and excludes time to mount carried accessories."
        ]
      },
      "variantIdentity": {
        "genericSku": "WP-NPT-Y62-13-XX-ASM0",
        "sideOptions": [
          {
            "side": "RH",
            "assemblySku": "WP-NPT-Y62-13-RH-ASM0",
            "skuState": "manufacturer-fitting-instruction-verified"
          },
          {
            "side": "LH",
            "assemblySku": null,
            "skuState": "unknown-do-not-infer"
          },
          {
            "side": "BOTH",
            "assemblySku": null,
            "skuState": "option-exists-price-and-composite-sku-not-source-resolved"
          }
        ]
      },
      "finishOptions": [
        "Matte Black Powder Coat"
      ],
      "material": {
        "type": "aluminium",
        "thicknessMm": 4
      },
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "install": {
        "estimateHoursMin": 0.1667,
        "estimateHoursMax": 0.25,
        "sourceVerified": true,
        "difficulty10": 1,
        "labourPriceAud": null,
        "scope": "panel only; accessory mounting time extra"
      },
      "loadGovernance": {
        "status": "engineering-source-conflict",
        "normalizedOperationalLimitKg": 20,
        "normalizedBasis": "conservative workshop ceiling from current fitting instruction pending manufacturer clarification",
        "pdpRatedKgPerPanel": 25,
        "fittingInstructionMaxKg": 20,
        "fittingInstructionRevision": "Rev A",
        "fittingInstructionDate": "2026-05-20"
      },
      "fittingParts": {
        "included": [
          "1 x LH or RH panel",
          "2 x 4.5in Sea Sucker vacuum suction cups",
          "1 x small parts/fastener kit",
          "1 x side-specific bottle opener plate",
          "3 x M6x12 button head cap screws",
          "3 x M6 flat washers",
          "3 x M6 flange nuts",
          "2 x 1/4in x 0.5in UNC high-tensile zinc-plated hex bolts",
          "2 x M6 mudguard washers"
        ],
        "reusedFromParent": [
          "4 x M8x20 black button head bolts from Scout roof-rack second/third cross rails (from rear)",
          "4 x matching M8 black flat washers"
        ],
        "separateFittingKitSku": null,
        "modificationPolicy": "Use only supplied hardware and retained Scout-rack fasteners; manufacturer fitting instruction says product/fixings must not be modified unless stated."
      },
      "maintenance": {
        "periodicSuctionCupCheckRequired": true,
        "note": "Fitting instructions require periodic checks that both suction cups remain locked; re-clean/wet/reseal if they repeatedly release."
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/window-accessory-panel-to-suit-nissan-patrol-y62-2013-on/",
        "fittingInstructionUrl": "https://offroadanimal.com.au/content/Y62%20Window%20Accessory%20Panel%20Fitting%20Instruction%20Rev.A.pdf",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "side",
        "rear34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Exact manufacturer references exist, but no governed/approved Y62 window-panel render layer is present; side variant must also be explicitly resolved."
      },
      "note": "Exact Y62 2013-on fitment and hard Scout-rack dependency are manufacturer-backed. Base current manufacturer price is verified but MSRP is blank. The storefront 4 kg field remains separate because it is not explicitly defined as installed/product-only mass. Load capacity is governed conservatively at 20 kg due to a live 25 kg PDP claim conflicting with the current fitting instruction maximum of 20 kg."
    },
    {
      "id": "oa-y62-rally-hoop-9",
      "brand": "Offroad Animal",
      "name": "Rally Hoop — Offroad Animal 9-inch Arse Kicker — Y62 Cobra route",
      "sku": "TB-COM-RAL-ORA-2X9-ASM0",
      "category": "Protection",
      "status": "confirmed",
      "selected": false,
      "layer": "front-hoop",
      "group": "cobra-top-hoop",
      "pricing": {
        "parts": 330,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 330,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "oa-y62-cobra-frontbar"
        ],
        "conflicts": [
          "oa-y62-toro-frontbar",
          "slx-x1",
          "oa-y62-stealth-top-type-a",
          "oa-y62-night-slapper-9-pair",
          "oa-y62-butt-kicker-7-pair"
        ],
        "reviewRequired": true,
        "routeRequiredParts": [
          "oa-y62-ass-kicker-9-pair",
          "oa-y62-camera-relocation-kit"
        ],
        "staffReviewGates": [
          "Current Cobra Y62 PDP explicitly offers this 9-inch Offroad Animal Rally Hoop as a bolt-on top-hoop option; direct Rally Hoop compatibility table uses older Y62 S5 front-bar part number FB-NPT-S5-20-PR-ASM0 rather than current Cobra SKU FB-NPT-Y62-19-PR-ASM0, so preserve source-nomenclature drift as a staff-review note.",
          "Manufacturer states the Y62 S5 Rally Hoop blocks the factory camera. TB-COM-NIS-CAM-BRKIT must be included on the governed Cobra + Rally Hoop route before quote/workshop release.",
          "This hoop is designed around the Offroad Animal 9-inch Arse Kicker pair only. Do not substitute another lamp geometry without separate fitment evidence.",
          "PRO4X4 labour/freight remain unknown; the 15-minute manufacturer fitting instruction covers hoop fitment only and does not include light wiring or camera relocation."
        ]
      },
      "finishOptions": [
        "Matte Black Powder Coat"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "install": {
        "estimateHoursMin": 0.25,
        "estimateHoursMax": 0.25,
        "sourceVerified": true,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "rally hoop only; excludes driving-light electrical work and camera relocation"
      },
      "fittingParts": {
        "included": [
          "1 x front hoop section",
          "1 x rear hoop section",
          "1 x bag of supplied fasteners"
        ],
        "manufacturerFastenerRoute": [
          "M6 fasteners for hoop section assembly",
          "2 x M10x30 socket-head screws with washers/nuts to secure hoop outer corners to bull bar"
        ],
        "mandatoryRouteProducts": [
          "oa-y62-ass-kicker-9-pair",
          "oa-y62-camera-relocation-kit"
        ]
      },
      "cameraGovernance": {
        "status": "required-on-y62-s5-rally-hoop-route",
        "requiredPartId": "oa-y62-camera-relocation-kit",
        "reason": "Offroad Animal Y62 compatibility data says Rally Hoop blocks camera; current camera-kit instruction explicitly supports Y62 S5 Cobra/Predator bars with Rally Hoop."
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-to-suit-offroad-animal-9-inch-arse-kicker-lights/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "fittingInstructionUrl": "https://offroadanimal.com.au/content/Rally%20Hoop%20Fitting%20Instruction%20Rev.B.pdf",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Manufacturer references exist but no governed Y62 Cobra + Rally Hoop layer is approved; camera-relocation and exact route state must remain visible to staff."
      },
      "note": "Current manufacturer price is verified but MSRP is blank. Storefront 4 kg is preserved separately rather than treated as installed/net-added vehicle mass. Exact current Cobra option evidence supports the route while the standalone hoop table retains an older Y62 S5 bar part number, so that nomenclature drift is not hidden."
    },
    {
      "id": "oa-y62-ass-kicker-9-pair",
      "brand": "Offroad Animal",
      "name": "Ass Kicker 9-inch Round LED Driving Lights with Side Shooter — Pair",
      "sku": "ORA-ALO-GR7-B",
      "category": "Lighting",
      "status": "confirmed",
      "selected": false,
      "layer": "front-lighting",
      "pricing": {
        "parts": 580,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 580,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [
          "oa-y62-night-slapper-9-pair",
          "oa-y62-butt-kicker-7-pair"
        ],
        "reviewRequired": true,
        "routeScope": "Exact current Cobra and Toro PDPs both expose the Ass Kicker 9-inch pair. Cobra has a governed Rally Hoop dependency; Toro parent selection is confirmed but exact lamp bracket geometry remains staff-review.",
        "staffReviewGates": [
          "Confirm the Rally Hoop TB-COM-RAL-ORA-2X9-ASM0 is selected; that hoop is designed only around this 9-inch Offroad Animal light geometry.",
          "Exact Y62 high-beam trigger/interface, switch location and any CAN/high-beam adapter remain installer/electrical review items; no adapter SKU is inferred.",
          "PRO4X4 wiring labour remains unknown. Manufacturer Cobra fitting-partner bundle prices are not converted into standalone PRO4X4 labour.",
          "On Toro, do not auto-add the Cobra Rally Hoop; the Toro is a separate welded-hoop front-bar route and exact spotlight mounting hardware/clearance must be confirmed at fitment."
        ],
        "requiresAnyOf": [
          "oa-y62-cobra-frontbar",
          "oa-y62-toro-frontbar"
        ],
        "routeDependencies": [
          {
            "parentId": "oa-y62-cobra-frontbar",
            "state": "confirmed-current-configurator-option",
            "requiredParts": [
              "oa-y62-rally-hoop-9"
            ],
            "note": "Governed Cobra route uses the exact 9-inch Rally Hoop."
          },
          {
            "parentId": "oa-y62-toro-frontbar",
            "state": "confirmed-current-configurator-option",
            "requiredParts": [],
            "note": "Toro PDP explicitly offers the Ass Kicker pair; exact spotlight mounting points/brackets are not separately published and remain workshop review."
          }
        ]
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": 9,
      "storefrontListedWeightKg": 7,
      "weightNormalization": {
        "basis": "manufacturer explicit specification states 4.5 kg each with wiring harness; pair normalized to 9 kg",
        "quantity": 2,
        "unitWeightKgWithHarness": 4.5,
        "confidence": "manufacturer-explicit-specification"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "electrical install duration not published for the Y62 route"
      },
      "electrical": {
        "voltage": "9-36V DC",
        "powerWPerLight": 205,
        "beamPattern": "Combination",
        "lumenPerLight": 23760,
        "connector": "Deutsch waterproof",
        "triggerIntegration": "engineering-staff-review"
      },
      "fittingParts": {
        "includedPerLight": [
          "1 x light",
          "1 x wiring harness",
          "1 x bolt kit",
          "1 x stainless steel mounting bracket"
        ],
        "pairQuantity": 2
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/offroad-animal-ass-kicker-9-round-led-light-with-side-shooter-pair/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14",
        "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "No approved Y62 driving-light layer was created; this package governs data and route only."
      },
      "note": "Sold as a pair. Manufacturer explicit spec gives 4.5 kg per light including wiring harness, so the governed pair weight is 9 kg; the storefront 7 kg field is retained separately as conflicting storefront metadata rather than overriding the explicit specification."
    },
    {
      "id": "oa-y62-night-slapper-9-pair",
      "brand": "Offroad Animal",
      "name": "Night Slapper 9-inch LED Driving Lights — Pair — Y62 Cobra option",
      "sku": "ORA-ALO-P-R-9-C31D1-AW",
      "category": "Lighting",
      "status": "confirmed",
      "selected": false,
      "layer": "front-lighting",
      "pricing": {
        "parts": 795,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 795,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [
          "oa-y62-ass-kicker-9-pair",
          "oa-y62-butt-kicker-7-pair",
          "oa-y62-rally-hoop-9"
        ],
        "reviewRequired": true,
        "routeScope": "Exact current Cobra and Toro PDPs both expose the Night Slapper 9-inch pair as a spot-light option. Exact mounting bracket/top-hoop position and Series 5 two-light electrical route remain unresolved.",
        "staffReviewGates": [
          "Confirm the physical lamp mounting position, bracket clearance and compatibility with the selected Cobra top-hoop/light-bar configuration before quote/workshop release; the current Cobra PDP proves the option but does not publish that mounting detail.",
          "Do not pair with TB-COM-RAL-ORA-2X9-ASM0. The governed 9-inch Rally Hoop is manufacturer-specific to the Ass Kicker pair, not Night Slapper geometry.",
          "The exact Y62 Series 5 high-beam trigger/harness and light-side connector interface for this two-light set are not source-resolved. Do not reuse the governed WIRQKFT-HIBEAM one-output route without a separately verified two-light electrical design.",
          "PRO4X4 wiring labour/install duration remain unknown.",
          "Toro product-option identity is confirmed, but exact lamp mounting points/brackets and electrical route are not; do not infer them from Cobra geometry."
        ],
        "requiresAnyOf": [
          "oa-y62-cobra-frontbar",
          "oa-y62-toro-frontbar"
        ],
        "routeDependencies": [
          {
            "parentId": "oa-y62-cobra-frontbar",
            "state": "confirmed-current-configurator-option",
            "requiredParts": [],
            "note": "Current Cobra configurator offers Night Slapper as a spotlight choice; exact physical mount remains staff-review."
          },
          {
            "parentId": "oa-y62-toro-frontbar",
            "state": "confirmed-current-configurator-option",
            "requiredParts": [],
            "note": "Current Toro configurator offers Night Slapper as a spotlight choice; exact physical mount remains staff-review."
          }
        ]
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 3,
      "weightNormalization": {
        "basis": "Manufacturer PDP exposes 3.00 KGS while also stating the product is supplied as a pair, but does not define whether that storefront value is pair net mass, shipping mass or another catalogue weight. Normalized weightKg remains null.",
        "confidence": "storefront-weight-semantic-unresolved"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "Y62 physical/electrical installation time not published"
      },
      "electrical": {
        "voltage": "9-30V DC",
        "currentAt13_2V": "9A ±0.9A",
        "powerAt13_2V": "118.8W ±11.88W",
        "effectiveLumenAt13_2V": "9508 lm ±950.8 lm",
        "ingressProtection": [
          "IP68",
          "IP69K"
        ],
        "colorTemperature": "5700K ±500K",
        "connector": null,
        "triggerIntegration": "engineering-staff-review",
        "sourceScopeNote": "Manufacturer table does not explicitly label the current/power/lumen values as per-light or pair totals; preserve values as published and do not derive harness sizing from them."
      },
      "fittingParts": {
        "included": [
          "light pair",
          "covers",
          "wiring looms"
        ],
        "exactMountingHardwareSku": null,
        "exactY62ElectricalHarnessSku": null
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/offroad-animal-night-slapper-9-inch-led-driving-lights/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14",
        "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Exact product and current Y62 Cobra option are source-backed, but mounting position/clearance and no approved visual layer are resolved in WF2."
      },
      "note": "Current manufacturer price $795 is verified while MSRP is blank, so RRP remains unknown. Exact Y62 Cobra option identity is confirmed. Weight, install time, physical mounting route and Series 5 two-light electrical trigger remain deliberately unresolved."
    },
    {
      "id": "oa-y62-rally-hoop-7",
      "brand": "Offroad Animal",
      "name": "Rally Hoop — Butt Kicker 7-inch — Y62 Series 5 engineering route",
      "sku": "TB-COM-RAL-ORA-2X7-ASM0",
      "category": "Protection",
      "status": "engineering",
      "selected": false,
      "layer": "front-hoop",
      "group": "cobra-top-hoop",
      "pricing": {
        "parts": 315,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 315,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [
          "oa-y62-rally-hoop-9",
          "oa-y62-stealth-top-type-a"
        ],
        "reviewRequired": true,
        "vehicleApplicabilityState": "confirmed-y62-series5-family-current-parent-route-engineering",
        "routeRequiredParts": [
          "oa-y62-butt-kicker-7-pair"
        ],
        "conditionalRequiredParts": [
          {
            "item": "oa-y62-camera-relocation-kit",
            "state": "conditional-confirmed-if-current-cobra-parent-route-approved",
            "reason": "Manufacturer 7-inch hoop table says Y62 Series 5 blocks camera; current Y62 camera-kit instruction supports Patrol Y62 S5 Predator/Cobra bars fitted with a Rally Hoop."
          }
        ],
        "candidateParent": {
          "item": "oa-y62-cobra-frontbar",
          "currentSku": "FB-NPT-Y62-19-PR-ASM0",
          "sourceListedHistoricalSku": "FB-NPT-S5-20-PR-ASM0",
          "state": "engineering-historical-parent-nomenclature-current-cobra-configurator-omits-hoop"
        },
        "staffReviewGates": [
          "Offroad Animal currently lists TB-COM-RAL-ORA-2X7-ASM0 in its Nissan Patrol Y62 category and the hoop product table explicitly lists Nissan Patrol Series 5 2020-on, establishing Y62-family applicability.",
          "The hoop product table maps Y62 S5 to historical front-bar SKU FB-NPT-S5-20-PR-ASM0, while the current Cobra SKU is FB-NPT-Y62-19-PR-ASM0 and the current Cobra configurator does not expose this 7-inch hoop. Do not auto-release the current-Cobra parent route until Offroad Animal/dealer engineering explicitly closes that nomenclature/configurator gap.",
          "The product houses only Offroad Animal Butt Kicker 7-inch lights. The governed Butt Kicker pair ORA-ALO-R5-C10D1 is the route light set; substitute lamp geometries require separate evidence.",
          "The Y62 compatibility table says the hoop blocks the camera. If the current Cobra parent route is approved, governed camera relocation kit TB-COM-NIS-CAM-BRKIT is required before workshop/quote release.",
          "Manufacturer rally-hoop fitting instruction gives approximately 15 minutes for hoop fitment only. Electrical wiring, camera relocation and PRO4X4 labour remain separately unresolved."
        ]
      },
      "finishOptions": [
        "Matte Black Powder Coat"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 8,
      "weightNormalization": {
        "basis": "Manufacturer storefront exposes 8.00 KGS but does not define net installed/product/shipping semantics; normalized weightKg remains null.",
        "confidence": "storefront-weight-semantic-unknown"
      },
      "install": {
        "estimateHoursMin": 0.25,
        "estimateHoursMax": 0.25,
        "sourceVerified": true,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "rally hoop only; excludes driving-light electrical work and camera relocation"
      },
      "fittingParts": {
        "documentedFastenerRoute": [
          "Driving-light mounting brackets and fasteners are supplied with the Butt Kicker lights",
          "2 x M6x20 hex bolts with M6 flat washers and flange nuts for lower front/rear hoop section join (non-Quad route)",
          "8 x M6x16 black button-head bolts with M6 flat washers and flange nuts across the top faces (non-Quad route)",
          "2 x M10x30 socket-head cap screws with M10 flat washers/flange nuts and spring washers if supplied, one per side, to secure hoop outer corners to bull bar"
        ],
        "routeProducts": [
          "oa-y62-butt-kicker-7-pair"
        ],
        "conditionalCameraPart": "oa-y62-camera-relocation-kit",
        "separateFittingKitSku": null
      },
      "cameraGovernance": {
        "status": "conditional-required-after-parent-route-approval",
        "requiredPartId": "oa-y62-camera-relocation-kit",
        "reason": "Direct Y62 Series 5 hoop table says Blocks Camera; camera-kit Rev B supports Y62 S5 Predator/Cobra + Rally Hoop and explicitly excludes Toro."
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/",
        "vehicleCategoryUrl": "https://offroadanimal.com.au/nissan/nissan-patrol-y62/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "fittingInstructionUrl": "https://offroadanimal.com.au/content/Rally%20Hoop%20Fitting%20Instruction%20Rev.B.pdf",
        "cameraInstructionUrl": "https://offroadanimal.com.au/content/TB-COM-NIS-CAM-BRKIT%20Fitting%20Instruction%20Rev.B.pdf",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Y62-family identity is source-backed, but exact current-Cobra parent mapping remains engineering and no approved Y62 7-inch Rally Hoop visual state exists."
      },
      "note": "Current manufacturer price $315 is verified while MSRP is blank, so RRP remains unknown. Offroad Animal now lists this SKU in the live Y62 category and explicitly lists Patrol S5 2020-on, but the product table still names historical front-bar SKU FB-NPT-S5-20-PR-ASM0 and the current Cobra configurator omits the hoop. Governed as an engineering route, not a released current-Cobra fitment."
    },
    {
      "id": "oa-y62-butt-kicker-7-pair",
      "brand": "Offroad Animal",
      "name": "Butt Kicker 7-inch Round LED Driving Lights — Pair — Y62 Cobra option",
      "sku": "ORA-ALO-R5-C10D1",
      "category": "Lighting",
      "status": "confirmed",
      "selected": false,
      "layer": "front-lighting",
      "pricing": {
        "parts": 415,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 415,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "conflicts": [
          "oa-y62-ass-kicker-9-pair",
          "oa-y62-night-slapper-9-pair",
          "oa-y62-rally-hoop-9"
        ],
        "reviewRequired": true,
        "routeScope": "Exact current Cobra and Toro PDPs both expose the Butt Kicker 7-inch pair. The dedicated 7-inch Rally Hoop remains an engineering candidate for Cobra only; it is not a Toro dependency.",
        "candidateMountingRoute": {
          "id": "oa-y62-rally-hoop-7",
          "sku": "TB-COM-RAL-ORA-2X7-ASM0",
          "state": "governed-engineering-y62-family-confirmed-current-cobra-parent-unresolved",
          "historicalY62ParentSku": "FB-NPT-S5-20-PR-ASM0",
          "currentCobraSku": "FB-NPT-Y62-19-PR-ASM0",
          "manufacturerCategoryState": "listed-in-current-y62-category",
          "manufacturerNote": "Blocks Camera",
          "cameraState": "blocks-camera-per-historical-y62-table-if-this-hoop-route-is-used"
        },
        "staffReviewGates": [
          "Confirm the physical mounting path selected for the Butt Kicker pair on the current Cobra before quote/workshop release. Do not auto-add TB-COM-RAL-ORA-2X7-ASM0 from historical Y62 bar nomenclature.",
          "If the 7-inch Rally Hoop candidate is engineering-approved for the current Cobra, camera relocation must be separately resolved because the manufacturer Y62 S5 table says the hoop blocks the camera.",
          "Do not pair with the governed 9-inch Rally Hoop TB-COM-RAL-ORA-2X9-ASM0; that hoop is specific to the Ass Kicker 9-inch pair.",
          "Exact Y62 Series 5 two-light high-beam trigger/harness remains unknown; small-DT lamp connector does not by itself prove compatibility with the governed STEDI one-output harness.",
          "PRO4X4 wiring labour/install duration remain unknown.",
          "On Toro, do not auto-add TB-COM-RAL-ORA-2X7-ASM0; the current Toro option is confirmed independently and exact lamp mounting hardware/clearance remains workshop review."
        ],
        "requiresAnyOf": [
          "oa-y62-cobra-frontbar",
          "oa-y62-toro-frontbar"
        ],
        "routeDependencies": [
          {
            "parentId": "oa-y62-cobra-frontbar",
            "state": "confirmed-current-configurator-option-mount-route-unresolved",
            "requiredParts": [],
            "candidateParts": [
              "oa-y62-rally-hoop-7"
            ],
            "note": "Current Cobra offers Butt Kicker lights, but the dedicated 7-inch hoop parent mapping remains engineering."
          },
          {
            "parentId": "oa-y62-toro-frontbar",
            "state": "confirmed-current-configurator-option",
            "requiredParts": [],
            "note": "Current Toro configurator offers the Butt Kicker pair; do not infer use of the Cobra 7-inch Rally Hoop."
          }
        ]
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 7,
      "weightNormalization": {
        "basis": "Manufacturer PDP exposes 7.00 KGS but does not define whether it is pair net mass, shipping mass or another storefront value. Because the product is sold as a pair and no explicit normalized pair/product mass is published, weightKg remains null.",
        "confidence": "storefront-weight-semantic-unresolved"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "Y62 physical/electrical installation time not published"
      },
      "electrical": {
        "voltage": "9-36V DC",
        "powerWPerLight": 105,
        "lumenPerLight": 5800,
        "beamPattern": "Combination",
        "ingressProtection": [
          "IP68",
          "IP69K"
        ],
        "colorTemperature": "6500K",
        "connector": "small DT connector",
        "triggerIntegration": "engineering-staff-review"
      },
      "fittingParts": {
        "includedPerLight": [
          "1 x light",
          "1 x wiring harness",
          "1 x bolt kit",
          "1 x stainless-steel mounting bracket"
        ],
        "pairQuantity": 2,
        "candidateHoopSku": "TB-COM-RAL-ORA-2X7-ASM0",
        "candidateHoopState": "governed-engineering-not-auto-required",
        "candidateHoopId": "oa-y62-rally-hoop-7"
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/offroad-animal-butt-kicker-7-round-led-light-pair/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "candidateHoopUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/",
        "verification": "authoritative-verified-2026-09-14",
        "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Exact product and current Y62 Cobra option are source-backed, but the current-Cobra mounting path/camera consequence is not sufficiently resolved for an approved visual state."
      },
      "note": "Current manufacturer price $415 is verified while MSRP is blank, so RRP remains unknown. The exact light pair is a current Y62 Cobra option. Its dedicated 7-inch Rally Hoop is now a governed engineering record because Offroad Animal lists the exact hoop SKU in the current Y62 category and the hoop table explicitly lists Patrol S5 2020-on; however, the table still names historical parent bar FB-NPT-S5-20-PR-ASM0 and the current Cobra configurator omits the hoop, so it is not auto-required."
    },
    {
      "id": "oa-y62-stealth-top-type-a",
      "brand": "Offroad Animal",
      "name": "Stealth Top Type A — Y62 Cobra route",
      "sku": "TB-COM-PR-ASM0",
      "category": "Protection",
      "status": "confirmed",
      "selected": false,
      "layer": "front-hoop",
      "group": "cobra-top-hoop",
      "pricing": {
        "parts": 235,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 235,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour",
        "freight"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "oa-y62-cobra-frontbar",
          "oa-y62-camera-relocation-kit"
        ],
        "conflicts": [
          "oa-y62-rally-hoop-9",
          "oa-y62-toro-frontbar",
          "slx-x1"
        ],
        "reviewRequired": true,
        "supportedLighting": [
          "oa-y62-22in-slim-lightbar"
        ],
        "staffReviewGates": [
          "Current Y62 Cobra manufacturer page explicitly offers “Stealth Top suit Type A LED Light Predator style” as a top-hoop option; standalone Type A page verifies SKU TB-COM-PR-ASM0 and separately links Patrol Y62 camera-relocation instructions.",
          "The standalone Type A description gives Ranger/Hilux/Raptor as examples and does not explicitly list Y62 in its prose. Vehicle fitment is therefore governed from the current Y62 Cobra option plus the Patrol-specific camera-relocation reference, not from generic wording alone.",
          "Nissan camera relocation kit TB-COM-NIS-CAM-BRKIT is mandatory on the governed Y62 Series 5 Cobra + Stealth Hoop route. Verify camera operation/aim after fitting.",
          "The exact Y62 Series 5 STEDI high-beam adaptor PATROL-Y62S5-ADAPTER and single-output Quick Fit Smart Harness WIRQKFT-HIBEAM are now governed as a matched STEDI trigger route. STEDI explicitly warns the Y62 adaptor is exclusive to its Quick Fit harness electronics and that use with generic harnesses may cause headlight-module failure. This route remains candidate-only for the Offroad Animal light until the OA light connector series/pinout/polarity is source-proven against the STEDI Deutsch DT output.",
          "If no light occupies the Cobra centre light-bar aperture, the current Cobra page offers a front light-area cover plate. Exact cover-plate SKU/price are not source-resolved and remain a workshop/quote check.",
          "PRO4X4 standalone labour/freight remain unknown; 30-minute manufacturer time is for the hoop only and excludes camera relocation and light wiring."
        ]
      },
      "finishOptions": [
        "Matte Black Powder Coat",
        "Colour code — quote"
      ],
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "install": {
        "estimateHoursMin": 0.5,
        "estimateHoursMax": 0.5,
        "sourceVerified": true,
        "difficulty10": 2,
        "labourPriceAud": null,
        "scope": "top hoop only; excludes camera relocation and lighting electrical work"
      },
      "fittingParts": {
        "manufacturerFastenerRoute": [
          "2 x M10 bolts secure hoop directly to Offroad Animal bumper"
        ],
        "mandatoryRouteProducts": [
          "oa-y62-camera-relocation-kit"
        ],
        "compatibleLightBarEnvelope": "up to 22-inch single-row LED light bar",
        "unresolvedConditional": [
          {
            "item": "front light-area cover plate",
            "sku": null,
            "priceAud": null,
            "condition": "Current Cobra page says cover plate is not required when running a light in the middle of the bar; exact SKU/price unresolved for a top-hoop-only light route."
          }
        ]
      },
      "cameraGovernance": {
        "status": "required-on-y62-s5-stealth-hoop-route",
        "requiredPartId": "oa-y62-camera-relocation-kit",
        "reason": "Current Y62 Cobra option labels camera relocation as required for stealth hoop, and the source-resolved camera kit is explicitly for Y62 S5 Cobra/Predator with a 22-inch Stealth Hoop or Rally Hoop."
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/stealth-top-suit-type-a-led-light-predator-style/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Manufacturer references exist but no governed Y62 Cobra + Type A Stealth visual layer has been approved or created."
      },
      "note": "Exact SKU/current manufacturer price and 30-minute/2-of-10 hoop fitment are source-backed. MSRP is blank, so no RRP is inferred. Storefront 4 kg is retained separately because the page does not define installed/net-added mass."
    },
    {
      "id": "oa-y62-22in-slim-lightbar",
      "brand": "Offroad Animal",
      "name": "22-inch Slim LED Light Bar — Y62 front-bar / Stealth support",
      "sku": "ORA-ALO-S5D1-20",
      "category": "Lighting",
      "status": "confirmed",
      "selected": false,
      "layer": "front-lighting",
      "pricing": {
        "parts": 200,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": 200,
        "priceState": "verified-current-manufacturer-price-msrp-blank",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [],
        "requiresAnyOf": [
          "oa-y62-cobra-frontbar",
          "oa-y62-toro-frontbar",
          "oa-y62-stealth-top-type-a"
        ],
        "conflicts": [],
        "reviewRequired": true,
        "routeScope": "Manufacturer-backed Y62 mapping only: current Y62 Cobra and Toro pages offer this light bar, and Type A Stealth accommodates up to a 22-inch single-row light. This is not a stand-alone Y62 fitment claim.",
        "staffReviewGates": [
          "For the governed Cobra Stealth route, confirm oa-y62-stealth-top-type-a is selected and camera relocation is complete before workshop release.",
          "Governed STEDI route: PATROL-Y62S5-ADAPTER + WIRQKFT-HIBEAM. The adapter-to-STEDI-harness interface is manufacturer-backed and required for Y62 Series 5 switching. Do not connect PATROL-Y62S5-ADAPTER to the Offroad Animal supplied/generic harness: STEDI warns non-Quick-Fit use may cause headlight-module failure. Final STEDI-harness-to-OA-light connection stays engineering because OA identifies only a generic “Deutsch waterproof” connector, not the exact DT series/pinout/polarity.",
          "Manufacturer Cobra fitting-partner bundle pricing is evidence only. Do not derive standalone PRO4X4 light-wiring labour by subtraction.",
          "The current Cobra page also offers two light bars, but exact dual-light mounting geometry is not asserted by this record; the governed Stealth Hoop route is a single 22-inch light only.",
          "Toro route is product-option confirmed, but exact light-area hardware/cover-plate selection and wiring labour remain workshop checks; no cover-plate SKU is inferred."
        ],
        "routeDependencies": [
          {
            "parentId": "oa-y62-cobra-frontbar",
            "state": "confirmed-current-configurator-option",
            "additionalGovernedParts": [
              "oa-y62-stealth-top-type-a"
            ],
            "note": "Stealth-top route remains the governed single-light geometry; direct-in-bar Cobra option may also exist but exact geometry is not generalized here."
          },
          {
            "parentId": "oa-y62-toro-frontbar",
            "state": "confirmed-current-configurator-option",
            "additionalGovernedParts": [],
            "note": "Toro PDP explicitly offers the exact 22-inch Slim LED option; exact wiring duration remains staff/electrical review."
          }
        ]
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": 1.7,
      "storefrontListedWeightKg": 2,
      "weightNormalization": {
        "basis": "manufacturer explicit specification states 1.7 kg each with wiring harness; storefront separately lists 2.00 KGS",
        "quantity": 1,
        "unitWeightKgWithHarness": 1.7,
        "confidence": "manufacturer-explicit-specification"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "Y62 electrical install duration not published; hoop installation is governed separately"
      },
      "electrical": {
        "voltage": "9-36V DC",
        "powerW": 100,
        "leds": "12 spot / 8 flood",
        "waterproofRating": "IP68",
        "beamPattern": "Combination",
        "lumen": 11880,
        "luxAt6m": 7740,
        "shootingDistanceHalfLuxM": 1056,
        "connector": "Deutsch waterproof",
        "triggerIntegration": "engineering-staff-review"
      },
      "fittingParts": {
        "included": [
          "1 x light",
          "1 x wiring harness",
          "1 x bolt kit",
          "1 x pair mounting bracket — manufacturer wording"
        ],
        "candidateVehicleElectricalRoute": {
          "state": "engineering-light-interface-unproven",
          "requiredGovernedParts": [
            "stedi-y62s5-highbeam-adapter",
            "stedi-single-smart-harness"
          ],
          "vehicleSideState": "confirmed-stedi-matched-route",
          "lightSideState": "unproven-connector-series-pinout-polarity",
          "prohibition": "Do not connect PATROL-Y62S5-ADAPTER to the Offroad Animal supplied/generic harness. STEDI states the Y62 adapter is exclusively compatible with STEDI Quick Fit harness electronics and generic-harness use may cause headlight-module failure.",
          "constraint": "WIRQKFT-HIBEAM exposes a Deutsch DT light output while the OA light only states “Deutsch waterproof”. Exact DT family, gender, pinout and polarity are not source-proven; staff/electrical verification or an approved adapter is required before release."
        }
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/offroad-animal-22-slim-led-light-bar/",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [
        "front34"
      ],
      "visual": {
        "status": "staff-review",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Product and Y62 mounting routes are source-backed, but no approved Y62 light-bar visual layer was created in WF2."
      },
      "note": "Current manufacturer price is verified while MSRP is blank, so RRP remains unknown. Explicit manufacturer specification gives 1.7 kg including wiring harness and overrides the less-specific 2.00 KGS storefront field for normalized product mass."
    },
    {
      "id": "stedi-y62s5-highbeam-adapter",
      "brand": "STEDI",
      "name": "Nissan Patrol Y62 Series 5 High Beam Adaptor",
      "sku": "PATROL-Y62S5-ADAPTER",
      "category": "Electrical",
      "status": "confirmed",
      "selected": false,
      "layer": "electrical-trigger",
      "pricing": {
        "parts": 36,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentAuDealerPriceAud": 36,
        "priceState": "verified-current-au-dealer-price-rrp-unknown",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "stedi-single-smart-harness"
        ],
        "conflicts": [],
        "reviewRequired": true,
        "routeScope": "Exact Y62 Series 5 vehicle-side high-beam trigger component for STEDI Quick Fit/Smart Harness routes only.",
        "prohibitedIntegrations": [
          "Offroad Animal supplied/generic light harness directly",
          "non-STEDI generic high-beam harnesses"
        ],
        "staffReviewGates": [
          "STEDI states this adaptor is designed only for Nissan Patrol Y62 Series 5 models from 2020 onward and exclusively for STEDI Quick Fit harnesses.",
          "Do not connect this adaptor directly to the Offroad Animal supplied/generic harness. STEDI explicitly warns generic-harness use is likely to cause headlight-module failure because the STEDI Quick Fit harness contains the electronics required to neutralise Series 5 switching.",
          "For the governed one-light route, pair with WIRQKFT-HIBEAM. Other STEDI Quick Fit harness SKUs may be valid but are outside this package until separately governed.",
          "PRO4X4 install labour/time remain unknown; manufacturer describes plug-and-play fitment but publishes no timed installation allowance."
        ]
      },
      "finishOptions": [],
      "weightKg": 0.3,
      "weightNormalization": {
        "basis": "STEDI product specification states 0.3 kg",
        "confidence": "brand-product-specification"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "vehicle-specific high-beam adaptor only; timed installation not published"
      },
      "electrical": {
        "vehicleConnector": "Nissan Y62 Patrol Series 5 LED headlight adaptor",
        "harnessCompatibility": "STEDI Quick Fit only",
        "highBeamTrigger": true,
        "switchingRequirement": "STEDI Quick Fit electronics required to neutralise Y62 Series 5 switching"
      },
      "fittingParts": {
        "included": [
          "1 x Nissan Y62 Patrol Series 5 LED headlight adaptor"
        ],
        "requiredGovernedRoutePart": "stedi-single-smart-harness"
      },
      "source": {
        "authority": "STEDI",
        "url": "https://stediuk.com/products/stedi-nissan-patrol-y62-series-5-high-beam-adaptor",
        "supportUrl": "https://support.stedi.com.au/hc/en-us/articles/7920536700185-Headlight-Piggy-Back-Adaptor",
        "auPriceUrl": "https://www.roofracksgalore.com.au/stedi-patrol-y62-series-5-high-beam-adapter-patrol-y62s5-adapter",
        "verification": "authoritative-fitment-spec-plus-current-au-dealer-price-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [],
      "visual": {
        "status": "non-visual",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Electrical trigger/support component; no customer visual layer required."
      },
      "note": "Exact vehicle-specific STEDI SKU and 0.3 kg product specification are source-backed. Current Australian dealer price $36 is stored as current dealer price only; manufacturer RRP is not asserted. The STEDI-only harness dependency is a hard safety/fitment gate."
    },
    {
      "id": "stedi-single-smart-harness",
      "brand": "STEDI",
      "name": "Single Connector Plug & Play Smart Harness — Y62 Series 5 route",
      "sku": "WIRQKFT-HIBEAM",
      "category": "Electrical",
      "status": "confirmed",
      "selected": false,
      "layer": "electrical-harness",
      "pricing": {
        "parts": 45,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentAuDealerPriceAud": 45,
        "priceState": "verified-current-au-dealer-price-rrp-unknown",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "stedi-y62s5-highbeam-adapter"
        ],
        "conflicts": [],
        "reviewRequired": true,
        "routeScope": "Governed single-light STEDI Quick Fit harness for Y62 Series 5 when paired with PATROL-Y62S5-ADAPTER.",
        "candidateLightingRoutes": [
          {
            "productId": "oa-y62-22in-slim-lightbar",
            "state": "engineering-connector-interface-unproven",
            "reason": "STEDI harness light output is Deutsch DT waterproof. Offroad Animal light states only “Deutsch waterproof”; exact connector family/gender/pinout/polarity is not source-resolved."
          }
        ],
        "staffReviewGates": [
          "PATROL-Y62S5-ADAPTER is mandatory for the governed Y62 Series 5 route; do not use the included generic HB3/H4 piggybacks on this vehicle route.",
          "Harness electronics are source-backed for positive/negative switching and STEDI specifically requires its Quick Fit electronics with the Y62 Series 5 adaptor.",
          "The STEDI light output is a Deutsch DT waterproof connector. The OA 22-inch light connector cannot be auto-declared compatible until exact connector family/gender/pinout/polarity is verified.",
          "If connector/pinout differs, use only an approved adapter/retermination method signed off by an auto electrician; do not improvise a direct connection.",
          "PRO4X4 install labour/time remain unknown."
        ]
      },
      "finishOptions": [],
      "weightKg": null,
      "retailerListedWeightKg": [
        0.63,
        1
      ],
      "weightNormalization": {
        "basis": "Current retailer listings conflict at approximately 0.63 kg and 1.0 kg; no brand-net product mass is published in the governing product specification, so normalized weightKg remains null.",
        "confidence": "unresolved-retailer-weight-conflict"
      },
      "install": {
        "estimateHoursMin": null,
        "estimateHoursMax": null,
        "sourceVerified": false,
        "difficulty10": null,
        "labourPriceAud": null,
        "scope": "electrical harness install; no timed Y62 allowance published"
      },
      "electrical": {
        "wiringRating": "12V DC 30A",
        "relayRating": "12V DC 60A",
        "fuseA": 30,
        "maxLoadAAt12V": 25,
        "lightConnector": "Deutsch DT waterproof",
        "outputCount": 1,
        "switching": "built-in electronics detect positive or negative switched systems"
      },
      "fittingParts": {
        "included": [
          "1 x Quick Fit single-connector Smart Harness",
          "1 x HB3 piggyback adaptor",
          "1 x H4 piggyback adaptor",
          "1 x DTP-to-DT reducer",
          "1 x instruction leaflet",
          "ON/OFF isolator switch / relay / fuse assembly per product specification"
        ],
        "y62RouteUses": [
          "PATROL-Y62S5-ADAPTER instead of generic HB3/H4 piggyback"
        ]
      },
      "source": {
        "authority": "STEDI",
        "url": "https://stediuk.com/collections/best-sellers/products/stedi-plug-and-play-wiring-harness-high-beam-driving-light-single-connector",
        "auPriceUrl": "https://www.roofracksgalore.com.au/camping-offroad/vehicle-accessories/led-lighting/wiring-looms",
        "weightCrossCheckUrls": [
          "https://bdoffroad.com.au/product/single-connector-plug-play-smart-harness-high-beam-driving-light-wiring/",
          "https://www.carracks.com.au/products/stedi-single-connector-plug-play-smart-harness-high-beam-driving-light-wiring-wirqkft-hibeam"
        ],
        "verification": "authoritative-product-spec-plus-current-au-price-and-weight-conflict-captured-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [],
      "visual": {
        "status": "non-visual",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Electrical harness/support component; no customer visual layer required."
      },
      "note": "SKU/specification and current Australian $45 dealer price are source-backed; RRP is not asserted. Weight stays unknown because current retailer listings disagree. This is the safe governed vehicle-side bridge with PATROL-Y62S5-ADAPTER, but the final STEDI-DT-to-Offroad-Animal-light connector/pinout remains engineering until explicitly proven."
    },
    {
      "id": "oa-y62-camera-relocation-kit",
      "brand": "Offroad Animal",
      "name": "Nissan Camera Relocation Kit — Y62 Series 5 Rally/Stealth Hoop",
      "sku": "TB-COM-NIS-CAM-BRKIT",
      "category": "Electrical",
      "status": "confirmed",
      "selected": false,
      "layer": "front-camera",
      "pricing": {
        "parts": null,
        "labour": null,
        "paint": null,
        "freight": null,
        "engineering": null
      },
      "pricingMeta": {
        "rrpAud": null,
        "currentManufacturerPriceAud": null,
        "priceState": "exact-sku-verified-price-not-source-resolved",
        "capturedAt": "2026-09-14"
      },
      "pricingRequired": [
        "parts",
        "labour"
      ],
      "fitment": {
        "compatibleVehicleIds": [
          "nissan-y62-warrior-2025"
        ],
        "requiredParts": [
          "oa-y62-cobra-frontbar"
        ],
        "requiresAnyOf": [
          "oa-y62-rally-hoop-9",
          "oa-y62-stealth-top-type-a",
          "oa-y62-rally-hoop-7"
        ],
        "conflicts": [
          "oa-y62-toro-frontbar"
        ],
        "reviewRequired": true,
        "exclusiveRoutes": [
          {
            "bar": "oa-y62-cobra-frontbar",
            "topHoop": "oa-y62-rally-hoop-9",
            "state": "confirmed",
            "rule": "Y62 Series 5 Cobra + Rally Hoop route."
          },
          {
            "bar": "oa-y62-cobra-frontbar",
            "topHoop": "oa-y62-stealth-top-type-a",
            "state": "confirmed",
            "rule": "Y62 Series 5 Cobra + 22-inch Type A Stealth Hoop route."
          }
        ],
        "routeRule": "Current Rev B instruction says kit suits Nissan Patrol Y62 Series 5 only on Offroad Animal Predator/Cobra bars fitted with a 22-inch Stealth Hoop or Rally Hoop; it does not suit Toro or bars without top hoops.",
        "staffReviewGates": [
          "Verify camera image/operation after relocation before vehicle release.",
          "The fitting instruction warns the camera harness may be too short and may need wire extension; extension equipment is not supplied.",
          "Exact kit retail/RRP and PRO4X4 labour remain unknown; do not infer price from bull-bar option bundles."
        ]
      },
      "finishOptions": [
        "Black"
      ],
      "weightKg": null,
      "install": {
        "estimateHoursMin": 0.25,
        "estimateHoursMax": 0.25,
        "sourceVerified": true,
        "difficulty10": null,
        "labourPriceAud": null
      },
      "fittingParts": {
        "supplied": [
          "B-1467 camera relocation bracket",
          "B-1264 camera cover bracket",
          "2 x M6x16 black button-head bolts",
          "2 x M6 black flat washers",
          "2 x M6 flange nuts"
        ],
        "reusedFactory": [
          "factory Phillips-head screws retaining camera/harness"
        ],
        "conditionalNotSupplied": [
          "automotive electrical wire / solder / heatshrink if factory camera harness requires extension"
        ]
      },
      "source": {
        "authority": "Offroad Animal",
        "url": "https://offroadanimal.com.au/content/TB-COM-NIS-CAM-BRKIT%20Fitting%20Instruction%20Rev.B.pdf",
        "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
        "verification": "authoritative-verified-2026-09-14"
      },
      "visualisable": false,
      "supportedViews": [],
      "visual": {
        "status": "non-visual",
        "referenceAvailable": true,
        "approved": false,
        "layerId": null,
        "policy": "REFERENCE_BACKED_APPROVED_VISUALS_ONLY",
        "reason": "Support/electrical fitment part; no customer render layer required."
      },
      "note": "Exact Y62 Series 5 camera-relocation SKU and 15-minute manufacturer fit time are verified. Price and weight remain unknown. The kit is mandatory on governed Y62 Cobra + 9-inch Rally Hoop and Cobra + Type A Stealth Hoop routes; it is also the conditional camera route for the engineering 7-inch Rally Hoop if its current-Cobra parent mapping is approved. It is explicitly incompatible with Toro."
    }
  ]
};
