import path from 'node:path';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
// Run the complete prior desktop visual regression before project workflow smoke.
await import('./desktop-smoke.mjs');
const {chromium}=await import(pathToFileURL(path.resolve(path.dirname(process.execPath),'../node_modules/playwright/index.mjs')).href);
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',d=>d.accept());
 await page.goto(process.env.ALPHA94_PREVIEW_URL||'http://127.0.0.1:8094/');
 await page.waitForFunction(()=>document.querySelector('#runtimeGate').textContent.includes('10/10'));
 await page.click('#togglePred');
 assert(await page.locator('#quote').isDisabled());
 await page.click('#saveProject');
 await page.waitForFunction(()=>document.querySelector('#projectState').textContent.includes('R000001')&&document.querySelector('#projectState').textContent.includes('SAVED'));
 const pointer=await page.evaluate(()=>JSON.parse(localStorage.getItem('p4x4-a94-server-pointer')));
 const before=await page.locator('#stage').getAttribute('data-render-state');
 await page.reload();await page.waitForFunction(()=>document.querySelector('#runtimeGate').textContent.includes('10/10'));
 assert.equal(await page.locator('#stage').getAttribute('data-render-state'),before);
 assert((await page.textContent('#projectState')).includes(pointer.revisionId));
 await page.click('#toggleScout');assert((await page.textContent('#projectState')).includes('UNSAVED CHANGES'));assert(await page.locator('#quote').isDisabled());
 await page.click('#saveProject');await page.waitForFunction(()=>document.querySelector('#projectState').textContent.includes('R000002'));
 await page.selectOption('#revisionList','R000001');await page.click('#loadRevision');await page.waitForFunction(()=>document.querySelector('#projectState').textContent.includes('R000001'));
 await page.fill('#name','Desktop QA');await page.click('#quote');await page.waitForFunction(()=>document.querySelector('#result').textContent.includes('SERVER QUOTE'));
 assert((await page.textContent('#result')).includes('review / pricing required'));
 await page.click('#shareRevision');await page.waitForFunction(()=>document.querySelector('#projectReceipt').textContent.includes('/api/public-shares/'));
 const shareURL=(await page.textContent('#projectReceipt')).split('Pinned revision link: ')[1];
 const shared=await (await page.request.get(shareURL)).json();assert.equal(shared.revision.revisionId,'R000001');assert(!JSON.stringify(shared).includes('R000002'));assert(!Object.hasOwn(shared,'project'));assert(!Object.hasOwn(shared.revision,'ownerId'));
 assert.deepEqual(errors,[]);
 const result={status:'PASS',browser:'Edge desktop headless',visualRegression:'PASS',projectSaveReload:'PASS',dirtyQuoteGuard:'PASS',immutableRevisionNavigation:'PASS',quoteHandoff:'PASS / review required',publicShareIsolation:'PASS',pageErrors:errors,iOS:'NOT TESTED'};
 fs.writeFileSync(new URL('../../consolidation/STAGE_6_DESKTOP.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}
