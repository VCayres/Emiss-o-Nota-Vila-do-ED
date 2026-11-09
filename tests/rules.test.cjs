const {test} = require('node:test');
const assert = require('node:assert/strict');
const C = require('../app/config.js');
const F = require('../app/classifications.js');
const R = require('../app/rules.js');
function filled(id) { const f=R.blank(id); Object.assign(f,C.merchants[id].order.expected,{issWithheld:C.merchants[id].order.retention,reviewed:true}); return f; }
for(const id of Object.keys(C.merchants)) {
  test(`${id}: fixed client, description and price; empty classifications fail and correct scenario passes`,()=>{
    const f=R.blank(id),o=C.merchants[id].order;
    assert.equal(f.recipient,o.recipient);assert.equal(f.description,o.description);assert.equal(R.cents(f.amount),o.amount);
    assert.ok(Object.keys(R.validate(id,f)).length>=6);assert.deepEqual(R.validate(id,filled(id)),{});
  });
}
test('decimal precision and invalid money formats',()=>{
  assert.equal(R.cents('19,75'),1975);assert.equal(R.cents('1800.00'),180000);assert.equal(R.cents('0,10')*3,30);
  for(const x of ['1e3','-1','1.234,56','1,234','','Infinity','.1']) assert.equal(R.cents(x),null);
});
test('classifications outside the merchant or request cannot emit',()=>{
  const f=filled('ze');f.cnae='4399199';assert.ok(R.validate('ze',f).cnae);
  f.cnae='5212500';f.ctn='070202';assert.ok(R.validate('ze',f).ctn);
  f.ctn='110402';f.nbs='106011000';assert.ok(R.validate('ze',f).nbs);
  f.nbs='999999999';assert.ok(R.validate('ze',f).nbs);
});
test('CNAE→CTN→NBS dependencies reset downstream selections and preserve fixed contract/value',()=>{
  let f=filled('ze');f=R.update('ze',f,'cnae','5211799');assert.equal(f.ctn,'');assert.equal(f.nbs,'');assert.equal(f.amount,'250,00');assert.equal(f.reviewed,false);
  f=R.update('ze',f,'ctn','110401');assert.deepEqual(R.nbsOptions('ze',f),['106029000','106021000']);
  f=R.update('ze',f,'nbs','106029000');f=R.update('ze',f,'ctn','110402');assert.equal(f.nbs,'');assert.ok(!R.nbsOptions('ze',f).includes('106029000'));
  assert.deepEqual(R.ctnOptions('ze',R.blank('ze')),[]);assert.deepEqual(R.nbsOptions('ze',R.blank('ze')),[]);
});
test('CST change resets class and incompatible class is rejected',()=>{
  let f=filled('tina');f=R.update('tina',f,'cst','000');assert.equal(f.classTrib,'');assert.deepEqual(R.classOptions(f),['000001']);
  f.classTrib='200046';assert.ok(R.validate('tina',f).classTrib);f=filled('tina');f.classTrib='200045';assert.ok(R.validate('tina',f).classTrib);
});
test('retention is scenario-specific, not a property assigned to CNAE',()=>{
  for(const id of ['ze','tina','bene']){const f=filled(id);f.issWithheld=f.issWithheld==='sim'?'nao':'sim';assert.ok(R.validate(id,f).issWithheld);}
  assert.equal(C.merchants.tina.order.retention,'sim');assert.equal(C.merchants.ze.order.retention,'nao');
});
test('value, fixed contract fields and final confirmation are independently validated',()=>{
  for(const [key,value] of [['amount','0'],['amount','250,01'],['recipient','Other client'],['description','Other service'],['destination','Other place'],['reviewed',false]]){
    const f=filled('ze');f[key]=value;assert.ok(R.validate('ze',f)[key],key);
  }
});
test('resume sanitizes fixed data and impossible dependent codes',()=>{
  const f=filled('ze');f.recipient='<script>bad</script>';f.ctn='070202';f.nbs='101054000';const clean=R.clean('ze',f);
  assert.equal(clean.recipient,C.merchants.ze.order.recipient);assert.equal(clean.ctn,'');assert.equal(clean.nbs,'');
});
test('v2 resume keeps a validated first contribution, and rejects a forged receipt',()=>{
  const f=filled('ze'),saved={v:2,step:'receipt',merchant:'ze',form:f,first:{merchant:'ze',form:f},completed:true,contributions:1};
  let s=R.restore(saved,false);assert.equal(s.step,'receipt');assert.equal(s.completed,true);assert.equal(s.contributions,1);
  saved.form={...f,ctn:'070202'};s=R.restore(saved,false);assert.equal(s.step,'form');assert.equal(s.completed,true);
});
test('previous version approval survives migration and subsequent reentry',()=>{
  let s=R.restore({v:1,completed:true,contributions:1,first:{merchant:'bene',form:{}}},false);
  assert.equal(s.v,2);assert.equal(s.completed,true);assert.equal(s.legacyCompleted,true);assert.equal(s.contributions,1);
  s=R.restore(s,false);assert.equal(s.completed,true);assert.equal(s.first.legacy,true);
  s=R.restore({v:1,completed:false,contributions:0},false);assert.equal(s.completed,false);
});
test('malformed suspend data never overrides LMS approval or crashes',()=>{
  for(const bad of [null,{},[],{v:2,merchant:'__proto__',first:{merchant:'constructor'}},{v:2,merchant:'ze',form:null,step:'receipt'}]){
    const s=R.restore(bad,true);assert.equal(s.completed,true);assert.equal(s.contributions,1);
  }
});
test('candidate provenance is explicit and original products are not relabeled as services',()=>{
  assert.equal(F.officialVerified,false);assert.equal(C.originalCatalog.length,7);assert.ok(C.originalCatalog.includes('Poção de Cura Menor'));
  const evidence=require('../docs/evidencias/candidatos-nfse.json');
  for(const m of Object.values(C.merchants)){
    const e=m.order.expected,code=F.nbs[e.nbs][0];assert.ok(evidence.correlacoes.some(row=>row.nbs===code));
    assert.ok(Object.values(evidence.cnaes).flat().some(row=>row.c===F.cnaes[e.cnae][0]));
  }
});
module.exports={filled};
