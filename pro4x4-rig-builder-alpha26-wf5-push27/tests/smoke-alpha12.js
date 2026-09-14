const fs=require('fs'),vm=require('vm'),{webcrypto}=require('crypto');
class Storage{constructor(){this.m=new Map()}get length(){return this.m.size}key(i){return [...this.m.keys()][i]??null}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(String(k),String(v))}removeItem(k){this.m.delete(k)}clear(){this.m.clear()}}
const localStorage=new Storage();
const sandbox={console,Date,Math,JSON,URL,URLSearchParams,TextEncoder,Uint8Array,crypto:webcrypto,localStorage,location:{origin:'https://local.test',href:'https://local.test/index.html',search:''},btoa:s=>Buffer.from(s,'binary').toString('base64'),setTimeout,clearTimeout};sandbox.window=sandbox;sandbox.window.localStorage=localStorage;sandbox.fetch=async()=>{throw new Error('network disabled')};
vm.createContext(sandbox);
for(const f of ['quote-contract.js','persistence.js','auth.js','audit-store.js','sales-store.js','data-y62.js','catalogue-store.js','project-store.js','mock-api.js','backend-client.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
(async()=>{
  const {PRO4X4_AUTH:auth,PRO4X4_SALES_STORE:sales,PRO4X4_PROJECT_STORE:projects,PRO4X4_PERSISTENCE:P,PRO4X4_AUDIT_STORE:audit}=sandbox;
  auth.setLocalRole('admin','Test Admin');
  const base=sandbox.RIG_DATA;const selected=base.accessories.filter(a=>a.selected).map(a=>JSON.parse(JSON.stringify(a)));
  const build={schemaVersion:'0.12.0',reference:'P4X4-TEST-001',createdAt:new Date().toISOString(),channel:'test',lead:{name:'Test Customer',phone:'0400000000',email:'',postcode:'5000',preferredContact:'phone',notes:''},vehicle:{id:base.vehicle.id,yearRange:base.vehicle.yearRange,make:base.vehicle.make,model:base.vehicle.model,trim:base.vehicle.trim,paint:'Black Obsidian',wheelTyre:'factory-warrior',view:'front34'},selections:selected,pricing:{currency:'AUD',knownSubtotal:0,components:{parts:0,labour:0,paint:0,freight:0,engineering:0},unpricedComponentCounts:{parts:0,labour:0,paint:0,freight:0,engineering:0},isComplete:false},weight:{baseline:base.vehicle.weights,knownAccessoryMassKg:72.3,unknownAccessoryMassCount:4},gates:[],render:{view:'front34',manifestVersion:'test',productionReady:false,activeLayers:[]},workflow:{status:'pricing-incomplete',owner:null,staffNotes:'',lastUpdatedAt:new Date().toISOString()},catalogue:{schemaVersion:'0.12.0',revision:'BASE-Y62-001',publishedAt:null},project:{},contract:{version:'0.12.0',createEndpoint:'POST /api/v1/builds'}};
  sales.upsert(build,{action:'quote.submitted'});
  if(sales.list().length!==1)throw new Error('sales store failed');
  const saved=projects.saveRevision(build,{title:'Test Y62',source:'test'});if(saved.project.version!==1)throw new Error('project version failed');
  let conflict=false;try{projects.saveRevision(build,{projectId:saved.project.id,expectedVersion:0,source:'stale'})}catch(e){conflict=e.code==='VERSION_CONFLICT'}if(!conflict)throw new Error('version conflict failed');
  const share=await projects.createShare(saved.project.id,'customer-view',saved.revision.id,30);const p=projects.getProject(saved.project.id);if(!p.shares[0].tokenHash||p.shares[0].token)throw new Error('hashed share storage failed');const resolved=await projects.resolveShare(share.token);if(!resolved)throw new Error('share resolve failed');
  const http=P.httpMock();
  const quotes=await http.listQuotes();if(quotes.length!==1)throw new Error('http list quotes failed');
  const cat=await http.getCatalogue(base.vehicle.id);if(cat.accessories.length!==11)throw new Error('http catalogue failed');
  let validation=false;try{await http.createBuild({})}catch(e){validation=e.status===422&&e.detail?.fieldErrors?.length>0}if(!validation)throw new Error('validation envelope failed');
  const auditRows=await http.listAudit({limit:100});if(auditRows.length<3)throw new Error('audit route failed');
  const seed=JSON.parse(fs.readFileSync('seed/bootstrap.seed.json','utf8'));const report=await http.importSeed(seed);if(report.catalogues!==1)throw new Error('seed import failed');
  fs.writeFileSync('/mnt/data/alpha12-test-project.json',JSON.stringify(projects.getProject(saved.project.id),null,2));
  fs.writeFileSync('/mnt/data/alpha12-test-build.json',JSON.stringify({...saved.snapshot,schemaVersion:'0.12.0',contract:{...(saved.snapshot.contract||{}),version:'0.12.0'}},null,2));
  console.log(JSON.stringify({quotes:quotes.length,catalogueAccessories:cat.accessories.length,auditEvents:auditRows.length,seedReport:report,projectId:saved.project.id,shareStoredAsHash:true},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
