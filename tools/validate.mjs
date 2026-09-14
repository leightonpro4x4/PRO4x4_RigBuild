import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {resultURL} from '../acceptance/support/results.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));process.chdir(root);
const config=JSON.parse(fs.readFileSync('validation.config.json'));
if(process.versions.node!==config.node)throw Error(`Node ${config.node} required; found ${process.versions.node}`);
const args=process.argv.slice(2),groups=args.length?(args[0]==='core'?Object.keys(config.groups).filter(g=>!['browser','python'].includes(g)):args):Object.keys(config.groups);
const summary=[];
for(const group of groups){
  if(!config.groups[group])throw Error('Unknown validation group '+group);
  for(const script of config.groups[group]){
    const python=group==='python',exe=python?path.join(root,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python'):process.execPath;
    if(!fs.existsSync(exe))throw Error('Declared isolated Python environment missing: '+exe);
    console.log(`\n[${group}] ${script}`);
    const run=spawnSync(exe,python?[script]:['--experimental-vm-modules',script],{cwd:root,encoding:'utf8',env:{...process.env,ALPHA94_VALIDATION_STAGE:'8'},maxBuffer:20*1024*1024});
    const log=(run.stdout||'')+(run.stderr||'');process.stdout.write(log);fs.writeFileSync(resultURL(group+'-'+path.basename(script)+'.log'),log);
    const status=run.error?(run.error.code==='EPERM'?'BLOCKED_ENVIRONMENT':'EXECUTION_ERROR'):run.status===78?'BLOCKED_ENVIRONMENT':run.status===0?'PASS':'FAIL';
    summary.push({group,script,status,exitCode:run.status,error:run.error?.message||null});fs.writeFileSync(resultURL('run-'+groups.join('-')+'.json'),JSON.stringify(summary,null,2)+'\n');
    if(status!=='PASS'){console.error(status+': '+script);process.exit(1);}
  }
}
console.log(JSON.stringify({status:'PASS',groups,executed:summary.length}));
