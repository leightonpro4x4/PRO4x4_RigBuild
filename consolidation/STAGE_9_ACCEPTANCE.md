# Stage 9 — Hands-on acceptance plan

Application baseline: `7518af7b69aa0aff2461dce5c20cbeab45e17d1f`, `alpha94-consolidation`. These are **manual tests to perform**, not results. Hosted automated desktop evidence is recorded separately in `STAGE_9.md` / `STAGE_9_VALIDATION.json`. **No real iOS run is claimed.**

## Test record and preparation

Record tester, UTC time, preview URL, deployed app SHA, configuration revision, desktop OS/browser/version or actual iPhone model/iOS/Safari version, network, orientation and database identifier (not its contents). Record each test as PASS / FAIL / BLOCKED / NOT IMPLEMENTED with observed result and a private screenshot/recording reference. All checkboxes below are initially unexecuted. Do not commit personal information, session cookies, share tokens or internal reviewer images.

Use a fresh **test** browser profile/session and a fresh private preview database with no production records. Use fictional contact details. Desktop may start at `http://127.0.0.1:8094/` through `npm start`; remote/iOS testing requires the deployment gate in `STAGE_9_DEPLOYMENT.md`. Never use `localhost` as an iPhone's link to the desktop host.

There are two deliberately different journeys:

* **Authoritative catalogue**: current WF2 facts and Stage 4 rules. Six mapped Ranger controls are available; Power Boards is not. Unknown pricing and staff-review conditions remain. Saved catalogue revisions can request a draft review.
* **Alpha 93 checkpoint — A$10,239 fixture**: seven preserved mesh/product fixtures, simpler dependency graph and fixed parts prices. It can be saved as a checkpoint but **cannot request a quote**. Do not use the old in-page checklist's quote instruction as acceptance authority.

Use a clean browser context for each phase if saved pointers interfere. `RESET BUILD` clears the current selection; it does not delete server projects or erase all cached profiles. Explicitly set **Authoritative catalogue → Ranger → RESET BUILD** before starting a fresh catalogue test. Set **Ranger before switching to checkpoint**; the vehicle selector becomes disabled in checkpoint mode.

## Desktop checklist — catalogue and customer journey

