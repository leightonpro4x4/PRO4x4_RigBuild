import fs from 'node:fs';
export function resultURL(name){const dir=new URL('../../.validation/results/',import.meta.url);fs.mkdirSync(dir,{recursive:true});return new URL(name,dir);}
