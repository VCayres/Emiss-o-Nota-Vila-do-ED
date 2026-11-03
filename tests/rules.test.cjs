const { test } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../app/config.js');
const R = require('../app/rules.js');
function filled(id) {
  const f = R.blank(id);
  f.lines = C.merchants[id].order.items.map(l => ({ product: l.product, quantity: String(l.quantity), price: (C.products[l.product].price / 100).toFixed(2), unit: 'UD' }));
  R.fiscal.fields.forEach(x => f[x.key] = x.expected); f.reviewed = true; return f;
}
for (const id of Object.keys(C.merchants)) {
  test(`${id}: blank invoice cannot pass, complete correct invoice passes`, () => {
    assert.ok(Object.keys(R.validate(id, R.blank(id))).length > 0);
    assert.deepEqual(R.validate(id, filled(id)), {});
  });
}
test('decimal arithmetic and strict lexical validation', () => {
  assert.equal(R.cents('19,75'), 1975); assert.equal(R.cents('0.10'), 10);
  for (const value of ['1e3', '-1', 'Infinity', '1,234', '1.2.3', '', '.1']) assert.equal(R.cents(value), null);
  assert.equal(R.totals([{ quantity: '3', price: '0,10' }]).total, 30);
  for (const value of ['0', '-1', '1.5', '01', '1e2', '10000']) assert.equal(R.quantity(value), null);
});
test('all required fields, price, unit and recipient are validated independently', () => {
  const checks = [
    [f => f.lines[0].quantity = '11', 'quantity-0'],
    [f => f.lines[0].price = '19,76', 'price-0'],
    [f => f.lines[0].unit = 'm3', 'unit-0'],
    [f => f.recipient = 'real person', 'recipient'],
    [f => f.destination = '', 'destination'],
    [f => f.ibs = 'federal', 'ibs'],
    [f => f.cbs = 'estadual-municipal', 'cbs'],
    [f => f.operation = 'doacao', 'operation'],
    [f => f.reviewed = false, 'reviewed'],
  ];
  checks.forEach(([change, key]) => { const f = filled('bene'); change(f); assert.ok(R.validate('bene', f)[key], key); });
});
test('catalog full, fictional products never qualify as an evaluated order', () => {
  assert.equal(C.merchants.ze.catalog.length, 7);
  for (const product of ['pocao', 'ervas', 'madeira', 'pedra', 'tangerina']) {
    const f = filled('ze'); f.lines[0].product = product;
    assert.ok(R.validate('ze', f)['product-0']);
  }
  const f = filled('tina'); f.lines[0].product = 'tabua'; assert.ok(R.validate('tina', f)['product-0']);
});
test('duplicate or missing order lines rejected, order itself may be rearranged', () => {
  const f = filled('ze'); f.lines.reverse(); assert.deepEqual(R.validate('ze', f), {});
  f.lines[1] = {...f.lines[0]}; assert.ok(R.validate('ze', f)['product-1']);
  f.lines.pop(); assert.ok(R.validate('ze', f).lines);
});
test('commercial totals match scenario configuration', () => {
  assert.equal(R.totals(filled('ze').lines).total, 23250);
  assert.equal(R.totals(filled('tina').lines).total, 22800);
  assert.equal(R.totals(filled('bene').lines).total, 19750);
});
module.exports = { filled };
