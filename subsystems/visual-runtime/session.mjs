import {createEngine} from '../domain/engine.mjs';
import {alpha93FixtureCatalogue} from '../domain/fixture.mjs';
import {eligibility} from '../visual-eligibility/adapter.mjs';
export function createSession({catalogue,fixture,mapping,profile='catalogue',vehicleId=mapping.vehicleId}) {
  if(!['catalogue','checkpoint'].includes(profile))throw new Error('Unknown profile');
  if(profile==='checkpoint')vehicleId='alpha93-regression-only';
  const engine=createEngine(profile==='checkpoint'?alpha93FixtureCatalogue(fixture):catalogue);
  let selected=[];
  function current(){const decision=engine.evaluate({vehicleId,selected});return {decision,render:eligibility({decision,mapping,profile})};}
  return {
    current,
    change(action){const result=engine.transition({vehicleId,selected,action});selected=result.selected;return {...current(),transition:result};},
    reset(){selected=[];return current();},
    serialize(){return JSON.stringify({schemaVersion:1,profile,vehicleId,selected});},
    restore(text){try{const saved=JSON.parse(text);if(saved.schemaVersion!==1||saved.profile!==profile||saved.vehicleId!==vehicleId||!Array.isArray(saved.selected)||saved.selected.some(id=>typeof id!=='string'))throw new Error('Invalid saved selection');selected=[...saved.selected];}catch{selected=[];}return current();}
  };
}
