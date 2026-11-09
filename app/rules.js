(function (root) {
  const C = typeof module === 'undefined' ? root.VilaConfig : require('./config.js');
  const F = typeof module === 'undefined' ? root.VilaFiscal : require('./classifications.js');
  const fields = ['cnae', 'ctn', 'nbs', 'cst', 'classTrib', 'issWithheld', 'amount'];
  function cents(value) {
    const s = String(value ?? '').trim();
    if (!/^\d{1,7}([,.]\d{1,2})?$/.test(s)) return null;
    const [whole, part = ''] = s.replace(',', '.').split('.');
    const n = Number(whole) * 100 + Number(part.padEnd(2, '0'));
    return Number.isSafeInteger(n) ? n : null;
  }
  function money(n) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n / 100); }
  function blank(id) {
    const o = C.merchants[id].order;
    return { recipient: o.recipient, destination: o.destination, description: o.description, amount: (o.amount / 100).toFixed(2).replace('.', ','), cnae: '', ctn: '', nbs: '', cst: '', classTrib: '', issWithheld: '', reviewed: false };
  }
  function ctnOptions(id, f) { const m = C.merchants[id]; return m && m.cnaes.includes(f.cnae) ? m.ctns : []; }
  function nbsOptions(id, f) { return ctnOptions(id, f).includes(f.ctn) ? F.nbsByCtn[f.ctn] || [] : []; }
  function classOptions(f) { return Object.keys(F.classes).filter(id => F.classes[id].cst === f.cst); }
  function update(id, f, key, value) {
    if (!fields.includes(key) && key !== 'reviewed') return f;
    const next = { ...f, [key]: key === 'reviewed' ? value === true : String(value) };
    if (key !== 'reviewed') next.reviewed = false;
    if (key === 'cnae') { next.ctn = ''; next.nbs = ''; }
    if (key === 'ctn') next.nbs = '';
    if (key === 'cst') next.classTrib = '';
    return next;
  }
  function clean(id, value) {
    const f = blank(id);
    if (!value || typeof value !== 'object') return f;
    fields.forEach(k => f[k] = String(value[k] ?? f[k]).slice(0, 20)); f.reviewed = value.reviewed === true;
    if (!C.merchants[id].cnaes.includes(f.cnae)) { f.cnae = ''; f.ctn = ''; f.nbs = ''; }
    if (!ctnOptions(id, f).includes(f.ctn)) { f.ctn = ''; f.nbs = ''; }
    if (!nbsOptions(id, f).includes(f.nbs)) f.nbs = '';
    if (!classOptions(f).includes(f.classTrib)) f.classTrib = '';
    return f;
  }
  function validate(id, f) {
    if (!Object.hasOwn(C.merchants, id) || !f) return { form: 'Escolha um prestador.' };
    const m = C.merchants[id], e = m.order.expected, errors = {};
    for (const k of ['recipient', 'destination', 'description']) if (f[k] !== m.order[k]) errors[k] = 'Mantenha os dados fictícios pré-preenchidos deste contrato.';
    if (cents(f.amount) === null || cents(f.amount) <= 0 || cents(f.amount) !== m.order.amount) errors.amount = 'Use o valor contratado da solicitação, sem separador de milhar.';
    if (!m.cnaes.includes(f.cnae) || f.cnae !== e.cnae) errors.cnae = 'Escolha a atividade correspondente ao serviço descrito, e não apenas ao nome do estabelecimento.';
    if (!ctnOptions(id, f).includes(f.ctn) || f.ctn !== e.ctn) errors.ctn = id === 'tina' ? 'O contrato é de execução por empreitada, não de administração de obra.' : id === 'ze' ? 'O contrato descreve carga, descarga e arrumação, sem armazenagem cobrada.' : 'O serviço é de serralheria em peças metálicas, não de carpintaria.';
    if (!nbsOptions(id, f).includes(f.nbs) || f.nbs !== e.nbs) errors.nbs = 'Confira a discriminação: a NBS deve corresponder ao serviço contratado.';
    if (f.cst !== e.cst) errors.cst = 'Confira o tratamento IBS/CBS proposto para este contrato na orientação do pedido. Ele não é igual para todos os serviços.';
    if (!classOptions(f).includes(f.classTrib) || f.classTrib !== e.classTrib) errors.classTrib = 'Escolha a classificação indicada para as condições do cenário. Reconstruir a vila não concede automaticamente benefício fiscal de reabilitação urbana.';
    if (f.issWithheld !== m.order.retention) errors.issWithheld = m.order.retentionNote;
    if (f.reviewed !== true) errors.reviewed = 'Confira o valor, os códigos e a retenção e marque a confirmação.';
    return errors;
  }
  function restore(saved, passed) {
    const s = { v: 2, step: 'home', merchant: '', form: null, completed: !!passed, first: null, contributions: passed ? 1 : 0, legacyCompleted: false };
    if (!saved || ![1, 2].includes(saved.v)) return s;
    if (saved.v === 1) {
      if (saved.completed === true && saved.contributions === 1) { s.completed = true; s.contributions = 1; s.legacyCompleted = true; s.first = { merchant: Object.hasOwn(C.merchants, saved.first?.merchant) ? saved.first.merchant : '', legacy: true }; }
      s.step = 'choose'; return s;
    }
    if (Object.hasOwn(C.merchants, saved.merchant)) { s.merchant = saved.merchant; s.form = clean(s.merchant, saved.form); }
    try {
      if (saved.first?.legacy === true && saved.completed === true) { s.first = { merchant: Object.hasOwn(C.merchants, saved.first.merchant) ? saved.first.merchant : '', legacy: true }; s.legacyCompleted = true; }
      else if (saved.first && Object.hasOwn(C.merchants, saved.first.merchant) && !Object.keys(validate(saved.first.merchant, saved.first.form)).length) s.first = { merchant: saved.first.merchant, form: clean(saved.first.merchant, saved.first.form) };
    } catch (_) { /* Invalid snapshots cannot remove an LMS approval. */ }
    s.completed = !!s.first || !!passed; s.contributions = s.completed ? 1 : 0;
    s.step = ['home', 'choose', 'form', 'receipt'].includes(saved.step) ? saved.step : 'choose';
    if (['form', 'receipt'].includes(s.step) && !s.merchant) s.step = 'choose';
    if (s.step === 'receipt' && Object.keys(validate(s.merchant, s.form)).length) s.step = 'form';
    return s;
  }
  root.VilaRules = { fields, cents, money, blank, clean, update, ctnOptions, nbsOptions, classOptions, validate, restore };
  if (typeof module !== 'undefined') module.exports = root.VilaRules;
})(typeof window === 'undefined' ? globalThis : window);
