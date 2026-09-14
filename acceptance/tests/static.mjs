import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {parse} from 'yaml';
import {resultURL} from '../support/results.mjs';
const root=new URL('../../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),config=JSON.parse(read('validation.config.json'));
const files=[];function walk(p){for(const e of fs.readdirSync(new URL(p+'/',root),{withFileTypes:true})){const f=p+'/'+e.name;if(e.isDirectory()&&!e.name.startsWith('__'))walk(f);else if(e.isFile())files.push(f);}}
for(const p of ['acceptance','tools','subsystems','public'])walk(p);
let scripts=0,json=0,imports=0;
for(const p of files){
  if(p.endsWith('.json')){JSON.parse(read(p));json++;}
  if(p.endsWith('.mjs')){const m=new vm.SourceTextModule(read(p),{identifier:p});scripts++;for(const spec of m.dependencySpecifiers){if(spec.startsWith('.'))assert(fs.existsSync(new URL(spec,new URL(p,root))),`${p}: ${spec}`);else if(spec==='three'||spec.startsWith('three/'))assert(read('public/index.html').includes('three@0.180.0')) ;else if(!spec.startsWith('node:'))createRequire(new URL(p,root)).resolve(spec);imports++;}}
  else if(p.endsWith('.js')){new vm.Script(read(p),{filename:p});scripts++;}
}
const html=read('public/index.html');let htmlReferences=0;
for(const [,v] of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)){if(/^(?:https?:|data:|#)/.test(v))continue;const target=v.startsWith('/subsystems/')?v.slice(1):'public/'+v.replace(/^\//,'');assert(fs.existsSync(new URL(target,root)),target);htmlReferences++;}
for(const [,attrs,body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){if(attrs.includes('importmap'))JSON.parse(body);else if(attrs.includes('module'))new vm.SourceTextModule(body);else new vm.Script(body);}
assert.deepEqual(fs.readdirSync(new URL('public/',root)).filter(x=>x.endsWith('.html')),['index.html']);
const pkg=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json'));
assert.equal(lock.lockfileVersion,3);assert.deepEqual(lock.packages[''].devDependencies,pkg.devDependencies);assert.equal(pkg.engines.node,config.node);assert.equal(pkg.engines.npm,config.npm);assert.equal(pkg.packageManager,'npm@'+config.npm);
assert.equal(read('.node-version').trim(),config.node);assert.equal(read('.python-version').trim(),config.python);assert.equal(lock.packages['node_modules/playwright'].version,config.playwright);
assert(read('requirements-validation.lock').includes('--hash=sha256:'));
const workflows=fs.readdirSync(new URL('.github/workflows/',root));assert.deepEqual(workflows,['alpha94.yml']);const w=parse(read('.github/workflows/alpha94.yml'));
assert(w.on.pull_request===null||typeof w.on.pull_request==='object');assert(Object.hasOwn(w.on,'workflow_dispatch'));assert.deepEqual(w.on.push.branches,['alpha94-consolidation']);assert.equal(w.defaults.run['working-directory'],'.');
const steps=w.jobs.validate.steps;assert.equal(w.jobs.validate['runs-on'],config.ciRunner);assert(steps.some(s=>s.with?.['cache-dependency-path']==='package-lock.json'));
for(const [group,tests] of Object.entries(config.groups)){assert(steps.some(s=>s.run==='npm run test:'+group));for(const t of tests){assert(t.startsWith('acceptance/tests/')&&fs.existsSync(new URL(t,root)));assert(!/wf3_run56|pro4x4-rig-builder-alpha26/.test(t));}}
assert(!read('acceptance/support/browser.mjs').includes('msedge'));assert(!read('acceptance/support/browser.mjs').includes('codex-runtimes'));
const result={status:'PASS',scripts,json,imports,htmlDocuments:1,htmlReferences,workflowGroups:Object.keys(config.groups).length,lockfile:'committed root package-lock.json',staleRuntimeBindings:0};fs.writeFileSync(resultURL('static.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
