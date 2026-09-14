const assert=require('node:assert/strict');
const fs=require('node:fs');
const nav=require('../customer-navigation.js');

const products=[
  {id:'a',category:'Protection',brand:'Offroad Animal'},
  {id:'b',category:'Protection',brand:'MCC 4x4'},
  {id:'c',category:'Protection',brand:'Offroad Animal'},
  {id:'d',category:'Touring',brand:'Darche'},
  {id:'e',category:null,brand:null}
];
assert.deepEqual(nav.categories(products),['ALL','PROTECTION','TOURING','OTHER']);
assert.deepEqual(nav.vendors(products,'PROTECTION'),[
  {id:'ALL',label:'ALL MANUFACTURERS',count:3},
  {id:'MCC 4x4',label:'MCC 4x4',count:1},
  {id:'Offroad Animal',label:'Offroad Animal',count:2}
]);
assert.deepEqual(nav.visibleProducts(products,'PROTECTION','Offroad Animal').map(p=>p.id),['a','c']);
assert.equal(nav.validVendor(products,'TOURING','Offroad Animal'),'ALL');
assert.equal(nav.validVendor(products,'PROTECTION','Offroad Animal'),'Offroad Animal');
assert.deepEqual(nav.path('PROTECTION','Offroad Animal'),['ALL GEAR','PROTECTION','Offroad Animal']);
assert.deepEqual(nav.path('ALL','ALL'),['ALL GEAR']);


// Integration against the governed Ranger slice: navigation derives from catalogue data and never owns it.
global.window=global;
require('../data-ranger.js');
const ranger=global.RANGER_DATA.accessories;
assert.equal(nav.visibleProducts(ranger,'ALL','ALL').length,ranger.length);
for(const category of nav.categories(ranger)){
  const scoped=nav.visibleProducts(ranger,category,'ALL');
  const vendorRows=nav.vendors(ranger,category);
  assert.equal(vendorRows[0].count,scoped.length);
  assert.equal(vendorRows.slice(1).reduce((n,row)=>n+row.count,0),scoped.length);
}

const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const app=fs.readFileSync(require.resolve('../merged-app.js'),'utf8');
assert.match(html,/id="manufacturerTabs"/);
assert.match(html,/id="cataloguePath"/);
assert.match(html,/id="resetCataloguePath"/);
assert.ok(html.indexOf('customer-navigation.js')<html.indexOf('merged-app.js'),'navigation contract must load before customer app');
assert.match(app,/state\.vendor='ALL'/);
assert.match(app,/visibleProducts\?\.\(products\(\),state\.category,state\.vendor\)/);
assert.match(app,/validVendor\?\.\(products\(\),state\.category,state\.vendor\)/);
assert.match(app,/state\.category=c;state\.vendor='ALL'/);
assert.match(app,/state\.vendor=v\.id/);
assert.match(app,/state\.category='ALL';state\.vendor='ALL';(?:state\.focusProductId=null;)?renderCategories\(\);renderManufacturers\(\);renderProducts\(\)/);

console.log('WF1 Alpha 26 catalogue browse path: PASS');
