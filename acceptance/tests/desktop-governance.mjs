import assert from 'node:assert/strict';
import fs from 'node:fs';
process.env.ALPHA94_VALIDATION_STAGE='7';
process.env.ALPHA94_PREVIEW_URL||='http://127.0.0.1:8097';
const base=process.env.ALPHA94_PREVIEW_URL;
// Runs the complete current Ranger + projects desktop journeys; writes separate Stage7 evidence.
await import('./desktop-projects.mjs');
for(const p of ['subsystems/governance/baseline.json','subsystems/governance/registry.mjs','subsystems/y62-evidence/r34-candidate05.json','evidence/archive/snapshots/wf3.zip'])assert.equal((await fetch(base+'/'+p)).status,404,p);
const policy=await fetch(base+'/subsystems/visual-eligibility/governance-policy.mjs');assert.equal(policy.status,200);assert((await policy.text()).includes('"productionCount": 0'));
const result={status:'PASS',desktopVisual:'PASS',desktopProjects:'PASS',governanceRegistryIsolation:'PASS',Y62Production:0,iOS:'NOT TESTED'};
fs.writeFileSync(new URL('../../consolidation/STAGE_7_DESKTOP.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
