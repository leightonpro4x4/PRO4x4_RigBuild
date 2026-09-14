# visual-runtime

Stage 5 extracts Alpha 93's renderer to ranger.mjs. Camera, orbit/zoom constraints, lights, assembly, transforms and ten GLB filenames remain unchanged. Only selection application is replaced: each scene object's visibility comes directly from the eligibility adapter's state. No dependencies or localStorage are interpreted by the renderer.

session.mjs owns selection through the shared domain engine and recomputes eligibility on every change or restore. Catalogue mode uses authoritative WF2 data. Explicit checkpoint mode uses the isolated Alpha93 regression fixture; prices and dependencies never flow back into the catalogue.

The original HTML and inline runtime are preserved byte-for-byte at evidence/archive/alpha93/runtime/index.html.source and in the frozen Alpha93 ZIP. The Stage 1 preservation test now verifies the archived HTML instead of requiring the active integrated entrypoint to remain unchanged. All GLB checks remain unchanged.

The desktop smoke gate is mandatory before the Stage 5 commit. iOS acceptance requires a real device and is not implied by a desktop test.
