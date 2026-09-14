import fs from 'node:fs';
import path from 'node:path';
import {sourceArchive} from '../../tools/source-archive.mjs';
import {GovernanceRegistry,hash} from './registry.mjs';
import {publicProjection} from './projection.mjs';
import {governancePolicy} from '../visual-eligibility/governance-policy.mjs';
export function bootstrapGovernance(root,directory=path.join(root,'.runtime')){
  const read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),baseline=read('subsystems/governance/baseline.json');
  const archives={wf3:sourceArchive('wf3'),wf4:sourceArchive('wf4')};
  const registry=new GovernanceRegistry({baseline,filename:path.join(directory,'alpha94.sqlite'),readBinary:s=>archives[s.branch]?.get(s.path)});
  // Default grants are empty. Customer/finaliser roles cannot authorize visual promotion.
  const policy=publicProjection(registry,baseline,read('consolidation/manifest.json').activeApplication.requiredAssets);
  if(hash(policy)!==hash(governancePolicy)){registry.close();throw Error('Governance projection requires explicit reconciliation');}
  return registry;
}
