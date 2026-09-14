# PRO4X4 Rig Builder — Alpha 26 WF1 Run 03

## Scope
WF1-only package from the latest merged Alpha 26 customer-configurator checkpoint. This run closes the highest-priority WF1 defect returned by WF5: an accessory with `fitment.anyOfRequiredParts` could remain selected after its last valid support item was removed, while the immutable project/quote snapshot did not carry a hard dependency gate.

No catalogue records, backend production controls, staff tooling or visual assets were changed.

## Concrete progress

### 1. Durable OR-dependency gates in immutable project / quote snapshots
`merged-project-contract.gatesFor()` now evaluates `fitment.anyOfRequiredParts` in addition to direct `requires/requiredParts` dependencies.

When none of the verified alternatives is selected it emits a structured `dependency-any-of` gate containing:
- the dependent product ID;
- the exact verified alternative IDs in `requiredAnyOf`;
- resolved catalogue labels for those alternatives when available;
- a human-readable note stating that one of the alternatives is required.

`buildSnapshot()` now passes the authoritative vehicle catalogue into `gatesFor()` for label resolution. The selected BOM still preserves the original source `fitment.anyOfRequiredParts` metadata unchanged.

No alternative is auto-selected or inferred.

### 2. Post-removal customer invariant handling
The customer configurator now revalidates the selected build immediately after an item is removed. If that removal leaves another selected product without one of its verified supporting alternatives, the build is retained but explicitly enters an unresolved fitment state rather than silently appearing valid.

This preserves the customer's build intent while making the missing support choice impossible to miss.

### 3. Build-summary fitment messaging
Selected products with OR dependencies now show the exact alternatives in the build summary:
- `SUPPORT REQUIREMENT MET` when one verified alternative is selected;
- `REQUIRES ONE OF` when no alternative is present.

The vehicle fitment banner gains a blocking visual state for unresolved support choices and tells the customer to add one verified alternative before fitment approval.

Existing conditional manufacturer-fitment messaging from WF1 Run 02 remains intact.

### 4. Quote handoff remains immutable
Quote submission remains allowed so staff can resolve a deliberately incomplete build, but the unresolved dependency is now locked into the exact saved project revision and quote handoff. The quote confirmation explicitly tells the customer when unresolved dependency gates remain for staff resolution.

Project → revision → share → quote lineage is unchanged. `REFERENCE_BACKED_APPROVED_VISUALS_ONLY` and `fallbackPolicy:'none'` are unchanged.

## Verification

### WF1 targeted regression
`npm run test:wf1-anyof` — **PASS**.

Verified:
- lower bash/skid plate is blocked before Predator or Toro is selected;
- both verified alternatives are offered without silently choosing one;
- Predator satisfies the OR dependency;
- Toro satisfies the OR dependency;
- a stranded bash plate produces a durable `dependency-any-of` project/quote gate;
- the gate preserves the exact alternative IDs and human-readable labels;
- the immutable workflow state becomes `needs-fitment-review`;
- the original BOM fitment metadata remains intact.

### Existing WF1 conditional-fitment regression
`tests/wf1-conditional-fitment-guidance-alpha26.js` — **PASS**.

### Full Alpha regression chain
`npm test` — **PASS**, including Alpha 12 → Alpha 26 historical tests plus WF1 Run 02 and the new Run 03 dependency-integrity test.

### WF5 positive promotion / lineage regression
`npm run test:wf5-promotion` — **PASS**.

This confirms the WF1 changes did not disturb staged visual isolation, reviewed master promotion, exact resolver behavior, immutable review evidence, or project/share/quote visual lineage.

### WF5 acceptance gate
The previously returned **WF1-BOM-ANYOF** check now **PASSES**.

The combined acceptance command remains red only because **WF4-DIRECT-PRODUCTION-REVIEW** is still unresolved in the separate WF4 lane. WF5 customer draft isolation continues to pass. No WF4 code was changed in this WF1 package.

### Static / integrity checks
- `npm run check` — **PASS**
- JavaScript syntax sweep — **85 files / 0 failures**
- JSON parse sweep — **9 files / 0 failures**
- HTML local dependency sweep — **16 HTML files / 239 local references / 0 missing**

## Files changed by this WF1 package
Product/runtime changes are limited to:
- `merged-app.js`
- `merged-project-contract.js`
- `merged.css`
- `package.json`

Verification/report additions:
- `tests/wf1-anyof-dependency-integrity-alpha26.js`
- WF5 QA-only tests copied forward for gate verification
- `qa-evidence/WF1_RUN03_*`
- this report

No `data-ranger.js`, `data-y62.js`, server database/runtime files, render registry, canonical candidate, or image file was modified.

## Next dependency
The immediate WF1 QA-return is closed. The next unfinished WF1 package should remain **structured customer fitment-context capture**, but only after WF2 defines governed question keys/options for manufacturer conditions; WF1 should not parse free-text fitment notes into invented compatibility truth.

For promotion of the overall merged Alpha checkpoint, the remaining cross-workflow blocker is WF4's direct production upsert reviewer-evidence gap identified by WF5.
