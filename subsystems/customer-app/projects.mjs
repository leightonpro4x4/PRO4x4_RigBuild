// WF1 workflow: explicit save, immutable revisions, dirty-state guard and handoff.
// Only identity pointers may be cached. Server responses own snapshots and receipts.
export function createProjectWorkflow(request){
  let metadata=null,saved=null,dirty=true;
  return {
    async init(){metadata=await request('/api/session');return metadata;},
    state(){return {saved,dirty,metadata};},
    changed(){dirty=true;},
    detach(){saved=null;dirty=true;},
    async list(){return request('/api/projects');},
    async history(projectId){return request('/api/projects/'+encodeURIComponent(projectId));},
    async save({profile,vehicleId,selected},newProject=false){if(!metadata)await this.init();const previous=!newProject&&saved;
      saved=await request('/api/revisions',{schemaVersion:metadata.schemaVersion,catalogueVersion:metadata.catalogueVersion,profile,vehicleId,selected,...(previous?{projectId:previous.snapshot.projectId,expectedVersion:previous.projectVersion}:{})});dirty=false;return saved;},
    async load(projectId,revisionId,{discardDirty=false}={}){if(dirty&&saved&&!discardDirty)throw new Error('Unsaved changes: save or explicitly discard before loading.');const project=await this.history(projectId);const revision=await request(`/api/projects/${encodeURIComponent(projectId)}/revisions/${encodeURIComponent(revisionId)}`);saved={...revision,projectVersion:project.version};dirty=false;return saved;},
    async quote(customer){if(!saved||dirty)throw new Error('Save the current revision before requesting a quote.');if(saved.migrationRequired)throw new Error('Migrate this revision before requesting a quote.');return request('/api/quotes',{projectId:saved.snapshot.projectId,revisionId:saved.snapshot.revisionId,checksum:saved.checksum,renderState:saved.snapshot.renderState,customer});},
    async share(){if(!saved||dirty)throw new Error('Save the current revision before sharing.');return request('/api/shares',{projectId:saved.snapshot.projectId,revisionId:saved.snapshot.revisionId,checksum:saved.checksum});},
    async migrate(){if(!saved)throw new Error('Load a revision first.');saved=await request('/api/migrations/revision',{projectId:saved.snapshot.projectId,revisionId:saved.snapshot.revisionId,checksum:saved.checksum,expectedVersion:saved.projectVersion,acknowledge:true});dirty=false;return saved;},
    async importLegacy(sourceKey,selected){saved=await request('/api/migrations/legacy',{sourceKey,selected,acknowledgeUntrusted:true});dirty=false;return saved;}
  };
}
