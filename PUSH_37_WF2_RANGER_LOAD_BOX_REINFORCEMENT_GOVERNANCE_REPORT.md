# PRO4X4 Rig Builder — WF2 Ranger Load-Box Reinforcement Governance — Push 11

**Schema:** `0.26.10`  
**Scope:** WF2 Catalogue + Fitment Data only  
**Date verified:** 2026-09-14  
**Catalogue:** 49 → 50 governed Ranger records  
**Evidence registry:** 30 → 31 primary manufacturer-backed rows

## Package advanced

This push closes the highest-priority Ranger tub-support data gap without inventing cross-vendor fitment certainty. It adds the Ford Genuine non-Raptor load-box reinforcement kit as a governed record and connects it to the existing Ranger tub/rack records only as a staff-review support candidate where the accessory manufacturer has not named the Ford SKU.

### New governed product

- **Ford Genuine Load Box Reinforcement Kit (J-Brace)**
  - ID: `ford-load-box-reinforcement-ranger`
  - SKU: `VN1WZ2627726A`
  - Alternate Ford service-part reference captured in evidence: `AMN1WJ27726AA`
  - Current observed Australian listed RRP: **AUD $336.12**
  - Installed weight: **unknown** — not normalised from non-Ford shipping/product listings
  - PRO4X4 labour price: **unknown**
  - Manufacturer install duration: **unknown**
  - Catalogue state: **engineering / staff review**
  - Visual state: **non-visual / staff review**

## Source-backed fitment state

Primary manufacturer source: Ford currently lists `VN1WZ2627726A` as the **Ranger 2024–2025 Load Box Reinforcement Kit for non-Raptor Models**. Ford states that reinforcement brackets are required when accessories extend above the load-box side rail and weigh more than **40 kg**, and explicitly says suitability for aftermarket non-Ford-Licensed accessories must be determined by the aftermarket manufacturer or supplier. Ford recommends dealer installation.

Supporting Australian evidence:

- Australian Online Car Parts lists genuine `VN1WZ2627726A` for **Ranger RA 2022 onward excluding Raptor**, with observed RRP **$336.12**.
- Jefferson Ford Parts independently lists the same Ford part number for Next-Gen Ranger **XLS / XLT / Wildtrak**.

Platinum is therefore **not promoted to independently trim-confirmed** in this package. It remains a VIN/build-date staff check even though broad non-Raptor / RA 2022-on source wording may encompass it. Raptor is explicitly excluded from this governed record.

## Existing fitment tightened

### Scout Tub Platform Rack — full and 500 mm

Both existing Scout rack records now reference the Ford reinforcement kit as a **staff-review support candidate only**. Offroad Animal says Ranger/Raptor installs should use a tub brace, but does not identify Ford `VN1WZ2627726A` by SKU. Therefore:

- no automatic `requires` dependency was created;
- no cross-vendor equivalence was inferred;
- the bare-tub mounting route retains review;
- roller-shutter-specific fastener and setup checks remain unchanged.

### EGR J-Brace

The EGR `040174` record still explicitly excludes **Wildtrak and Platinum**. The Ford kit is recorded only as a separate governed alternative; it does not silently replace EGR or satisfy another vendor's brace requirement.

### GOAT Rack

The existing GOAT Rack manufacturer weight is **50 kg**. That intersects Ford's published `>40 kg` elevated load-box accessory reinforcement threshold, so a structured reinforcement staff-review gate now points to the governed Ford kit as a candidate. It is **not auto-added** because vehicle build/VIN and aftermarket supplier acceptance remain unresolved.

## Evidence sources

1. Ford — Ranger 2024–2025 Load Box Reinforcement Kit for non-Raptor Models  
   https://www.ford.com/product/load-box-reinforcement-kit-for-nonraptor-models-p2746486928
2. Australian Online Car Parts — genuine `VN1WZ2627726A`, Ranger RA 2022-on excluding Raptor, observed RRP $336.12  
   https://www.australianonlinecarparts.com.au/canopy-j-brace-kit-vn1wz2627726a-for-ford
3. Jefferson Ford Parts — authorised Australian Ford dealer listing for XLS / XLT / Wildtrak  
   https://www.jeffersonfordparts.com.au/ford-next-gen-ranger-j-brace-bracket-kit-xls-xlt

## Verification

- Targeted `wf2-ranger-load-box-reinforcement-alpha26.js`: **PASS**
- Full Alpha regression chain via `npm test`: **PASS**
- `npm run check`: **PASS**
- JavaScript syntax validation: **87 / 87 PASS**
- JSON parse validation: **9 / 9 PASS**
- HTML/local dependency validation: **16 HTML files / 239 local references / 0 missing**
- Catalogue identity validation: **50 IDs / 50 unique; 50 SKUs / 50 unique**
- Governed dependency/support-reference validation: **PASS**
- Approved visual leakage from new/changed WF2 records: **0**
- Customer UX files changed: **0**
- Visual assets created or changed: **0**

## Next WF2 dependency

The remaining tub-reinforcement uncertainty is now narrower: obtain an authoritative Australian Ford source that explicitly resolves **Platinum and vehicle build-date/VIN reinforcement applicability** for `VN1WZ2627726A`, and/or an Offroad Animal source that names the exact approved brace for its Scout rack route. Until then those paths stay staff-review and are not auto-satisfied.

If that evidence remains unavailable, the next WF2 package should expand another exact Next-Gen Ranger subsystem from manufacturer-backed product pages rather than weaken the reinforcement gate. Equivalent Y62 mapping follows after the Ranger verified slice is sufficiently broad.
