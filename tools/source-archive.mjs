import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function sourceArchive(branch){
  const m=JSON.parse(fs.readFileSync(new URL('../consolidation/manifest.json',import.meta.url)));
  const source=m.sources.find(s=>s.branch===branch),zip=fs.readFileSync(new URL('../'+source.archive,import.meta.url));
  if(sha(zip)!==source.archiveSha256)throw Error('Frozen archive mismatch');
  let end=zip.length-22;while(end>=0&&zip.readUInt32LE(end)!==0x06054b50)end--;
  const out=new Map();let p=zip.readUInt32LE(end+16);
  for(let i=0;i<zip.readUInt16LE(end+10);i++){
    const n=zip.readUInt16LE(p+28),x=zip.readUInt16LE(p+30),c=zip.readUInt16LE(p+32),l=zip.readUInt32LE(p+42),name=zip.toString('utf8',p+46,p+46+n);
    const start=l+30+zip.readUInt16LE(l+26)+zip.readUInt16LE(l+28),bytes=zip.subarray(start,start+zip.readUInt32LE(p+20));
    if(!name.endsWith('/'))out.set(name,zip.readUInt16LE(p+10)===8?zlib.inflateRawSync(bytes):bytes);p+=46+n+x+c;
  }
  for(const f of source.files)if(sha(out.get(f.path))!==f.sha256)throw Error('Source mismatch '+f.path);
  return out;
}
