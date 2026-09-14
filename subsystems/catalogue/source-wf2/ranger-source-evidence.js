(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.RANGER_SOURCE_EVIDENCE=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 return {
  "schemaVersion": "0.26.22",
  "capturedAt": "2026-09-14",
  "vehicleId": "ford-ranger-nextgen-2025",
  "sources": [
    {
      "id": "oa-predator",
      "sku": "FB-FRA-NG-22-PR-ASM0",
      "rrpAud": 3100,
      "fitment": "Ford Ranger Next Gen RA 2022 on",
      "url": "https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/",
      "sourceType": "manufacturer",
      "weightKg": 65,
      "installTimeHours": {
        "min": 5,
        "max": 6
      }
    },
    {
      "id": "oa-toro-ranger",
      "sku": "FB-FRA-NG-22-TOR-ASM0",
      "rrpAud": 3770,
      "fitment": "P703/PU Ranger 2022 on — manufacturer states all variants",
      "url": "https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/",
      "sourceType": "manufacturer",
      "weightKg": 76,
      "installTimeHours": {
        "min": 5,
        "max": 6
      }
    },
    {
      "id": "oa-scout-rack-ranger",
      "sku": "RR-FRA-PU-22-SCT-ASM0",
      "rrpAud": 1520,
      "weightKg": 15,
      "storefrontListedWeightKg": 16,
      "installTimeHours": {
        "min": 4,
        "max": 4
      },
      "installDifficulty10": 5,
      "fitment": "All dual-cab Ford Ranger and Raptor Ranger models 2022-current, including Ranger Super Duty",
      "url": "https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/",
      "categoryUrl": "https://offroadanimal.com.au/roof-racks/ford-ranger/",
      "sourceType": "manufacturer",
      "dimensionsMm": {
        "width": 1210,
        "length": 1230,
        "heightAboveRoof": 90
      },
      "loadRatingsKg": {
        "dynamicOnRoad": 95,
        "dynamicOffRoad": 63,
        "static": 190
      },
      "directPdpOptions": [
        "Roof Rack Eye Bolt kit",
        "Clampit Rubber Holder Quick Fist style",
        "Light Bar wind deflector",
        "Offroad Animal Slim 42 inch LED light Bar",
        "Offroad Animal 42 inch Double Row LED light Bar"
      ],
      "unresolvedAccessoryMappings": [
        {
          "option": "Light Bar wind deflector",
          "state": "engineering",
          "candidateSkuObserved": "RR-FRA-PX-11-SCT-LBKIT",
          "candidateUrl": "https://offroadanimal.com.au/scout-roof-rack-wind-deflector-to-suit-up-to-42in-light-bar-for-ranger-raptor/",
          "candidateRrpAud": 210,
          "candidateListedWeightKg": 3,
          "candidateState": "reference-only-not-proven-nextgen",
          "reason": "Exact Next-Gen Scout PDP does not expose the option SKU. The live Ranger/Raptor deflector PDP exposes RR-FRA-PX-11-SCT-LBKIT but does not state Next-Gen years/interface; preserve as reference-only rather than infer exact fitment."
        },
        {
          "option": "42-inch light bars",
          "state": "products-governed-support-unresolved",
          "mappedProductIds": [
            "oa-slim-42-lightbar-scout-ranger",
            "oa-double-42-lightbar-scout-ranger"
          ],
          "reason": "Exact light-bar identities are now governed from the Next-Gen Scout selectable options and direct manufacturer PDPs; rack installation remains staff-review until the exact wind-deflector fitting part is resolved."
        }
      ]
    },
    {
      "id": "oa-roof-rack-eye-bolt-kit-ranger",
      "sku": "RR-EBK-4-ASM0",
      "rrpAud": 25,
      "weightKg": null,
      "storefrontListedWeightKg": 0.5,
      "installTimeHours": null,
      "fitment": "Manufacturer says the M8 kit fits any Offroad Animal roof rack; the exact Next-Gen Ranger Scout PDP offers it as a tie-down option",
      "url": "https://offroadanimal.com.au/roof-rack-eye-bolt-kit/",
      "parentUrl": "https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/",
      "sourceType": "manufacturer"
    },
    {
      "id": "clampit-quick-fist-scout-ranger",
      "sku": "JED 25-57",
      "rrpAud": 25,
      "weightKg": null,
      "storefrontListedWeightKg": 0.25,
      "installTimeHours": null,
      "fitment": "Exact Next-Gen Ranger Scout PDP offers the Clampit option; product page says it is suited to the side or top of Offroad Animal Scout racks",
      "url": "https://offroadanimal.com.au/clampit-rubber-holder-quick-fist-style-pair/",
      "parentUrl": "https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/",
      "sourceType": "manufacturer",
      "identitySourceRole": "Offroad Animal manufacturer storefront publishes the Clampit product and explicitly confirms Scout-rack use; product brand remains Clampit",
      "safeWorkingLoadKgEach": 10,
      "objectDiameterMm": {
        "min": 25,
        "max": 57
      }
    },
    {
      "id": "oa-awning-mount-scout-ranger",
      "sku": "RR-AM-COM-ASM0",
      "rrpAud": 85,
      "weightKg": null,
      "storefrontListedWeightKg": 0.7,
      "installTimeHours": {
        "min": 0.3333,
        "max": 0.3333,
        "sourceText": "20 min"
      },
      "installDifficulty10": 1,
      "fitment": "Listed in manufacturer Ford Ranger roof-rack range; manufacturer warns bracket does not suit every Scout rack without extra side-rail holes and limits it to 90-degree awnings",
      "url": "https://offroadanimal.com.au/awning-mount-roof-rack/",
      "categoryUrl": "https://offroadanimal.com.au/roof-racks/ford-ranger/",
      "sourceType": "manufacturer",
      "staffReviewReasons": [
        "Next-Gen Scout side-rail hole alignment is not explicitly confirmed",
        "manufacturer says extra drilling may be required on some Scout racks",
        "90-degree awnings only"
      ]
    },
    {
      "id": "oa-awning-quick-connect-scout-ranger",
      "sku": "RR-AMQ-MED-ASM0",
      "rrpAud": 295,
      "weightKg": null,
      "storefrontListedWeightKg": 4,
      "installTimeHours": {
        "min": 0.5,
        "max": 1
      },
      "installDifficulty10": 2,
      "fitment": "Listed in manufacturer Ford Ranger roof-rack range; direct PDP supports awnings up to 25 kg including 180/270-degree styles, but exact Next-Gen Scout side-rail interface is not stated",
      "url": "https://offroadanimal.com.au/awning-quick-connect-brackets/",
      "categoryUrl": "https://offroadanimal.com.au/roof-racks/ford-ranger/",
      "sourceType": "manufacturer",
      "staffReviewReasons": [
        "exact Next-Gen Scout bracket-to-side-rail interface is not explicitly confirmed on the direct PDP"
      ]
    },
    {
      "id": "oa-rear-protection-ranger",
      "sku": "RB-FRA-NG-22-ASM0",
      "rrpAud": 1940,
      "fitment": "XLS/XLT/Wildtrak/Platinum 2022-current with factory tow bar; Hayman Reese excluded",
      "url": "https://offroadanimal.com.au/rear-protection-bumper-ford-ranger-ra-next-gen-2022-on/",
      "sourceType": "manufacturer",
      "weightKg": 36,
      "installTimeHours": {
        "min": 1,
        "max": 2
      }
    },
    {
      "id": "oa-rock-sliders-ranger",
      "sku": "RSW-FRA-NG-22-ASM0",
      "rrpAud": 1895,
      "fitment": "Ford Ranger Next Gen 2022 to current",
      "url": "https://offroadanimal.com.au/rock-sliders-ford-ranger-next-gen-2022-to-current/",
      "sourceType": "manufacturer",
      "weightKg": 60,
      "installTimeHours": {
        "min": 3,
        "max": 3
      }
    },
    {
      "id": "oa-ausb-sports-bar-ranger",
      "sku": "SB-COM-MED-ASM0",
      "rrpAud": 2675,
      "fitment": "Next Gen Ranger with roller-shutter T-slot tracks; tub-clamp mounting excluded for this fitment",
      "url": "https://offroadanimal.com.au/actually-useful-sports-bar-a-u-s-b/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-adventure-rack-ranger",
      "sku": "ADVR-DC-COM-ASM0",
      "rrpAud": 1365,
      "fitment": "Universal dual cab ute; Ranger-specific mounting remains staff review",
      "url": "https://offroadanimal.com.au/adventure-rack-universal-fit-all-aussie-utes/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-lower-bash-ranger",
      "sku": "BP-FRA-NG-22-ASM0",
      "rrpAud": 420,
      "fitment": "Next Gen Ranger/Everest; only with Offroad Animal Predator/Toro bars; factory bumper/stone guard excluded",
      "url": "https://offroadanimal.com.au/lower-bash-skid-plate-to-suit-next-gen-ford-ranger-everest/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-camera-relocation-ranger",
      "sku": "FB-FRA-NG-22-PR-ASM5",
      "rrpAud": 165,
      "fitment": "Next Gen Ranger/Raptor/Everest; conditional use when hoops/lights obstruct factory camera",
      "url": "https://offroadanimal.com.au/next-gen-camera-relocation-kit/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-brush-rails-ranger",
      "sku": "SR-FRA-NG-22-ASM0",
      "rrpAud": 790,
      "weightKg": 12,
      "installTimeHours": {
        "min": 2,
        "max": 3
      },
      "fitment": "All Ford Ranger RA Dual Cab models; requires Toro bull bar + Offroad Animal rock sliders",
      "url": "https://offroadanimal.com.au/brush-rails-to-suit-ford-ranger-ra-next-gen-2022-current/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-egr-flare-endcaps-ranger",
      "sku": "FLEC-FRA-NG-22-ASM0",
      "rrpAud": 150,
      "weightKg": 1,
      "installTimeHours": {
        "min": 0.25,
        "max": 0.25
      },
      "fitment": "RA Ranger 2022-current; EGR branded flares + Toro or Predator bar; other flare brands unverified",
      "url": "https://offroadanimal.com.au/egr-flare-end-caps-to-suit-offroad-animal-ranger-ra-bull-bars-toro-and-predator/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-toro-indicator-harness-ranger",
      "sku": "LM-FRA-NG-IND",
      "rrpAud": null,
      "currentManufacturerPriceAud": 80,
      "weightKg": null,
      "storefrontListedWeightKg": 1,
      "installTimeHours": null,
      "fitment": "Next Gen Ranger current Predator/Toro option; indicator breakout and Level 1/3 +12V high-beam trigger; Level 2 trigger unavailable from this harness",
      "url": "https://offroadanimal.com.au/ranger-toro-indicator-piggy-back-harness/",
      "fittingNoteUrl": "https://offroadanimal.com.au/content/indicatorharness.pdf",
      "sourceType": "manufacturer",
      "sourceState": "confirmed-component-headlight-level-conditional",
      "weightNormalization": "1.00 KGS storefront field has undefined product/shipping semantics; normalized weightKg remains null.",
      "highBeamOutputs": {
        "level1": "+12V green",
        "level3": "+12V brown",
        "level2": "not available from harness; passenger kick-panel route required"
      },
      "staffReviewReasons": [
        "identify actual headlight level",
        "do not infer Smart Harness T-connector compatibility from bare trigger wires",
        "standalone labour/time unpublished"
      ]
    },
    {
      "id": "oa-predator-stealth-top-ranger",
      "sku": "TB-COM-PR-ASM0",
      "rrpAud": 235,
      "weightKg": 4,
      "installTimeHours": {
        "min": 0.5,
        "max": 0.5
      },
      "fitment": "Offroad Animal Predator-style bar including Ranger; constrained to Ranger Predator dependency",
      "url": "https://offroadanimal.com.au/stealth-top-suit-type-a-led-light-predator-style/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-predator-round-top-ranger",
      "sku": "TB-COM-PR-RD-ASM0",
      "rrpAud": 365,
      "weightKg": 3,
      "installTimeHours": {
        "min": 0.5,
        "max": 0.5
      },
      "fitment": "All Predator bars except Wrangler JK/JL, Navara and Ram; Next Gen Ranger Predator not excluded",
      "url": "https://offroadanimal.com.au/predator-round-top-tube/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-tray-slide-wide-ranger",
      "sku": "TRS-DC-COM-WIDE-ASM0",
      "rrpAud": 2780,
      "weightKg": 51,
      "installTimeHours": {
        "min": 1,
        "max": 1
      },
      "assemblyTimeHours": {
        "min": 2,
        "max": 2
      },
      "fitment": "Manufacturer-listed universal fit for Next Gen RA Ranger/Raptor/Amarok Dual Cab; wide version named for Next-Gen Ranger",
      "url": "https://offroadanimal.com.au/full-extension-tray-slide-bed-slide-wide-size-to-suit-ra-ranger/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-rally-hoop-stedi-pro-ranger",
      "sku": "TB-COM-RAL-STE-2XPRO-ASM0",
      "rrpAud": 330,
      "weightKg": 4,
      "installTimeHours": null,
      "fitment": "Ford Ranger RA 2022 on; Predator FB-FRA-NG-22-PR-ASM0; very close to grille; ORA camera relocation required",
      "url": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-pro/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-rally-hoop-9in-ranger",
      "sku": "TB-COM-RAL-ORA-2X9-ASM0",
      "rrpAud": 330,
      "weightKg": 4,
      "installTimeHours": null,
      "fitment": "Ford Ranger RA 2022 on; Predator FB-FRA-NG-22-PR-ASM0; good fit; ORA camera relocation required",
      "url": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-to-suit-offroad-animal-9-inch-arse-kicker-lights/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-rally-hoop-7in-ranger",
      "sku": "TB-COM-RAL-ORA-2X7-ASM0",
      "rrpAud": 315,
      "weightKg": 8,
      "installTimeHours": null,
      "fitment": "Ford Ranger RA 2022 on; Predator FB-FRA-NG-22-PR-ASM0; good fit; ORA camera relocation required",
      "url": "https://offroadanimal.com.au/rally-hoop-to-suit-offroad-animal-butt-kicker-7inch-driving-lights/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-22in-slim-lightbar-ranger",
      "sku": "ORA-ALO-S5D1-20",
      "rrpAud": 200,
      "weightKg": 2,
      "installTimeHours": null,
      "fitment": "Support component confirmed via OA light-bar description plus Next Gen Ranger Predator/Toro manufacturer options; constrained to those mapped bar routes",
      "url": "https://offroadanimal.com.au/offroad-animal-22-slim-led-light-bar/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-deep-dish-floor-mats-ranger",
      "sku": "FM-FRA-NG-22",
      "rrpAud": 250,
      "weightKg": 5,
      "installTimeHours": null,
      "fitment": "Exact Next Gen Ranger MY22+ product; vehicle-specific retention clips and precision moulded fit",
      "url": "https://offroadanimal.com.au/deep-dish-floor-matts-to-suit-next-gen-ranger-my22/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-scout-tub-platform-ranger",
      "sku": "SP-COM-FT-MD-ASM0",
      "rrpAud": 1175,
      "weightKg": null,
      "weightVariantsKg": {
        "lowLeg": 20.5,
        "highLeg": 22.7
      },
      "installTimeHours": {
        "min": 2,
        "max": 3
      },
      "fitment": "Manufacturer Ford Ranger tub-rack catalogue; universal rack page calls out Ranger/Raptor tub brace; Next Gen brace/mounting route remains staff review",
      "url": "https://offroadanimal.com.au/scout-ute-tub-platform-rack/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-scout-tub-platform-short-ranger",
      "sku": "SP-COM-FT-500-ASM0",
      "rrpAud": 650,
      "weightKg": null,
      "weightVariantsKg": {
        "lowLeg": 12.2,
        "highLeg": 14.4
      },
      "installTimeHours": {
        "min": 2,
        "max": 3
      },
      "fitment": "Manufacturer Ford Ranger tub-rack catalogue; 500 mm universal rack page calls out Ranger/Raptor tub brace; Next Gen brace/mounting route remains staff review",
      "url": "https://offroadanimal.com.au/scout-ute-tub-platform-rack-short-500mm/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-goat-rack-ranger",
      "sku": "GR-MED-COM-ASM0",
      "rrpAud": 4725,
      "saleAudObserved": 3995,
      "weightKg": 50,
      "installTimeHours": {
        "min": 3,
        "max": 4
      },
      "fitment": "Manufacturer Ranger/Raptor/BT-50 vehicle option; explicit NG Ranger/Raptor RGr roller-shutter exclusion; conditional Next Gen mapping",
      "url": "https://offroadanimal.com.au/goat-rack-greatest-of-all-time-tub-rack/",
      "sourceType": "manufacturer"
    },
    {
      "id": "egr-j-brace-ranger",
      "sku": "040174",
      "rrpAud": 249,
      "weightKg": null,
      "installTimeHours": null,
      "fitment": "EGR manufacturer: Ford Ranger RA 2022-onwards; excludes Wildtrak and Platinum; cross-vendor rack sufficiency not inferred",
      "url": "https://egrauto.com/products/egr-lower-tub-strengthening-bracket-j-brace",
      "sourceType": "manufacturer",
      "packageWeightKg": 3
    },
    {
      "id": "oa-ausb-angled-roller-mount-ranger",
      "sku": "SB-COM-RSAN-KIT",
      "rrpAud": 175,
      "weightKg": 5,
      "installTimeHours": null,
      "fitment": "A.U.S.B. optional mount for angled roller-shutter T-slot tracks (Mountain Top / Real Truck); Next Gen Ranger conditional on actual shutter track geometry",
      "url": "https://offroadanimal.com.au/sports-bar-angled-roller-shutter-mount-kit/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-nice-tub-rack-ranger",
      "sku": "TR-NR-COM-ASM1",
      "rrpAud": null,
      "rrpState": "source-conflict",
      "rrpCandidatesAud": [
        1750,
        1300
      ],
      "weightKg": 23,
      "installTimeHours": null,
      "fitment": "Manufacturer Next Gen Ranger category lists the universal Nice Rack, but exact setup remains staff review; live manufacturer price surfaces conflict",
      "url": "https://offroadanimal.com.au/the-nice-tub-rack-universal-fit/",
      "secondaryUrl": "https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-nice-rack-toolbox-50l-ranger",
      "sku": "TR-NR-COM-ASM2",
      "rrpAud": 765,
      "weightKg": 13,
      "installTimeHours": null,
      "fitment": "Manufacturer confirms 50L toolbox mounts to The Nice Rack with supplied low/high brackets; Ranger applicability inherits parent rack review",
      "url": "https://offroadanimal.com.au/tool-box-to-suit-the-nice-rack-50l/",
      "sourceType": "manufacturer",
      "capacityLitres": 50,
      "dimensionsMm": {
        "length": 630,
        "width": 300,
        "height": 480
      }
    },
    {
      "id": "oa-nice-rack-toolbox-92l-ranger",
      "sku": "TR-NR-COM-ASM5",
      "rrpAud": 965,
      "weightKg": 19,
      "installTimeHours": null,
      "fitment": "Manufacturer confirms 92L toolbox mounts to The Nice Rack with supplied low/high brackets; Ranger applicability inherits parent rack review",
      "url": "https://offroadanimal.com.au/tool-box-to-suit-the-nice-rack-92l/",
      "sourceType": "manufacturer",
      "capacityLitres": 92,
      "dimensionsMm": {
        "length": 1100,
        "width": 300,
        "height": 480
      }
    },
    {
      "id": "oa-nice-rack-molle-low-ranger",
      "sku": "TR-NR-COM-ASM3",
      "rrpAud": 162,
      "weightKg": 4,
      "installTimeHours": null,
      "fitment": "Manufacturer confirms 500 x 350 mm Molle panel is specifically for The Nice Rack low configuration; Ranger applicability inherits parent rack review",
      "url": "https://offroadanimal.com.au/molle-panel-to-suit-the-nice-rack-low-version/",
      "sourceType": "manufacturer",
      "dimensionsMm": {
        "width": 500,
        "height": 350
      }
    },
    {
      "id": "oa-nice-rack-molle-high-ranger",
      "sku": "TR-NR-COM-ASM4",
      "rrpAud": 240,
      "weightKg": 5,
      "installTimeHours": null,
      "fitment": "Manufacturer confirms 500 x 525 mm Molle panel is specifically for The Nice Rack high configuration; Ranger applicability inherits parent rack review",
      "url": "https://offroadanimal.com.au/molle-panel-to-suit-the-nice-rack-high-version/",
      "sourceType": "manufacturer",
      "dimensionsMm": {
        "width": 500,
        "height": 525
      }
    },
    {
      "id": "oa-tub-rack-base-ranger",
      "sku": "TR-DC-COM-BASE",
      "rrpAud": 1150,
      "saleAudObserved": 1050,
      "weightKg": 30,
      "installTimeHours": {
        "min": 1,
        "max": 2
      },
      "fitment": "Manufacturer Next-Gen Ranger category listing plus direct PDP: universal 1438-1650 mm tub-width rack; direct vehicle selector is legacy-labelled; excludes Ranger Wildtrak and NG Ranger/Raptor with EGR roller shutter; bare tub requires drilling",
      "url": "https://offroadanimal.com.au/tub-rack-base/",
      "categoryUrl": "https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/",
      "sourceType": "manufacturer",
      "staffReviewReasons": [
        "direct PDP vehicle selector does not explicitly list RA/Next-Gen Ranger",
        "Wildtrak is explicitly excluded",
        "NG Ranger/Raptor with EGR roller shutter is explicitly excluded",
        "actual tub and roller-shutter geometry must be confirmed"
      ]
    },
    {
      "id": "oa-tub-rack-roller-rail-kit-ranger",
      "sku": "TR-FRA-PX-11-RSFK",
      "rrpAud": 470,
      "weightKg": 5,
      "installTimeHours": null,
      "fitment": "Universal rail kit for most roller shutters with a compatible T-slot; offered by manufacturer as an option on the Tub Rack Base; exact Next-Gen Ranger route is shutter-geometry and parent-fitment dependent",
      "url": "https://offroadanimal.com.au/roller-shutter-rails-to-suit-tub-racks-fit-kit/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-tub-rack-angled-roller-rail-kit-ranger",
      "sku": "TR-FRA-PX-11-RSANFK",
      "rrpAud": 470,
      "weightKg": 5,
      "installTimeHours": null,
      "fitment": "Universal Mountain Top angled-top roller-shutter rail kit; explicitly 'Not Ford Wildtrak'; manufacturer supplies 13/18 mm square nuts but notes shutter-approved M6 track nuts may be required",
      "url": "https://offroadanimal.com.au/angled-roller-shutter-rails-to-suit-mountain-top-brand-tub-rack-fit-kit/",
      "sourceType": "manufacturer"
    },
    {
      "id": "oa-slim-42-lightbar-scout-ranger",
      "sku": "ORA-ALO-S5D1-40",
      "rrpAud": 280,
      "weightKg": 2.7,
      "storefrontListedWeightKg": 4,
      "installTimeHours": null,
      "fitment": "Exact Next-Gen Ranger Scout PDP offers this named 42-inch slim light bar option; exact light-bar wind-deflector SKU/interface remains unresolved and blocks automatic rack fitment",
      "url": "https://offroadanimal.com.au/offroad-animal-slim-42-led-light-bar/",
      "parentUrl": "https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/",
      "rangerLightingCategoryUrl": "https://offroadanimal.com.au/led-lights/led-light-bars/ford-ranger/",
      "sourceType": "manufacturer",
      "staffReviewReasons": [
        "exact Next-Gen Scout wind-deflector SKU/interface is not exposed",
        "do not substitute legacy Ranger/Raptor RR-FRA-PX-11-SCT-LBKIT without explicit Next-Gen mapping"
      ]
    },
    {
      "id": "oa-double-42-lightbar-scout-ranger",
      "sku": "ORA-ALO-D6D1-40",
      "rrpAud": 440,
      "weightKg": null,
      "storefrontListedWeightKg": 6,
      "weightState": "manufacturer-storefront-listed; product-only mass not separately specified",
      "installTimeHours": null,
      "fitment": "Exact Next-Gen Ranger Scout PDP offers this named 42-inch double-row light bar option; exact light-bar wind-deflector SKU/interface remains unresolved and blocks automatic rack fitment",
      "url": "https://offroadanimal.com.au/offroad-animal-42-double-row-led-light-bar/",
      "parentUrl": "https://offroadanimal.com.au/scout-roof-rack-to-suit-next-gen-ranger-super-duty-and-raptor-2022-to-current/",
      "rangerLightingCategoryUrl": "https://offroadanimal.com.au/led-lights/led-light-bars/ford-ranger/",
      "sourceType": "manufacturer",
      "staffReviewReasons": [
        "exact Next-Gen Scout wind-deflector SKU/interface is not exposed",
        "manufacturer PDP header weight is retained separately rather than asserted as product-only/installed mass",
        "do not substitute legacy Ranger/Raptor RR-FRA-PX-11-SCT-LBKIT without explicit Next-Gen mapping"
      ]
    },
    {
      "id": "ford-load-box-reinforcement-ranger",
      "sku": "VN1WZ2627726A",
      "alternateSku": "AMN1WJ27726AA",
      "rrpAud": 336.12,
      "rrpSourceState": "Australian OEM parts retailer listed RRP; Ford Australia direct RRP not located",
      "weightKg": null,
      "installTimeHours": null,
      "fitment": "Ford official: Ranger 2024–2025 non-Raptor; required for elevated load-box accessories over 40 kg. Australian OEM-parts source: Ranger RA 2022-on excluding Raptor. Authorised Australian Ford dealer explicitly lists XLS, XLT and Wildtrak; Platinum remains VIN/staff confirmation.",
      "url": "https://www.ford.com/product/load-box-reinforcement-kit-for-nonraptor-models-p2746486928",
      "rrpUrl": "https://www.australianonlinecarparts.com.au/canopy-j-brace-kit-vn1wz2627726a-for-ford",
      "trimConfirmationUrl": "https://www.jeffersonfordparts.com.au/ford-next-gen-ranger-j-brace-bracket-kit-xls-xlt",
      "sourceType": "manufacturer",
      "staffReviewReasons": [
        "Ford says aftermarket accessory suitability must be determined by the aftermarket manufacturer or supplier",
        "Platinum not independently trim-listed in the authorised-dealer source used here",
        "vehicle VIN/build-date confirmation retained rather than inferring reinforcement requirement"
      ],
      "supportingSourceTypes": [
        "Australian OEM parts retailer",
        "authorised Ford dealer"
      ],
      "rrpSourceType": "Australian OEM parts retailer"
    },
    {
      "id": "oa-rally-hoop-stedi-evo-ranger",
      "sku": "TB-COM-RAL-STE-2XEVO-ASM0",
      "rrpAud": 330,
      "weightKg": 4,
      "installTimeHours": null,
      "fitment": "Broad Ford Ranger category-listed but direct PDP fitment table omits Ranger RA non-Raptor; category placement is not exact RA proof and applicability remains unresolved",
      "url": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-evo-8-5-inch/",
      "categoryUrl": "https://offroadanimal.com.au/ford/ranger/",
      "sourceType": "manufacturer",
      "sourceState": "conflict-preserved",
      "directFitmentRowsObserved": [
        "Ford Ranger PX1-PX3 2011-2021",
        "Ford Ranger Raptor Gen 1 2019-2021",
        "Ford Ranger Raptor Gen 2 2022 on",
        "Nissan Patrol S5 2020 on",
        "Suzuki Jimny JB74 2018-current",
        "Toyota Landcruiser 76/78/79 2007-2022",
        "Volkswagen Amarok NF 2023 on",
        "Silverado 1500 2020-2022",
        "Jeep Grand Cherokee WK2 2011-2021",
        "Jeep Grand Cherokee WL 2022-current"
      ],
      "rangerCategoryListed": true,
      "rangerRaCategoryApplicabilityProven": false,
      "rangerRaDirectFitmentRowPresent": false,
      "requiredParentSku": "FB-FRA-NG-22-PR-ASM0",
      "cameraRelocationForRangerRa": "unknown-do-not-infer-from-raptor-row",
      "resolutionState": "engineering-review-required"
    },
    {
      "id": "stedi-type-x-evo-pair-ranger",
      "sku": "LEDTYPE-X-EVO",
      "rrpAud": 858,
      "weightKg": null,
      "storefrontListedWeightKg": 7,
      "installTimeHours": null,
      "fitment": "STEDI pair explicitly linked by EVO rally-hoop PDP; Ranger RA applicability inherits unresolved hoop route",
      "url": "https://offroadanimal.com.au/type-x-evo-8-5-inch-led-driving-lights-pair/",
      "parentUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-evo-8-5-inch/",
      "sourceType": "manufacturer",
      "identitySourceRole": "Offroad Animal manufacturer storefront for the exact retailed STEDI pair identity/SKU/RRP; STEDI manufacturer support confirms the Type-X EVO product family and mounting requirements",
      "manufacturerSupportUrl": "https://support.stedi.com.au/hc/en-us/articles/15100201192601-Type-X-EVO-8-5-and-7-LED-Driving-Lights",
      "nextGenRangerHighBeamSupportUrl": "https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation",
      "mountingHardwareRequirement": "all three M10 bolts must be used for each Type-X EVO U-bracket base",
      "electricalRouteState": "staff-review-by-nextgen-headlight-level",
      "requiredParentSku": "TB-COM-RAL-STE-2XEVO-ASM0",
      "vehicleApplicabilityState": "engineering-via-unresolved-parent"
    },
    {
      "id": "runva-11expedition-ranger-frontbar",
      "sku": "11EXPEDITION12V",
      "rrpAud": 1295,
      "weightKg": 29,
      "fittedWeightKg": 29,
      "offroadAnimalStorefrontListedWeightKg": 31,
      "offroadAnimalShippingWeightKg": 39,
      "weightNormalization": "Runva direct manufacturer explicitly publishes FITTED WEIGHT 29KG; Offroad Animal 31 kg storefront field is preserved separately and not used to overwrite the direct fitted-weight specification.",
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Exact winch is selectable on both Offroad Animal Next-Gen Ranger Predator and Toro bull-bar PDPs; both bars accept low-mount winches up to 12,000 lb and the Runva is 11,000 lb.",
      "url": "https://www.runvawinch.com.au/11expedition-12v-with-synthetic-rope",
      "secondaryUrl": "https://offroadanimal.com.au/runva-11expedition-winch-12v/",
      "predatorFitmentUrl": "https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/",
      "toroFitmentUrl": "https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/",
      "sourceType": "manufacturer",
      "compatibleParentSkus": [
        "FB-FRA-NG-22-PR-ASM0",
        "FB-FRA-NG-22-TOR-ASM0"
      ],
      "mountingBoltPatternMm": {
        "width": 254,
        "depth": 114.3,
        "hardware": "4 x M10 bolts"
      },
      "ratedLinePullLb": 11000,
      "barRatedMaxWinchLb": 12000,
      "fittingPartnerBundlePricingAud": {
        "frontBarOnly": 900,
        "frontBarPlusWinch": 1200,
        "standaloneWinchLabourNormalized": null
      },
      "fittingPartsState": {
        "requiredGovernedPartChoice": [
          "oa-predator",
          "oa-toro-ranger"
        ],
        "includedOrParentSupplied": [
          "winch mounting hardware / four-M10 pattern",
          "bar fairlead mounting provision",
          "bar number-plate flip"
        ],
        "unresolvedExternalParts": [
          "exact battery isolation hardware if PRO4X4 installation standard requires one"
        ],
        "inferencePolicy": "do not invent an isolator SKU or standalone install price from bundled fitting-partner pricing"
      },
      "supportingSourceTypes": [
        "Runva direct manufacturer",
        "Offroad Animal manufacturer storefront"
      ]
    },
    {
      "id": "oa-cube-reverse-work-light-ranger-rearbar",
      "sku": "ORA-ALO-2-E4T",
      "rrpAud": 95,
      "pairRrpBasisAud": 190,
      "rearBarOptionBundlePriceAud": null,
      "weightKg": 0.5,
      "storefrontListedWeightKg": 1,
      "pairWeightKg": 1,
      "weightNormalization": "Manufacturer specification table explicitly states 0.5 kg each with wiring harness; the 1.0 kg storefront header is preserved separately and not treated as unit fitted mass.",
      "installTimeHours": null,
      "fitment": "Candidate for the exact Offroad Animal reverse-work-light pair offered on RB-FRA-NG-22-ASM0; rear-bar PDP and Rev.B fitting instructions prove a two-light auxiliary route but do not print the optional light SKU.",
      "url": "https://offroadanimal.com.au/offroad-animal-cube-work-light-2x-2/",
      "rearBarUrl": "https://offroadanimal.com.au/rear-protection-bumper-ford-ranger-ra-next-gen-2022-on/",
      "fittingInstructionUrl": "https://offroadanimal.com.au/content/RB-FRA-NG-22-ASM0%20Fitting%20Instruction%20Rev.B.pdf",
      "sourceType": "manufacturer",
      "sourceState": "engineering-candidate-not-exact-sku-proven",
      "requiredParentSku": "RB-FRA-NG-22-ASM0",
      "requiredQuantity": 2,
      "rearBarEvidence": {
        "optionLabel": "2x Offroad Animal Reverse Work Lights",
        "mounting": "rear-light tabs; M8 fasteners supplied with lights",
        "wiring": "several configurations depending on customer requirements",
        "lightSkuPrinted": false
      },
      "productEvidence": {
        "powerWEach": 40,
        "lumensEach": 1940,
        "beamPattern": "Flood",
        "ingressRating": "IP68",
        "voltageRangeV": "9-36",
        "connector": "Deutsch waterproof",
        "boxContents": [
          "1 x Light",
          "1 x bolt kit",
          "1 x Wiring harness"
        ]
      },
      "alternativeManufacturerWorkLightSkuObserved": "ORA-ALO-L2-P7T/E7T",
      "staffReviewReasons": [
        "rear-bar option label does not expose exact SKU",
        "fitting instructions show the auxiliary light form and mounting hardware but do not identify SKU",
        "do not treat visual correspondence as exact identity until current manufacturer/dealer BOM confirms it",
        "electrical wiring route is customer-requirement dependent and no mandatory exact harness/switch SKU is published"
      ]
    },
    {
      "id": "oa-dual-jerry-holder-horizontal-ranger",
      "sku": "JC-COM-DBL-LGE-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 265,
      "priceState": "verified-current-manufacturer-price-not-explicit-msrp",
      "weightKg": null,
      "storefrontListedWeightKg": 3,
      "installTimeHours": null,
      "fitment": "Exact SKU is listed in manufacturer dedicated Ford Ranger RA (Next Gen) 2022-on collection; direct PDP does not identify Ranger-specific mounting location, fasteners or fitting instructions, so mounting route remains staff-review.",
      "url": "https://offroadanimal.com.au/dual-jerry-can-holder-horizontal-sit/",
      "vehicleCategoryUrl": "https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/",
      "sourceType": "manufacturer",
      "sourceState": "engineering-category-listed-mounting-route-unresolved",
      "capacityCans": 2,
      "orientation": "horizontal",
      "material": "3 mm aluminium",
      "dimensionsMm": {
        "length": 512,
        "width": 390,
        "height": 180
      },
      "internalDimensionsMm": {
        "length": 505,
        "width": 383
      },
      "weightNormalization": "Direct PDP header exposes 3.00 KGS but does not label that value as installed/product-only mass; normalized weightKg remains null and storefrontListedWeightKg preserves the observed value.",
      "fittingPartsState": {
        "exactMountingSurface": null,
        "exactHardwareSku": null,
        "manufacturerFittingInstructionsLocated": false,
        "inferencePolicy": "do not invent a rack/tub/roller-shutter parent or fastener SKU from vehicle-category placement alone"
      },
      "staffReviewReasons": [
        "physical mounting substrate/location is not specified",
        "no exact fitting hardware or instruction set identified",
        "loaded-can clearance and support capacity require install-location review"
      ]
    },
    {
      "id": "oa-dual-jerry-holder-upright-ranger",
      "sku": "JC-COM-DBL-STD-ASM0",
      "rrpAud": null,
      "currentManufacturerPriceAud": 240,
      "priceState": "verified-current-manufacturer-price-not-explicit-msrp",
      "weightKg": null,
      "storefrontListedWeightKg": 3,
      "installTimeHours": null,
      "fitment": "Exact SKU is listed in manufacturer dedicated Ford Ranger RA (Next Gen) 2022-on collection; direct PDP does not identify Ranger-specific mounting location, fasteners or fitting instructions, so mounting route remains staff-review.",
      "url": "https://offroadanimal.com.au/dual-jerry-can-holder-upright-sit/",
      "vehicleCategoryUrl": "https://offroadanimal.com.au/ford/ranger/ra-ranger-next-gen-2022-on/",
      "sourceType": "manufacturer",
      "sourceState": "engineering-category-listed-mounting-route-unresolved",
      "capacityCans": 2,
      "orientation": "upright",
      "material": "3 mm aluminium",
      "dimensionsMm": {
        "length": 375,
        "width": 390,
        "height": 180
      },
      "internalDimensionsMm": {
        "length": 369,
        "width": 383
      },
      "weightNormalization": "Direct PDP header exposes 3.00 KGS but does not label that value as installed/product-only mass; normalized weightKg remains null and storefrontListedWeightKg preserves the observed value.",
      "fittingPartsState": {
        "exactMountingSurface": null,
        "exactHardwareSku": null,
        "manufacturerFittingInstructionsLocated": false,
        "inferencePolicy": "do not invent a rack/tub/roller-shutter parent or fastener SKU from vehicle-category placement alone"
      },
      "staffReviewReasons": [
        "physical mounting substrate/location is not specified",
        "no exact fitting hardware or instruction set identified",
        "loaded-can clearance and support capacity require install-location review"
      ]
    },
    {
      "id": "stedi-st3k-21-5-ranger-predator",
      "sku": "LEDST3K-20L",
      "rrpAud": null,
      "currentAuRetailPriceAud": 219,
      "priceState": "verified-current-au-retail-price-multi-seller-manufacturer-rrp-unverified",
      "weightKg": 1.855,
      "weightNormalization": "Multiple current STEDI product listings publish explicit 1.855 kg product specification. Autopartsco separately labels 2.55 kg shipping weight and another retailer lists 4 kg; those ancillary/listing figures do not override the explicit product-spec mass.",
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Exact LEDST3K-20L is offered as an add-on with the current Offroad Animal Predator Bullbar for Ford Ranger Next Gen 2022-on. Offroad Animal manufacturer states FB-FRA-NG-22-PR-ASM0 accepts up to a 22-inch single-row light bar inside the bar; electrical trigger/adaptor remains headlight-level dependent and staff-review.",
      "url": "https://www.autopartsco.com.au/stedi-21.5-st3k-20-led-slim-led-light-bar",
      "fitmentUrl": "https://www.autopartsco.com.au/offroad-animal-predator-bullbar-ford-ranger-next-g",
      "parentManufacturerUrl": "https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/",
      "specCrossCheckUrl": "https://frankiesautoelectrics.com.au/products/stedi-ledst3k-20l",
      "sourceType": "manufacturer-parent-plus-current-dealer-fitment-and-product-spec",
      "sourceState": "physical-fitment-confirmed-electrical-staff-review",
      "requiredParentSku": "FB-FRA-NG-22-PR-ASM0",
      "knownConflictSkus": [
        "ORA-ALO-S5D1-20"
      ],
      "specification": {
        "ledCount": 20,
        "effectiveLumens": 4100,
        "operatingVoltageV": "10-30",
        "currentDrawAAt13_5V": 4.3,
        "ipRating": "IP68",
        "colourTemperatureK": 5700,
        "connector": "Deutsch DT-2 (majority current product-spec sources)",
        "lightHeightMmWithoutSideBrackets": 51,
        "lightHeightMmWithSideBrackets": 63
      },
      "includedParts": [
        "ST3K 21.5-inch LED light bar",
        "stainless fasteners",
        "stainless steel side mounting brackets",
        "12V Quick Fit high-beam wiring/relay/wiring kit/on-off switch",
        "H4 adapter",
        "HB3 adapter",
        "wiring instructions"
      ],
      "electricalState": {
        "state": "confirmed-stedi-adaptor-family-staff-selection-by-headlight-level",
        "exactHighBeamAdaptorSku": null,
        "adapterByHeadlightLevel": {
          "levels1And3": "FRD-RNG-NG-ADAPTER-L13",
          "level2": "FRD-RNG-NG-ADAPTER-L2"
        },
        "compactRetailAliases": {
          "levels1And3": "FRDRNGNGADAPTERL13",
          "level2": "FRDRNGNGADAPTERL2"
        },
        "bundledQuickFitHarnessSku": null,
        "bundledHarnessSkuState": "not-printed-on-current-LEDST3K-20L-product-spec",
        "inferencePolicy": "do not infer a bundled harness SKU; component-family compatibility is source-backed, adapter selection still requires actual headlight-level identification",
        "remainingGate": "Identify actual headlight level before quote/workshop release; exact bundled harness SKU remains unknown."
      },
      "secondaryRouteEvidence": {
        "stealthTopSku": "TB-COM-PR-ASM0",
        "dealerOffersSingleAndTwinST3K": true,
        "state": "not-auto-governed-in-this-centre-aperture-package"
      },
      "staffReviewReasons": [
        "actual Next-Gen Ranger headlight level must be identified before selecting the governed adaptor",
        "standalone PRO4X4 install time/labour not published",
        "one retailer labels light connector DTP while multiple detailed product-spec sources label DT-2; workshop physical connector check remains prudent",
        "twin-pack/top-hoop route is out of scope for this single-light centre-aperture package"
      ],
      "nextGenRangerHighBeamSupportUrl": "https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation",
      "adapterRetailCrossCheckUrls": [
        "https://www.repco.com.au/globes-batteries-electrical/driving-lights-accessories/driving-light-mounts-accessories/stedi-next-gen-ranger-everest-piggy-back-adaptor-trim-levels-1-3-frdrngngadapterl13/p/A5691972",
        "https://www.repco.com.au/globes-batteries-electrical/driving-lights-accessories/driving-light-mounts-accessories/stedi-next-gen-ranger-everest-piggy-back-adaptor-trim-level-2-frdrngngadapterl2/p/A5691973"
      ]
    },
    {
      "id": "stedi-ranger-highbeam-adapter-l13",
      "sku": "FRD-RNG-NG-ADAPTER-L13",
      "rrpAud": null,
      "currentAuRetailPriceAud": 50,
      "priceState": "verified-current-au-retail-price-rrp-unknown",
      "weightKg": null,
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Next-Gen Ranger/Everest actual headlight Level 1 or Level 3 only. STEDI support instructs passenger-side headlight-harness inline connection, chassis earth and STEDI Smart Harness T-pin connection.",
      "url": "https://stediuk.com/products/stedi-next-gen-ford-ranger-raptor-everest-piggyback-adaptor",
      "fitmentUrl": "https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation",
      "auPriceUrl": "https://www.repco.com.au/globes-batteries-electrical/driving-lights-accessories/driving-light-mounts-accessories/stedi-next-gen-ranger-everest-piggy-back-adaptor-trim-levels-1-3-frdrngngadapterl13/p/A5691972",
      "sourceType": "manufacturer",
      "sourceState": "confirmed-component-staff-headlight-level-selection",
      "canonicalPartNumber": "FRD-RNG-NG-ADAPTER-L13",
      "crossReferencePartNumbers": [
        "FRDRNGNGADAPTERL13"
      ],
      "connectorType": "2 PIN / FORD PROPRIETARY",
      "includedParts": [
        "Next Gen piggy-back high-beam adaptor",
        "wiring instructions"
      ],
      "staffReviewReasons": [
        "actual headlight level must be identified before release",
        "do not infer compatibility with third-party harnesses",
        "manufacturer RRP, product mass and timed labour remain unknown"
      ]
    },
    {
      "id": "stedi-ranger-highbeam-adapter-l2",
      "sku": "FRD-RNG-NG-ADAPTER-L2",
      "rrpAud": null,
      "currentAuRetailPriceAud": 25,
      "priceState": "verified-current-au-retail-price-rrp-unknown",
      "weightKg": null,
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Next-Gen Ranger/Everest actual headlight Level 2 only. STEDI support instructs passenger-footwell labelled signal pickup using provided crimp connectors, followed by STEDI Smart Harness T-connector.",
      "url": "https://stediuk.com/products/stedi-next-gen-ford-ranger-raptor-everest-piggyback-adaptor",
      "fitmentUrl": "https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation",
      "auPriceUrl": "https://www.repco.com.au/globes-batteries-electrical/driving-lights-accessories/driving-light-mounts-accessories/stedi-next-gen-ranger-everest-piggy-back-adaptor-trim-level-2-frdrngngadapterl2/p/A5691973",
      "sourceType": "manufacturer",
      "sourceState": "confirmed-component-staff-headlight-level-selection",
      "canonicalPartNumber": "FRD-RNG-NG-ADAPTER-L2",
      "crossReferencePartNumbers": [
        "FRDRNGNGADAPTERL2"
      ],
      "connectorType": "2 PIN / FORD PROPRIETARY / footwell pickup route",
      "includedParts": [
        "Next Gen piggy-back high-beam adaptor",
        "wiring instructions"
      ],
      "staffReviewReasons": [
        "actual headlight level must be identified before release",
        "footwell signal-wire identification and crimp quality require workshop verification",
        "do not infer compatibility with third-party harnesses",
        "manufacturer RRP, product mass and timed labour remain unknown"
      ],
      "partNumberCrossCheckUrl": "https://www.sawleysautoandmarine.com.au/products/high-beam-adaptor-frd-rng-ng-adapter-l2-piggy-back-adapter-next-gen-ford-ranger-everest-l2"
    },
    {
      "id": "oa-night-slapper-9-pair-ranger",
      "sku": "ORA-ALO-P-R-9-C31D1-AW",
      "rrpAud": null,
      "currentManufacturerPriceAud": 795,
      "priceState": "verified-current-manufacturer-price-not-explicit-msrp",
      "weightKg": null,
      "storefrontListedWeightKg": 3,
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Current Offroad Animal Next-Gen Ranger Toro configurator explicitly offers the exact Night Slapper pair. Predator does not currently offer Night Slapper, so that route is not inferred. Exact Toro mounting BOM and vehicle-side two-light electrical integration remain staff-review.",
      "url": "https://offroadanimal.com.au/offroad-animal-night-slapper-9-inch-led-driving-lights/",
      "fitmentUrl": "https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/",
      "sourceType": "manufacturer",
      "sourceState": "confirmed-toro-option-engineering-mount-and-electrical",
      "includedParts": [
        "pair of lights",
        "covers",
        "wiring looms"
      ],
      "weightNormalization": "3.00 KGS storefront field has undefined product/pair/shipping semantics; normalized weightKg remains null.",
      "electricalState": {
        "state": "engineering-staff-review",
        "publishedSpecScope": "current/power/lumen table scope not explicitly stated as per-lamp or pair",
        "inferencePolicy": "preserve published values verbatim; do not derive two-light circuit sizing or reuse STEDI interfaces without evidence"
      },
      "staffReviewReasons": [
        "exact Toro spotlight mounting bracket/points unresolved",
        "two-light high-beam trigger/harness architecture unresolved",
        "standalone PRO4X4 labour/time unpublished"
      ]
    },
    {
      "id": "oa-ass-kicker-9-pair-ranger",
      "sku": "ORA-ALO-GR7-B",
      "rrpAud": null,
      "currentManufacturerPriceAud": 580,
      "priceState": "verified-current-manufacturer-price-not-explicit-msrp",
      "weightKg": 9,
      "storefrontListedWeightKg": 7,
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Current Offroad Animal Next-Gen Ranger Predator and Toro configurators explicitly offer the Ass Kicker pair. Predator route is governed through the 9-inch OA Rally Hoop; Toro does not inherit that hoop and retains mounting-BOM review.",
      "url": "https://offroadanimal.com.au/offroad-animal-ass-kicker-9-round-led-light-with-side-shooter-pair/",
      "fitmentUrls": [
        "https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/",
        "https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/"
      ],
      "sourceType": "manufacturer",
      "sourceState": "confirmed-parent-options-engineering-electrical",
      "weightNormalization": "Manufacturer explicit 4.5 kg each including wiring harness × sold pair = 9 kg. Generic 7.00 KGS storefront field is retained separately as conflicting metadata.",
      "includedPartsPerLight": [
        "1 light",
        "1 wiring harness",
        "1 bolt kit",
        "1 stainless mounting bracket"
      ],
      "routeDependencies": [
        {
          "parentSku": "FB-FRA-NG-22-PR-ASM0",
          "state": "confirmed-dedicated-compatible-route-hard-dependency-unproven",
          "compatibleSku": "TB-COM-RAL-ORA-2X9-ASM0"
        },
        {
          "parentSku": "FB-FRA-NG-22-TOR-ASM0",
          "requiredSku": null,
          "state": "option-confirmed-mounting-bom-unresolved"
        }
      ],
      "staffReviewReasons": [
        "exact minimum Predator mounting BOM without dedicated Rally Hoop remains unresolved",
        "exact Toro mounting bracket/points unresolved",
        "two-light Next-Gen Ranger electrical trigger architecture unresolved",
        "standalone PRO4X4 labour/time unpublished"
      ]
    },
    {
      "id": "oa-butt-kicker-7-pair-ranger",
      "sku": "ORA-ALO-R5-C10D1",
      "rrpAud": null,
      "currentManufacturerPriceAud": 415,
      "priceState": "verified-current-manufacturer-price-not-explicit-msrp",
      "weightKg": null,
      "storefrontListedWeightKg": 7,
      "installTimeHours": null,
      "installLabourAud": null,
      "fitment": "Current Offroad Animal Next-Gen Ranger Predator and Toro configurators explicitly offer the Butt Kicker pair. Predator route is governed through the 7-inch OA Rally Hoop; Toro does not inherit that hoop and retains mounting-BOM review.",
      "url": "https://offroadanimal.com.au/offroad-animal-butt-kicker-7-round-led-light-pair/",
      "fitmentUrls": [
        "https://offroadanimal.com.au/predator-bull-bar-ford-ranger-next-gen-ra-2022-on/",
        "https://offroadanimal.com.au/toro-bull-bar-for-ford-ranger-next-gen-ra-2022-on/"
      ],
      "sourceType": "manufacturer",
      "sourceState": "confirmed-parent-options-engineering-electrical",
      "weightNormalization": "7.00 KGS storefront field has undefined product/pair/shipping semantics; normalized weightKg remains null.",
      "includedPartsPerLight": [
        "1 light",
        "1 wiring harness",
        "1 bolt kit",
        "1 stainless mounting bracket"
      ],
      "routeDependencies": [
        {
          "parentSku": "FB-FRA-NG-22-PR-ASM0",
          "state": "confirmed-dedicated-compatible-route-hard-dependency-unproven",
          "compatibleSku": "TB-COM-RAL-ORA-2X7-ASM0"
        },
        {
          "parentSku": "FB-FRA-NG-22-TOR-ASM0",
          "requiredSku": null,
          "state": "option-confirmed-mounting-bom-unresolved"
        }
      ],
      "specification": {
        "powerPerLightW": 105,
        "effectiveLumensPerLight": 5800,
        "operatingVoltageV": "9-36",
        "ipRating": "IP68/IP69K",
        "connector": "small DT connector"
      },
      "staffReviewReasons": [
        "exact minimum Predator mounting BOM without dedicated Rally Hoop remains unresolved",
        "exact Toro mounting bracket/points unresolved",
        "two-light Next-Gen Ranger electrical trigger architecture unresolved",
        "standalone PRO4X4 labour/time unpublished"
      ]
    },
    {
      "id": "stedi-dual-smart-harness-ranger",
      "sku": "WIRQKFT-SMART",
      "rrpAud": null,
      "currentAuRetailPriceAud": 69.99,
      "weightKg": null,
      "storefrontListedWeightKg": 1,
      "installTimeHours": null,
      "fitment": "Universal STEDI dual-output high-beam harness; Next-Gen Ranger vehicle-side route confirmed via STEDI FRD-RNG-NG-ADAPTER-L13 or FRD-RNG-NG-ADAPTER-L2 according to actual headlight level",
      "url": "https://offroadanimal.com.au/dual-connector-plug-play-smart-harness-high-beam-driving-light-wiring/",
      "fitmentUrl": "https://support.stedi.com.au/hc/en-us/articles/21520348753177-STEDI-High-Beam-Piggy-Back-Adaptor-Installation",
      "rangerAdapterUrl": "https://support.stedi.com.au/hc/en-us/articles/18200648989977-Next-Gen-Ford-Ranger-Everest-High-Beam-Adaptor-Installation",
      "sourceType": "manufacturer",
      "sourceState": "confirmed-vehicle-side-light-side-engineering",
      "weightNormalization": "1.00 KGS storefront field has undefined product/shipping semantics; normalized weightKg remains null.",
      "specification": {
        "outputs": 2,
        "cableGauge": "10AWG",
        "fuseA": 35,
        "relayA": 60,
        "includedReducers": "DTP-to-DT",
        "triggerAdapters": [
          "HB3",
          "H4"
        ]
      },
      "staffReviewReasons": [
        "actual headlight level selection",
        "lamp-side mating connector/gender/pinout/polarity",
        "selected lamp-pair circuit/load suitability",
        "standalone labour/time unpublished"
      ]
    },
    {
      "id": "stedi-type-x-pro-pair-ranger",
      "sku": "LEDTYPE-X-PRO",
      "rrpAud": null,
      "currentAuRetailPriceAud": 699,
      "pricingState": "current Australian retail/list price verified; manufacturer RRP not explicitly source-proven",
      "brand": "STEDI",
      "product": "TYPE-X PRO 8.5-inch LED Driving Lights (Pair)",
      "sourceType": "manufacturer-product-support + Australian-retail-price + manufacturer-vehicle-fitment",
      "url": "https://stediuk.com/products/type-x-pro-led-driving-lights",
      "installGuideUrl": "https://support.stedi.com.au/hc/en-us/articles/360023907832-STEDI-Type-X-Pro-LED-Driving-Lights",
      "fitmentUrl": "https://offroadanimal.com.au/rally-hoop-to-suit-predator-bars-for-stedi-type-x-pro/",
      "australianRetailPriceSources": [
        "https://www.carracks.com.au/products/stedi-type-x-pro-lights-pair-ledtype-x-pro",
        "https://peak4x4.com.au/products/stedi-type-x-pro-led-driving-lights"
      ],
      "weightKg": 5.72,
      "weightBasis": "2.860 kg each published by STEDI; normalized pair mass = 5.72 kg",
      "fitment": "Dedicated Offroad Animal Type-X PRO Rally Hoop TB-COM-RAL-STE-2XPRO-ASM0; exact hoop table maps Ford Ranger RA 2022-on to Predator FB-FRA-NG-22-PR-ASM0 with OA camera relocation required",
      "installTimeHours": null,
      "installDifficulty10": null,
      "keyEvidence": [
        "LEDTYPE-X-PRO is sold as a pair and includes a Smart High Beam Wiring Harness with DTP-2 sealed connectors",
        "Offroad Animal says the dedicated Rally Hoop houses two Type-X PRO lights and only these lights",
        "Ford Ranger RA 2022-on exact hoop fitment is source-listed and camera relocation is required",
        "STEDI mounting instructions require all three M10 base bolts per light bracket"
      ],
      "unresolved": [
        "manufacturer RRP in AUD",
        "standalone SKU of the harness bundled inside LEDTYPE-X-PRO",
        "standalone PRO4X4 installation labour/time"
      ]
    }
  ]
};
});
