'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const nav=require('../customer-navigation.js');
const root=path.join(__dirname,'..');

const products=[
  {id:'a',category:'Protection',brand:'Offroad Animal'},
  {id:'b',category:'Protection',brand:'MCC 4x4'},
  {id:'c',category:'Protection',brand:'Offroad Animal'},
  {id:'d',category:'Touring',brand:'Darche'},
  {id:'e',category:null,brand:null}
];
const selected=new Set(['a','b','d']);

assert.deepEqual(nav.categoryRows(products,selected),[
  {id:'ALL',label:'ALL GEAR',count:5,selectedCount:3},
  {id:'PROTECTION',label:'PROTECTION',count:3,selectedCount:2},
  {id:'TOURING',label:'TOURING',count:1,selectedCount:1},
  {id:'OTHER',label:'OTHER',count:1,selectedCount:0}
]);
assert.deepEqual(nav.vendorRows(products,'PROTECTION',selected),[
  {id:'ALL',label:'ALL MANUFACTURERS',count:3,selectedCount:2},
  {id:'MCC 4x4',label:'MCC 4x4',count:1,selectedCount:1},
  {id:'Offroad Animal',label:'Offroad Animal',count:2,selectedCount:1}
]);
assert.equal(nav.visibleSelectionCount(products,'PROTECTION','Offroad Animal',selected),1);
assert.equal(nav.visibleSelectionCount(products,'PROTECTION','ALL',selected),2);
assert.equal(nav.visibleSelectionCount(products,'ALL','ALL',selected),3);

// Selection-aware navigation is derived only; it must not mutate catalogue records or the selected Set.
const beforeProducts=JSON.stringify(products),beforeSelected=[...selected];
nav.categoryRows(products,selected);nav.vendorRows(products,'PROTECTION',selected);nav.visibleSelectionCount(products,'ALL','ALL',selected);
assert.equal(JSON.stringify(products),beforeProducts);
assert.deepEqual([...selected],beforeSelected);


// Real governed Ranger proof: selection counts follow the current governed catalogue rather than hard-coded UI ownership.
global.window=global;
require('../data-ranger.js');
const ranger=global.RANGER_DATA.accessories;
const rangerSelected=new Set(['mcc-309bsbk','mcc-309rp']);
const rangerCategories=nav.categoryRows(ranger,rangerSelected);
assert.equal(rangerCategories.find(r=>r.id==='ALL').selectedCount,2);
assert.equal(rangerCategories.find(r=>r.id==='PROTECTION').selectedCount,2);
const rangerVendors=nav.vendorRows(ranger,'PROTECTION',rangerSelected);
assert.equal(rangerVendors.find(r=>r.id==='MCC 4x4').selectedCount,2);
assert.equal(rangerVendors.find(r=>r.id==='Offroad Animal').selectedCount,0);

const app=fs.readFileSync(path.join(root,'merged-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'merged.css'),'utf8');
assert.match(app,/categoryRows\?\.\(products\(\),state\.selected\)/,'category nav must derive selected counts from the current customer selection');
assert.match(app,/vendorRows\?\.\(products\(\),state\.category,state\.selected\)/,'manufacturer nav must derive selected counts in the current category');
assert.match(app,/visibleSelectionCount\?\.\(products\(\),state\.category,state\.vendor,state\.selected\)/,'visible product count must disclose how many items in the current view are already selected');
assert.match(app,/SELECTED IN VIEW/,'browse result header must keep selection context visible');
assert.match(app,/data-edit-product/,'every selected build row must expose an edit-in-catalogue path');
assert.match(app,/EDIT SELECTED ITEM/,'build editing must reuse the existing exact product trace path');
assert.match(css,/\.build-edit-link/,'selected-build edit control must have an explicit customer UI style');
assert.match(css,/merge-category-tabs button em/,'category selection badges must be styled');
assert.match(css,/merge-manufacturer-tabs button em/,'manufacturer selection badges must be styled');

// Existing category/vendor/product ownership remains catalogue-driven; no new catalogue write path is introduced.
assert.doesNotMatch(app,/categoryRows[\s\S]{0,160}\.push\(/,'WF1 navigation must not append catalogue records');
assert.doesNotMatch(app,/vendorRows[\s\S]{0,160}\.brand\s*=/,'WF1 navigation must not rewrite manufacturer ownership');

console.log('WF1 Alpha 26 selection-aware catalogue navigation: PASS');
