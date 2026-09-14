'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const cameraProfiles=require('../camera-profiles-y62.js');
const readinessPlan=require('../y62-readiness-plan.js');
const visualGovernance=require('../visual-governance.js');
const y62ReferencePack=require('../y62-reference-pack.js');
const y62CanonicalBriefs=require('../y62-canonical-briefs.js');

const SCHEMA_VERSION='0.12.0';
const DB_SCHEMA_VERSION=6;
const now=()=>new Date().toISOString();
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
const parse=(s,fallback=null)=>{try{return JSON.parse(s)}catch{return fallback}};
const stringify=v=>JSON.stringify(v);
const quoteStatuses=new Set(['new','needs-fitment-review','pricing-incomplete','ready-to-quote','quoted','won','lost']);
const components=['parts','labour','paint','freight','engineering'];

const assetVersionStates=new Set(['candidate','production','superseded','rejected']);
function assetVersionId(assetId,n){return `${assetId}-V${String(n).padStart(4,'0')}`}
function objectFromVersionRow(r){return r?{assetId:r.asset_id,versionId:r.version_id,versionNumber:r.version_number,state:r.state,checksumSha256:r.checksum_sha256,objectKey:r.object_key,mimeType:r.mime_type,width:r.width,height:r.height,hasAlpha:r.has_alpha==null?null:!!r.has_alpha,transparencyVerified:!!r.transparency_verified,sizeBytes:r.size_bytes,createdAt:r.created_at,createdBy:r.created_by,promotedAt:r.promoted_at,promotedBy:r.promoted_by,supersededAt:r.superseded_at,supersededBy:r.superseded_by,rejectedAt:r.rejected_at,rejectedBy:r.rejected_by,rejectionNote:r.rejection_note,payload:parse(r.payload_json,{})}:null}

function recomputeQuote(x){
  x=clone(x||{});x.schemaVersion=SCHEMA_VERSION;x.workflow=x.workflow||{status:'new',owner:null,staffNotes:'',lastUpdatedAt:now()};
  x.selections=(x.selections||[]).map(a=>({...a,pricing:{parts:null,labour:null,paint:null,freight:null,engineering:null,...(a.pricing||{})},pricingRequired:Array.isArray(a.pricingRequired)?a.pricingRequired:components}));
  x.fitmentReview=x.fitmentReview||{resolutions:[]};
  const old=new Map((x.fitmentReview.resolutions||[]).map(r=>[r.key,r]));
  x.fitmentReview.resolutions=(x.gates||[]).map((g,i)=>{const key=`${g.type||'gate'}:${g.id||i}:${i}`;return old.get(key)||{key,type:g.type,id:g.id,status:'unresolved',staffNote:'',sourceNote:g.note}});
  x.quoteFinalisation=x.quoteFinalisation||{status:'draft',quoteNumber:null,issuedAt:null,validUntil:null,customerTotal:null,labourRateUsed:null};
  const totals=Object.fromEntries(components.map(k=>[k,0])),missing=Object.fromEntries(components.map(k=>[k,0]));
  for(const a of x.selections){for(const k of components){const v=a.pricing?.[k],required=(a.pricingRequired||components).includes(k);if(v==null){if(required)missing[k]++}else totals[k]+=Number(v)||0}}
  x.pricing={...(x.pricing||{}),currency:'AUD',components:totals,unpricedComponentCounts:missing,knownSubtotal:components.reduce((n,k)=>n+totals[k],0),isComplete:components.every(k=>missing[k]===0)};
  const res=x.fitmentReview.resolutions;x.fitmentReview.allApproved=res.length===0||res.every(r=>r.status==='approved');x.fitmentReview.hasRejected=res.some(r=>r.status==='rejected');
  if(!['quoted','won','lost'].includes(x.workflow.status))x.workflow.status=!x.fitmentReview.allApproved?'needs-fitment-review':!x.pricing.isComplete?'pricing-incomplete':'ready-to-quote';
  x.workflow.lastUpdatedAt=x.workflow.lastUpdatedAt||now();return x;
}

