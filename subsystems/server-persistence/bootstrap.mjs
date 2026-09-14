import {bootstrapGovernance} from '../governance/bootstrap.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ProjectStore,hash} from './store.mjs';
import {createAPI} from './api.mjs';
import crypto from 'node:crypto';
const root=fileURLToPath(new URL('../../',import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
export function bootstrap(origin){
  const directory=path.join(root,'.runtime');fs.mkdirSync(directory,{recursive:true});
  const governance=bootstrapGovernance(root);
  const report=json('evidence/archive/alpha93/reports/PUSH_93_REPORT.json');
  for(const asset of report.deploymentAssets){const bytes=fs.readFileSync(path.join(root,'public',asset.file));if(bytes.length!==asset.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw new Error('Authoritative asset mismatch: '+asset.file);}
  const store=new ProjectStore({filename:path.join(directory,'alpha94.sqlite'),catalogue:json('subsystems/catalogue/catalogue.json'),fixture:json('subsystems/catalogue/alpha93-fixture.json'),mapping:json('subsystems/catalogue/alpha93-mapping.json'),assetHashes:Object.fromEntries(report.deploymentAssets.map(a=>[a.file,a.sha256])),implementationVersion:hash(['subsystems/visual-eligibility/governance-policy.mjs','subsystems/domain/engine.mjs','subsystems/visual-eligibility/adapter.mjs','subsystems/visual-runtime/ranger.mjs','subsystems/catalogue/alpha93-mapping.json','subsystems/catalogue/alpha93-fixture.json','subsystems/server-persistence/store.mjs'].map(read))});
  return {store,governance,api:createAPI(store,{origin,finaliserToken:process.env.PRO4X4_FINALISER_TOKEN,finaliserId:process.env.PRO4X4_FINALISER_ID})};
}
