import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = fileURLToPath(new URL('.', import.meta.url));
export const sourceCommit = 'ebccc17ee9caf1b81834bf50a50319c7fcc21dbc';
export const identity = (vehicleId, productId) => `${vehicleId}::${productId}`;
export function loadSources() {
  const context = vm.createContext({window:{}});
  for (const file of ['data-ranger.js','data-y62.js','ranger-source-evidence.js','y62-source-evidence.js']) {
    vm.runInContext(fs.readFileSync(path.join(directory,'source-wf2',file),'utf8'), context, {timeout:1000});
  }
  return JSON.parse(JSON.stringify([
    {catalogue:context.window.RANGER_DATA,evidence:context.RANGER_SOURCE_EVIDENCE},
    {catalogue:context.window.RIG_DATA,evidence:context.Y62_SOURCE_EVIDENCE}
  ]));
}
export function normalize(sources) {
  return {
    schemaVersion:1, sourceCommit,
    identityPolicy:'Vehicle-scoped source product ID; SKU is searchable metadata, never a global primary key. Vehicle trim/series and product fitment conditions retain variant context.',
    vehicles:sources.map(({catalogue,evidence})=>{
      const {accessories,...definition}=catalogue;
      const {sources:records,...evidenceMetadata}=evidence;
      return {vehicleId:catalogue.vehicle.id,definition,evidenceMetadata,
        visualAvailability:{approvedProduction3DBase:false,approvedBaseAsset:null,classification:catalogue.vehicle.id.startsWith('nissan')?'catalogue-only; Y62 review evidence does not approve a 3D base':'Alpha93 visual checkpoint is separate from catalogue production approval'}};
    }),
    products:sources.flatMap(({catalogue})=>catalogue.accessories.map(data=>({
      identity:identity(catalogue.vehicle.id,data.id),vehicleId:catalogue.vehicle.id,
      variantContext:{trim:catalogue.vehicle.trim,series:catalogue.vehicle.series??null,bodyStyle:catalogue.vehicle.bodyStyle,drivetrain:catalogue.vehicle.drivetrain,yearRange:catalogue.vehicle.yearRange},
      sourceProductId:data.id,data
    }))),
    evidence:sources.flatMap(({catalogue,evidence})=>evidence.sources.map(data=>({identity:`${catalogue.vehicle.id}::evidence::${data.id}`,vehicleId:catalogue.vehicle.id,data})))
  };
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  fs.writeFileSync(path.join(directory,'catalogue.json'),JSON.stringify(normalize(loadSources()),null,2)+'\n');
}
