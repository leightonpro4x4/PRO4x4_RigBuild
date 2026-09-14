import fs from 'node:fs';
import {sourceArchive} from './source-archive.mjs';
import {GovernanceRegistry} from '../subsystems/governance/registry.mjs';
import {publicProjection} from '../subsystems/governance/projection.mjs';
const root=new URL('../',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,root))),baseline=read('subsystems/governance/baseline.json'),archives={wf3:sourceArchive('wf3'),wf4:sourceArchive('wf4')};
const registry=new GovernanceRegistry({baseline,readBinary:s=>archives[s.branch]?.get(s.path)});
const policy=publicProjection(registry,baseline,read('consolidation/manifest.json').activeApplication.requiredAssets);
registry.close();
fs.writeFileSync(new URL('subsystems/visual-eligibility/governance-policy.mjs',root),'// Generated from governed source evidence; no reviewer or registry data is public.\nconst freeze=x=>{if(x&&typeof x===\'object\'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};\nexport const governancePolicy=freeze('+JSON.stringify(policy,null,2)+');\n');
