import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { handle } from '../../tools/serve.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const read = p => fs.readFileSync(path.join(root, p));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const manifest = JSON.parse(read('consolidation/manifest.json'));
let sourceCount = 0;
// Read ZIP central directory; verify uncompressed bytes against SHA-256 AND Git blob IDs.
function entries(zip) {
  let end = zip.length - 22;
  while (end >= Math.max(0, zip.length - 65557) && zip.readUInt32LE(end) !== 0x06054b50) end--;
  assert(end >= 0, 'ZIP end record');
  const count = zip.readUInt16LE(end + 10), result = new Map();
  let cursor = zip.readUInt32LE(end + 16);
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(cursor), 0x02014b50);
    const method = zip.readUInt16LE(cursor + 10), size = zip.readUInt32LE(cursor + 20);
    const nameSize = zip.readUInt16LE(cursor + 28), extra = zip.readUInt16LE(cursor + 30), comment = zip.readUInt16LE(cursor + 32);
    const local = zip.readUInt32LE(cursor + 42), name = zip.toString('utf8', cursor + 46, cursor + 46 + nameSize);
    const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    if (!name.endsWith('/')) {
      assert([0, 8].includes(method));
      const compressed = zip.subarray(start, start + size);
      result.set(name, method === 8 ? zlib.inflateRawSync(compressed) : compressed);
    }
    cursor += 46 + nameSize + extra + comment;
  }
  return result;
}
for (const source of manifest.sources) {
  const archive = read(source.archive);
  assert.equal(hash(archive), source.archiveSha256, source.archive);
  const files = entries(archive);
  assert.equal(files.size, source.files.length);
  for (const item of source.files) {
    const bytes = files.get(item.path);
    assert(bytes, item.path); assert.equal(bytes.length, item.bytes);
    assert.equal(hash(bytes), item.sha256, `${source.branch}:${item.path}`);
    assert.equal(crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), item.gitBlob, `${source.branch}:${item.path}`);
    sourceCount++;
  }
}
for (const item of manifest.alpha93Relocations) assert.equal(hash(read(item.destination)), item.sha256, item.destination);
const files = fs.readdirSync(path.join(root, 'public'));
assert.deepEqual(files.filter(f => f.endsWith('.html')), ['index.html']);
assert.equal(files.length, 11);
for (const asset of manifest.activeApplication.requiredAssets) {
  const bytes = read('public/' + asset.file);
  assert.equal(hash(bytes), asset.sha256); assert.equal(bytes.length, asset.bytes);
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF'); assert.equal(bytes.readUInt32LE(8), bytes.length);
}
const html = read('public/index.html').toString('utf8');
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const importMap = JSON.parse(scripts.find(s => s[1].includes('importmap'))[2]);
assert.equal(importMap.imports.three, 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
for (const [, attributes, body] of scripts) {
  if (attributes.includes('importmap')) continue;
  if (attributes.includes('module')) {
    const module = new vm.SourceTextModule(body);
    for (const specifier of module.dependencySpecifiers) {
      const prefix = Object.keys(importMap.imports).find(p => specifier === p || (p.endsWith('/') && specifier.startsWith(p)));
      assert(prefix, `Unresolved import ${specifier}`);
      assert.equal(new URL(importMap.imports[prefix] + (prefix.endsWith('/') ? specifier.slice(prefix.length) : '')).protocol, 'https:');
    }
  } else new vm.Script(body);
}
for (const [, asset] of html.matchAll(/['"]([^'"\s]+\.glb)['"]/g)) assert(files.includes(asset), `Missing ${asset}`);
// Exercise the actual serving boundary without requiring sandbox socket privileges.
for (const [url, expected] of [['/',200],['/predator.glb',200],['/evidence/archive/snapshots/wf3.zip',404],['/wf3_run56/index.html',404],['/pro4x4-rig-builder-alpha26/index.html',404],['/pro4x4-rig-builder-alpha26-wf5-push27/index.html',404],['/../package.json',404]]) {
  let status;
  await handle({url,method:'GET'}, {writeHead(s){status=s;},end(){}});
  assert.equal(status,expected,url);
}
console.log(JSON.stringify({status:'PASS',sourceFilesVerified:sourceCount,snapshots:manifest.sources.length,alpha93FilesPreserved:manifest.alpha93Relocations.length,alpha93GlbsPreserved:manifest.alpha93Relocations.filter(f=>f.source.endsWith('.glb')).length,liveGlbs:10,activeEntrypoints:1,inlineJavaScriptSyntax:'PASS',imports:'resolved through unchanged pinned import map; remote CDN availability not a local test',archiveAndNestedApps:'not served',y62Promoted:false},null,2));