| Done / ID | Exact action | Expected observation |
|---|---|---|
| [ ] D01 | Open `/` in a fresh desktop browser with normal network access; wait up to 60 seconds. | Integrated Alpha 94 loads, no fatal console/module error, no `Server workflow unavailable`; runtime shows `10/10 3D ASSETS LOADED`. Ranger preview notice is visible. |
| [ ] D02 | Set Build mode to **Authoritative catalogue**, Vehicle to **Ranger**, then **RESET BUILD**. | Ranger stock base with factory front and rear; zero selected products; `AUTHORITATIVE CATALOGUE DRAFT`; no production approval. |
| [ ] D03 | Collapse and expand **FRONT PROTECTION + LIGHTING → OFFROAD ANIMAL**, **TOURING + ROOF STORAGE → OFFROAD ANIMAL**, **SIDE STEPS + ACCESS → CLEARVIEW**, **TUB + LOAD CARRYING → OFFROAD ANIMAL**, and **REAR PROTECTION → OFFROAD ANIMAL**. | Each existing section toggles and its controls remain usable. Seven cards exist, not a complete 73-product catalogue browser. Record full Ranger catalogue navigation as **NOT IMPLEMENTED**, not a missing-data regression. |
| [ ] D04 | Use Tab/Shift-Tab through mode, vehicle, toolbar, category controls, product buttons and saved-project controls; activate selected buttons using Enter/Space. | Focus is visible, controls can be reached and selection is not accidentally changed by scroll/focus. Record any focus/readability/overflow defect; do not infer accessibility acceptance from CI. |
| [ ] D05 | With an empty catalogue build, click **ADD Butt Kicker 7in Pair**. | Addition is rejected pending an explicit Predator/Toro choice; no bar or light is silently added. Customer-readable choice reasons and choice buttons appear. |
| [ ] D06 | Click the choice for Predator, then click **ADD Butt Kicker 7in Pair** again. | Predator and the light pair are selected; Toro and Rally are not auto-added. Staff/engineering reasons remain. Light mesh remains hidden without the exact preserved Predator/Rally mounting assembly; selecting a commercial item is not a promise of a mesh. |
| [ ] D07 | Reset; add **Rally Hoop** directly. Inspect selected lines. | Predator **and `oa-camera-relocation-ranger`** are automatically included with Rally. Camera relocation is a commercial prerequisite without an invented dedicated mesh. The simpler checkpoint chain must not override it. |
| [ ] D08 | Add Butt Kickers to the D07 build. | Light pair appears with the preserved Predator/Rally assembly; electrical/mounting/labour review conditions are still explained. No production approval is granted. |
| [ ] D09 | Remove **Predator** from the D08 catalogue build. | Factory front returns; Rally is removed transitively. Butt Kickers remain selected with a reopened any-of choice, but their mesh is hidden. Camera relocation may remain selected; do not demand deletion of unrelated/orphan prerequisites. No Toro is silently selected. |
| [ ] D10 | Reset; add and remove **Scout Roof Rack**. | Roof mesh follows selection; front/rear factory parts stay independent. Source mounting/light-bar/headliner conditions remain readable and cannot become verified merely by selection. |
| [ ] D11 | Inspect both toolbar and card for **Power Boards** in catalogue mode. | Disabled with `UNAVAILABLE IN THIS CATALOGUE` and unresolved price; no WF2 identity is fabricated from `PB-FD-005` or the checkpoint A$1,649. |
| [ ] D12 | Reset; add **The Nice Tub Rack**. Inspect card, known parts and fitted pricing. | Rack can be a review draft; card says `PRICE UNRESOLVED`; summary includes `+ UNPRICED`; fitted pricing says `INSTALL / REVIEW REQUIRED`. The checkpoint A$1,300 must not fill the missing catalogue price. |
| [ ] D13 | Reset; add **Rear Protection Bumper**. | Replacement preview can appear while engineering/factory-towbar/Hayman Reese conditions remain unresolved. No customer towbar selector exists. Known-incompatible-context handling is verified by domain tests, **NOT IMPLEMENTED as a manual UI input**. Do not claim that condition was satisfied. |
| [ ] D14 | Observe all pricing/reason text with Scout, rear bumper and tub rack selected. | Known parts subtotal is distinguished from complete fitted pricing. Conditional fitment and review-required states remain visible; no customer-confirmed final total or guaranteed fitment appears. |
| [ ] D15 | In a fresh catalogue phase, reset and add Predator; inspect **REQUEST REVIEW OF SAVED REVISION** before saving. | Quote/review button is disabled because current draft is unsaved. |
| [ ] D16 | Click **Save as new project**. Record project ID, revision ID and checksum from state/receipt. | Server returns `R000001` in the new project, `SAVED` and an immutable revision receipt. Local cache is not presented as server authority. |
| [ ] D17 | Reload the same tab, then close/reopen that preview URL in the same browser profile. | Same saved project/revision and rendered selection restore using the guest session and saved pointer. Checksum stays the same; no new revision is created by reading. |
| [ ] D18 | Add Scout. Try the review button, then click **Save revision**. | State first shows `UNSAVED CHANGES` and review is disabled. Saving creates `R000002` in the same project; `R000001` is retained, not overwritten. |
| [ ] D19 | Make another unsaved change; select `R000001` in **Saved revision**, click **Load selected revision**, cancel the confirmation, then repeat and accept. | Cancel keeps the dirty draft. Accept restores R000001 exactly and updates render/selection/receipt. No silent discard or rewrite of R000002. |
| [ ] D20 | Fill NAME, PHONE, EMAIL and BUILD NOTES with synthetic values. Click **REQUEST REVIEW OF SAVED REVISION** on clean R000001. | `SERVER QUOTE <id> · review / pricing required · pinned R000001`. Record quote ID; it is a stored draft, not an email, final issued quote or booking. |
| [ ] D21 | In the same authenticated browser, inspect `GET /api/quotes/<recorded-quote-id>` and `GET /api/projects/<recorded-project-id>/revisions/R000001` using Network tools or same-origin tabs. | Quote projectId/revisionId/revisionChecksum match the saved receipt and revision checksum. Selections/calculations refer to R000001, not current unsaved state or R000002. Quote status is draft and quoteReady is false for this unresolved build. |
| [ ] D22 | Return to the app, load R000002 and then read the existing quote again. | Existing quote remains pinned to R000001 and its original checksum; navigation does not mutate lineage. |
| [ ] D23 | Fill POSTCODE and inspect the quote request payload. | Document known limitation: POSTCODE is **not submitted or stored**. Do not mark postcode capture PASS. NAME/EMAIL/PHONE/NOTES are the implemented fields. |
| [ ] D24 | Load a clean saved revision; click **Share saved revision**; open the returned link in an isolated browser. | JSON share is pinned to that revision/checksum. No sibling revision, owner, full project, internal render provenance or reviewer registry is exposed. It is a data DTO, **not an implemented interactive share-page UI**. Keep token/link out of public records. |
| [ ] D25 | On the loaded clean revision, click **Revalidate as new revision** and accept the confirmation. | New immutable revision under current catalogue/implementation, old checksum/content unchanged. This exercises explicit current-version revalidation. Genuine stale-version restoration needs a controlled old-version fixture/environment; do not alter live catalogue/governance merely to create staleness. |
| [ ] D26 | Use an entirely separate guest browser session and attempt the recorded private project/revision and quote URLs. | Ownership denial; server does not expose another guest's private data. Original test browser can still read its records. Cross-device account recovery is NOT IMPLEMENTED. |

