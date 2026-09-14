import crypto from 'node:crypto';
import authModule from './vendor/auth.cjs';
import {SCHEMA,fail} from './store.mjs';
const {AuthBoundary}=authModule;
export function createAPI(store,{origin='http://127.0.0.1:8094',finaliserToken=null,finaliserId=null}={}){
  const auth=new AuthBoundary(store,{sessionTtlMinutes:60*24*30,secureCookies:origin.startsWith('https:'),allowPrototypeHeaders:false,allowDevLogin:false});
  const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b));
  const send=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));};
  return async function api(req,res){
    try{
      if(req.headers.host!==new URL(origin).host)fail('invalid_host',403);
      if(!['GET','POST','PATCH'].includes(req.method))fail('method_not_allowed',405);
      if(req.method!=='GET'&&req.headers.origin!==origin)fail('same_origin_required',403);
      const url=new URL(req.url,origin),parts=url.pathname.split('/').filter(Boolean);
      if(req.method==='GET'&&parts[1]==='public-shares'&&parts.length===3){send(res,200,store.resolveShare(parts[2]));return;}
      let actor;
      if(finaliserId&&finaliserToken&&equal(req.headers.authorization,'Bearer '+finaliserToken))actor={actorId:finaliserId,role:'finaliser'};
      else actor=auth.resolve(req,res).actor;
      let body={};if(req.method!=='GET'){let size=0,chunks=[];for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>100000)fail('body_too_large',413);chunks.push(Buffer.from(chunk));}try{body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}catch{fail('invalid_json');}}
      let result;
      if(req.method==='GET'&&url.pathname==='/api/session')result={actor:{id:actor.actorId,role:actor.role},schemaVersion:SCHEMA,catalogueVersion:store.catalogueVersion};
      else if(req.method==='GET'&&url.pathname==='/api/projects')result=store.list(actor);
      else if(req.method==='POST'&&url.pathname==='/api/revisions')result=store.save(body,actor);
      else if(req.method==='POST'&&url.pathname==='/api/migrations/revision')result=store.migrate(body,actor);
      else if(req.method==='POST'&&url.pathname==='/api/migrations/legacy')result=store.importLegacy(body,actor);
      else if(req.method==='GET'&&parts[1]==='projects'&&parts.length===3)result=store.getProject(parts[2],actor);
      else if(req.method==='GET'&&parts[1]==='projects'&&parts[3]==='revisions'&&parts.length===5)result=store.readRevision(parts[2],parts[4],actor);
      else if(req.method==='POST'&&url.pathname==='/api/quotes')result=store.createQuote(body,actor);
      else if(req.method==='GET'&&parts[1]==='quotes'&&parts.length===3)result=store.getQuote(parts[2],actor);
      else if(req.method==='PATCH'&&parts[1]==='quotes'&&parts.length===3)result=store.updateQuote(parts[2],body,actor);
      else if(req.method==='POST'&&parts[1]==='quotes'&&parts[3]==='finalise'&&parts.length===4)result=store.finalise(parts[2],body,actor);
      else if(req.method==='POST'&&url.pathname==='/api/shares')result=store.createShare(body,actor);
      else fail('not_found',404);
      send(res,200,result);
    }catch(e){send(res,e.status||500,{error:e.code||'server_error',message:e.code||'Server operation failed'});}
  };
}
