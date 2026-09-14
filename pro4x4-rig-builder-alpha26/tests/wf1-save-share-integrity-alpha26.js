const assert=require('assert'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');

// Saved revisions must become visibly stale as soon as the on-screen build changes.
assert.match(app,/dirty:false/);
assert.match(app,/function markBuildChanged\(\)\{state\.quoteQueued=false;state\.dirty=true;syncProjectChip\(\)\}/);
assert.match(app,/function applySnap\(s\).*markBuildChanged\(\)/);
assert.match(app,/state\.selected\.clear\(\);markBuildChanged\(\)/);
assert.match(app,/addEventListener\('input',markBuildChanged\)/);

// A dirty screen may not share the previously saved immutable revision by mistake.
assert.match(app,/if\(state\.dirty\).*Save your latest changes before sharing/);
assert.match(app,/SAVE CHANGES TO SHARE/);
assert.match(app,/share\.disabled=true/);

// Saving an immutable revision clears dirty state; clean state is visibly locked.
assert.match(app,/state\.dirty=false;localStorage\.setItem/);
assert.match(app,/save\.textContent='SAVED ✓'/);
assert.match(app,/save\.disabled=true/);
assert.match(app,/No duplicate revision was created/);

// UX checkpoint labels are no longer stale Alpha 24 labels.
assert.match(html,/Merged Alpha 26/);
assert.match(html,/MERGED ALPHA 26/);
assert.match(css,/merge-project-chip\.dirty/);

console.log('WF1 Alpha 26 save/share integrity: PASS');