function makeActor(headers={}){return {actorId:headers['x-pro4x4-actor']||'server-local',displayName:headers['x-pro4x4-name']||'PRO4X4 Local Server',role:headers['x-pro4x4-role']||'admin',prototype:true}}
function eventId(){return `AUD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`}
function telemetryId(){return `RTE-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`}
function checksum(v){return crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex').slice(0,16)}

class RigDatabase{
  constructor(file,{schemaPath=path.join(__dirname,'schema.sql'),migrationsPath=path.join(__dirname,'migrations')}={}){
    if(file!==':memory:')fs.mkdirSync(path.dirname(file),{recursive:true});
    this.file=file;this.db=new DatabaseSync(file);this.db.exec(fs.readFileSync(schemaPath,'utf8'));this.applyMigrations(migrationsPath);this.setMeta('schemaVersion',SCHEMA_VERSION);this.setMeta('dbSchemaVersion',DB_SCHEMA_VERSION);this.seedRenderAssets();this.backfillRenderStates();
  }
  applyMigrations(migrationsPath){
    let current=Number(this.db.prepare('SELECT MAX(version) version FROM schema_migrations').get()?.version||0);
    if(current===0){this.db.prepare('INSERT INTO schema_migrations(version,applied_at,description) VALUES(?,?,?)').run(1,now(),'Alpha 11 baseline schema');current=1}
    if(current>DB_SCHEMA_VERSION)throw new Error(`Database schema ${current} is newer than this runtime supports (${DB_SCHEMA_VERSION})`);
    const files=fs.existsSync(migrationsPath)?fs.readdirSync(migrationsPath).filter(f=>/^\d+_.*\.sql$/.test(f)).sort():[];
    for(const file of files){const version=Number(file.split('_',1)[0]);if(version<=current)continue;if(version>DB_SCHEMA_VERSION)continue;const sql=fs.readFileSync(path.join(migrationsPath,file),'utf8');this.db.exec('BEGIN IMMEDIATE');try{this.db.exec(sql);this.db.prepare('INSERT INTO schema_migrations(version,applied_at,description) VALUES(?,?,?)').run(version,now(),file);this.db.exec('COMMIT');current=version}catch(e){this.db.exec('ROLLBACK');throw e}}
    if(current!==DB_SCHEMA_VERSION)throw new Error(`Database schema migration incomplete: expected ${DB_SCHEMA_VERSION}, got ${current}`);
  }
  close(){this.db.close()}
  setMeta(key,value){this.db.prepare('INSERT INTO meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,String(value))}
  getMeta(key){return this.db.prepare('SELECT value FROM meta WHERE key=?').get(key)?.value??null}
  getDatabaseStatus(){return {schemaVersion:SCHEMA_VERSION,dbSchemaVersion:Number(this.getMeta('dbSchemaVersion')||DB_SCHEMA_VERSION),migrationVersion:Number(this.db.prepare('SELECT MAX(version) version FROM schema_migrations').get()?.version||0)}}
  createAuthSession(actor,{ttlMinutes=480,metadata={}}={}){const token=crypto.randomBytes(32).toString('base64url'),tokenHash=crypto.createHash('sha256').update(token).digest('hex'),createdAt=now(),expiresAt=new Date(Date.now()+Math.max(15,Number(ttlMinutes)||480)*60000).toISOString(),scopes=Array.isArray(actor?.scopes)?actor.scopes:[];this.db.prepare('INSERT INTO auth_sessions(token_hash,actor_id,display_name,role,scopes_json,created_at,expires_at,revoked_at,last_seen_at,metadata_json) VALUES(?,?,?,?,?,?,?,?,?,?)').run(tokenHash,actor.actorId,actor.displayName,actor.role,stringify(scopes),createdAt,expiresAt,null,createdAt,stringify(metadata||{}));const out={schemaVersion:SCHEMA_VERSION,token,tokenHash,actor:{...clone(actor),scopes},createdAt,expiresAt};this.audit('auth.session.created','auth-session',tokenHash.slice(0,12),{role:actor.role,expiresAt,source:metadata?.source||null},actor);return out}
  resolveAuthSession(token){if(!token)return null;const tokenHash=crypto.createHash('sha256').update(token).digest('hex'),r=this.db.prepare('SELECT * FROM auth_sessions WHERE token_hash=?').get(tokenHash);if(!r||r.revoked_at||Date.parse(r.expires_at)<=Date.now())return null;const lastSeenAt=now();this.db.prepare('UPDATE auth_sessions SET last_seen_at=? WHERE token_hash=?').run(lastSeenAt,tokenHash);return {schemaVersion:SCHEMA_VERSION,tokenHash,actor:{actorId:r.actor_id,displayName:r.display_name,role:r.role,scopes:parse(r.scopes_json,[]),prototype:false},createdAt:r.created_at,expiresAt:r.expires_at,lastSeenAt,metadata:parse(r.metadata_json,{})}}
  revokeAuthSession(token,{actor}={}){if(!token)return false;const tokenHash=crypto.createHash('sha256').update(token).digest('hex'),r=this.db.prepare('SELECT actor_id,role,revoked_at FROM auth_sessions WHERE token_hash=?').get(tokenHash);if(!r)return false;if(!r.revoked_at){const revokedAt=now();this.db.prepare('UPDATE auth_sessions SET revoked_at=? WHERE token_hash=?').run(revokedAt,tokenHash);this.audit('auth.session.revoked','auth-session',tokenHash.slice(0,12),{sessionActorId:r.actor_id,sessionRole:r.role},actor||{actorId:r.actor_id,displayName:r.actor_id,role:r.role})}return true}
  pruneAuthSessions(){const cutoff=now();const result=this.db.prepare('DELETE FROM auth_sessions WHERE expires_at<? OR revoked_at IS NOT NULL').run(cutoff);return Number(result.changes||0)}
  audit(action,entityType,entityId,metadata={},actor={actorId:'server-local',displayName:'PRO4X4 Local Server',role:'admin'},correlationId=null){const e={schemaVersion:SCHEMA_VERSION,id:eventId(),at:now(),action,entityType,entityId:String(entityId||''),actor,correlationId,metadata:clone(metadata)};this.db.prepare('INSERT INTO audit_events(id,at,action,entity_type,entity_id,actor_role,actor_id,correlation_id,payload_json) VALUES(?,?,?,?,?,?,?,?,?)').run(e.id,e.at,e.action,e.entityType,e.entityId,e.actor.role,e.actor.actorId,e.correlationId,stringify(e));return e}
  listAudit({entityType=null,entityId=null,action=null,limit=200}={}){let sql='SELECT payload_json FROM audit_events WHERE 1=1',args=[];if(entityType){sql+=' AND entity_type=?';args.push(entityType)}if(entityId){sql+=' AND entity_id=?';args.push(entityId)}if(action){sql+=' AND action=?';args.push(action)}sql+=' ORDER BY at DESC LIMIT ?';args.push(Math.max(1,Math.min(Number(limit)||200,1000)));return this.db.prepare(sql).all(...args).map(r=>parse(r.payload_json)).filter(Boolean)}
  upsertQuote(payload,{actor,action='quote.updated'}={}){const x=recomputeQuote(payload);if(!x.reference)throw Object.assign(new Error('Quote reference is required'),{code:'validation_error',fieldErrors:[{field:'reference',message:'Quote reference is required'}]});if(!x.vehicle?.id)throw Object.assign(new Error('Vehicle ID is required'),{code:'validation_error',fieldErrors:[{field:'vehicle.id',message:'Vehicle ID is required'}]});const t=now(),existing=this.db.prepare('SELECT created_at FROM quotes WHERE reference=?').get(x.reference);const created=existing?.created_at||x.createdAt||t;this.db.prepare('INSERT INTO quotes(reference,status,project_id,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(reference) DO UPDATE SET status=excluded.status,project_id=excluded.project_id,payload_json=excluded.payload_json,updated_at=excluded.updated_at').run(x.reference,x.workflow.status,x.project?.id||null,stringify(x),created,t);this.audit(existing?action:'quote.submitted','quote',x.reference,{status:x.workflow.status,projectId:x.project?.id||null},actor);return x}
  listQuotes(){return this.db.prepare('SELECT payload_json FROM quotes ORDER BY updated_at DESC').all().map(r=>parse(r.payload_json)).filter(Boolean)}
  getQuote(reference){const r=this.db.prepare('SELECT payload_json FROM quotes WHERE reference=?').get(reference);return r?parse(r.payload_json):null}
  updateQuote(reference,patch,{actor}={}){const current=this.getQuote(reference);if(!current)return null;const next=patch?.reference&&patch.reference===reference?patch:{...current,...clone(patch||{}),reference};return this.upsertQuote(next,{actor,action:'quote.review.saved'})}
  getSettings(){const r=this.db.prepare('SELECT payload_json FROM staff_settings WHERE id=?').get('quote');return r?parse(r.payload_json):{labourRate:null,quoteValidityDays:14}}
  setSettings(payload,{actor}={}){const out={labourRate:payload?.labourRate==null?null:Number(payload.labourRate),quoteValidityDays:Math.max(1,Math.round(Number(payload?.quoteValidityDays)||14)),schemaVersion:SCHEMA_VERSION};const t=now();this.db.prepare('INSERT INTO staff_settings(id,payload_json,updated_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json,updated_at=excluded.updated_at').run('quote',stringify(out),t);this.audit('staff.settings.updated','staff-settings','quote',{quoteValidityDays:out.quoteValidityDays,labourRateConfigured:out.labourRate!=null},actor);return out}
  finaliseQuote(reference,{actor}={}){let x=this.getQuote(reference);if(!x)return null;x=recomputeQuote(x);if(!x.fitmentReview.allApproved||!x.pricing.isComplete){const e=new Error('Formal quote blocked by unresolved fitment or pricing requirements');e.code='quote_gate_blocked';e.fieldErrors=[];if(!x.fitmentReview.allApproved)e.fieldErrors.push({field:'fitmentReview',message:'Every fitment gate must be approved'});if(!x.pricing.isComplete)e.fieldErrors.push({field:'pricing',message:'Every required price component must be resolved'});throw e}const settings=this.getSettings(),issued=new Date(),valid=new Date(issued.getTime()+settings.quoteValidityDays*86400000);x.quoteFinalisation={status:'finalised',quoteNumber:x.quoteFinalisation?.quoteNumber||`Q-${reference.replace(/^P4X4-/,'')}`,issuedAt:issued.toISOString(),validUntil:valid.toISOString(),customerTotal:x.pricing.knownSubtotal,labourRateUsed:settings.labourRate};x.workflow.status='quoted';x.workflow.lastUpdatedAt=issued.toISOString();return this.upsertQuote(x,{actor,action:'quote.finalised'})}
  getCatalogue(vehicleId){const r=this.db.prepare('SELECT payload_json FROM catalogue_revisions WHERE vehicle_id=? ORDER BY id DESC LIMIT 1').get(vehicleId);return r?parse(r.payload_json):null}
  publishCatalogue(vehicleId,snapshot,{actor}={}){const x=clone(snapshot||{});x.schemaVersion=SCHEMA_VERSION;x.vehicleId=x.vehicleId||vehicleId;if(x.vehicleId!==vehicleId)throw Object.assign(new Error('Vehicle ID mismatch'),{code:'validation_error'});if(!Array.isArray(x.accessories)||!x.accessories.length)throw Object.assign(new Error('Catalogue accessories are required'),{code:'validation_error',fieldErrors:[{field:'accessories',message:'At least one accessory is required'}]});const row=this.db.prepare('SELECT COUNT(*) n FROM catalogue_revisions WHERE vehicle_id=?').get(vehicleId);const next=Number(row.n)+1;x.revision=x.revision&&!/^BASE-/.test(x.revision)?x.revision:`Y62-CAT-${String(next).padStart(3,'0')}`;x.publishedAt=now();x.publishedBy=actor?.displayName||actor?.actorId||'server';this.db.prepare('INSERT OR REPLACE INTO catalogue_revisions(vehicle_id,revision,payload_json,published_at,published_by) VALUES(?,?,?,?,?)').run(vehicleId,x.revision,stringify(x),x.publishedAt,x.publishedBy);this.db.prepare('DELETE FROM catalogue_drafts WHERE vehicle_id=?').run(vehicleId);this.audit('catalogue.published','catalogue',vehicleId,{revision:x.revision,accessoryCount:x.accessories.length},actor);return x}
  getCatalogueDraft(vehicleId){const r=this.db.prepare('SELECT payload_json FROM catalogue_drafts WHERE vehicle_id=?').get(vehicleId);return r?parse(r.payload_json):null}
  saveCatalogueDraft(vehicleId,snapshot,{actor}={}){const x=clone(snapshot||{});x.schemaVersion=SCHEMA_VERSION;x.vehicleId=x.vehicleId||vehicleId;x.savedAt=now();this.db.prepare('INSERT INTO catalogue_drafts(vehicle_id,payload_json,updated_at,updated_by) VALUES(?,?,?,?) ON CONFLICT(vehicle_id) DO UPDATE SET payload_json=excluded.payload_json,updated_at=excluded.updated_at,updated_by=excluded.updated_by').run(vehicleId,stringify(x),x.savedAt,actor?.actorId||'server');this.audit('catalogue.draft.saved','catalogue',vehicleId,{accessoryCount:x.accessories?.length||0},actor);return x}
  discardCatalogueDraft(vehicleId,{actor}={}){this.db.prepare('DELETE FROM catalogue_drafts WHERE vehicle_id=?').run(vehicleId);this.audit('catalogue.draft.discarded','catalogue',vehicleId,{},actor);return true}
  importSeed(bundle,{actor}={}){if(!bundle?.catalogue?.vehicleId)throw Object.assign(new Error('Seed bundle catalogue.vehicleId is required'),{code:'validation_error'});const vehicleId=bundle.catalogue.vehicleId;const existing=this.getCatalogue(vehicleId);let catalogue=existing;if(!existing)catalogue=this.publishCatalogue(vehicleId,{...bundle.catalogue,revision:bundle.catalogue.revision||'BASE-Y62-001'},{actor});this.audit('seed.imported','seed',vehicleId,{catalogueCreated:!existing,accessoryCount:bundle.catalogue.accessories?.length||0},actor);return {schemaVersion:SCHEMA_VERSION,vehicleId,catalogueCreated:!existing,catalogueRevision:catalogue?.revision||null,errors:[]}}
  projectAllowed(project,actor){if(!project)return false;if(!actor||actor.role!=='customer')return true;return project.ownerId===actor.actorId}
  assertProjectAccess(project,actor){if(!project)return; if(!this.projectAllowed(project,actor)){const e=new Error('Project is not owned by this customer');e.status=403;e.code='forbidden';throw e}}
  listProjects({actor}={}){const rows=actor?.role==='customer'?this.db.prepare('SELECT payload_json FROM projects WHERE owner_id=? ORDER BY updated_at DESC').all(actor.actorId):this.db.prepare('SELECT payload_json FROM projects ORDER BY updated_at DESC').all();return rows.map(r=>parse(r.payload_json)).filter(Boolean)}
  saveProjectRevision(projectId,snapshot,{expectedVersion,source='http-client',actor}={}){const t=now();let pRow=this.db.prepare('SELECT payload_json,version FROM projects WHERE id=?').get(projectId),project=pRow?parse(pRow.payload_json):null;if(project)this.assertProjectAccess(project,actor);if(pRow&&expectedVersion!=null&&Number(expectedVersion)!==Number(pRow.version)){const e=new Error(`Project changed from version ${expectedVersion} to ${pRow.version}`);e.code='version_conflict';e.currentVersion=pRow.version;throw e}if(!project){const vehicleLabel=[snapshot?.vehicle?.yearRange,snapshot?.vehicle?.make,snapshot?.vehicle?.model,snapshot?.vehicle?.trim].filter(Boolean).join(' ')||'4WD Build',title=snapshot?.lead?.name?`${snapshot.lead.name} · ${vehicleLabel}`:`${vehicleLabel} Build`;project={schemaVersion:SCHEMA_VERSION,id:projectId,title,vehicleId:snapshot?.vehicle?.id||null,ownerId:actor?.actorId||'server',createdAt:t,updatedAt:t,version:0,currentRevisionId:null,revisions:[],shares:[],archived:false}}const n=Number(project.version||0)+1,revNo=(project.revisions?.length||0)+1,revisionId=`R${String(revNo).padStart(4,'0')}`,snap=clone(snapshot||{});snap.schemaVersion=SCHEMA_VERSION;snap.project={id:projectId,revisionId,revisionNumber:revNo,savedAt:t,source,projectVersion:n};snap.actor=actor;snap.contract={...(snap.contract||{}),version:SCHEMA_VERSION};const revision={id:revisionId,number:revNo,createdAt:t,source,actor,checksum:checksum(snap),summary:{reference:snap.reference||'',leadName:snap.lead?.name||'',vehicleId:snap.vehicle?.id||'',vehicleLabel:[snap.vehicle?.yearRange,snap.vehicle?.make,snap.vehicle?.model,snap.vehicle?.trim].filter(Boolean).join(' '),knownSubtotal:snap.pricing?.knownSubtotal||0,itemCount:snap.selections?.length||0,workflowStatus:snap.workflow?.status||'new'},snapshot:snap};project.schemaVersion=SCHEMA_VERSION;project.version=n;project.updatedAt=t;project.currentRevisionId=revisionId;project.revisions=[...(project.revisions||[]),revision];project.vehicleId=snap.vehicle?.id||project.vehicleId;this.db.prepare('INSERT INTO projects(id,owner_id,title,vehicle_id,version,current_revision_id,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET owner_id=excluded.owner_id,title=excluded.title,vehicle_id=excluded.vehicle_id,version=excluded.version,current_revision_id=excluded.current_revision_id,payload_json=excluded.payload_json,updated_at=excluded.updated_at').run(projectId,project.ownerId,project.title,project.vehicleId,project.version,revisionId,stringify(project),project.createdAt,project.updatedAt);this.db.prepare('INSERT INTO project_revisions(project_id,revision_id,revision_number,source,actor_json,checksum,summary_json,snapshot_json,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(projectId,revisionId,revNo,source,stringify(actor),revision.checksum,stringify(revision.summary),stringify(snap),t);this.audit(n===1?'project.created':'project.revision.saved','project',projectId,{revisionId,projectVersion:n,source},actor);return {project,revision,snapshot:snap}}
  getProject(projectId,{actor}={}){const r=this.db.prepare('SELECT payload_json FROM projects WHERE id=?').get(projectId),p=r?parse(r.payload_json):null;if(p)this.assertProjectAccess(p,actor);return p}
  restoreProjectRevision(projectId,revisionId,{expectedVersion,actor}={}){const p=this.getProject(projectId,{actor});if(!p)return null;if(expectedVersion!=null&&Number(expectedVersion)!==Number(p.version||0)){const e=new Error(`Project changed from version ${expectedVersion} to ${p.version}`);e.code='version_conflict';e.currentVersion=p.version;throw e}const revision=(p.revisions||[]).find(r=>r.id===revisionId);if(!revision){const e=new Error('Project revision not found');e.status=404;e.code='not_found';throw e}p.currentRevisionId=revision.id;p.updatedAt=now();p.version=Number(p.version||0)+1;this.db.prepare('UPDATE projects SET version=?,current_revision_id=?,payload_json=?,updated_at=? WHERE id=?').run(p.version,p.currentRevisionId,stringify(p),p.updatedAt,projectId);this.audit('project.revision.restored','project',projectId,{revisionId,projectVersion:p.version},actor);return {project:p,snapshot:clone(revision.snapshot)}}
  createShare(projectId,payload,{actor}={}){const p=this.getProject(projectId,{actor});if(!p)return null;const revisionId=payload?.revisionId||p.currentRevisionId,revision=(p.revisions||[]).find(r=>r.id===revisionId);if(!revision){const e=new Error('Project revision not found');e.status=404;e.code='not_found';throw e}const role=payload?.role||'customer-view',expiresDays=payload?.expiresDays??30;const token=crypto.randomBytes(32).toString('base64url'),tokenHash=crypto.createHash('sha256').update(token).digest('hex'),t=now(),expiresAt=expiresDays?new Date(Date.now()+Number(expiresDays)*86400000).toISOString():null,stored={schemaVersion:SCHEMA_VERSION,tokenHash,tokenHint:token.slice(-6),projectId,revisionId,role,createdAt:t,expiresAt,revokedAt:null};this.db.prepare('INSERT INTO shares(token_hash,token_hint,project_id,revision_id,role,created_at,expires_at,revoked_at,metadata_json) VALUES(?,?,?,?,?,?,?,?,?)').run(tokenHash,stored.tokenHint,projectId,revisionId,role,t,expiresAt,null,stringify(stored));p.shares=[...(p.shares||[]),stored];p.version=Number(p.version||0)+1;p.updatedAt=t;this.db.prepare('UPDATE projects SET version=?, payload_json=?, updated_at=? WHERE id=?').run(p.version,stringify(p),t,projectId);this.audit('project.share.created','project',projectId,{revisionId,role,expiresAt,tokenHint:stored.tokenHint},actor);return {...stored,token}}
  resolveShare(token){const hash=crypto.createHash('sha256').update(token).digest('hex'),r=this.db.prepare('SELECT metadata_json FROM shares WHERE token_hash=?').get(hash),s=r?parse(r.metadata_json):null;if(!s||s.revokedAt||(s.expiresAt&&Date.parse(s.expiresAt)<Date.now()))return null;const p=this.getProject(s.projectId),rev=p?.revisions?.find(x=>x.id===s.revisionId);return p&&rev?{share:s,project:p,revision:rev}:null}
  revokeShareHash(projectId,tokenHash,{actor}={}){const p=this.getProject(projectId,{actor});if(!p)return false;const r=this.db.prepare('SELECT metadata_json FROM shares WHERE token_hash=? AND project_id=?').get(tokenHash,projectId),s=r?parse(r.metadata_json):null;if(!s)return false;if(!s.revokedAt){s.revokedAt=now();this.db.prepare('UPDATE shares SET revoked_at=?, metadata_json=? WHERE token_hash=?').run(s.revokedAt,stringify(s),tokenHash);p.shares=(p.shares||[]).map(x=>x.tokenHash===tokenHash?{...x,revokedAt:s.revokedAt}:x);p.updatedAt=s.revokedAt;p.version=Number(p.version||0)+1;this.db.prepare('UPDATE projects SET version=?,payload_json=?,updated_at=? WHERE id=?').run(p.version,stringify(p),p.updatedAt,projectId);this.audit('project.share.revoked','project',projectId,{revisionId:s.revisionId,role:s.role,tokenHint:s.tokenHint},actor)}return true}
  revokeShare(token,{actor}={}){const hash=crypto.createHash('sha256').update(token).digest('hex'),r=this.db.prepare('SELECT project_id FROM shares WHERE token_hash=?').get(hash);if(!r)return false;return this.revokeShareHash(r.project_id,hash,{actor})}


  seedRenderAssets(seedPath=path.join(__dirname,'..','seed','render-assets.y62.seed.json')){
    const count=Number(this.db.prepare('SELECT COUNT(*) n FROM render_assets').get()?.n||0);if(count||!fs.existsSync(seedPath))return count;
    const bundle=parse(fs.readFileSync(seedPath,'utf8'),{}),actor={actorId:'system-seed',displayName:'PRO4X4 Asset Registry Seed',role:'admin',prototype:false};
    for(const asset of bundle.assets||[])this.upsertRenderAsset(asset,{actor});
    return Number(this.db.prepare('SELECT COUNT(*) n FROM render_assets').get()?.n||0);
  }

  expectedVisualGovernanceRecords(vehicleId=y62ReferencePack.vehicleId){
    if(vehicleId!==y62ReferencePack.vehicleId)throw Object.assign(new Error('Visual governance registry is not defined for this vehicle'),{status:404,code:'not_found'});
    const refs=(y62ReferencePack.references||[]).map(r=>({
      schemaVersion:'0.26.2',assetId:r.id,assetClass:'reference',vehicleId:y62ReferencePack.vehicleId,viewId:r.view,layerId:'reference',exactSku:null,status:'reference-only',source:r.file,
      provenance:{sourceType:r.sourceType,sourceUrl:null,licenceStatus:r.rights,licenceNote:y62ReferencePack.usageBasis,rightsTag:r.rights,capturedAt:null},
      file:{checksumSha256:r.sha256,mimeType:'image/jpeg',width:r.width,height:r.height,hasAlpha:false},
      cameraGeometry:{profileId:null,matched:false,notes:`${r.quality} owner authenticity/reference evidence; never a production render layer.`},
      fitmentScope:[y62ReferencePack.vehicleId],approval:{state:'approved-reference',approvedBy:'owner-source-intake',approvedAt:null,notes:'Reference evidence only. Raw source imagery is not production eligible.'},
      governance:{state:'reference-approved',reviewedBy:'owner-source-intake',reviewedAt:null},
      history:[{at:'2026-09-13T00:00:00.000Z',action:'reference.registered',note:'Owner-supplied Y62 reference registered as authenticity evidence.'}]
    }));
    const masters=Object.entries(y62CanonicalBriefs.briefs||{}).map(([viewId,b])=>({
      schemaVersion:'0.26.2',assetId:`${b.briefId}-MASTER`,assetClass:'canonical-master',vehicleId:b.vehicleId,viewId,layerId:'base',exactSku:null,status:'candidate',source:null,
      renderState:{paintId:b.paintId||'black-obsidian',wheelTyreId:b.wheelTyreId||'factory-warrior'},
      provenance:{sourceType:'reference-derived-canonical',sourceUrl:null,licenceStatus:'pending-render',licenceNote:'Canonical master must be newly created from approved references; raw owner or third-party reference images are not production layers.',capturedAt:null,referenceIds:[...(b.referenceIds||[])]},
      file:{checksumSha256:null,mimeType:null,width:b.canvas?.width||null,height:b.canvas?.height||null,hasAlpha:null},
      cameraGeometry:{profileId:b.briefId,matched:false,notes:b.camera},fitmentScope:[b.vehicleId,'vehicle-state'],
      approval:{state:'not-reviewed',approvedBy:null,approvedAt:null,notes:b.reviewGate||'Awaiting canonical master candidate.'},
      governance:{state:'master-draft',reviewedBy:null,reviewedAt:null},
      history:[{at:'2026-09-13T00:00:00.000Z',action:'canonical.slot-created',note:`Governed canonical slot created from ${b.briefId}; no production image is implied.`}]
    }));
    return [...refs,...masters];
  }

  syncVisualGovernanceRegistry({vehicleId=y62ReferencePack.vehicleId}={}, {actor}={}){
    const expected=this.expectedVisualGovernanceRecords(vehicleId),created=[],preserved=[],backfilled=[];
    const existing=this.db.prepare('SELECT payload_json FROM render_assets WHERE vehicle_id=? ORDER BY asset_id').all(vehicleId).map(r=>parse(r.payload_json)).filter(Boolean);
    for(const raw of existing){
      if(raw.assetClass&&raw.governance?.state)continue;
      const x=visualGovernance.normalize(raw);x.schemaVersion='0.26.2';x.history=[...(x.history||[]),{at:now(),action:'visual-governance.backfilled',note:'Asset class and governance state persisted from the existing registry record.'}];
      this.db.prepare('UPDATE render_assets SET payload_json=?,updated_at=? WHERE asset_id=?').run(stringify(x),now(),x.assetId);backfilled.push(x.assetId);
    }
    const ids=new Set(this.listRenderAssets({vehicleId}).map(x=>x.assetId));
    for(const record of expected){
      if(ids.has(record.assetId)){preserved.push(record.assetId);continue}
      this.upsertRenderAsset(record,{actor});created.push(record.assetId);ids.add(record.assetId);
    }
    const records=this.listRenderAssets({vehicleId}),byClass={},byGovernance={};
    for(const raw of records){const x=visualGovernance.normalize(raw),cls=x.assetClass||'unknown',state=x.governance?.state||'unknown';byClass[cls]=(byClass[cls]||0)+1;byGovernance[state]=(byGovernance[state]||0)+1}
    const out={schemaVersion:'0.26.2',vehicleId,createdCount:created.length,preservedCount:preserved.length,backfilledCount:backfilled.length,created,preserved,backfilled,summary:{total:records.length,byClass,byGovernance,productionEligible:records.filter(x=>visualGovernance.productionEligible(x)).length}};
    this.audit('visual-governance.registry.synced','visual-governance',vehicleId,{createdCount:created.length,preservedCount:preserved.length,backfilledCount:backfilled.length,summary:out.summary},actor);
    return out;
  }

  backfillRenderStates(){
    const rows=this.db.prepare('SELECT asset_id,payload_json FROM render_assets').all();let changed=0;
    for(const row of rows){
      const x=parse(row.payload_json,{});if(!x||!x.layerId)continue;let dirty=false;
      if(x.layerId==='base'&&!x.renderState?.paintId){x.renderState={...(x.renderState||{}),paintId:'black-obsidian'};dirty=true}
      if(x.layerId==='wheels'&&!x.renderState?.wheelTyreId){x.renderState={...(x.renderState||{}),wheelTyreId:'factory-warrior'};dirty=true}
      if(!dirty)continue;x.schemaVersion='0.22.0';this.db.prepare('UPDATE render_assets SET payload_json=? WHERE asset_id=?').run(stringify(x),row.asset_id);changed++;
    }
    return changed;
  }

  listRenderAssets({vehicleId=null,viewId=null,status=null}={}){
    let sql='SELECT payload_json FROM render_assets WHERE 1=1',args=[];
    if(vehicleId){sql+=' AND vehicle_id=?';args.push(vehicleId)}
    if(viewId){sql+=' AND view_id=?';args.push(viewId)}
    if(status){sql+=' AND status=?';args.push(status)}
    sql+=' ORDER BY vehicle_id, view_id, layer_id, asset_id';
    return this.db.prepare(sql).all(...args).map(r=>parse(r.payload_json)).filter(Boolean).map(x=>visualGovernance.normalize(x));
  }
  resolveProductionRenderStack({vehicleId,viewId,requirements}={}){
    const v=String(vehicleId||'').trim(),view=String(viewId||'').trim(),reqs=Array.isArray(requirements)?requirements:[];
    if(!v||!view)throw Object.assign(new Error('Vehicle and view are required'),{status:422,code:'validation_error',fieldErrors:[{field:'vehicleId',message:'vehicleId is required'},{field:'viewId',message:'viewId is required'}]});
    if(reqs.length<1||reqs.length>32)throw Object.assign(new Error('Render requirements must contain 1 to 32 layers'),{status:422,code:'validation_error'});
    const rows=this.listRenderAssets({vehicleId:v,viewId:view}),seen=new Set(),resolved=[];
    for(const raw of reqs){
      const layerId=String(raw?.layerId||'').trim(),exactSku=raw?.exactSku==null||raw?.exactSku===''?null:String(raw.exactSku).trim(),requestedState=raw?.state&&typeof raw.state==='object'?Object.fromEntries(Object.entries(raw.state).filter(([k,v])=>['paintId','wheelTyreId'].includes(k)&&v!=null&&String(v).trim()).map(([k,v])=>[k,String(v).trim()])):{},stateKey=String(raw?.stateKey||Object.entries(requestedState).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}:${v}`).join('|')||'').slice(0,180)||null;
      if(!/^[a-z0-9-]{1,80}$/i.test(layerId))throw Object.assign(new Error(`Invalid render layer: ${layerId||'(blank)'}`),{status:422,code:'validation_error'});
      if(layerId!=='base'&&!exactSku)throw Object.assign(new Error(`Exact SKU/state is required for render layer ${layerId}`),{status:422,code:'validation_error'});
      const key=`${layerId}::${exactSku||''}::${stateKey||''}`;if(seen.has(key))continue;seen.add(key);
      const layerRows=rows.filter(a=>a.layerId===layerId),skuMatches=layerRows.filter(a=>(a.exactSku||null)===exactSku),matches=skuMatches.filter(a=>Object.entries(requestedState).every(([k,val])=>a.renderState?.[k]===val));
      if(!matches.length){const reason=!layerRows.length?'layer-not-registered':!skuMatches.length?'exact-sku-not-registered':Object.keys(requestedState).length?'render-state-not-registered':'production-asset-missing';resolved.push({layerId,exactSku,stateKey,requestedState,state:'missing',reason,registryStatus:null,assetId:null,binaryUrl:null,checksumSha256:null});continue}
      const rank={
        'production-ready':0,'blocked-fitment':1,'candidate':2,'asset-needed':3,'reference-only':4,'retired':5
      };
      const asset=[...matches].sort((a,b)=>(rank[a.status]??99)-(rank[b.status]??99)||String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')))[0];
      if(asset.status==='blocked-fitment'){resolved.push({layerId,exactSku,stateKey,requestedState,state:'blocked',reason:'fitment-blocked',registryStatus:asset.status,assetId:asset.assetId,binaryUrl:null,checksumSha256:null});continue}
      if(asset.status!=='production-ready'){const reason=asset.status==='reference-only'?'reference-only-not-production':asset.status==='candidate'?'candidate-not-approved':asset.status==='retired'?'asset-retired':'production-asset-missing';resolved.push({layerId,exactSku,stateKey,requestedState,state:'missing',reason,registryStatus:asset.status,assetId:asset.assetId,binaryUrl:null,checksumSha256:null});continue}
      const obj=this.getAssetObject(asset.assetId),problems=this.productionProblems(asset,obj);
      if(!obj||problems.length){resolved.push({layerId,exactSku,stateKey,requestedState,state:'missing',reason:'production-gate-invalid',registryStatus:asset.status,assetId:asset.assetId,binaryUrl:null,checksumSha256:null});continue}
      resolved.push({layerId,exactSku,stateKey,requestedState,state:'available',reason:null,registryStatus:asset.status,assetId:asset.assetId,versionId:asset.lineage?.currentVersionId||null,binaryUrl:`/api/v1/render-assets/${encodeURIComponent(asset.assetId)}/binary?sha=${encodeURIComponent(obj.checksumSha256)}`,checksumSha256:obj.checksumSha256,mimeType:obj.mimeType,width:obj.width,height:obj.height});
    }
    const counts={available:resolved.filter(x=>x.state==='available').length,missing:resolved.filter(x=>x.state==='missing').length,blocked:resolved.filter(x=>x.state==='blocked').length};
    const diagnostics={baseState:resolved.find(x=>x.layerId==='base')?.state||'missing',unresolved:resolved.filter(x=>x.state!=='available').map(x=>({layerId:x.layerId,exactSku:x.exactSku,state:x.state,reason:x.reason})),preloadOrder:resolved.filter(x=>x.state==='available').map(x=>x.layerId)}; return {schemaVersion:'0.22.0',vehicleId:v,viewId:view,fallbackPolicy:'none',exactMatchRequired:true,productionReady:resolved.length>0&&counts.available===resolved.length,counts,diagnostics,layers:resolved};
  }


  renderReadiness({vehicleId=readinessPlan.vehicleId,telemetryHours=readinessPlan.thresholds.telemetryWindowHours}={}){
    const v=String(vehicleId||'').trim();
    if(v!==readinessPlan.vehicleId)throw Object.assign(new Error('Render readiness plan not found for vehicle'),{status:404,code:'not_found'});
    const assets=this.listRenderAssets({vehicleId:v}),slots=readinessPlan.expectedSlots();
    const ranked={'production-ready':0,'candidate':1,'asset-needed':2,'reference-only':3,'blocked-fitment':4,'retired':5};
    const matrix=slots.map(slot=>{
      const candidates=assets.filter(a=>a.viewId===slot.viewId&&a.layerId===slot.layerId&&(a.exactSku||null)===(slot.exactSku||null)&&Object.entries(slot.renderState||{}).every(([k,val])=>a.renderState?.[k]===val));
      const asset=[...candidates].sort((a,b)=>(ranked[a.status]??99)-(ranked[b.status]??99)||String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')))[0]||null;
      let state='slot-missing',nextAction='create-slot';
      if(asset){state=asset.status;nextAction=asset.status==='production-ready'?'ready':asset.status==='candidate'?'review-candidate':asset.status==='blocked-fitment'?'resolve-fitment':asset.status==='reference-only'?'source-genuine-layer':'source-asset'}
      return {...slot,registered:!!asset,assetId:asset?.assetId||null,status:state,productionReady:asset?.status==='production-ready',nextAction,approvalState:asset?.approval?.state||null,updatedAt:asset?.updatedAt||asset?.createdAt||null};
    });
    const hours=Math.max(1,Math.min(Number(telemetryHours)||24,168)),cutoff=Date.now()-hours*3600000,telemetry=this.listRenderTelemetry({vehicleId:v,limit:500}).filter(e=>Date.parse(e.at)>=cutoff);
    const loadSuccess=telemetry.filter(e=>e.eventType==='asset-load-success').length,loadErrors=telemetry.filter(e=>e.eventType==='asset-load-error').length,retries=telemetry.filter(e=>e.eventType==='asset-load-retry').length,loadTerminal=loadSuccess+loadErrors;
    const loadSuccessRate=loadTerminal?loadSuccess/loadTerminal:null,retryRate=loadTerminal?retries/loadTerminal:null;
    const frontCore=matrix.filter(x=>x.viewId==='front34'),frontReady=frontCore.filter(x=>x.productionReady).length,registered=matrix.filter(x=>x.registered).length,ready=matrix.filter(x=>x.productionReady).length;
    let health='red',healthReason='Front 3/4 validated core state coverage is incomplete.';
    if(frontReady===frontCore.length&&frontCore.length){health='amber';healthReason='Front 3/4 core states are ready; broader view/state coverage remains incomplete.'}
    if(frontReady===frontCore.length&&ready===matrix.length&&matrix.length){health='green';healthReason='All validated core render-state slots are production-ready.'}
    if(loadSuccessRate!=null&&loadSuccessRate<readinessPlan.thresholds.amber.loadSuccessRateMin){health='red';healthReason='Recent governed binary load success is below the readiness threshold.'}
    else if(health==='green'&&retryRate!=null&&retryRate>readinessPlan.thresholds.green.retryRateMax){health='amber';healthReason='Production coverage is complete but recent retry rate is above the green threshold.'}
    const byView=readinessPlan.views.map(view=>{const cells=matrix.filter(x=>x.viewId===view.id);return {viewId:view.id,label:view.label,cameraProfileId:view.cameraProfileId,cameraState:view.cameraState,planned:cells.length,registered:cells.filter(x=>x.registered).length,productionReady:cells.filter(x=>x.productionReady).length,missingSlots:cells.filter(x=>!x.registered).length,cells}});
    return {schemaVersion:'0.23.0',vehicleId:v,generatedAt:now(),policy:'exact-state-no-substitution',summary:{plannedSlots:matrix.length,registeredSlots:registered,missingSlots:matrix.length-registered,productionReadySlots:ready,coveragePct:matrix.length?Math.round(ready/matrix.length*100):0,front34ProductionReady:frontReady,front34Planned:frontCore.length,health,healthReason},telemetry:{windowHours:hours,eventCount:telemetry.length,loadSuccess,loadErrors,retries,loadSuccessRate,retryRate,thresholds:clone(readinessPlan.thresholds)},views:byView};
  }
  syncRenderReadinessSlots({vehicleId=readinessPlan.vehicleId}={}, {actor}={}){
    const report=this.renderReadiness({vehicleId}),created=[],existing=[];
    for(const view of report.views)for(const slot of view.cells){
      if(slot.registered){existing.push(slot.assetId);continue}
      const asset={schemaVersion:'0.23.0',assetId:slot.assetIdHint,vehicleId:slot.vehicleId,viewId:slot.viewId,layerId:slot.layerId,exactSku:slot.exactSku,status:'asset-needed',source:null,renderState:clone(slot.renderState),provenance:{sourceType:'unknown',sourceUrl:null,licenceStatus:'unknown',licenceNote:'Explicit validated render-state slot. Genuine source and usage rights are required before candidate promotion.',capturedAt:null},file:{checksumSha256:null,mimeType:null,width:null,height:null,hasAlpha:null},cameraGeometry:{profileId:slot.cameraProfileId,matched:false,notes:slot.cameraState==='locked'?'Must be matched to the locked camera profile before production approval.':'View camera profile remains calibration-only; asset can be sourced but cannot be production-approved yet.'},fitmentScope:[slot.vehicleId,slot.exactSku||'vehicle-state',slot.stateKey],approval:{state:'not-reviewed',approvedBy:null,approvedAt:null,notes:`Readiness slot created for ${slot.label}. No visual binary is implied.`},history:[{at:now(),action:'readiness.slot.created',note:`Explicit asset-needed slot created for ${slot.stateKey}; no stand-in artwork attached.`}]};
      this.upsertRenderAsset(asset,{actor});created.push(asset.assetId);
    }
    this.audit('render.readiness.slots.synced','render-readiness',vehicleId,{createdCount:created.length,existingCount:existing.length,created},actor);
    return {schemaVersion:'0.23.0',vehicleId,createdCount:created.length,existingCount:existing.length,created,readiness:this.renderReadiness({vehicleId})};
  }

  productionProblems(x,stored=null){
    const problems=[];
    if(!x.exactSku&&x.layerId!=='base')problems.push('exact SKU/state missing');
    if(x.layerId==='base'&&!x.renderState?.paintId)problems.push('base paint render state missing');
    if(x.layerId==='wheels'&&!x.renderState?.wheelTyreId)problems.push('wheel/tyre render state missing');
    if(!['owned','licensed'].includes(x.provenance?.licenceStatus))problems.push('usage rights not cleared');
    if(!/^[a-f0-9]{64}$/i.test(x.file?.checksumSha256||''))problems.push('valid SHA-256 missing');
    if(!x.file?.mimeType||!x.file?.width||!x.file?.height)problems.push('file metadata missing');
    if(x.file?.hasAlpha!==true)problems.push('transparent layer not verified');
    if(x.vault?.stored!==true)problems.push('governed binary not stored in asset vault');
    if(x.vault?.transparencyVerified!==true)problems.push('server-side transparency not verified');
    if(x.vault?.checksumSha256!==x.file?.checksumSha256)problems.push('vault checksum does not match asset record');
    if(!stored)problems.push('asset vault object record missing');
    else{
      const checksum=stored.checksum_sha256??stored.checksumSha256,verified=stored.transparency_verified??stored.transparencyVerified,width=stored.width,height=stored.height;
      if(checksum!==x.file?.checksumSha256)problems.push('stored object checksum mismatch');
      if(!verified)problems.push('stored object transparency not server-verified');
      if(Number(width)!==Number(x.file?.width)||Number(height)!==Number(x.file?.height))problems.push('stored object dimensions mismatch');
    }
    if(!x.cameraGeometry?.matched)problems.push('camera geometry not matched');
    const camera=cameraProfiles.get(x.viewId);
    if(camera?.state!=='locked')problems.push('camera profile is not production-locked');
    if(camera?.outputCanvas&&(Number(x.file?.width)!==camera.outputCanvas.width||Number(x.file?.height)!==camera.outputCanvas.height))problems.push(`dimensions must match ${camera.outputCanvas.width}x${camera.outputCanvas.height} locked camera canvas`);
    if(x.status==='blocked-fitment')problems.push('fitment blocked');
    if(!visualGovernance.productionEligible(x))problems.push(`visual governance state ${visualGovernance.inferState(x)} is not production eligible`);
    return problems;
  }
  recordRenderTelemetry(event,{actor}={}){
    const x=clone(event||{}),allowed=new Set(['resolve-start','resolve-success','resolve-error','asset-load-start','asset-load-success','asset-load-error','asset-load-retry','stack-ready','stack-degraded']);
    if(!allowed.has(x.eventType))throw Object.assign(new Error('Unsupported render telemetry event'),{status:422,code:'validation_error'});
    const vehicleId=String(x.vehicleId||'').trim(),viewId=String(x.viewId||'').trim();
    if(!vehicleId||!viewId)throw Object.assign(new Error('Render telemetry vehicle/view are required'),{status:422,code:'validation_error'});
    const t=now(),id=telemetryId(),layerId=x.layerId==null?null:String(x.layerId).slice(0,80),exactSku=x.exactSku==null?null:String(x.exactSku).slice(0,160),stateKey=x.stateKey==null?null:String(x.stateKey).slice(0,180),assetId=x.assetId==null?null:String(x.assetId).slice(0,160),checksumSha256=/^[a-f0-9]{64}$/i.test(x.checksumSha256||'')?String(x.checksumSha256).toLowerCase():null,errorCode=x.errorCode==null?null:String(x.errorCode).slice(0,100),attempt=Math.max(0,Math.min(Number(x.attempt)||0,20)),durationMs=x.durationMs==null?null:Math.max(0,Math.min(Number(x.durationMs)||0,600000));
    const payload={schemaVersion:'0.22.0',id,at:t,sessionKey:x.sessionKey?String(x.sessionKey).slice(0,160):null,vehicleId,viewId,layerId,exactSku,stateKey,eventType:x.eventType,attempt,durationMs,assetId,checksumSha256,errorCode,metadata:clone(x.metadata||{}),actorRole:actor?.role||'customer'};
    this.db.prepare('INSERT INTO render_telemetry(id,at,session_key,vehicle_id,view_id,layer_id,exact_sku,state_key,event_type,attempt,duration_ms,asset_id,checksum_sha256,error_code,payload_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,t,payload.sessionKey,vehicleId,viewId,layerId,exactSku,stateKey,x.eventType,attempt,durationMs,assetId,checksumSha256,errorCode,stringify(payload));
    return payload;
  }
  listRenderTelemetry({vehicleId=null,viewId=null,eventType=null,limit=100}={}){
    let sql='SELECT payload_json FROM render_telemetry WHERE 1=1',args=[];
    if(vehicleId){sql+=' AND vehicle_id=?';args.push(String(vehicleId))}
    if(viewId){sql+=' AND view_id=?';args.push(String(viewId))}
    if(eventType){sql+=' AND event_type=?';args.push(String(eventType))}
    sql+=' ORDER BY at DESC LIMIT ?';args.push(Math.max(1,Math.min(Number(limit)||100,500)));
    return this.db.prepare(sql).all(...args).map(r=>parse(r.payload_json)).filter(Boolean);
  }

  upsertRenderAsset(record,{actor}={}){
    const x=visualGovernance.normalize(clone(record||{})),t=now();
    if(!x.assetId||!x.vehicleId||!x.viewId||!x.layerId)throw Object.assign(new Error('Asset ID, vehicle, view and layer are required'),{code:'validation_error'});
    const allowed=new Set(['asset-needed','reference-only','blocked-fitment','candidate','production-ready','retired']);
    if(!allowed.has(x.status))throw Object.assign(new Error('Unsupported render asset status'),{code:'validation_error'});
    x.schemaVersion='0.26.2';x.history=Array.isArray(x.history)?x.history:[];
    if(x.status==='production-ready'){
      const stored=this.db.prepare('SELECT checksum_sha256,transparency_verified,width,height FROM asset_objects WHERE asset_id=?').get(x.assetId),problems=this.productionProblems(x,stored);
      if(problems.length)throw Object.assign(new Error(`Production asset gate blocked: ${problems.join(', ')}`),{status:422,code:'asset_gate_blocked',fieldErrors:problems.map(message=>({field:'productionGate',message}))});
    }
    const existing=this.db.prepare('SELECT created_at FROM render_assets WHERE asset_id=?').get(x.assetId),createdAt=existing?.created_at||t;
    x.updatedAt=t;x.createdAt=x.createdAt||createdAt;
    this.db.prepare('INSERT INTO render_assets(asset_id,vehicle_id,view_id,layer_id,exact_sku,status,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(asset_id) DO UPDATE SET vehicle_id=excluded.vehicle_id,view_id=excluded.view_id,layer_id=excluded.layer_id,exact_sku=excluded.exact_sku,status=excluded.status,payload_json=excluded.payload_json,updated_at=excluded.updated_at').run(x.assetId,x.vehicleId,x.viewId,x.layerId,x.exactSku||null,x.status,stringify(x),createdAt,t);
    this.audit(existing?'render.asset.updated':'render.asset.created','render-asset',x.assetId,{vehicleId:x.vehicleId,viewId:x.viewId,layerId:x.layerId,status:x.status},actor);
    return x;
  }


  getRenderAsset(assetId){const r=this.db.prepare('SELECT payload_json FROM render_assets WHERE asset_id=?').get(assetId),x=r?parse(r.payload_json):null;return x?visualGovernance.normalize(x):null}
  attachAssetObject(assetId,object,{actor}={}){
    const current=this.getRenderAsset(assetId);if(!current)throw Object.assign(new Error('Render asset not found'),{status:404,code:'not_found'});
    const t=now(),storedBy=actor?.actorId||'server-local';
    this.db.prepare('INSERT INTO asset_objects(asset_id,checksum_sha256,object_key,mime_type,width,height,has_alpha,transparency_verified,size_bytes,stored_at,stored_by) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(asset_id) DO UPDATE SET checksum_sha256=excluded.checksum_sha256,object_key=excluded.object_key,mime_type=excluded.mime_type,width=excluded.width,height=excluded.height,has_alpha=excluded.has_alpha,transparency_verified=excluded.transparency_verified,size_bytes=excluded.size_bytes,stored_at=excluded.stored_at,stored_by=excluded.stored_by').run(assetId,object.checksumSha256,object.objectKey,object.mimeType,object.width,object.height,object.hasAlpha==null?null:(object.hasAlpha?1:0),object.transparencyVerified?1:0,object.sizeBytes,t,storedBy);
    current.file={...(current.file||{}),checksumSha256:object.checksumSha256,mimeType:object.mimeType,width:object.width,height:object.height,hasAlpha:object.hasAlpha,sizeBytes:object.sizeBytes,serverInspectedAt:t};
    current.vault={stored:true,objectKey:object.objectKey,checksumSha256:object.checksumSha256,sizeBytes:object.sizeBytes,transparencyVerified:!!object.transparencyVerified,storedAt:t,storedBy};
    if(current.status!=='blocked-fitment'&&current.status!=='production-ready')current.status='candidate';
    current.history=[...(current.history||[]),{at:t,action:'asset.binary.vaulted',note:`Governed binary stored · ${object.width}x${object.height} · SHA-256 ${object.checksumSha256.slice(0,12)}…`}];
    const out=this.upsertRenderAsset(current,{actor});this.audit('render.asset.binary.stored','render-asset',assetId,{objectKey:object.objectKey,checksumSha256:object.checksumSha256,sizeBytes:object.sizeBytes,transparencyVerified:!!object.transparencyVerified},actor);return out;
  }
  getAssetObject(assetId){const r=this.db.prepare('SELECT * FROM asset_objects WHERE asset_id=?').get(assetId);return r?{assetId:r.asset_id,checksumSha256:r.checksum_sha256,objectKey:r.object_key,mimeType:r.mime_type,width:r.width,height:r.height,hasAlpha:r.has_alpha==null?null:!!r.has_alpha,transparencyVerified:!!r.transparency_verified,sizeBytes:r.size_bytes,storedAt:r.stored_at,storedBy:r.stored_by}:null}
  listAssetObjects(){return this.db.prepare('SELECT * FROM asset_objects ORDER BY object_key').all().map(r=>({assetId:r.asset_id,checksumSha256:r.checksum_sha256,objectKey:r.object_key,mimeType:r.mime_type,width:r.width,height:r.height,transparencyVerified:!!r.transparency_verified,sizeBytes:r.size_bytes,storedAt:r.stored_at}))}
  listAssetVersions(assetId){return this.db.prepare('SELECT * FROM asset_versions WHERE asset_id=? ORDER BY version_number DESC').all(assetId).map(objectFromVersionRow)}
  getAssetVersion(assetId,versionId){const r=this.db.prepare('SELECT * FROM asset_versions WHERE asset_id=? AND version_id=?').get(assetId,versionId);return objectFromVersionRow(r)}
  ensureCurrentProductionVersion(assetId,{actor}={}){
    const current=this.getRenderAsset(assetId),obj=this.getAssetObject(assetId);if(!current||current.status!=='production-ready'||!obj)return null;
    const existingId=current.lineage?.currentVersionId;if(existingId){const existing=this.getAssetVersion(assetId,existingId);if(existing)return existing}
    const n=Number(this.db.prepare('SELECT COALESCE(MAX(version_number),0)+1 n FROM asset_versions WHERE asset_id=?').get(assetId)?.n||1),versionId=assetVersionId(assetId,n),t=now(),createdBy=actor?.actorId||'server-local',payload=clone(current);
    payload.lineage={...(payload.lineage||{}),currentVersionId:versionId,versionNumber:n};
    this.db.prepare('INSERT INTO asset_versions(version_id,asset_id,version_number,state,payload_json,checksum_sha256,object_key,mime_type,width,height,has_alpha,transparency_verified,size_bytes,created_at,created_by,promoted_at,promoted_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(versionId,assetId,n,'production',stringify(payload),obj.checksumSha256,obj.objectKey,obj.mimeType,obj.width,obj.height,obj.hasAlpha==null?null:(obj.hasAlpha?1:0),obj.transparencyVerified?1:0,obj.sizeBytes,obj.storedAt||t,obj.storedBy||createdBy,current.approval?.approvedAt||t,current.approval?.approvedBy||createdBy);
    this.db.prepare('UPDATE render_assets SET payload_json=?,updated_at=? WHERE asset_id=?').run(stringify({...current,lineage:{...(current.lineage||{}),currentVersionId:versionId,versionNumber:n}}),t,assetId);
    this.audit('render.asset.version.backfilled','render-asset',assetId,{versionId,versionNumber:n},actor);return this.getAssetVersion(assetId,versionId);
  }
  stageAssetVersion(assetId,object,{actor}={}){
    let current=this.getRenderAsset(assetId);if(!current)throw Object.assign(new Error('Render asset not found'),{status:404,code:'not_found'});
    this.ensureCurrentProductionVersion(assetId,{actor});current=this.getRenderAsset(assetId);
    const open=this.db.prepare("SELECT version_id FROM asset_versions WHERE asset_id=? AND state='candidate' ORDER BY version_number DESC LIMIT 1").get(assetId);if(open)throw Object.assign(new Error('A candidate version is already staged for this asset'),{status:409,code:'asset_candidate_exists',currentVersion:open.version_id});
    const n=Number(this.db.prepare('SELECT COALESCE(MAX(version_number),0)+1 n FROM asset_versions WHERE asset_id=?').get(assetId)?.n||1),versionId=assetVersionId(assetId,n),t=now(),createdBy=actor?.actorId||'server-local';
    const payload=visualGovernance.normalize(clone(current));payload.schemaVersion='0.26.3';payload.status='candidate';payload.governance={...(payload.governance||{}),state:payload.assetClass==='canonical-master'?'master-draft':'layer-draft',reviewedBy:null,reviewedAt:null};payload.provenance={...(payload.provenance||{}),sourceType:'unknown',sourceUrl:null,licenceStatus:'unknown',licenceNote:'New binary candidate requires independent provenance and usage-rights confirmation before promotion.'};payload.file={...(payload.file||{}),checksumSha256:object.checksumSha256,mimeType:object.mimeType,width:object.width,height:object.height,hasAlpha:object.hasAlpha,sizeBytes:object.sizeBytes,serverInspectedAt:t};payload.vault={stored:true,objectKey:object.objectKey,checksumSha256:object.checksumSha256,sizeBytes:object.sizeBytes,transparencyVerified:!!object.transparencyVerified,storedAt:t,storedBy:createdBy};payload.cameraGeometry={...(payload.cameraGeometry||{}),matched:false,notes:`Version ${versionId} staged ${t}. Manual overlay verification required before promotion.`};payload.approval={...(payload.approval||{}),state:'not-reviewed',approvedBy:null,approvedAt:null};payload.lineage={...(payload.lineage||{}),candidateVersionId:versionId,versionNumber:n,supersedesVersionId:current.lineage?.currentVersionId||null};payload.history=[...(payload.history||[]),{at:t,action:'asset.version.staged',note:`${versionId} staged in governed vault · ${object.width}x${object.height} · SHA-256 ${object.checksumSha256.slice(0,12)}…`}];
    this.db.prepare('INSERT INTO asset_versions(version_id,asset_id,version_number,state,payload_json,checksum_sha256,object_key,mime_type,width,height,has_alpha,transparency_verified,size_bytes,created_at,created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(versionId,assetId,n,'candidate',stringify(payload),object.checksumSha256,object.objectKey,object.mimeType,object.width,object.height,object.hasAlpha==null?null:(object.hasAlpha?1:0),object.transparencyVerified?1:0,object.sizeBytes,t,createdBy);
    this.audit('render.asset.version.staged','render-asset',assetId,{versionId,versionNumber:n,objectKey:object.objectKey,checksumSha256:object.checksumSha256},actor);return this.getAssetVersion(assetId,versionId);
  }
  updateAssetVersion(assetId,versionId,record,{actor}={}){
    const v=this.getAssetVersion(assetId,versionId);if(!v)throw Object.assign(new Error('Asset version not found'),{status:404,code:'not_found'});if(v.state!=='candidate')throw Object.assign(new Error('Only candidate versions can be edited'),{status:409,code:'asset_version_immutable'});
    const current=this.getRenderAsset(assetId),x=clone(record||{}),t=now();if(!current)throw Object.assign(new Error('Render asset not found'),{status:404,code:'not_found'});
    x.assetId=current.assetId;x.vehicleId=current.vehicleId;x.viewId=current.viewId;x.layerId=current.layerId;x.exactSku=current.exactSku||null;x.status='candidate';x.schemaVersion='0.26.3';x.assetClass=visualGovernance.inferClass(x);x.governance={...(x.governance||{}),state:visualGovernance.inferState(x)};x.file={...(x.file||{}),checksumSha256:v.checksumSha256,mimeType:v.mimeType,width:v.width,height:v.height,hasAlpha:v.hasAlpha,sizeBytes:v.sizeBytes};x.vault={...(x.vault||{}),stored:true,objectKey:v.objectKey,checksumSha256:v.checksumSha256,sizeBytes:v.sizeBytes,transparencyVerified:v.transparencyVerified};x.lineage={...(x.lineage||{}),candidateVersionId:versionId,versionNumber:v.versionNumber,supersedesVersionId:current.lineage?.currentVersionId||null};x.history=[...(x.history||[]),{at:t,action:'asset.version.updated',note:`Candidate metadata updated for ${versionId}.`}];
    this.db.prepare('UPDATE asset_versions SET payload_json=? WHERE version_id=? AND asset_id=?').run(stringify(x),versionId,assetId);this.audit('render.asset.version.updated','render-asset',assetId,{versionId},actor);return this.getAssetVersion(assetId,versionId);
  }
  promoteAssetVersion(assetId,versionId,{actor}={}){
    const v=this.getAssetVersion(assetId,versionId);if(!v)throw Object.assign(new Error('Asset version not found'),{status:404,code:'not_found'});if(v.state!=='candidate')throw Object.assign(new Error('Only candidate versions can be promoted'),{status:409,code:'asset_version_not_candidate'});
    const current=this.getRenderAsset(assetId);if(!current)throw Object.assign(new Error('Render asset not found'),{status:404,code:'not_found'});const t=now(),promotedBy=actor?.actorId||'server-local',x=clone(v.payload),reviewState=visualGovernance.inferState(x),reviewedBy=x.governance?.reviewedBy,reviewedAt=x.governance?.reviewedAt;
    if(!reviewedBy||!reviewedAt)throw Object.assign(new Error('Immutable reviewer identity and review timestamp are required before promotion'),{status:422,code:'review_evidence_required'});
    x.status='production-ready';x.approval={...(x.approval||{}),state:'approved-production',approvedBy:actor?.displayName||promotedBy,approvedAt:t,reviewEvidence:{reviewState,reviewedBy,reviewedAt,cameraMatched:x.cameraGeometry?.matched===true,licenceStatus:x.provenance?.licenceStatus||null,checksumSha256:v.checksumSha256,versionId}};x.lineage={...(x.lineage||{}),currentVersionId:versionId,versionNumber:v.versionNumber,previousVersionId:current.lineage?.currentVersionId||null,candidateVersionId:null};x.history=[...(x.history||[]),{at:t,action:'asset.version.promoted',note:`${versionId} passed the production gate and became the active immutable layer. Reviewer ${reviewedBy} recorded ${reviewState} at ${reviewedAt}.`}];
    const problems=this.productionProblems(x,{checksumSha256:v.checksumSha256,transparencyVerified:v.transparencyVerified,width:v.width,height:v.height});if(problems.length)throw Object.assign(new Error(`Production asset gate blocked: ${problems.join(', ')}`),{status:422,code:'asset_gate_blocked',fieldErrors:problems.map(message=>({field:'productionGate',message}))});
    this.db.exec('BEGIN IMMEDIATE');try{
      const prev=current.lineage?.currentVersionId;if(prev)this.db.prepare("UPDATE asset_versions SET state='superseded',superseded_at=?,superseded_by=? WHERE version_id=? AND asset_id=? AND state='production'").run(t,promotedBy,prev,assetId);
      this.db.prepare("UPDATE asset_versions SET state='production',payload_json=?,promoted_at=?,promoted_by=? WHERE version_id=? AND asset_id=?").run(stringify(x),t,promotedBy,versionId,assetId);
      this.db.prepare('INSERT INTO asset_objects(asset_id,checksum_sha256,object_key,mime_type,width,height,has_alpha,transparency_verified,size_bytes,stored_at,stored_by) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(asset_id) DO UPDATE SET checksum_sha256=excluded.checksum_sha256,object_key=excluded.object_key,mime_type=excluded.mime_type,width=excluded.width,height=excluded.height,has_alpha=excluded.has_alpha,transparency_verified=excluded.transparency_verified,size_bytes=excluded.size_bytes,stored_at=excluded.stored_at,stored_by=excluded.stored_by').run(assetId,v.checksumSha256,v.objectKey,v.mimeType,v.width,v.height,v.hasAlpha==null?null:(v.hasAlpha?1:0),v.transparencyVerified?1:0,v.sizeBytes,t,promotedBy);
      const createdAt=current.createdAt||t;x.createdAt=createdAt;x.updatedAt=t;this.db.prepare('UPDATE render_assets SET status=?,payload_json=?,updated_at=? WHERE asset_id=?').run('production-ready',stringify(x),t,assetId);this.db.exec('COMMIT');
    }catch(e){this.db.exec('ROLLBACK');throw e}
    this.audit('render.asset.version.promoted','render-asset',assetId,{versionId,versionNumber:v.versionNumber,previousVersionId:current.lineage?.currentVersionId||null,reviewEvidence:x.approval.reviewEvidence},actor);return {asset:this.getRenderAsset(assetId),version:this.getAssetVersion(assetId,versionId)};
  }
  rejectAssetVersion(assetId,versionId,note,{actor}={}){
    const v=this.getAssetVersion(assetId,versionId);if(!v)throw Object.assign(new Error('Asset version not found'),{status:404,code:'not_found'});if(v.state!=='candidate')throw Object.assign(new Error('Only candidate versions can be rejected'),{status:409,code:'asset_version_not_candidate'});const t=now(),by=actor?.actorId||'server-local';this.db.prepare("UPDATE asset_versions SET state='rejected',rejected_at=?,rejected_by=?,rejection_note=? WHERE version_id=? AND asset_id=?").run(t,by,String(note||'').slice(0,1000),versionId,assetId);this.audit('render.asset.version.rejected','render-asset',assetId,{versionId,note:String(note||'').slice(0,250)},actor);return this.getAssetVersion(assetId,versionId)
  }
  listVaultReferences(){
    const current=this.listAssetObjects().map(x=>({...x,referenceType:'current-production'})),versions=this.db.prepare('SELECT * FROM asset_versions ORDER BY asset_id,version_number').all().map(r=>({assetId:r.asset_id,versionId:r.version_id,checksumSha256:r.checksum_sha256,objectKey:r.object_key,mimeType:r.mime_type,width:r.width,height:r.height,transparencyVerified:!!r.transparency_verified,sizeBytes:r.size_bytes,storedAt:r.created_at,referenceType:`version-${r.state}`})),map=new Map();
    for(const ref of [...current,...versions]){const prior=map.get(ref.objectKey);if(prior){prior.references.push({assetId:ref.assetId,versionId:ref.versionId||null,referenceType:ref.referenceType})}else map.set(ref.objectKey,{...ref,references:[{assetId:ref.assetId,versionId:ref.versionId||null,referenceType:ref.referenceType}]})}return [...map.values()].sort((a,b)=>a.objectKey.localeCompare(b.objectKey))
  }

  backup(){const rows=(sql)=>this.db.prepare(sql).all().map(r=>{const o={...r};for(const k of Object.keys(o))if(k.endsWith('_json'))o[k]=parse(o[k]);return o});return {schemaVersion:SCHEMA_VERSION,exportedAt:now(),meta:rows('SELECT * FROM meta'),quotes:rows('SELECT * FROM quotes'),staffSettings:rows('SELECT * FROM staff_settings'),catalogueRevisions:rows('SELECT * FROM catalogue_revisions'),catalogueDrafts:rows('SELECT * FROM catalogue_drafts'),projects:rows('SELECT * FROM projects'),projectRevisions:rows('SELECT * FROM project_revisions'),shares:rows('SELECT * FROM shares'),renderAssets:rows('SELECT * FROM render_assets'),assetObjects:rows('SELECT * FROM asset_objects'),assetVersions:rows('SELECT * FROM asset_versions'),renderTelemetry:rows('SELECT * FROM render_telemetry'),auditEvents:rows('SELECT * FROM audit_events')}}
  restoreBackup(bundle,{actor}={}){if(!bundle||!String(bundle.schemaVersion||'').startsWith('0.'))throw Object.assign(new Error('Backup schemaVersion is required'),{code:'validation_error'});const tables=['render_telemetry','audit_events','asset_versions','asset_objects','render_assets','shares','project_revisions','projects','catalogue_drafts','catalogue_revisions','staff_settings','quotes'];this.db.exec('BEGIN IMMEDIATE');try{for(const t of tables)this.db.exec(`DELETE FROM ${t}`);for(const r of bundle.quotes||[])this.db.prepare('INSERT INTO quotes(reference,status,project_id,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?)').run(r.reference,r.status,r.project_id,stringify(r.payload_json),r.created_at,r.updated_at);for(const r of bundle.staffSettings||[])this.db.prepare('INSERT INTO staff_settings(id,payload_json,updated_at) VALUES(?,?,?)').run(r.id,stringify(r.payload_json),r.updated_at);for(const r of bundle.catalogueRevisions||[])this.db.prepare('INSERT INTO catalogue_revisions(id,vehicle_id,revision,payload_json,published_at,published_by) VALUES(?,?,?,?,?,?)').run(r.id,r.vehicle_id,r.revision,stringify(r.payload_json),r.published_at,r.published_by);for(const r of bundle.catalogueDrafts||[])this.db.prepare('INSERT INTO catalogue_drafts(vehicle_id,payload_json,updated_at,updated_by) VALUES(?,?,?,?)').run(r.vehicle_id,stringify(r.payload_json),r.updated_at,r.updated_by);for(const r of bundle.projects||[])this.db.prepare('INSERT INTO projects(id,owner_id,title,vehicle_id,version,current_revision_id,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(r.id,r.owner_id,r.title,r.vehicle_id,r.version,r.current_revision_id,stringify(r.payload_json),r.created_at,r.updated_at);for(const r of bundle.projectRevisions||[])this.db.prepare('INSERT INTO project_revisions(project_id,revision_id,revision_number,source,actor_json,checksum,summary_json,snapshot_json,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(r.project_id,r.revision_id,r.revision_number,r.source,stringify(r.actor_json),r.checksum,stringify(r.summary_json),stringify(r.snapshot_json),r.created_at);for(const r of bundle.shares||[])this.db.prepare('INSERT INTO shares(token_hash,token_hint,project_id,revision_id,role,created_at,expires_at,revoked_at,metadata_json) VALUES(?,?,?,?,?,?,?,?,?)').run(r.token_hash,r.token_hint,r.project_id,r.revision_id,r.role,r.created_at,r.expires_at,r.revoked_at,stringify(r.metadata_json));for(const r of bundle.renderAssets||[])this.db.prepare('INSERT INTO render_assets(asset_id,vehicle_id,view_id,layer_id,exact_sku,status,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(r.asset_id,r.vehicle_id,r.view_id,r.layer_id,r.exact_sku,r.status,stringify(r.payload_json),r.created_at,r.updated_at);for(const r of bundle.assetObjects||[])this.db.prepare('INSERT INTO asset_objects(asset_id,checksum_sha256,object_key,mime_type,width,height,has_alpha,transparency_verified,size_bytes,stored_at,stored_by) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(r.asset_id,r.checksum_sha256,r.object_key,r.mime_type,r.width,r.height,r.has_alpha,r.transparency_verified,r.size_bytes,r.stored_at,r.stored_by);for(const r of bundle.assetVersions||[])this.db.prepare('INSERT INTO asset_versions(version_id,asset_id,version_number,state,payload_json,checksum_sha256,object_key,mime_type,width,height,has_alpha,transparency_verified,size_bytes,created_at,created_by,promoted_at,promoted_by,superseded_at,superseded_by,rejected_at,rejected_by,rejection_note) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(r.version_id,r.asset_id,r.version_number,r.state,stringify(r.payload_json),r.checksum_sha256,r.object_key,r.mime_type,r.width,r.height,r.has_alpha,r.transparency_verified,r.size_bytes,r.created_at,r.created_by,r.promoted_at,r.promoted_by,r.superseded_at,r.superseded_by,r.rejected_at,r.rejected_by,r.rejection_note);for(const r of bundle.renderTelemetry||[])this.db.prepare('INSERT INTO render_telemetry(id,at,session_key,vehicle_id,view_id,layer_id,exact_sku,state_key,event_type,attempt,duration_ms,asset_id,checksum_sha256,error_code,payload_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(r.id,r.at,r.session_key,r.vehicle_id,r.view_id,r.layer_id,r.exact_sku,r.state_key,r.event_type,r.attempt,r.duration_ms,r.asset_id,r.checksum_sha256,r.error_code,stringify(r.payload_json));for(const r of bundle.auditEvents||[])this.db.prepare('INSERT INTO audit_events(id,at,action,entity_type,entity_id,actor_role,actor_id,correlation_id,payload_json) VALUES(?,?,?,?,?,?,?,?,?)').run(r.id,r.at,r.action,r.entity_type,r.entity_id,r.actor_role,r.actor_id,r.correlation_id,stringify(r.payload_json));this.db.exec('COMMIT')}catch(e){this.db.exec('ROLLBACK');throw e}this.backfillRenderStates();this.audit('backup.restored','system','database',{sourceSchemaVersion:bundle.schemaVersion,quoteCount:(bundle.quotes||[]).length,projectCount:(bundle.projects||[]).length},actor);return {schemaVersion:SCHEMA_VERSION,restored:true,quoteCount:(bundle.quotes||[]).length,projectCount:(bundle.projects||[]).length}}
}
module.exports={RigDatabase,SCHEMA_VERSION,DB_SCHEMA_VERSION,recomputeQuote,makeActor};