## Desktop checklist — Ranger visual checkpoint

Run this phase in a fresh context, or explicitly select Ranger before selecting checkpoint. A saved catalogue pointer can otherwise restore catalogue mode on reload. If testing server checkpoint restoration, save the checkpoint first and record its own pointer.

| Done / ID | Exact action | Expected observation |
|---|---|---|
| [ ] V01 | Set **Alpha 93 checkpoint — A$10,239 fixture**; click **RESET BUILD**. | Vehicle selector disabled; stock Ranger shows factory front and rear; checkpoint label visible; no selected accessories. |
| [ ] V02 | Drag with primary mouse button around the model, scroll wheel both directions, click **FRONT**, **3/4 VIEW**, **RESET VIEW**. | Orbit is smooth enough for inspection; wheel zoom is bounded (source distance limits 4–10); no pan; camera buttons restore expected views; no clipping/disappearing assembly. CI only dispatched inputs, so judge actual visual response manually. |
| [ ] V03 | Add Predator only; inspect front at several angles. | Predator visible and factory front hidden; factory rear remains. No duplicate front geometry. |
| [ ] V04 | Reset; add rear bumper only; orbit to rear. | Rear replacement visible, factory rear hidden, factory front remains. |
| [ ] V05 | Add Predator to V04, then remove rear, then remove Predator. | All four combinations work: both replacement, front-only, then stock. Front/rear changes remain independent; the correct factory part returns each time. |
| [ ] V06 | Reset; add Butt Kicker pair directly. | **Checkpoint only:** Predator and Rally are automatically added and all three meshes appear. Reset, add Rally alone, and confirm it adds Predator. |
| [ ] V07 | Reset; add **Scout Roof Rack** alone, inspect roof and sides, then remove it. | Only Scout layer toggles; no front/rear or other product changes. |
| [ ] V08 | Reset; add **Clearview Power Boards** alone, inspect both sides, then remove it. | Preserved pair mesh toggles independently. This does not establish catalogue fitment or require powered retract animation; no such new animation is claimed. |
| [ ] V09 | Reset; add **The Nice Tub Rack** alone, inspect rear/side alignment, then remove it. | Only tub-rack mesh toggles; fixture shows A$1,300, clearly separate from catalogue unresolved pricing. |
| [ ] V10 | Click **LOAD CHECKPOINT FIXTURE**. Inspect front, rear, roof and both sides. | Exactly seven products: Predator, Rally, Butt Kickers, Scout, Power Boards, Nice Tub Rack, rear bumper. All seven accessory meshes on; both factory replacements off; total **A$10,239 KNOWN PARTS**. It remains a fixture, not fitted commercial pricing. |
| [ ] V11 | From V10 remove Predator. | Predator, Rally and Butt Kickers all disappear and are removed from checkpoint selection; Scout/Power Boards/tub rack/rear stay. Four remaining products total A$6,409; factory front returns. This differs deliberately from D09 catalogue any-of semantics. |
| [ ] V12 | Remove rear bumper from V11. | Factory rear returns; remaining three independent products total A$4,469. |
| [ ] V13 | Load full checkpoint again; save as a new checkpoint project; reload the browser. | Full seven-product render/selection and A$10,239 restore with the saved checkpoint revision/checksum. Review/quote button stays disabled despite being saved. |

