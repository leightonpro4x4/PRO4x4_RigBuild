// One-time, reproducible reconciliation from frozen source archives and a WF4 clean-sync export.
// The export is source-policy replay, never a new reviewer approval.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {sourceArchive,sha} from './source-archive.mjs';
const root=new URL('../',import.meta.url),write=(p,b)=>{fs.mkdirSync(new URL(path.dirname(p)+'/',root),{recursive:true});fs.writeFileSync(new URL(p,root),b);};
const json=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
const a3=sourceArchive('wf3'),a4=sourceArchive('wf4'),a5=sourceArchive('wf5');
const raw=JSON.parse(fs.readFileSync(process.argv[2]));
const references=raw.filter(r=>r.assetClass==='reference'),masters=raw.filter(r=>r.assetId.endsWith('-V1-MASTER'));
if(references.length!==9||masters.length!==3)throw Error('WF4 baseline count mismatch');
const packContext={module:{exports:{}}};vm.runInNewContext(a3.get('wf3_run56/y62-reference-pack.js').toString(),packContext,{timeout:1000});
const vehicle=packContext.module.exports.vehicleIdentity;
const variant=[vehicle.series,vehicle.trim,vehicle.paint].join('; ');
const context={module:{exports:{}}};vm.runInNewContext(a3.get('wf3_run56/y62-canonical-candidates.js').toString(),context,{timeout:1000});
const history=JSON.parse(JSON.stringify(context.module.exports.listHistory()));
const sourceFiles=[];
for(const [branch,map] of [['wf3',a3],['wf4',a4],['wf5',a5]])for(const [p,b] of map){
  if(branch==='wf3'||/canonical-|reference-|visual-governance|promotion-path|acceptance-gate|PUSH_57/.test(p))sourceFiles.push({branch,path:p,sha256:sha(b),bytes:b.length});
}
const r34Path='wf3_run56/assets/y62-canonical-candidates/Y62-R34-V1-candidate-05-second-targeted-alpha-cleanup-v01.json';
const r34=JSON.parse(a3.get(r34Path));
for(const key of ['source','candidate','mask','preview','board'])if(sha(a3.get('wf3_run56/'+r34[key].file))!==r34[key].sha256)throw Error('R34 evidence checksum '+key);
for(const r of references)if(sha(a3.get('wf3_run56/'+r.source))!==r.file.checksumSha256)throw Error('Owner reference mismatch');
const candidates=history.map(c=>{
  if(sha(a3.get('wf3_run56/'+c.source))!==c.file.checksumSha256)throw Error('Candidate checksum '+c.candidateId);
  const master=masters.find(m=>m.viewId===c.viewId);
  return {id:[c.vehicleId,variant,c.viewId,c.candidateId].map(encodeURIComponent).join('::'),vehicleId:c.vehicleId,variant,viewId:c.viewId,candidateId:c.candidateId,masterId:master.assetId,
    referenceIds:c.provenance.referenceIds,sha256:c.file.checksumSha256,source:{branch:'wf3',path:'wf3_run56/'+c.source},state:'master-draft',productionEligible:false,cameraMatched:false,
    binaryRights:null,reconstruction:'unaccepted',reviewer:null,claim:null,decision:null,seal:null,sourceCandidate:c,
    evidence:c.candidateId===r34.candidateId?{manifest:r34,manifestSource:r34Path,manifestSha256:sha(a3.get(r34Path)),reconstruction:'fail',cameraMatched:false,productionEligible:false}:null,
    blockers:c.candidateId===r34.candidateId?['exact-checksum-edge-review-required','clean-neutral-reconstruction-fail','camera-not-matched','production-binary-rights-hold','F34-first','master-WF5-hold']:
      c.candidateId==='Y62-F34-V1-CANDIDATE-02'?master.candidateHandoff.intake.blockers:['historical-candidate-not-approved']};
});
// Retain WF4 raw decisions separately. Do not replace R34's awaiting handoff with a newer file.
const snapshot={schemaVersion:'alpha94-governance-v1',authority:'frozen-WF4-policy-replay-plus-WF3-evidence',variant,
  referenceRecords:references,masterRecords:masters,candidates,sourceFiles,
  reconciliation:{f34RegistryCandidate:'Y62-F34-V1-CANDIDATE-02',f34State:'blocked-upstream',sideState:'awaiting-wf3-candidate',sideCamera:'calibration',sideSourceGap:'open/current',r34RegistryState:'awaiting-wf3-candidate',r34EvidenceCandidate:r34.candidateId,r34EvidenceState:'master-draft',f34Candidate05BinaryPresent:false,claims:[],decisions:[],seals:[],production:[]}};
json('subsystems/governance/baseline.json',snapshot);
json('subsystems/y62-evidence/r34-candidate05.json',r34);
// Exact WF4 reference validators, including their recursive local dependencies.
const copied=new Set();function copy(name){if(copied.has(name))return;copied.add(name);const b=a4.get('pro4x4-rig-builder-alpha26/'+name);if(!b)throw Error(name);write('subsystems/governance/vendor/'+name,b);for(const [,dep] of b.toString().matchAll(/(?:require|req)\(['"]\.\/([^'"]+)['"]\)/g))copy(dep);}
copy('canonical-review-gate.js');copy('canonical-review-workflow.js');copy('canonical-production-seal.js');
json('subsystems/governance/vendor/package.json',{type:'commonjs'});
json('subsystems/governance/vendor-hashes.json',[...copied].sort().map(p=>({path:p,sha256:sha(a4.get('pro4x4-rig-builder-alpha26/'+p))})));
console.log(JSON.stringify({references:references.length,masters:masters.length,candidates:candidates.length,production:0,vendorModules:copied.size}));
