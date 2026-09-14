import {DatabaseSync} from 'node:sqlite';
import crypto from 'node:crypto';
import audit from './vendor/audit-integrity.cjs';
import {createEngine} from '../domain/engine.mjs';
import {alpha93FixtureCatalogue} from '../domain/fixture.mjs';
import {eligibility} from '../visual-eligibility/adapter.mjs';
export const SCHEMA='alpha94-project-v1';
export const hash=value=>audit.sha256Hex(audit.stableStringify(value));
const clone=v=>JSON.parse(JSON.stringify(v));
const now=()=>new Date().toISOString();
const uid=prefix=>prefix+'-'+crypto.randomUUID();
export function fail(code,status=422){throw Object.assign(new Error(code),{code,status});}
function only(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!keys.includes(k)))fail('unexpected_fields');}
function customerFields(value={}){only(value,['name','email','phone','notes']);for(const v of Object.values(value))if(typeof v!=='string'||v.length>2000)fail('invalid_customer_fields');return clone(value);}
export class ProjectStore {
  #db; #catalogue; #fixture; #mapping; #assets; #engine; #fixtureEngine;
  constructor({filename=':memory:',catalogue,fixture,mapping,assetHashes,implementationVersion}) {
    this.#catalogue=clone(catalogue);this.#fixture=clone(fixture);this.#mapping=clone(mapping);this.#assets=clone(assetHashes);
    this.catalogueVersion=hash(catalogue);this.implementationVersion=implementationVersion;
    this.#engine=createEngine(this.#catalogue);this.#fixtureEngine=createEngine(alpha93FixtureCatalogue(this.#fixture));
    this.#db=new DatabaseSync(filename);
    this.#db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS schema_meta(version INTEGER NOT NULL);
      INSERT INTO schema_meta SELECT 1 WHERE NOT EXISTS(SELECT 1 FROM schema_meta);
      CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,owner TEXT NOT NULL,version INTEGER NOT NULL,title TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS revisions(project_id TEXT NOT NULL,revision_id TEXT NOT NULL,checksum TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(project_id,revision_id),FOREIGN KEY(project_id) REFERENCES projects(id));
      CREATE TABLE IF NOT EXISTS quotes(id TEXT PRIMARY KEY,owner TEXT NOT NULL,project_id TEXT NOT NULL,revision_id TEXT NOT NULL,status TEXT NOT NULL,payload TEXT NOT NULL,FOREIGN KEY(project_id,revision_id) REFERENCES revisions(project_id,revision_id));
      CREATE TABLE IF NOT EXISTS shares(token_hash TEXT PRIMARY KEY,project_id TEXT NOT NULL,revision_id TEXT NOT NULL,expires_at TEXT NOT NULL,revoked INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(project_id,revision_id) REFERENCES revisions(project_id,revision_id));
      CREATE TABLE IF NOT EXISTS auth_sessions(token_hash TEXT PRIMARY KEY,payload TEXT NOT NULL,expires_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS audit_events(seq INTEGER PRIMARY KEY AUTOINCREMENT,payload TEXT NOT NULL);
      CREATE TRIGGER IF NOT EXISTS immutable_revision_update BEFORE UPDATE ON revisions BEGIN SELECT RAISE(ABORT,'immutable_revision'); END;
      CREATE TRIGGER IF NOT EXISTS immutable_revision_delete BEFORE DELETE ON revisions BEGIN SELECT RAISE(ABORT,'immutable_revision'); END;
      CREATE TRIGGER IF NOT EXISTS terminal_quote_update BEFORE UPDATE ON quotes WHEN OLD.status='finalised' BEGIN SELECT RAISE(ABORT,'terminal_quote'); END;
      CREATE TRIGGER IF NOT EXISTS terminal_quote_delete BEFORE DELETE ON quotes WHEN OLD.status='finalised' BEGIN SELECT RAISE(ABORT,'terminal_quote'); END;
      CREATE TRIGGER IF NOT EXISTS immutable_audit_update BEFORE UPDATE ON audit_events BEGIN SELECT RAISE(ABORT,'immutable_audit'); END;
      CREATE TRIGGER IF NOT EXISTS immutable_audit_delete BEFORE DELETE ON audit_events BEGIN SELECT RAISE(ABORT,'immutable_audit'); END;`);
    if(this.#db.prepare('SELECT version FROM schema_meta').get().version!==1)fail('database_migration_required',409);
    const integrity=this.auditStatus();if(integrity.status==='broken'||integrity.legacyEvents)fail('audit_integrity_failure',409);
  }
  close(){this.#db.close();}
  #tx(fn){this.#db.exec('BEGIN IMMEDIATE');try{const result=fn();this.#db.exec('COMMIT');return result;}catch(e){this.#db.exec('ROLLBACK');throw e;}}
  #actor(actor){if(!actor?.actorId||!['customer','sales','finaliser','admin'].includes(actor.role))fail('identity_required',401);}
  #access(owner,actor){this.#actor(actor);if(actor.actorId!==owner&&!['sales','finaliser','admin'].includes(actor.role))fail('forbidden',403);}
  #event(action,entityId,actor,metadata={}){const last=this.#db.prepare('SELECT payload FROM audit_events ORDER BY seq DESC LIMIT 1').get();const previous=last?JSON.parse(last.payload).integrity.eventHash:null;const e=audit.seal({schemaVersion:SCHEMA,id:uid('AUD'),at:now(),action,entityType:'project-lifecycle',entityId,actor:{actorId:actor.actorId,role:actor.role},metadata},previous);this.#db.prepare('INSERT INTO audit_events(payload) VALUES(?)').run(JSON.stringify(e));}
  auditStatus(){return audit.verify(this.#db.prepare('SELECT payload FROM audit_events ORDER BY seq').all().map(r=>JSON.parse(r.payload)));}
  createAuthSession(actor,{ttlMinutes=1440}={}){const token=crypto.randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+ttlMinutes*60000).toISOString();this.#db.prepare('INSERT INTO auth_sessions VALUES(?,?,?)').run(hash(token),JSON.stringify({actor}),expiresAt);return {token,actor,expiresAt};}
  resolveAuthSession(token){const row=this.#db.prepare('SELECT * FROM auth_sessions WHERE token_hash=?').get(hash(token));return row&&row.expires_at>now()?{...JSON.parse(row.payload),expiresAt:row.expires_at}:null;}
  revokeAuthSession(token){this.#db.prepare('DELETE FROM auth_sessions WHERE token_hash=?').run(hash(token));}
  #canonical(input){
    if(input.schemaVersion!==SCHEMA)fail('schema_migration_required',409);
    if(input.catalogueVersion!==this.catalogueVersion)fail('catalogue_migration_required',409);
    if(!['catalogue','checkpoint'].includes(input.profile))fail('profile_required');
    if(!Array.isArray(input.selected)||input.selected.length>200||input.selected.some(id=>typeof id!=='string'))fail('invalid_selection');
    const checkpoint=input.profile==='checkpoint',vehicleId=checkpoint?'alpha93-regression-only':input.vehicleId;
    if(input.vehicleId!==vehicleId)fail('vehicle_profile_mismatch');
    const definition=checkpoint?{trim:'Alpha93 regression fixture',series:null,yearRange:null}:this.#catalogue.vehicles.find(v=>v.vehicleId===vehicleId)?.definition.vehicle;
    if(!definition)fail('unknown_vehicle');
    const variant={trim:definition.trim??null,series:definition.series??null,yearRange:definition.yearRange??null};
    if(Object.hasOwn(input,'variant')&&hash(input.variant)!==hash(variant))fail('variant_review_required');
    const decision=(checkpoint?this.#fixtureEngine:this.#engine).evaluate({vehicleId,selected:input.selected});
    if(decision.reasons.some(r=>['identity-invalid','vehicle-unknown'].includes(r.code)))fail('invalid_identity');
    const renderState=eligibility({decision,mapping:this.#mapping,profile:input.profile});
    const components=['parts','labour','paint','freight','engineering'];
    const lines=decision.products.map(p=>{const source=checkpoint?this.#fixture.products[p.identity.split('::')[1]]:this.#catalogue.products.find(x=>x.identity===p.identity).data;
      const amounts=source.pricing?{parts:null,labour:null,paint:null,freight:null,engineering:null,...source.pricing}:{parts:source.price??null,labour:Number.isFinite(source.install)?source.install:null,paint:null,freight:null,engineering:null};
      const required=checkpoint?['parts']:source.pricingRequired||(['parts','labour',...(vehicleId.startsWith('nissan')?['freight']:[])]);
      return {identity:p.identity,amounts,required};});
    const totals=Object.fromEntries(components.map(c=>[c,lines.reduce((n,l)=>n+(Number.isFinite(l.amounts[c])?l.amounts[c]:0),0)]));
    const missing=lines.flatMap(l=>l.required.filter(c=>!Number.isFinite(l.amounts[c])).map(component=>({identity:l.identity,component})));
    const calculations={currency:'AUD',components:totals,knownSubtotal:Object.values(totals).reduce((a,b)=>a+b,0),missing,complete:missing.length===0,lines};
    const canonical={schemaVersion:SCHEMA,profile:input.profile,vehicle:{id:vehicleId,variant},catalogueVersion:this.catalogueVersion,implementationVersion:this.implementationVersion,selected:decision.selected,decision,calculations,renderState,renderProvenance:{authority:'Alpha93 preview / Stage5 adapter',assets:this.#assets,productionApproved:false},quoteReady:!checkpoint&&decision.valid&&lines.length>0&&calculations.complete};
    if(Object.hasOwn(input,'renderState')&&hash(input.renderState)!==hash(renderState))fail('render_mismatch');
    if(Object.hasOwn(input,'decision')&&hash(input.decision)!==hash(decision))fail('decision_mismatch');
    return canonical;
  }
  list(actor){this.#actor(actor);return this.#db.prepare('SELECT * FROM projects WHERE owner=? ORDER BY id').all(actor.actorId);}
  #project(id,actor){const p=this.#db.prepare('SELECT * FROM projects WHERE id=?').get(id);if(!p)fail('project_not_found',404);this.#access(p.owner,actor);return p;}
  getProject(id,actor){const p=this.#project(id,actor);return {...p,revisions:this.#db.prepare('SELECT revision_id,checksum FROM revisions WHERE project_id=? ORDER BY revision_id').all(id)};}
  #revision(projectId,revisionId){const row=this.#db.prepare('SELECT * FROM revisions WHERE project_id=? AND revision_id=?').get(projectId,revisionId);if(!row)fail('revision_not_found',404);const r=JSON.parse(row.payload);if(hash(r)!==row.checksum)fail('revision_integrity_failure',409);return {snapshot:r,checksum:row.checksum};}
  readRevision(projectId,revisionId,actor){this.#project(projectId,actor);const r=this.#revision(projectId,revisionId);return {...r,migrationRequired:r.snapshot.catalogueVersion!==this.catalogueVersion||r.snapshot.implementationVersion!==this.implementationVersion||r.snapshot.schemaVersion!==SCHEMA};}
  save(input,actor,provenance=null){this.#actor(actor);only(input,['schemaVersion','catalogueVersion','profile','vehicleId','variant','selected','decision','renderState','projectId','expectedVersion','title']);const canonical=this.#canonical(input);
    return this.#tx(()=>{const p=input.projectId?this.#project(input.projectId,actor):{id:uid('PRJ'),owner:actor.actorId,version:0,title:typeof input.title==='string'?input.title.slice(0,120):'Rig build'};
      if(input.projectId&&input.expectedVersion!==p.version)fail('version_conflict',409);
      const version=p.version+1,revisionId='R'+String(version).padStart(6,'0');
      const snapshot={...canonical,projectId:p.id,ownerId:p.owner,revisionId,revisionNumber:version,createdAt:now(),createdBy:actor.actorId,migration:provenance};const checksum=hash(snapshot);
      if(p.version===0)this.#db.prepare('INSERT INTO projects VALUES(?,?,?,?)').run(p.id,p.owner,version,p.title);else this.#db.prepare('UPDATE projects SET version=? WHERE id=?').run(version,p.id);
      this.#db.prepare('INSERT INTO revisions VALUES(?,?,?,?)').run(p.id,revisionId,checksum,JSON.stringify(snapshot));this.#event(provenance?'project.migrated':'project.revision.saved',p.id,actor,{revisionId,checksum});return {snapshot,checksum,projectVersion:version,migrationRequired:false};});
  }
  migrate(input,actor){only(input,['projectId','revisionId','checksum','expectedVersion','acknowledge']);if(input.acknowledge!==true)fail('explicit_migration_required');const old=this.readRevision(input.projectId,input.revisionId,actor);if(input.checksum!==old.checksum)fail('checksum_mismatch',409);return this.save({schemaVersion:SCHEMA,catalogueVersion:this.catalogueVersion,profile:old.snapshot.profile,vehicleId:old.snapshot.vehicle.id,selected:old.snapshot.selected,projectId:input.projectId,expectedVersion:input.expectedVersion},actor,{kind:'revalidate-revision-v1',sourceRevision:input.revisionId,sourceChecksum:old.checksum});}
  importLegacy(input,actor){only(input,['sourceKey','selected','acknowledgeUntrusted']);if(input.acknowledgeUntrusted!==true||!['p4x4-a87','p4x4-a93'].includes(input.sourceKey)||!Array.isArray(input.selected)||input.selected.some(id=>!Object.hasOwn(this.#fixture.products,id)))fail('legacy_migration_required');return this.save({schemaVersion:SCHEMA,catalogueVersion:this.catalogueVersion,profile:'checkpoint',vehicleId:'alpha93-regression-only',selected:input.selected.map(id=>'alpha93-regression-only::'+id),title:'Imported Alpha93 checkpoint'},actor,{kind:'legacy-alpha93-v1',sourceKey:input.sourceKey,untrustedSource:true});}
  createQuote(input,actor){only(input,['projectId','revisionId','checksum','revisionContent','renderState','customer']);if(!input.projectId||!input.revisionId)fail('lineage_required');const r=this.readRevision(input.projectId,input.revisionId,actor);if(input.checksum!==r.checksum)fail('checksum_mismatch',409);if(r.migrationRequired)fail('revision_migration_required',409);
    if(Object.hasOwn(input,'revisionContent')&&hash(input.revisionContent)!==r.checksum)fail('revision_content_mismatch');if(Object.hasOwn(input,'renderState')&&hash(input.renderState)!==hash(r.snapshot.renderState))fail('render_mismatch');if(r.snapshot.profile!=='catalogue')fail('checkpoint_not_quotable');
    const fresh=this.#canonical({schemaVersion:SCHEMA,catalogueVersion:this.catalogueVersion,profile:'catalogue',vehicleId:r.snapshot.vehicle.id,selected:r.snapshot.selected});if(hash(fresh.decision)!==hash(r.snapshot.decision)||hash(fresh.renderState)!==hash(r.snapshot.renderState)||hash(fresh.calculations)!==hash(r.snapshot.calculations))fail('revalidation_mismatch',409);
    return this.#tx(()=>{const q={schemaVersion:SCHEMA,id:uid('QTE'),ownerId:r.snapshot.ownerId,projectId:input.projectId,revisionId:input.revisionId,revisionChecksum:r.checksum,status:'draft',customer:customerFields(input.customer),staffNotes:'',quoteReady:r.snapshot.quoteReady,calculations:r.snapshot.calculations,createdAt:now(),finalisation:null};this.#db.prepare('INSERT INTO quotes VALUES(?,?,?,?,?,?)').run(q.id,q.ownerId,q.projectId,q.revisionId,q.status,JSON.stringify(q));this.#event('quote.created',q.id,actor,{projectId:q.projectId,revisionId:q.revisionId,checksum:q.revisionChecksum});return q;});
  }
  getQuote(id,actor){const row=this.#db.prepare('SELECT payload FROM quotes WHERE id=?').get(id);if(!row)fail('quote_not_found',404);const q=JSON.parse(row.payload);this.#access(q.ownerId,actor);return q;}
  updateQuote(id,input,actor){return this.#tx(()=>{const q=this.getQuote(id,actor);if(q.status==='finalised')fail('quote_terminal',409);only(input,['customer','staffNotes']);if(input.customer)q.customer=customerFields(input.customer);if(input.staffNotes!==undefined){if(!['sales','finaliser','admin'].includes(actor.role))fail('forbidden',403);if(typeof input.staffNotes!=='string'||input.staffNotes.length>4000)fail('invalid_staff_notes');q.staffNotes=input.staffNotes;}this.#db.prepare('UPDATE quotes SET payload=? WHERE id=?').run(JSON.stringify(q),id);this.#event('quote.draft.updated',id,actor);return q;});}
  finalise(id,input,actor){this.#actor(actor);if(!['finaliser','admin'].includes(actor.role))fail('finaliser_required',403);only(input,['idempotencyKey']);if(typeof input.idempotencyKey!=='string'||input.idempotencyKey.length<8||input.idempotencyKey.length>120)fail('idempotency_key_required');return this.#tx(()=>{const q=this.getQuote(id,actor);if(q.status==='finalised'){if(q.finalisation.idempotencyKey===input.idempotencyKey&&q.finalisation.finaliserId===actor.actorId)return q;fail('quote_terminal',409);}
      const r=this.readRevision(q.projectId,q.revisionId,actor);if(r.migrationRequired)fail('revision_migration_required',409);if(r.checksum!==q.revisionChecksum)fail('checksum_mismatch');
      const fresh=this.#canonical({schemaVersion:SCHEMA,catalogueVersion:this.catalogueVersion,profile:r.snapshot.profile,vehicleId:r.snapshot.vehicle.id,selected:r.snapshot.selected});if(!fresh.quoteReady||hash(fresh.calculations)!==hash(q.calculations)||hash(fresh.decision)!==hash(r.snapshot.decision)||hash(fresh.renderState)!==hash(r.snapshot.renderState))fail('quote_not_ready',409);
      q.status='finalised';q.finalisation={issuedAt:now(),finaliserId:actor.actorId,idempotencyKey:input.idempotencyKey,revisionChecksum:r.checksum,totalAUD:fresh.calculations.knownSubtotal};this.#db.prepare('UPDATE quotes SET status=?,payload=? WHERE id=?').run(q.status,JSON.stringify(q),id);this.#event('quote.finalised',id,actor,{revisionChecksum:r.checksum,total:q.finalisation.totalAUD});return q;});}
  createShare(input,actor){only(input,['projectId','revisionId','checksum']);const r=this.readRevision(input.projectId,input.revisionId,actor);if(input.checksum!==r.checksum)fail('checksum_mismatch');return this.#tx(()=>{const token=crypto.randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+30*86400000).toISOString();this.#db.prepare('INSERT INTO shares(token_hash,project_id,revision_id,expires_at) VALUES(?,?,?,?)').run(hash(token),input.projectId,input.revisionId,expiresAt);this.#event('share.created',input.projectId,actor,{revisionId:input.revisionId});return {token,expiresAt};});}
  resolveShare(token){const row=this.#db.prepare('SELECT * FROM shares WHERE token_hash=? AND revoked=0').get(hash(token));if(!row||row.expires_at<=now())fail('share_not_found',404);const {snapshot:s,checksum}=this.#revision(row.project_id,row.revision_id);
    // Explicit projection: no owner, actor, registry, token metadata or other revisions.
    return {schemaVersion:SCHEMA,revision:{revisionId:s.revisionId,checksum,vehicle:s.vehicle,selected:s.selected,pricing:{currency:'AUD',knownSubtotal:s.calculations.knownSubtotal,complete:s.calculations.complete},visuals:Object.fromEntries(Object.entries(s.renderState.layers).map(([name,l])=>[name,{state:l.state,visible:l.visible}])),productionApproved:false},expiresAt:row.expires_at};}
}