## Desktop checklist — Y62 catalogue, conflicts and blocked fitment

| Done / ID | Exact action | Expected observation |
|---|---|---|
| [ ] Y01 | Set **Authoritative catalogue → Y62 — catalogue only, no 3D base → RESET BUILD**. | Badge says `Y62 · CATALOGUE ONLY · NO 3D BASE`; 26 Y62 product buttons are present in the choices area. All Ranger scene meshes are hidden. No Y62 production model, reference image or substitute appears. A 10/10 runtime load message only describes loaded Ranger files. |
| [ ] Y02 | Scroll the whole Y62 list; add/remove **Scout Roof Rack**. | Y62-scoped selection and current source conditions appear; no Ranger identities added. This is flat-list navigation; Y62-specific category grouping is NOT IMPLEMENTED. |
| [ ] Y03 | Reset; add **Extreme X-1 Bullbar**, then attempt **Toro Bull Bar — Nissan Patrol Y62 Series 5**. | Conflict is explained; Toro is rejected without silently removing X-1 or partially adding its prerequisites. Remove X-1 explicitly, retry Toro, and confirm its actual requirements/review conditions remain. |
| [ ] Y04 | Inspect the Y62 **Power Boards · blocked** button and attempt ordinary pointer/keyboard activation. | Disabled; no selection or mesh. Supplier Warrior exclusion is not bypassed by any preview approval. Full explanatory UX for a disabled item should be judged, not presumed. |
| [ ] Y05 | Save a Y62 draft and reload its revision. Inspect the returned snapshot and share DTO. | Y62 vehicle identity retained; productionApproved false, base unavailable, all mesh visibility false. No fallback is created by saving/sharing. |
| [ ] Y06 | Return to Ranger catalogue, then test a checkpoint in its separate phase. | Correct Ranger preview returns; Y62 state does not contaminate Ranger selections or confer visual approval. |

## Real iOS Safari checklist — separate device acceptance

Use a **physical iPhone in Safari**, not device emulation, Playwright WebKit, a desktop responsive viewport or an in-app browser. Record device/iOS/Safari version and whether normal/private browsing is used. Normal Safari is the baseline. Use a reachable isolated HTTPS preview; the current loopback launcher blocks starting this remote phase until deployment is configured.

Every D/V/Y scenario above still applies using taps/native selects. Record its own iOS result; a desktop PASS is not an iOS PASS. The following explicitly tests the interactions that differ.

