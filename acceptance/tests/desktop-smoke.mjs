import {resultURL} from '../support/results.mjs';
import fs from 'node:fs';
import {launchBrowser,browserLabel} from '../support/browser.mjs';
import assert from 'node:assert/strict';
const browser=await launchBrowser();
try{
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.ALPHA94_PREVIEW_URL||'http://127.0.0.1:8094/');
await page.waitForFunction(()=>document.querySelector('#runtimeGate').textContent.includes('10/10'),{},{timeout:60000});
await page.selectOption('#profile','checkpoint');
await page.click('#loadFullBuild');
assert((await page.textContent('#total')).includes('10,239'));
const state=()=>page.locator('#stage').getAttribute('data-render-state').then(JSON.parse);
let s=await state();assert(s.predator&&s.rally&&s.lights&&s.scout&&s.powerboards&&s.tubrack&&s.rearbumper&&!s.factoryFront&&!s.factoryRear);
await page.reload();await page.waitForFunction(()=>document.querySelector('#runtimeGate').textContent.includes('10/10'));assert.deepEqual(await state(),s);
await page.click('#togglePred');s=await state();assert(s.factoryFront&&!s.predator&&!s.rally&&!s.lights&&s.rearbumper);
await page.click('#toggleRearbumper');s=await state();assert(s.factoryRear&&s.factoryFront);
await page.click('#resetBuild');await page.click('#togglePred');s=await state();assert(s.predator&&s.factoryRear);
await page.click('#resetBuild');await page.click('#toggleRearbumper');s=await state();assert(s.factoryFront&&s.rearbumper);
await page.click('#front');await page.click('#threeq');
const canvas=page.locator('canvas'),box=await canvas.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+80,box.y+box.height/2+30,{steps:10});await page.mouse.up();await page.mouse.wheel(0,180);
await page.selectOption('#profile','catalogue');await page.click('#resetBuild');await page.click('#toggleRally');assert((await page.textContent('#quoteLines')).includes('oa-camera-relocation-ranger'));
await page.selectOption('#vehicle','nissan-y62-warrior-2025');s=await state();assert(Object.values(s).every(v=>!v));
await page.selectOption('#vehicle','ford-ranger-nextgen-2025');await page.selectOption('#profile','checkpoint');await page.click('#loadFullBuild');
assert.deepEqual(errors,[]);
console.log(JSON.stringify({status:'PASS',browser:browserLabel,assetLoad:'10/10',combinations:4,restoration:'PASS',persistedReload:'PASS',fullFixture:'PASS',partsTotal:10239,catalogueCameraRequirement:'PASS',y62NoFallback:'PASS',orbitZoomInputs:'PASS',pageErrors:errors,iOS:'NOT TESTED'}));
fs.writeFileSync(resultURL('browser-visual.json'),JSON.stringify({status:'PASS',browser:browserLabel,assetLoad:'10/10',replacementCombinations:4,fixtureTotalAUD:10239,persistedReload:'PASS',orbitZoomInputs:'PASS',pageErrors:errors,iOS:'NOT TESTED'},null,2));
}finally{await browser.close();}
