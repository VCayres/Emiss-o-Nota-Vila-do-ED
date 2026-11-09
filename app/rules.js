(function (root) {
  const C = typeof module === 'undefined' ? root.VilaConfig : require('./config.js');
  const F = typeof module === 'undefined' ? root.VilaFiscal : require('./classifications.js');
  const fields = ['cnae', 'ctn', 'nbs', 'issWithheld', 'amount'];
  const isService = id => C.merchants[id]?.kind === 'service';
  function cents(value) {
    const s = String(value ?? '').trim();
    if (!/^\d{1,7}([,.]\d{1,2})?$/.test(s)) return null;
    const [whole, part = ''] = s.replace(',', '.').split('.');
    const n = Number(whole) * 100 + Number(part.padEnd(2, '0'));
    return Number.isSafeInteger(n) ? n : null;
  }
  function quantity(v) { return /^[1-9]\d{0,3}$/.test(String(v)) ? Number(v) : null; }
  function money(n) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n / 100); }
  function totals(lines) {
    const subtotals = (Array.isArray(lines) ? lines : []).map(l => { const q = quantity(l?.quantity), p = cents(l?.price); return q !== null && p !== null ? q * p : 0; });
    return { subtotals, total: subtotals.reduce((a, b) => a + b, 0) };
  }
  function blank(id) {
    const m = C.merchants[id], o = m.order;
    const f = { recipient: o.recipient, destination: o.destination, description: o.description, reviewed: false };
    if (isService(id)) return { ...f, amount: (o.amount / 100).toFixed(2).replace('.', ','), cnae: '', ctn: '', nbs: '', issWithheld: '' };
    return { ...f, cnae: m.cnae, lines: o.items.map(l => ({ product: '', quantity: String(l.quantity), unit: 'UD', price: (C.products[l.product].price / 100).toFixed(2).replace('.', ',') })) };
  }
  function ctnOptions(id, f) { const m = C.merchants[id]; return isService(id) && m.cnaes.includes(f.cnae) ? m.ctns : []; }
  function nbsOptions(id, f) { return ctnOptions(id, f).includes(f.ctn) ? F.nbsByCtn[f.ctn] || [] : []; }
  function update(id, f, key, value) {
    if (key === 'reviewed') return { ...f, reviewed: value === true };
    if (!isService(id) || !fields.includes(key)) return f;
    const next = { ...f, [key]: String(value), reviewed: false };
    if (key === 'cnae') { next.ctn = ''; next.nbs = ''; }
    if (key === 'ctn') next.nbs = '';
    return next;
  }
  function updateLine(id, f, index, key, value) {
    if (isService(id) || !Number.isInteger(index) || !f.lines?.[index] || !['product', 'quantity', 'price'].includes(key)) return f;
    const lines = f.lines.map((l, i) => i === index ? { ...l, [key]: String(value) } : { ...l });
    return { ...f, lines, reviewed: false };
  }
  function clean(id, value) {
    const f = blank(id);
    if (!value || typeof value !== 'object') return f;
    f.reviewed = value.reviewed === true;
    if (!isService(id)) {
      f.lines.forEach((l, i) => ['product', 'quantity', 'price'].forEach(k => l[k] = String(value.lines?.[i]?.[k] ?? l[k]).slice(0, 20)));
      return f;
    }
    fields.forEach(k => f[k] = String(value[k] ?? f[k]).slice(0, 20));
    if (!C.merchants[id].cnaes.includes(f.cnae)) { f.cnae = ''; f.ctn = ''; f.nbs = ''; }
    if (!ctnOptions(id, f).includes(f.ctn)) { f.ctn = ''; f.nbs = ''; }
    if (!nbsOptions(id, f).includes(f.nbs)) f.nbs = '';
    return f;
  }
  function validate(id, f) {
    if (!Object.hasOwn(C.merchants, id) || !f) return { form: 'Escolha um estabelecimento.' };
    const m = C.merchants[id], errors = {};
    for (const k of ['recipient', 'destination', 'description']) if (f[k] !== m.order[k]) errors[k] = 'Mantenha os dados fictícios desta solicitação.';
    if (isService(id)) {
      const e = m.order.expected;
      if (cents(f.amount) !== m.order.amount) errors.amount = 'Confira o valor do serviço na solicitação, sem separador de milhar.';
      if (!m.cnaes.includes(f.cnae) || f.cnae !== e.cnae) errors.cnae = 'Escolha a atividade candidata de carpintaria relacionada ao processamento descrito, não montagem de móveis ou instalação de portas.';
      if (!ctnOptions(id, f).includes(f.ctn) || f.ctn !== e.ctn) errors.ctn = 'Leia o serviço contratado: processamento de madeira para tábuas. A placa do estabelecimento não muda a natureza do serviço.';
      if (!nbsOptions(id, f).includes(f.nbs) || f.nbs !== e.nbs) errors.nbs = 'Selecione a nomenclatura que abrange o serviço de carpintaria descrito.';
      if (f.issWithheld !== m.order.retention) errors.issWithheld = m.order.retentionNote;
    } else {
      if (f.cnae !== m.cnae) errors.cnae = 'Mantenha a atividade econômica de referência do estabelecimento.';
      if (!Array.isArray(f.lines) || f.lines.length !== m.order.items.length) errors.lines = 'Mantenha os itens previstos no pedido de venda.';
      else {
        const used = new Set();
        f.lines.forEach((l, i) => {
          const p = C.products[l?.product], target = m.order.items.find(x => x.product === l?.product);
          if (!m.catalog.includes(l?.product) || !target || used.has(l.product)) errors[`product-${i}`] = 'Escolha um produto do pedido, sem repetir itens. O restante do catálogo é para exploração.';
          used.add(l?.product);
          if (quantity(l?.quantity) === null || !target || Number(l.quantity) !== target.quantity) errors[`quantity-${i}`] = 'Informe a quantidade inteira do pedido, entre 1 e 9999.';
          if (!p || l.unit !== p.unit) errors[`unit-${i}`] = 'Use a unidade didática UD deste pedido.';
          if (!p || cents(l.price) !== p.price) errors[`price-${i}`] = 'Confira o preço unitário didático informado no pedido.';
        });
        if (totals(f.lines).total !== m.order.amount) errors.total = 'O total deve corresponder aos itens, quantidades e preços do pedido.';
      }
    }
    if (f.reviewed !== true) errors.reviewed = 'Confira os dados e marque a confirmação antes de emitir.';
    return errors;
  }
  function restore(saved, passed) {
    const s = { v: 3, step: 'home', merchant: '', form: null, completed: !!passed, first: null, contributions: passed ? 1 : 0, legacyCompleted: false };
    if (!saved || ![1, 2, 3].includes(saved.v)) return s;
    if (saved.v < 3) {
      if (saved.completed === true && saved.contributions === 1) { s.completed = true; s.contributions = 1; s.legacyCompleted = true; s.first = { merchant: Object.hasOwn(C.merchants, saved.first?.merchant) ? saved.first.merchant : '', legacy: true }; }
      s.step = 'choose'; return s;
    }
    if (Object.hasOwn(C.merchants, saved.merchant)) { s.merchant = saved.merchant; s.form = clean(s.merchant, saved.form); }
    try {
      if (saved.first?.legacy === true && saved.completed === true) { s.first = { merchant: Object.hasOwn(C.merchants, saved.first.merchant) ? saved.first.merchant : '', legacy: true }; s.legacyCompleted = true; }
      else if (saved.first && Object.hasOwn(C.merchants, saved.first.merchant) && !Object.keys(validate(saved.first.merchant, saved.first.form)).length) s.first = { merchant: saved.first.merchant, form: clean(saved.first.merchant, saved.first.form) };
    } catch (_) { /* Malformed snapshots do not remove an LMS approval. */ }
    s.completed = !!s.first || !!passed; s.contributions = s.completed ? 1 : 0;
    s.step = ['home', 'choose', 'form', 'receipt'].includes(saved.step) ? saved.step : 'choose';
    if (['form', 'receipt'].includes(s.step) && !s.merchant) s.step = 'choose';
    if (s.step === 'receipt' && Object.keys(validate(s.merchant, s.form)).length) s.step = 'form';
    return s;
  }
  root.VilaRules = { fields, isService, cents, quantity, money, totals, blank, clean, update, updateLine, ctnOptions, nbsOptions, validate, restore };
  if (typeof module !== 'undefined') module.exports = root.VilaRules;
})(typeof window === 'undefined' ? globalThis : window);
