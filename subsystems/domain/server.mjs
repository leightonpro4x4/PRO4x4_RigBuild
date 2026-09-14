import {createEngine} from './engine.mjs';
// The server supplies trusted catalogue and context. Ignore submitted decisions,
// prices, approval flags, product objects and client-supplied context.
export function createValidator(catalogue) {
  const engine=createEngine(catalogue);
  return Object.freeze({validate(payload,trustedContext={}) {
    if(!Array.isArray(payload.selected)||payload.selected.some(id=>typeof id!=='string')) throw new Error('Expected identity list');
    return engine.evaluate({vehicleId:payload.vehicleId,selected:payload.selected,context:trustedContext});
  }});
}
