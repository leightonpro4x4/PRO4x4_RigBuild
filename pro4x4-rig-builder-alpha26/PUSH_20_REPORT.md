# PRO4X4 Rig Builder — Push 20 / Alpha 21

## Advanced
- Added Y62 production layer-set contracts with explicit order, core layers, optional selection layers, preload policy and zero-substitution failure policy.
- Locked the front 3/4 contract to `Y62-F34-V1` and 1672 × 615.
- Added customer-facing production diagnostics: contract ID, camera profile, preload/base readiness and explicit unresolved-layer list.
- Added server resolver diagnostics including base state, unresolved reasons and available preload order.
- Added a staff Production Stack Preview that resolves through the same server-authoritative endpoint used by the customer configurator.
- Preserved exact-SKU matching and the no-fallback rule.

## Verified
- Contract and manifest layer IDs agree.
- Front 3/4 core contract requires base + wheels.
- Failure policy explicitly forbids substitution.
- Existing Alpha 20 resolver tests remain in the regression suite.
- New Alpha 21 contract test passes.

## Next dependency
First genuine rights-cleared 1672 × 615 `Y62-F34-V1` transparent Black Obsidian Warrior base. If unavailable, next work is asset load telemetry/retry diagnostics and contract-aware paint/wheel state variants.
