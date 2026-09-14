(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Y62_SOURCE_EVIDENCE=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  "schemaVersion": "0.26.25",
  "capturedAt": "2026-09-14",
  "vehicleId": "nissan-y62-warrior-2025",
  "sources": [
    {
      "id": "oa-y62-toro-frontbar",
      "sku": "FB-NPT-Y62-19-TOR-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 3990,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 77,
      "weightNormalization": "PDP exposes a 77.00 KGS storefront field but does not identify installed/net-added mass; normalized weightKg remains null.",
      "installTimeHours": {
        "min": 5,
        "max": 6
      },
      "installDifficulty10": 5,
      "fitment": "Nissan Patrol Y62 Series 5/current; manufacturer page states Series 5 TI from MY19 on and offers Warrior replacement bash plate.",
      "url": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "vehicleCategoryUrl": "https://offroadanimal.com.au/nissan/nissan-patrol-y62/",
      "sourceType": "manufacturer",
      "requiredForWarrior": [
        "oa-y62-warrior-lower-bash"
      ],
      "knownConflicts": [
        "slx-x1",
        "oa-y62-cobra-frontbar"
      ],
      "unresolvedStates": [
        "PDP wording says MY22 vehicles require grille cut; exact scope for MY25 is not explicit.",
        "No exact Warrior-mandatory camera-relocation SKU is stated.",
        "PRO4X4 standalone labour/freight are unknown; manufacturer fitting-partner bundles are not treated as PRO4X4 labour.",
        "Exact spotlight mounting brackets/clearance and all standalone PRO4X4 accessory labour remain unresolved; configurator bundle prices are evidence only."
      ],
      "currentManufacturerOptionSet": {
        "lightingSkus": [
          "ORA-ALO-S5D1-20",
          "ORA-ALO-GR7-B",
          "ORA-ALO-P-R-9-C31D1-AW",
          "ORA-ALO-R5-C10D1"
        ],
        "recoverySkus": [
          "11EXPEDITION12V"
        ],
        "warriorSupportSkus": [
          "FB-NPT-Y62-19-PR-ASM6"
        ],
        "sourceState": "confirmed-current-configurator"
      },
      "fittingPartnerBundlePricingAud": {
        "frontBarOnly": 900,
        "frontBarPlusOneLightBarOrDrivingLights": 1200,
        "frontBarPlusLightBarAndDrivingLights": 1350,
        "frontBarPlusWinch": 1200,
        "frontBarPlusOneLightBarOrDrivingLightsAndWinch": 1500,
        "frontBarPlusLightBarDrivingLightsAndWinch": 1650,
        "standaloneLabourNormalization": "not-derived"
      }
    },
    {
      "id": "runva-11expedition-y62-toro",
      "sku": "11EXPEDITION12V",
      "rrpAud": 1295,
      "currentManufacturerPriceAud": 1295,
      "currentOffroadAnimalPriceAud": 1295,
      "priceState": "manufacturer-direct-price-and-offroad-animal-price-match",
      "weightKg": 29,
      "fittedWeightKg": 29,
      "offroadAnimalStorefrontListedWeightKg": 31,
      "offroadAnimalShippingWeightKg": 39,
      "weightNormalization": "Runva direct manufacturer explicitly publishes FITTED WEIGHT 29KG; Offroad Animal storefront 31 kg and shipping 39 kg are retained separately.",
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Exact current Y62 Toro PDP offers Runva 11Expedition winch 12V. Separate Runva and Offroad Animal product pages resolve the exact SKU 11EXPEDITION12V. Toro accepts low-mount winches up to 12,000 lb; the winch is rated 11,000 lb.",
      "url": "https://www.runvawinch.com.au/11expedition-12v-with-synthetic-rope",
      "secondaryUrl": "https://offroadanimal.com.au/runva-11expedition-winch-12v/",
      "toroFitmentUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "sourceType": "manufacturer-cross-confirmed",
      "requiredParentSkus": [
        "FB-NPT-Y62-19-TOR-ASM0"
      ],
      "ratedLinePullLb": 11000,
      "barRatedMaxWinchLb": 12000,
      "mountingBoltPatternMm": {
        "width": 254,
        "depth": 114.3,
        "hardware": "4 x M10 bolts"
      },
      "fittingPartnerBundlePricingAud": {
        "frontBarOnly": 900,
        "frontBarPlusWinch": 1200,
        "standaloneWinchLabourNormalized": null
      },
      "fittingPartsState": {
        "requiredGovernedPart": [
          "oa-y62-toro-frontbar"
        ],
        "includedOrParentSupplied": [
          "winch four-M10 mounting hardware",
          "Toro low-mount winch cradle/provision",
          "Toro number-plate flip",
          "2 x 1.8 m Runva battery leads"
        ],
        "unresolvedExternalParts": [
          "exact battery isolation hardware if PRO4X4 installation standard requires one",
          "additional cable protection/extension if final battery routing requires it"
        ],
        "inferencePolicy": "do not invent an isolator SKU or standalone install price from fitting-partner bundles"
      },
      "unresolvedStates": [
        "Standalone Y62 winch install duration and PRO4X4 labour are not source-resolved.",
        "Exact control-box/clutch-access arrangement after final accessory selection remains workshop check.",
        "No separate battery-isolator SKU is published as mandatory for this exact route."
      ]
    },
    {
      "id": "oa-y62-cobra-frontbar",
      "sku": "FB-NPT-Y62-19-PR-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 3415,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 65,
      "weightNormalization": "PDP exposes a 65.00 KGS storefront field but does not identify installed/net-added mass; normalized weightKg remains null.",
      "installTimeHours": {
        "min": 4,
        "max": 4
      },
      "installDifficulty10": 5,
      "fitment": "Nissan Patrol Y62 Series 5/current; manufacturer page states Series 5 TI from MY19 on and offers Warrior replacement bash plate.",
      "url": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "vehicleCategoryUrl": "https://offroadanimal.com.au/nissan/nissan-patrol-y62/",
      "sourceType": "manufacturer",
      "requiredForWarrior": [
        "oa-y62-warrior-lower-bash"
      ],
      "knownConflicts": [
        "slx-x1",
        "oa-y62-toro-frontbar"
      ],
      "unresolvedStates": [
        "Lower-bash PDP uses Toro/Predator parent terminology while this current Y62 product is named Cobra; preserve staff review.",
        "PDP wording says MY22 vehicles require grille cut; exact scope for MY25 is not explicit.",
        "Camera relocation is not a universal bare-Cobra requirement. Exact kit TB-COM-NIS-CAM-BRKIT is source-resolved for Y62 S5 Cobra/Predator when fitted with Rally Hoop or 22-inch Stealth Hoop; route selection controls the requirement."
      ]
    },
    {
      "id": "oa-y62-warrior-lower-bash",
      "sku": "FB-NPT-Y62-19-PR-ASM6",
      "rrpAud": null,
      "currentManufacturerPriceAud": 420,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 8,
      "weightNormalization": "PDP exposes an 8.00 KGS storefront field but does not identify installed/net-added mass; normalized weightKg remains null.",
      "installTimeHours": null,
      "fitment": "Manufacturer title is Y62 Lower Bash Plate Kit to suit Warrior; page explicitly says it is required on Warrior and only fits Offroad Animal bars.",
      "url": "https://offroadanimal.com.au/y62-lower-bash-plate-kit-to-suit-warrior/",
      "sourceType": "manufacturer",
      "material": {
        "type": "steel",
        "thicknessMm": 3
      },
      "requiresAnyOf": [
        "oa-y62-toro-frontbar",
        "oa-y62-cobra-frontbar"
      ],
      "unresolvedStates": [
        "PDP says compatible with Toro and Predator bars while current Y62 secondary bar is sold as Cobra; bar PDP independently exposes the Warrior bash option, so exact parent naming remains a staff-review gate.",
        "Installation duration and standalone labour are not published on the PDP."
      ]
    },
    {
      "id": "oa-y62-window-panel",
      "sku": "WP-NPT-Y62-13-XX-ASM0",
      "verifiedVariantSku": "WP-NPT-Y62-13-RH-ASM0",
      "variantSkuState": {
        "generic": "verified-live-pdp",
        "RH": "verified-fitting-instruction",
        "LH": "unknown-do-not-infer",
        "both": "option-exists-composite-sku-unknown"
      },
      "rrpAud": null,
      "currentManufacturerPriceAud": 635,
      "priceState": "verified-current-manufacturer-base-price-msrp-blank",
      "priceScope": "base/single-panel option; both-side option price not source-resolved",
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "weightNormalization": "PDP exposes 4.00 KGS but does not define installed/product-only/net-added mass; normalized weightKg remains null.",
      "installTimeHours": {
        "min": 0.1667,
        "max": 0.25
      },
      "installDifficulty10": 1,
      "installScope": "panel only; accessory mounting time extra",
      "fitment": "2013-on Nissan Patrol Y62; only compatible with Offroad Animal Scout roof rack RR-NPT-Y62-13-SCT-ASM0.",
      "url": "https://offroadanimal.com.au/window-accessory-panel-to-suit-nissan-patrol-y62-2013-on/",
      "fittingInstructionUrl": "https://offroadanimal.com.au/content/Y62%20Window%20Accessory%20Panel%20Fitting%20Instruction%20Rev.A.pdf",
      "sourceType": "manufacturer",
      "requiredParts": [
        "scout-rack"
      ],
      "loadRating": {
        "pdpKgPerPanel": 25,
        "fittingInstructionMaxKg": 20,
        "normalizedOperationalLimitKg": 20,
        "state": "source-conflict-conservative-workshop-limit",
        "instructionRevision": "Rev A",
        "instructionDate": "2026-05-20"
      },
      "suppliedParts": [
        "LH or RH panel",
        "2 x 4.5in Sea Sucker vacuum suction cups",
        "small fastener kit",
        "side-specific bottle opener plate"
      ],
      "reusedParentHardware": [
        "4 x M8x20 black button head bolts",
        "4 x M8 black flat washers"
      ],
      "unresolvedStates": [
        "Live PDP uses generic XX assembly SKU; fitting instruction explicitly verifies RH assembly SKU WP-NPT-Y62-13-RH-ASM0, but authoritative LH assembly SKU was not source-resolved.",
        "PDP states 25 kg per panel while Rev A fitting instruction says do not exceed 20 kg; preserve conflict and use 20 kg only as conservative workshop ceiling pending manufacturer clarification.",
        "Both-side option exists but exact composite/bundle SKU and option-adjusted price were not source-resolved.",
        "PRO4X4 labour and freight remain unknown."
      ]
    },
    {
      "id": "oa-y62-rally-hoop-9",
      "sku": "TB-COM-RAL-ORA-2X9-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 330,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "weightNormalization": "Standalone hoop PDP exposes 4.00 KGS but does not define installed/net-added mass; normalized Y62 weightKg remains null.",
      "installTimeHours": {
        "min": 0.25,
        "max": 0.25
      },
      "installDifficulty10": null,
      "fitment": "Current Y62 Cobra PDP explicitly offers this exact 9-inch Offroad Animal Rally Hoop as a bolt-on top-hoop option. Standalone hoop table also lists Nissan Patrol S5 2020-on but uses older bar part number FB-NPT-S5-20-PR-ASM0 and says it blocks the camera.",
      "url": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-to-suit-offroad-animal-9-inch-arse-kicker-lights/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "fittingInstructionUrl": "https://offroadanimal.com.au/content/Rally%20Hoop%20Fitting%20Instruction%20Rev.B.pdf",
      "sourceType": "manufacturer",
      "requiredParts": [
        "oa-y62-cobra-frontbar"
      ],
      "routeRequiredParts": [
        "oa-y62-ass-kicker-9-pair",
        "oa-y62-camera-relocation-kit"
      ],
      "knownConflicts": [
        "oa-y62-toro-frontbar",
        "slx-x1"
      ],
      "unresolvedStates": [
        "Standalone hoop compatibility table uses historical Y62 S5 front-bar part number FB-NPT-S5-20-PR-ASM0 while the current Cobra PDP SKU is FB-NPT-Y62-19-PR-ASM0. Current Cobra option evidence confirms the route, but the nomenclature drift is retained for staff review.",
        "PRO4X4 labour and freight are unknown; 15-minute manufacturer fitting instruction excludes driving-light wiring and camera-relocation work."
      ]
    },
    {
      "id": "oa-y62-ass-kicker-9-pair",
      "sku": "ORA-ALO-GR7-B",
      "rrpAud": null,
      "currentManufacturerPriceAud": 580,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": 9,
      "storefrontListedWeightKg": 7,
      "weightNormalization": "Manufacturer specification states 4.5 kg each with wiring harness and product is sold as a pair; normalized pair weight is 9 kg. Storefront 7.00 KGS field is retained separately as conflicting metadata.",
      "installTimeHours": null,
      "fitment": "Current Y62 Cobra PDP offers the Ass Kicker 9-inch pair; governed Y62 route constrains the pair to Rally Hoop TB-COM-RAL-ORA-2X9-ASM0, whose PDP states it is designed only around these lights.",
      "url": "https://offroadanimal.com.au/offroad-animal-ass-kicker-9-round-led-light-with-side-shooter-pair/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "sourceType": "manufacturer",
      "requiredParts": [
        "oa-y62-rally-hoop-9"
      ],
      "electrical": {
        "voltage": "9-36V DC",
        "powerWPerLight": 205,
        "lumenPerLight": 23760,
        "beamPattern": "Combination",
        "connector": "Deutsch waterproof"
      },
      "unresolvedStates": [
        "Exact Y62 high-beam trigger/interface, switch integration and any CAN/high-beam adapter SKU are not source-resolved.",
        "PRO4X4 wiring labour and install duration remain unknown."
      ],
      "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "toroRouteState": "confirmed-current-configurator-option-physical-mount-and-electrical-labour-staff-review"
    },
    {
      "id": "oa-y62-stealth-top-type-a",
      "sku": "TB-COM-PR-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 235,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "weightNormalization": "Standalone hoop PDP exposes 4.00 KGS but does not define installed/net-added mass; normalized Y62 weightKg remains null.",
      "installTimeHours": {
        "min": 0.5,
        "max": 0.5
      },
      "installDifficulty10": 2,
      "fitment": "Current Y62 Cobra PDP explicitly offers Stealth Top Type A as a bolt-on top-hoop option. Standalone Type A PDP verifies SKU/current price, accommodates up to a 22-inch LED light bar, and links Patrol Y62 camera-relocation instructions.",
      "url": "https://offroadanimal.com.au/stealth-top-suit-type-a-led-light-predator-style/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "sourceType": "manufacturer",
      "requiredParts": [
        "oa-y62-cobra-frontbar",
        "oa-y62-camera-relocation-kit"
      ],
      "supportedLighting": [
        "oa-y62-22in-slim-lightbar"
      ],
      "knownConflicts": [
        "oa-y62-rally-hoop-9",
        "oa-y62-toro-frontbar",
        "slx-x1"
      ],
      "unresolvedStates": [
        "Standalone Type A prose names Ranger/Hilux/Raptor examples rather than explicitly listing Y62; exact Y62 fitment is therefore governed from the current Y62 Cobra option and Patrol-specific camera-relocation reference.",
        "Exact Y62 high-beam trigger/switch/CAN interface for hoop-mounted lighting is not source-resolved.",
        "Current Cobra page offers a centre light-area cover plate when no centre light is fitted, but exact cover-plate SKU/price were not source-resolved.",
        "PRO4X4 labour and freight are unknown; 30-minute manufacturer time covers hoop fitment only."
      ]
    },
    {
      "id": "oa-y62-22in-slim-lightbar",
      "sku": "ORA-ALO-S5D1-20",
      "rrpAud": null,
      "currentManufacturerPriceAud": 200,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": 1.7,
      "storefrontListedWeightKg": 2,
      "weightNormalization": "Manufacturer specification states 1.7 kg each with wiring harness; storefront separately exposes 2.00 KGS. Normalized product mass uses the explicit 1.7 kg specification.",
      "installTimeHours": null,
      "fitment": "Current Y62 Cobra and Toro PDPs offer the Offroad Animal 22-inch Slim LED light bar. Type A Stealth PDP accommodates up to a 22-inch single-row light; governed Y62 mapping is constrained to those verified parents.",
      "url": "https://offroadanimal.com.au/offroad-animal-22-slim-led-light-bar/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "sourceType": "manufacturer",
      "requiresAnyOf": [
        "oa-y62-cobra-frontbar",
        "oa-y62-toro-frontbar",
        "oa-y62-stealth-top-type-a"
      ],
      "electrical": {
        "voltage": "9-36V DC",
        "powerW": 100,
        "leds": "12 Spot / 8 Flood",
        "waterproofRating": "IP68",
        "beamPattern": "Combination",
        "lumen": 11880,
        "luxAt6m": 7740,
        "shootingDistanceHalfLuxM": 1056,
        "connector": "Deutsch waterproof"
      },
      "suppliedParts": [
        "1 x light",
        "1 x wiring harness",
        "1 x bolt kit",
        "1 x pair mounting bracket — manufacturer wording"
      ],
      "unresolvedStates": [
        "PATROL-Y62S5-ADAPTER + WIRQKFT-HIBEAM are now governed as the matched STEDI vehicle-side trigger route. STEDI explicitly warns the Y62 adaptor must use STEDI Quick Fit harness electronics and that generic-harness use may cause headlight-module failure. Final connection from the STEDI Deutsch DT light output to ORA-ALO-S5D1-20 remains engineering because Offroad Animal publishes only generic ‘Deutsch waterproof’ connector wording, not the exact connector family/gender/pinout/polarity.",
        "Standalone Y62 electrical install duration and PRO4X4 labour remain unknown.",
        "Cobra page offers a two-light-bar option, but exact dual-light mounting geometry is not asserted by this governed Stealth Hoop route."
      ],
      "toroRouteState": "confirmed-current-configurator-option-physical-mount-and-electrical-labour-staff-review"
    },
    {
      "id": "stedi-y62s5-highbeam-adapter",
      "sku": "PATROL-Y62S5-ADAPTER",
      "rrpAud": null,
      "currentAuDealerPriceAud": 36,
      "priceState": "verified-current-au-dealer-price-rrp-unknown",
      "weightKg": 0.3,
      "weightNormalization": "STEDI product specification explicitly states 0.3 kg.",
      "installTimeHours": null,
      "fitment": "STEDI product data: Nissan Patrol Y62 Series 5 only, from 2020 onward. Adapter is exclusively compatible with STEDI Quick Fit harnesses; STEDI warns generic-harness use may cause headlight-module failure.",
      "url": "https://stediuk.com/products/stedi-nissan-patrol-y62-series-5-high-beam-adaptor",
      "supportUrl": "https://support.stedi.com.au/hc/en-us/articles/7920536700185-Headlight-Piggy-Back-Adaptor",
      "auPriceUrl": "https://www.roofracksgalore.com.au/stedi-patrol-y62-series-5-high-beam-adapter-patrol-y62s5-adapter",
      "sourceType": "brand-product-specification-plus-au-dealer-price",
      "requiredParts": [
        "stedi-single-smart-harness"
      ],
      "knownConflicts": [],
      "safetyConstraints": [
        "Do not use with the Offroad Animal supplied/generic harness directly.",
        "STEDI states its Quick Fit harness electronics are required to neutralise Y62 Series 5 switching; generic harness use may cause headlight-module failure."
      ],
      "unresolvedStates": [
        "Manufacturer/Australian RRP not source-resolved; current AU dealer price only.",
        "Timed installation and PRO4X4 labour are unknown.",
        "Other STEDI Quick Fit harness SKUs are outside this package until separately governed."
      ]
    },
    {
      "id": "stedi-single-smart-harness",
      "sku": "WIRQKFT-HIBEAM",
      "rrpAud": null,
      "currentAuDealerPriceAud": 45,
      "priceState": "verified-current-au-dealer-price-rrp-unknown",
      "weightKg": null,
      "retailerListedWeightKg": [
        0.63,
        1
      ],
      "weightNormalization": "Retailer product weights conflict at approximately 0.63 kg and 1.0 kg; governing STEDI product specification does not publish a net product mass, so normalized weightKg remains null.",
      "installTimeHours": null,
      "fitment": "Universal STEDI Quick Fit single-output harness, governed for Y62 Series 5 only when paired with PATROL-Y62S5-ADAPTER. STEDI output is Deutsch DT waterproof; 12V 30A kit, 60A relay, 30A fuse, max load 25A at 12V.",
      "url": "https://stediuk.com/collections/best-sellers/products/stedi-plug-and-play-wiring-harness-high-beam-driving-light-single-connector",
      "auPriceUrl": "https://www.roofracksgalore.com.au/camping-offroad/vehicle-accessories/led-lighting/wiring-looms",
      "weightCrossCheckUrls": [
        "https://bdoffroad.com.au/product/single-connector-plug-play-smart-harness-high-beam-driving-light-wiring/",
        "https://www.carracks.com.au/products/stedi-single-connector-plug-play-smart-harness-high-beam-driving-light-wiring-wirqkft-hibeam"
      ],
      "sourceType": "brand-product-specification-plus-au-dealer-price",
      "requiredParts": [
        "stedi-y62s5-highbeam-adapter"
      ],
      "candidateLightingRoutes": [
        {
          "productId": "oa-y62-22in-slim-lightbar",
          "state": "engineering-connector-interface-unproven",
          "reason": "STEDI exposes Deutsch DT; OA publishes only generic Deutsch waterproof connector wording. Exact connector family/gender/pinout/polarity not proven."
        }
      ],
      "unresolvedStates": [
        "Manufacturer/Australian RRP not source-resolved; current AU dealer price only.",
        "Exact product weight unresolved due retailer conflict.",
        "Timed installation and PRO4X4 labour are unknown.",
        "Final interface to ORA-ALO-S5D1-20 remains staff/electrical review until exact connector and polarity are proven."
      ]
    },
    {
      "id": "oa-y62-night-slapper-9-pair",
      "sku": "ORA-ALO-P-R-9-C31D1-AW",
      "rrpAud": null,
      "currentManufacturerPriceAud": 795,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 3,
      "weightNormalization": "Manufacturer PDP exposes 3.00 KGS while stating lights are supplied as a pair, but does not define whether the storefront value is pair net mass, shipping mass or another catalogue weight; normalized weightKg remains null.",
      "installTimeHours": null,
      "fitment": "Current Y62 Cobra manufacturer PDP explicitly offers Offroad Animal Night Slapper 9 inch LED Driving Lights in its Add Spot Lights option. Exact physical mount/top-hoop location and Y62 Series 5 two-light electrical trigger route are not published.",
      "url": "https://offroadanimal.com.au/offroad-animal-night-slapper-9-inch-led-driving-lights/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "sourceType": "manufacturer",
      "requiredParts": [
        "oa-y62-cobra-frontbar"
      ],
      "knownConflicts": [
        "oa-y62-ass-kicker-9-pair",
        "oa-y62-butt-kicker-7-pair",
        "oa-y62-rally-hoop-9"
      ],
      "electrical": {
        "voltage": "9-30V DC",
        "currentAt13_2V": "9A ±0.9A",
        "powerAt13_2V": "118.8W ±11.88W",
        "effectiveLumenAt13_2V": "9508 lm ±950.8 lm",
        "ip": [
          "IP68",
          "IP69K"
        ],
        "connector": null,
        "scopeState": "manufacturer table does not explicitly identify current/power/lumen as per-light or pair total"
      },
      "suppliedParts": [
        "light pair",
        "covers",
        "wiring looms"
      ],
      "unresolvedStates": [
        "Exact Cobra lamp mounting bracket/top-hoop position and clearance are not source-resolved.",
        "Exact Y62 Series 5 two-light high-beam trigger/harness and lamp connector interface are not source-resolved; governed STEDI WIRQKFT-HIBEAM is a one-output route and is not auto-reused.",
        "PRO4X4 wiring labour and install duration remain unknown."
      ],
      "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "toroRouteState": "confirmed-current-configurator-option-physical-mount-and-electrical-labour-staff-review"
    },
    {
      "id": "oa-y62-butt-kicker-7-pair",
      "sku": "ORA-ALO-R5-C10D1",
      "rrpAud": null,
      "currentManufacturerPriceAud": 415,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 7,
      "weightNormalization": "Manufacturer PDP exposes 7.00 KGS but does not define whether it is pair net mass, shipping mass or another storefront value; normalized weightKg remains null.",
      "installTimeHours": null,
      "fitment": "Current Y62 Cobra manufacturer PDP explicitly offers the Offroad Animal Butt Kicker 7 inch pair as a spot-light option. A dedicated Butt Kicker 7 inch Rally Hoop lists Nissan Patrol S5 2020-on but uses historical front-bar SKU FB-NPT-S5-20-PR-ASM0 and is absent from the current Cobra configurator, so that hoop remains candidate-only.",
      "url": "https://offroadanimal.com.au/offroad-animal-butt-kicker-7-round-led-light-pair/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "candidateHoopUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/",
      "sourceType": "manufacturer",
      "requiredParts": [
        "oa-y62-cobra-frontbar"
      ],
      "knownConflicts": [
        "oa-y62-ass-kicker-9-pair",
        "oa-y62-night-slapper-9-pair",
        "oa-y62-rally-hoop-9"
      ],
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
      "electrical": {
        "voltage": "9-36V DC",
        "powerWPerLight": 105,
        "lumenPerLight": 5800,
        "connector": "small DT connector",
        "ip": [
          "IP68",
          "IP69K"
        ]
      },
      "suppliedPartsPerLight": [
        "1 x light",
        "1 x wiring harness",
        "1 x bolt kit",
        "1 x stainless mounting bracket"
      ],
      "unresolvedStates": [
        "Dedicated 7-inch Rally Hoop is now governed as oa-y62-rally-hoop-7 based on current Y62 category placement + direct Patrol S5 table, but it remains engineering because the table names historical parent bar FB-NPT-S5-20-PR-ASM0 and the current Cobra configurator omits the hoop.",
        "If the 7-inch Rally Hoop route is engineering-approved for current Cobra, camera relocation kit TB-COM-NIS-CAM-BRKIT is required because the manufacturer table says the Y62 S5 camera is blocked.",
        "Exact Y62 Series 5 two-light high-beam trigger/harness is not source-resolved.",
        "PRO4X4 wiring labour and install duration remain unknown."
      ],
      "currentToroOptionUrl": "https://offroadanimal.com.au/toro-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "toroRouteState": "confirmed-current-configurator-option-physical-mount-and-electrical-labour-staff-review"
    },
    {
      "id": "oa-y62-rally-hoop-7",
      "sku": "TB-COM-RAL-ORA-2X7-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 315,
      "priceState": "verified-current-manufacturer-price-msrp-blank",
      "weightKg": null,
      "storefrontListedWeightKg": 8,
      "weightNormalization": "Manufacturer PDP exposes 8.00 KGS but does not define net installed/product/shipping semantics; normalized weightKg remains null.",
      "installTimeHours": {
        "min": 0.25,
        "max": 0.25
      },
      "fitment": "Current Offroad Animal Y62 category lists the exact SKU, and the hoop compatibility table explicitly lists Nissan Patrol S5 2020-on. The table names historical Y62 front-bar SKU FB-NPT-S5-20-PR-ASM0 and says Blocks Camera; current Cobra SKU is FB-NPT-Y62-19-PR-ASM0 and its current configurator does not expose the 7-inch hoop, so exact current-Cobra parent mapping remains engineering.",
      "url": "https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/",
      "vehicleCategoryUrl": "https://offroadanimal.com.au/nissan/nissan-patrol-y62/",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "fittingInstructionUrl": "https://offroadanimal.com.au/content/Rally%20Hoop%20Fitting%20Instruction%20Rev.B.pdf",
      "cameraInstructionUrl": "https://offroadanimal.com.au/content/TB-COM-NIS-CAM-BRKIT%20Fitting%20Instruction%20Rev.B.pdf",
      "sourceType": "manufacturer",
      "status": "engineering",
      "routeRequiredParts": [
        "oa-y62-butt-kicker-7-pair"
      ],
      "conditionalRequiredParts": [
        "oa-y62-camera-relocation-kit"
      ],
      "candidateParent": {
        "id": "oa-y62-cobra-frontbar",
        "currentSku": "FB-NPT-Y62-19-PR-ASM0",
        "sourceListedHistoricalSku": "FB-NPT-S5-20-PR-ASM0",
        "state": "engineering-historical-parent-nomenclature-current-cobra-configurator-omits-hoop"
      },
      "knownConflicts": [
        "oa-y62-rally-hoop-9",
        "oa-y62-stealth-top-type-a"
      ],
      "unresolvedStates": [
        "Authoritative current-Cobra mapping for TB-COM-RAL-ORA-2X7-ASM0 remains absent; Y62-family applicability is confirmed but parent-bar release is not.",
        "Current Cobra configurator offers Butt Kicker 7-inch lights but does not expose the 7-inch Rally Hoop option.",
        "PRO4X4 labour/freight are unknown; manufacturer 15-minute figure covers rally-hoop fitment only.",
        "Storefront 8.00 KGS value is preserved but not normalized to installed/net product mass."
      ]
    },
    {
      "id": "oa-y62-camera-relocation-kit",
      "sku": "TB-COM-NIS-CAM-BRKIT",
      "rrpAud": null,
      "currentManufacturerPriceAud": null,
      "priceState": "exact-sku-verified-price-not-source-resolved",
      "weightKg": null,
      "installTimeHours": {
        "min": 0.25,
        "max": 0.25
      },
      "fitment": "Rev B fitting instruction explicitly suits Nissan Patrol Y62 Series 5 and only Offroad Animal Predator/Cobra bars fitted with a 22-inch Stealth Hoop or Rally Hoop; explicitly excludes Toro and bars without top hoops.",
      "url": "https://offroadanimal.com.au/content/TB-COM-NIS-CAM-BRKIT%20Fitting%20Instruction%20Rev.B.pdf",
      "currentCobraOptionUrl": "https://offroadanimal.com.au/cobra-bull-bar-nissan-patrol-y62-series-5-2020-current/",
      "sourceType": "manufacturer",
      "requiredParts": [
        "oa-y62-cobra-frontbar"
      ],
      "requiresAnyOf": [
        "oa-y62-rally-hoop-9",
        "oa-y62-stealth-top-type-a",
        "oa-y62-rally-hoop-7"
      ],
      "knownConflicts": [
        "oa-y62-toro-frontbar"
      ],
      "suppliedParts": [
        "B-1467 camera relocation bracket",
        "B-1264 camera cover bracket",
        "2 x M6x16 black button-head bolts",
        "2 x M6 black flat washers",
        "2 x M6 flange nuts"
      ],
      "unresolvedStates": [
        "Exact retail/RRP and product weight are not source-resolved.",
        "Camera harness may require extension; extension wire/solder/heatshrink is not supplied.",
        "PRO4X4 labour remains unknown."
      ]
    }
  ]
};
});
