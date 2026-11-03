/* Recorte conceitual demonstrativo: não determina enquadramento ou tributo devido. */
(function (root) {
  const config = typeof module === 'undefined' ? root.VilaConfig : require('./config.js');
  const fiscal = {
    id: 'conceitual-sem-apuracao-v1',
    label: 'Venda didática de mercadorias • sem apuração fiscal',
    notice: 'Parâmetros demonstrativos. NCM, CFOP, CST, cClassTrib e alíquotas não foram atribuídos. Revisão fiscal necessária antes do uso como orientação profissional.',
    fields: [
      { key: 'operation', label: 'Natureza da operação didática', expected: 'venda', options: [['venda', 'Venda de mercadorias'], ['doacao', 'Doação de mercadorias']], help: 'O pedido tem quantidades e preços: trata-se de uma venda.' },
      { key: 'ibs', label: 'IBS: esfera de competência', expected: 'estadual-municipal', options: [['estadual-municipal', 'Compartilhada: estados e municípios'], ['federal', 'Federal']], help: 'IBS reúne a participação de estados e municípios neste recorte conceitual.' },
      { key: 'cbs', label: 'CBS: esfera de competência', expected: 'federal', options: [['estadual-municipal', 'Compartilhada: estados e municípios'], ['federal', 'Federal']], help: 'CBS é a contribuição da esfera federal neste recorte.' }
    ]
  };
  function cents(value) {
    const s = String(value ?? '').trim();
    if (!/^\d{1,7}([,.]\d{1,2})?$/.test(s)) return null;
    const [whole, part = ''] = s.replace(',', '.').split('.');
    const n = Number(whole) * 100 + Number(part.padEnd(2, '0'));
    return Number.isSafeInteger(n) ? n : null;
  }
  function quantity(value) { return /^[1-9]\d{0,3}$/.test(String(value)) ? Number(value) : null; }
  function money(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100); }
  function totals(lines) {
    const subtotals = lines.map(l => { const q = quantity(l.quantity), p = cents(l.price); return q !== null && p !== null ? q * p : 0; });
    return { subtotals, total: subtotals.reduce((a, b) => a + b, 0) };
  }
  function blank(id) {
    return { recipient: config.merchants[id].order.recipient, destination: config.merchants[id].order.destination,
      lines: config.merchants[id].order.items.map(() => ({ product: '', quantity: '', unit: '', price: '' })), operation: '', ibs: '', cbs: '', reviewed: false };
  }
  function validate(id, form) {
    const m = config.merchants[id], errors = {};
    if (!m || !form) return { form: 'Escolha um estabelecimento e preencha a nota.' };
    for (const key of ['recipient', 'destination']) if (form[key] !== m.order[key]) errors[key] = 'Use o destinatário e o local fictícios deste pedido.';
    if (!Array.isArray(form.lines) || form.lines.length !== m.order.items.length) return { lines: 'Use exatamente os itens do pedido.' };
    const used = new Set();
    form.lines.forEach((line, i) => {
      const p = config.products[line.product], target = m.order.items.find(x => x.product === line.product);
      if (!m.catalog.includes(line.product) || !target || used.has(line.product)) errors[`product-${i}`] = 'Selecione um produto do pedido, sem repetir itens. Outros itens do catálogo são apenas para exploração.';
      used.add(line.product);
      if (quantity(line.quantity) === null || !target || Number(line.quantity) !== target.quantity) errors[`quantity-${i}`] = 'Informe a quantidade inteira indicada no pedido, entre 1 e 9999.';
      if (!p || line.unit !== p.unit) errors[`unit-${i}`] = 'Selecione UD, a unidade didática deste pedido.';
      if (!p || cents(line.price) !== p.price) errors[`price-${i}`] = 'Confira o preço unitário no pedido. Use vírgula ou ponto, com até duas casas decimais.';
    });
    fiscal.fields.forEach(f => { if (form[f.key] !== f.expected) errors[f.key] = f.help; });
    const expected = m.order.items.reduce((n, l) => n + l.quantity * config.products[l.product].price, 0);
    if (totals(form.lines).total !== expected) errors.total = 'O total deve corresponder à soma dos itens e valores do pedido.';
    if (!form.reviewed) errors.reviewed = 'Confira os totais e marque a confirmação antes de emitir.';
    return errors;
  }
  root.VilaRules = { fiscal, cents, quantity, money, totals, blank, validate };
  if (typeof module !== 'undefined') module.exports = root.VilaRules;
})(typeof window === 'undefined' ? globalThis : window);
