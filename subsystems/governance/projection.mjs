import {hash} from './registry.mjs';
// Public projection intentionally excludes references, candidate binaries, reviewers and registries.
export function publicProjection(registry,baseline,assets){
  const counts=registry.counts();
  if(counts.production!==0)throw Error('New production visuals require an explicit runtime integration and approval projection');
  return {schemaVersion:'alpha94-visual-policy-v1',basisSha256:hash(baseline),
    ranger:{vehicleId:'ford-ranger-nextgen-2025',state:'preview',productionApproved:false,assets:assets.map(a=>({file:a.file,sha256:a.sha256,state:'preview'}))},
    y62:{vehicleId:'nissan-y62-warrior-2025',state:'blocked',baseState:'unavailable',productionApproved:false,productionCount:0,fallback:'none',views:{front34:'blocked-upstream',side:'source-gap-calibration',rear34:'master-draft-camera-unmatched-reconstruction-failed'}}};
}
