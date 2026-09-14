# domain

Stage 4 provides a pure ES-module engine shared by future client and server layers. The existing Alpha 93 app is not wired to it. No renderer, database, quote API or production promotion is introduced.

## Interface

`createEngine(authoritativeCatalogue).evaluate({vehicleId, selected, context})` returns canonical structured decisions. selected contains vehicle-scoped identities. Each product includes requirements, commercial draft selectability, fitment state, parts price (null stays null), visual unavailability and customer-readable reasons. Top-level outcome precedence is blocked, choice, prerequisite, staff review, other review, ready. valid means no open domain reasons, not visual or production release approval.

`transition({vehicleId, selected, action: {type: 'add'|'remove', identity}, context})` returns applied, final selected identities, automatic additions, cascading removals and the evaluated proposed decision. Rejected additions leave the original selection intact; decision then explains the rejected proposal. Every known hard prerequisite is added recursively; alternatives are never guessed. Exclusive groups and explicit conflicts require removal first. Removing hard prerequisites cascades transitively; stranded any-of dependants stay selected with a new choice gate, matching WF1.

`client.mjs` exports the same engine. `server.mjs` supplies a validator that recomputes from authoritative catalogue identities and separately supplied trusted context. Submitted prices, decisions, product definitions and approval/context flags are ignored. This is a validation library, not a persistence or quote service. Production callers must obtain trusted context themselves; this stage does not add authentication.

## Semantic authority

WF1 c33f2c61b1b5111c321c40739cd4ebffef32a584: product-visual-contract.js selectionGate, merged-project-contract.js gatesFor, and merged-app.js removal/alternative explanations. Stage 4 makes hard cascades transitive and uses conservative explicit conflict resolution rather than silent replacement. Original source remains in the frozen archive.

WF2 ebccc17ee9caf1b81834bf50a50319c7fcc21dbc: Stage 3 catalogue.json supplies all product facts. requires, requiredParts and routeRequiredParts form allOf. anyOfRequiredParts and requiresAnyOf form explicit alternative groups. A selected parent activates its routeDependencies.requiredParts; an explicit context.routes[identity] activates matching mountingRoutes.requiredParts. Candidate, compatible and additional parts never become inferred requirements.

All richer fitment fields, including conditional requirements and uncertain route facts, are returned as source evidence requiring review. Text conditions remain unverified; the engine never guesses how to satisfy them. Exact source-declared exclusion lists can block a known trim/configuration. For the rear bumper's two exact towbar conditions, trusted factoryTowbar=false or towbarManufacturer='Hayman Reese' blocks fitment; absence of those facts cannot imply compatibility. Providing compatible context does not clear staff review or other source conditions.

Engineering products can be draft-selectable while review remains open. Unknown external dependencies stay visible as review gaps without fabricated products. Parts price completeness does not imply labour/quote completeness. Visual eligibility is conservatively unavailable (blocked when fitment is blocked) because no governed renderer/production base is integrated. Y62 is not promoted.

fixture.mjs is an explicit regression-only adapter using a separate alpha93-regression-only vehicle namespace. It must never be passed to the authoritative production validator. It preserves the simpler seven-product graph solely for tests; it cannot override WF2 camera, route, price or fitment rules.

Run node acceptance/tests/domain.mjs (29 tests) plus the prior stage gates. Stage 5 remains deferred.