| Done / ID | Real-device action | Expected result / evidence |
|---|---|---|
| [ ] I01 | Open the exact HTTPS origin directly in normal Safari; authenticate at the preview access gate if configured. | Trusted TLS, correct app identity, no install prompt or desktop loopback URL. Record cold-load time and `10/10` asset status. |
| [ ] I02 | Use the native Build mode and Vehicle pickers; run D02, Y01/Y06 and V01. | Native picker dismissal commits the intended mode/vehicle; checkpoint disables vehicle choice; labels and selected state match. |
| [ ] I03 | Swipe **outside** the model to scroll categories and saved-project panel; tap all category/vendor accordions (D03) and product controls. | Page scroll works outside canvas, controls do not overlap or become unreachable, no accidental product additions. Record narrow-screen text/readability defects. |
| [ ] I04 | In stock Ranger checkpoint, drag one finger horizontally and vertically **inside** the canvas, lift and resume. | Model orbits, no stuck gesture after finger release, page does not scroll instead of orbit. Observe full vehicle at front/side/rear. |
| [ ] I05 | Pinch in/out with two fingers on the canvas, repeatedly near limits; then scroll outside it. | Camera zoom changes within bounds and stays responsive; no unintended whole-page zoom during model pinch or trapping of outside-page scroll. No two-finger pan is expected. |
| [ ] I06 | Tap FRONT, 3/4 VIEW and RESET VIEW after arbitrary orbit/zoom. Rotate phone portrait → landscape → portrait. | Correct camera restoration and resized canvas; no blank/cropped renderer, unusable toolbar or lost selection. |
| [ ] I07 | Run V03–V06 by touch, inspecting front and rear with orbit. | All four factory/replacement combinations and checkpoint Rally/Butt Kicker chain correct; no duplicate geometry or residual layers. |
| [ ] I08 | Run V07–V10: independent Scout, Power Boards, Nice Tub Rack, then full seven. | Each mesh visible in its intended zone; full fixture reads A$10,239 without unintended catalogue price substitution. Capture portrait and landscape evidence. |
| [ ] I09 | Run V11–V13, including saved checkpoint reload. | Correct cascades/factory restoration; same saved selection and fixture total return; quote remains disabled. |
| [ ] I10 | Return to catalogue and run D05–D14 by touch. Tap explicit alternative choices and repeat the requested light addition. | Choice/prerequisite explanations remain readable; richer camera rule applies; missing Power Boards and unresolved/conditional pricing stay governed. No touch shortcut bypasses rejected selection. |
| [ ] I11 | Run D15–D19 with native saved-project/revision pickers and Safari confirmation dialogs. | Save receipts, revision history, dirty guard and cancel/accept load behaviour work. If Safari does not show a before-unload warning, record it; do not assume that optional browser behaviour protects data. |
| [ ] I12 | Reload Safari, background it for at least 60 seconds, reopen the tab, then close/reopen the URL in the same normal Safari profile. | Stored server revision and guest cookie/pointer restore; no blank WebGL scene, silent project reassignment or accidental extra revision. Unsaved changes are not represented as saved. |
| [ ] I13 | Run D20–D23; enter synthetic name/email/phone/notes using the software keyboard, dismiss it and tap review. | Inputs/submit remain reachable. Draft quote receipt pins the correct revision. Postcode omission remains a known failure of capture, not a PASS. |
| [ ] I14 | Open same-origin `/api/quotes/<id>` and the saved revision URL in another Safari tab, or inspect with Safari remote Web Inspector. | Verify actual project/revision/checksum lineage as D21–D22. Do not infer lineage solely from a screenshot of the UI. Keep identifiers/evidence private. |
| [ ] I15 | Run D24 share test in a separate isolated browser session, and Y01–Y06 on-device. | Share remains a limited JSON DTO; Y62 list/conflicts/blocked item work; no Y62/Ranger fallback is rendered for Y62. |
| [ ] I16 | Open a separate private Safari session and attempt a private project/revision URL from the normal session. | Denial as a different guest; no claim of cross-session/cross-device recovery. Do not clear the baseline normal-session cookies until its restoration tests finish. |
| [ ] I17 | Keep full checkpoint open for at least five minutes, alternating orbit/pinch, page scroll and background/resume. | Record responsiveness, thermal/memory symptoms, reloads, WebGL context loss or crashes. Any inability to complete the journey is a FAIL; no unmeasured performance guarantee is implied. |

## Completion rules

Deployment smoke must pass before remote testers are invited. Manual results must identify exact URL/SHA/device and distinguish expected review/blocked states from defects. Current implementation gaps must remain **NOT IMPLEMENTED** or known limitations; do not manufacture controls or call an automated assertion a hands-on pass. A failure that loses saved work, corrupts quote lineage, exposes private evidence, grants privilege or falsely promotes visuals stops that preview session pending investigation.

Passing this plan accepts only the named preview scope. It does not approve production pricing, certify fitment, deliver a commercial quote, authorize new features or promote Ranger/Y62 visuals. Stage 9 itself records readiness and the plan; deployment changes and actual-device execution require a subsequent authorized step.
