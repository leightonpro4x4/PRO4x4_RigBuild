(function(){
  const namespace='pro4x4-rig-builder:';
  class LocalAdapter{
    constructor(storage=window.localStorage){this.storage=storage;this.mode='local';}
    key(k){return namespace+k}
    get(k,fallback=null){try{const raw=this.storage.getItem(this.key(k));return raw==null?fallback:JSON.parse(raw)}catch{return fallback}}
    set(k,value){this.storage.setItem(this.key(k),JSON.stringify(value));return value}
    remove(k){this.storage.removeItem(this.key(k))}
    keys(prefix=''){const out=[];for(let i=0;i<this.storage.length;i++){const key=this.storage.key(i);if(key?.startsWith(namespace+prefix))out.push(key.slice(namespace.length));}return out.sort()}
  }
  class HttpAdapter{
    constructor(baseUrl='/api/v1',fetcher=window.fetch.bind(window)){this.baseUrl=baseUrl;this.fetcher=fetcher;this.mode='http';}
    identityHeaders(){const a=window.PRO4X4_AUTH?.current?.()||window.PRO4X4_AUTH?.actorSnapshot?.()||null;return a?{'x-pro4x4-actor':a.actorId||'browser-user','x-pro4x4-name':a.displayName||'PRO4X4 Browser','x-pro4x4-role':a.role||'admin'}:{'x-pro4x4-role':'admin'};}
    async request(path,opts={}){const r=await this.fetcher(this.baseUrl+path,{credentials:'same-origin',headers:{'content-type':'application/json','accept':'application/json',...this.identityHeaders(),...(opts.headers||{})},...opts});if(!r.ok){let detail=null;try{detail=await r.json()}catch{}const e=new Error(detail?.message||detail?.error||`Persistence API ${r.status}`);e.status=r.status;e.code=detail?.code||detail?.error||'API_ERROR';e.detail=detail;e.currentVersion=detail?.currentVersion;throw e}return r.status===204?null:r.json()}
    async health(){return this.request('/health')}
    async getSession(){return this.request('/auth/session')}
    async devLogin(payload){return this.request('/auth/dev-login',{method:'POST',body:JSON.stringify(payload||{})})}
    async logout(){return this.request('/auth/logout',{method:'POST',body:'{}'})}
    async listProjects(){return this.request('/projects')}
    async getProject(id){return this.request(`/projects/${encodeURIComponent(id)}`)}
    async saveRevision(id,snapshot,{source='http-client',expectedVersion}={}){return this.request(`/projects/${encodeURIComponent(id)}/revisions`,{method:'POST',body:JSON.stringify({snapshot,source,expectedVersion})})}
    async restoreRevision(id,revisionId,{expectedVersion}={}){return this.request(`/projects/${encodeURIComponent(id)}/current-revision`,{method:'PUT',body:JSON.stringify({revisionId,expectedVersion})})}
    async createShare(projectId,payload){return this.request(`/projects/${encodeURIComponent(projectId)}/shares`,{method:'POST',body:JSON.stringify(payload)})}
    async resolveShare(token){return this.request(`/shares/${encodeURIComponent(token)}`)}
    async revokeShare(token){return this.request(`/shares/${encodeURIComponent(token)}`,{method:'DELETE'})}
    async revokeProjectShare(projectId,tokenHash){return this.request(`/projects/${encodeURIComponent(projectId)}/shares/${encodeURIComponent(tokenHash)}`,{method:'DELETE'})}
    async createBuild(payload){return this.request('/builds',{method:'POST',body:JSON.stringify(payload)})}
    async resolveRenderStack(payload){return this.request('/render/resolve',{method:'POST',body:JSON.stringify(payload)})}
    async recordRenderTelemetry(payload){return this.request('/render/telemetry',{method:'POST',body:JSON.stringify(payload)})}
    async listQuotes(){return this.request('/staff/quotes')}
    async getQuote(reference){return this.request(`/staff/quotes/${encodeURIComponent(reference)}`)}
    async updateQuote(reference,payload){return this.request(`/staff/quotes/${encodeURIComponent(reference)}`,{method:'PATCH',body:JSON.stringify(payload)})}
    async finaliseQuote(reference,payload){return this.request(`/staff/quotes/${encodeURIComponent(reference)}/finalise`,{method:'POST',body:JSON.stringify(payload||{})})}
    async getStaffSettings(){return this.request('/staff/settings/quote')}
    async setStaffSettings(payload){return this.request('/staff/settings/quote',{method:'PATCH',body:JSON.stringify(payload)})}
    async getCatalogue(vehicleId){return this.request(`/catalogue/${encodeURIComponent(vehicleId)}`)}
    async publishCatalogue(vehicleId,snapshot){return this.request(`/staff/catalogue/${encodeURIComponent(vehicleId)}/revisions`,{method:'POST',body:JSON.stringify(snapshot)})}
    async getCatalogueDraft(vehicleId){return this.request(`/staff/catalogue/${encodeURIComponent(vehicleId)}/draft`)}
    async saveCatalogueDraft(vehicleId,snapshot){return this.request(`/staff/catalogue/${encodeURIComponent(vehicleId)}/draft`,{method:'PUT',body:JSON.stringify(snapshot)})}
    async discardCatalogueDraft(vehicleId){return this.request(`/staff/catalogue/${encodeURIComponent(vehicleId)}/draft`,{method:'DELETE'})}
    async listRenderAssets(vehicleId){const q=vehicleId?`?vehicleId=${encodeURIComponent(vehicleId)}`:'';return this.request(`/staff/render-assets${q}`)}
    async syncVisualGovernance(vehicleId){return this.request('/staff/visual-governance/sync',{method:'POST',body:JSON.stringify({vehicleId})})}
    async getRenderReadiness(vehicleId,telemetryHours=24){const q=new URLSearchParams();if(vehicleId)q.set('vehicleId',vehicleId);if(telemetryHours)q.set('telemetryHours',String(telemetryHours));return this.request(`/staff/render-readiness${q.toString()?`?${q}`:''}`)}
    async syncRenderReadinessSlots(vehicleId){return this.request('/staff/render-readiness/slots/sync',{method:'POST',body:JSON.stringify({vehicleId})})}
    async upsertRenderAsset(record){return this.request(`/staff/render-assets/${encodeURIComponent(record.assetId)}`,{method:'PUT',body:JSON.stringify(record)})}
    async uploadRenderAssetBinary(assetId,file){const r=await this.fetcher(this.baseUrl+`/staff/render-assets/${encodeURIComponent(assetId)}/binary`,{method:'PUT',credentials:'same-origin',headers:{'content-type':file.type||'application/octet-stream','accept':'application/json',...this.identityHeaders()},body:file});if(!r.ok){let detail=null;try{detail=await r.json()}catch{}const e=new Error(detail?.message||detail?.error||`Asset vault API ${r.status}`);e.status=r.status;e.code=detail?.code||detail?.error||'API_ERROR';throw e}return r.json()}
    async listRenderAssetVersions(assetId){return this.request(`/staff/render-assets/${encodeURIComponent(assetId)}/versions`)}
    async stageRenderAssetVersion(assetId,file){const r=await this.fetcher(this.baseUrl+`/staff/render-assets/${encodeURIComponent(assetId)}/versions`,{method:'POST',credentials:'same-origin',headers:{'content-type':file.type||'application/octet-stream','accept':'application/json',...this.identityHeaders()},body:file});if(!r.ok){let detail=null;try{detail=await r.json()}catch{}const e=new Error(detail?.message||detail?.error||`Asset version API ${r.status}`);e.status=r.status;e.code=detail?.code||detail?.error||'API_ERROR';e.currentVersion=detail?.currentVersion;throw e}return r.json()}
    async updateRenderAssetVersion(assetId,versionId,payload){return this.request(`/staff/render-assets/${encodeURIComponent(assetId)}/versions/${encodeURIComponent(versionId)}`,{method:'PUT',body:JSON.stringify(payload)})}
    async promoteRenderAssetVersion(assetId,versionId){return this.request(`/staff/render-assets/${encodeURIComponent(assetId)}/versions/${encodeURIComponent(versionId)}/promote`,{method:'POST',body:'{}'})}
    async rejectRenderAssetVersion(assetId,versionId,note=''){return this.request(`/staff/render-assets/${encodeURIComponent(assetId)}/versions/${encodeURIComponent(versionId)}/reject`,{method:'POST',body:JSON.stringify({note})})}
    async getRenderAssetVersionDelivery(assetId,versionId){return this.request(`/staff/render-assets/${encodeURIComponent(assetId)}/versions/${encodeURIComponent(versionId)}/delivery`)}
    async getRenderAssetBinary(assetId){return this.fetcher(this.baseUrl+`/staff/render-assets/${encodeURIComponent(assetId)}/binary`,{credentials:'same-origin',headers:{...this.identityHeaders()}})}
    async listAudit(params={}){const q=new URLSearchParams();Object.entries(params).forEach(([k,v])=>{if(v!=null&&v!=='')q.set(k,String(v))});return this.request(`/staff/audit${q.toString()?`?${q}`:''}`)}
    async listRenderTelemetry(params={}){const q=new URLSearchParams();Object.entries(params).forEach(([k,v])=>{if(v!=null&&v!=='')q.set(k,String(v))});return this.request(`/staff/render-telemetry${q.toString()?`?${q}`:''}`)}
    async importSeed(bundle){return this.request('/admin/import/seed',{method:'POST',body:JSON.stringify(bundle)})}
    async getAssetVaultStatus(){return this.request('/admin/asset-vault/status')}
    async gcAssetVault(execute=false){return this.request('/admin/asset-vault/gc',{method:'POST',body:JSON.stringify({execute})})}
    async exportBackup(){return this.request('/admin/backup')}
    async restoreBackup(bundle){return this.request('/admin/backup/restore',{method:'POST',body:JSON.stringify(bundle)})}
  }
  function httpMock(){if(!window.PRO4X4_MOCK_API)throw new Error('Mock API not loaded');return new HttpAdapter('/api/v1',window.PRO4X4_MOCK_API.fetch)}
  window.PRO4X4_PERSISTENCE={schemaVersion:'0.12.0',namespace,local:new LocalAdapter(),LocalAdapter,HttpAdapter,httpMock};
})();
