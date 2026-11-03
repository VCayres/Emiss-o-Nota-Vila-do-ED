(() => {
  'use strict';
  const C = window.VilaConfig, R = window.VilaRules, bridge = new window.VilaScorm.Bridge();
  const main = document.querySelector('main');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
  let state = { v: 1, step: 'home', merchant: '', form: null, completed: false, first: null, contributions: 0 };
  let errors = {}, saveTimer;
  function cleanForm(id, value) {
    const f = R.blank(id);
    if (!value || typeof value !== 'object') return f;
    ['operation', 'ibs', 'cbs'].forEach(k => f[k] = String(value[k] || '').slice(0, 40));
    f.reviewed = value.reviewed === true;
    f.lines.forEach((line, i) => ['product', 'quantity', 'unit', 'price'].forEach(k => line[k] = String(value.lines?.[i]?.[k] || '').slice(0, 20)));
    return f;
  }
  function validSnapshot(snapshot) {
    try { return snapshot && Object.hasOwn(C.merchants, snapshot.merchant) && !Object.keys(R.validate(snapshot.merchant, snapshot.form)).length; }
    catch (_) { return false; }
  }
  const loaded = bridge.init();
  if (loaded?.v === 1) {
    if (Object.hasOwn(C.merchants, loaded.merchant)) { state.merchant = loaded.merchant; state.form = cleanForm(loaded.merchant, loaded.form); }
    if (validSnapshot(loaded.first)) state.first = { merchant: loaded.first.merchant, form: cleanForm(loaded.first.merchant, loaded.first.form) };
    state.completed = !!state.first || bridge.passed;
    state.contributions = state.completed ? 1 : 0;
    state.step = ['home', 'choose', 'form', 'receipt', 'end'].includes(loaded.step) ? loaded.step : 'home';
    if (['form', 'receipt'].includes(state.step) && !state.merchant) state.step = 'choose';
    if (state.step === 'receipt' && Object.keys(R.validate(state.merchant, state.form)).length) state.step = 'form';
    if (state.step === 'end') state.step = 'choose';
  }
  if (bridge.passed) { state.completed = true; state.contributions = 1; }
  function syncNotice() {
    const box = document.querySelector('#sync'); box.replaceChildren();
    if (bridge.error) {
      const span = document.createElement('span'); span.textContent = bridge.error; box.append(span);
      const button = document.createElement('button'); button.textContent = 'Tentar salvar novamente'; button.type = 'button';
      button.onclick = () => { save(); }; box.append(button);
    }
    document.querySelector('#achievement').textContent = state.completed ? '✓ Contribuição concluída nesta tentativa' : 'Uma emissão correta conclui a atividade';
  }
  function save() { clearTimeout(saveTimer); const result = bridge.save(state); syncNotice(); return result; }
  function heading(eyebrow, title, intro = '') { return `<p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${intro ? `<p class="intro">${intro}</p>` : ''}`; }
  function progress(current) { return `<nav class="steps" aria-label="Etapas">${['Escolher', 'Preparar a nota', 'Emissão'].map((x, i) => `<span ${i === current ? 'aria-current="step"' : ''}><b>${i + 1}</b>${x}</span>`).join('')}</nav>`; }
  function ed(text) { return `<aside class="ed-help"><span class="ed-dot" aria-hidden="true">ED</span><p><strong>Uma dica do Ed</strong>${text}</p></aside>`; }
  function home() {
    return `<section class="hero"><div class="hero-copy"><p class="eyebrow">SEMANA TRIBUTÁRIA 2026 · EXPERIÊNCIA INTERATIVA</p><h1>A reconstrução<br>começa com<br><em>uma boa emissão.</em></h1><p class="intro">Ajude os empresários da Vila do ED a emitir corretamente suas notas fiscais.</p><p>Após as nuvens de corrupção, a vila volta a crescer. Cada operação bem registrada faz parte desse recomeço.</p><button class="primary" data-action="choose">Escolher empresário <span aria-hidden="true">→</span></button><div class="hero-meta"><span>◷ Cerca de 5 minutos</span><span>✓ Conclua um percurso</span></div></div><figure class="hero-art"><img src="./assets/vila.png" alt="Ed, Tina Rocha, Zé do Comércio e Bené Tronco reunidos na praça ensolarada da Vila do ED."><figcaption>Vila do ED · Juntos, a gente reconstrói.</figcaption></figure></section>${ed('A reconstrução aumentou o movimento nos estabelecimentos da vila. Escolha quem você vai ajudar e prepare a nota da próxima venda.')}<section class="scope"><strong>Aprender fazendo</strong><p>Receba o pedido, preencha a venda e confira os conceitos de IBS e CBS no próprio emissor. Sem pressa, sem ranking.</p><small>${escape(R.fiscal.notice)}</small></section>`;
  }
  function choose() {
    return `${progress(0)}${heading('01 / A VILA PRECISA DE VOCÊ', 'Quem você vai ajudar?', 'Escolha um estabelecimento. Basta emitir uma nota correta para concluir; os outros percursos continuam disponíveis para explorar.')}<div class="merchant-grid">${Object.entries(C.merchants).map(([id, m]) => `<article class="merchant-card"><div class="portrait ${m.portrait}" role="img" aria-label="Arte adaptada de ${m.name}"></div><div class="card-body"><p class="eyebrow">${m.shop}</p><h2>${m.name}</h2><p>${m.description}</p><span class="tag">${m.tag}</span><button class="primary" data-merchant="${id}">Ajudar ${id === 'ze' ? 'Zé' : id === 'tina' ? 'Tina' : 'Bené'} <span aria-hidden="true">→</span></button></div></article>`).join('')}</div><p class="quiet">Arte de apoio gerada a partir das referências fornecidas; sujeita à aprovação visual.</p>`;
  }
  function order(m) {
    return `<aside class="order" aria-label="Pedido de venda"><div class="order-title"><span class="eyebrow">SEU GUIA DE PREENCHIMENTO</span><h2>Pedido de venda</h2><span class="tag">${m.order.id} · Dados fictícios</span></div><p>${m.order.purpose}</p><dl><dt>Destinatário</dt><dd>${m.order.recipient}</dd><dt>Entrega / destino didático</dt><dd>${m.order.destination}</dd></dl><div class="order-items">${m.order.items.map(l => `<div><strong>${C.products[l.product].name}</strong><span>${l.quantity} UD × ${R.money(C.products[l.product].price)}</span><b>${R.money(l.quantity * C.products[l.product].price)}</b></div>`).join('')}</div><div class="order-total"><span>Total esperado</span><strong>${R.money(m.order.items.reduce((n, l) => n + l.quantity * C.products[l.product].price, 0))}</strong></div><p class="quiet">UD = unidade didática. Os preços foram criados para esta atividade e não representam preços do jogo.</p><div class="order-task"><strong>Para esta operação</strong><p>Venda de mercadorias. Identifique as esferas do IBS e da CBS e confira os valores. Não há cálculo de tributos neste protótipo.</p></div></aside>`;
  }
  function error(key) { return `<span class="field-error" id="error-${key}">${errors[key] ? escape(errors[key]) : ''}</span>`; }
  function attrs(key) { return `id="${key}" aria-describedby="error-${key}" ${errors[key] ? 'aria-invalid="true"' : ''}`; }
  function select(key, label, value, choices, extra = '') { return `<label class="field" for="${key}"><span>${label}</span><select ${attrs(key)} ${extra}><option value="">Selecione…</option>${choices.map(([v, title]) => `<option value="${v}" ${value === v ? 'selected' : ''}>${title}</option>`).join('')}</select>${error(key)}</label>`; }
  function form() {
    const m = C.merchants[state.merchant], f = state.form;
    return `${progress(1)}<div class="page-title"><div>${heading('02 / EMISSOR EDUCACIONAL', `Uma venda para ${m.name}`, 'Consulte o pedido, prepare os itens e confira antes de emitir.')}</div><button class="secondary" data-action="choose">Trocar empresário</button></div><div class="workspace"><div class="editor"><form id="invoice" novalidate><section class="panel"><div class="section-heading"><span>01</span><h2>Emitente e destinatário</h2></div><div class="issuer"><div><small>Emitente fictício</small><strong>${m.name}</strong><span>${m.shop} · Vila do ED</span></div><span class="tag">Cadastro preenchido</span></div><p class="context">${m.context}</p><div class="field-pair"><label class="field">Destinatário<input id="recipient" value="${f.recipient}" readonly aria-describedby="fictional-recipient"><small id="fictional-recipient">Cadastro fictício do pedido. Não informe CPF/CNPJ real.</small></label><label class="field">Local de entrega<input id="destination" value="${f.destination}" readonly></label></div></section><section class="panel"><div class="section-heading"><span>02</span><h2>Produtos da operação</h2></div><p class="quiet">Selecione os itens e informe as quantidades e os preços do pedido.</p>${f.lines.map((line, i) => `<fieldset class="line"><legend>Item ${i + 1}</legend>${select(`product-${i}`, 'Produto', line.product, m.catalog.map(id => [id, C.products[id].name]))}<div class="line-fields"><label class="field" for="quantity-${i}"><span>Quantidade</span><input ${attrs(`quantity-${i}`)} inputmode="numeric" maxlength="4" value="${escape(line.quantity)}" autocomplete="off">${error(`quantity-${i}`)}</label>${select(`unit-${i}`, 'Unidade', line.unit, [['UD', 'UD — didática']])}<label class="field" for="price-${i}"><span>Preço unitário (R$)</span><input ${attrs(`price-${i}`)} inputmode="decimal" maxlength="10" value="${escape(line.price)}" autocomplete="off">${error(`price-${i}`)}</label></div><p class="subtotal">Subtotal do item <output id="subtotal-${i}">${R.money(R.totals(f.lines).subtotals[i])}</output></p></fieldset>`).join('')}<details class="catalog"><summary>Consultar catálogo e observações dos produtos</summary><ul>${m.catalog.map(id => `<li><strong>${C.products[id].name}</strong> · ${R.money(C.products[id].price)} / UD<br><small>${C.products[id].note}</small></li>`).join('')}</ul><p>Somente os produtos do pedido podem compor a nota avaliada. Não há classificação fiscal automática para o catálogo.</p></details></section><section class="panel"><div class="section-heading"><span>03</span><h2>Contexto tributário</h2></div><div class="demo-note"><b>Cenário conceitual, sem apuração fiscal</b><p>${escape(R.fiscal.notice)}</p></div>${R.fiscal.fields.map(field => select(field.key, field.label, f[field.key], field.options)).join('')}${ed('IBS e CBS têm esferas diferentes. Identificá-las ajuda a entender a organização da reforma. A classificação e as alíquotas de cada mercadoria exigem análise específica.')}</section><section class="panel"><div class="section-heading"><span>04</span><h2>Conferência dos totais</h2></div><div class="total-row"><span>Total dos produtos</span><output id="grand-total">${R.money(R.totals(f.lines).total)}</output></div><p class="quiet">IBS e CBS: não apurados. Isso não significa alíquota zero ou isenção. O total desta representação é apenas comercial.</p>${error('total')}<label class="check"><input type="checkbox" ${attrs('reviewed')} ${f.reviewed ? 'checked' : ''}><span>Conferi os itens e o total com o pedido e reconheço que esta é uma simulação sem validade fiscal.</span></label>${error('reviewed')}<div id="validation" class="validation" role="status" tabindex="-1">${Object.keys(errors).length ? 'Há divergências. Revise os campos indicados abaixo de cada item e tente novamente.' : ''}</div><div class="actions"><button class="secondary" type="button" data-action="check">Conferir nota</button><button class="primary" type="submit">Emitir nota simulada <span aria-hidden="true">→</span></button></div></section></form></div><div class="order-column"><a class="order-jump" href="#order-mobile">Consultar pedido ↓</a><div id="order-mobile">${order(m)}</div></div></div>`;
  }
  function receipt() {
    const m = C.merchants[state.merchant], f = state.form, total = R.totals(f.lines);
    return `${progress(2)}<section class="success-banner"><span class="success-mark" aria-hidden="true">✓</span>${heading('VENDA REGISTRADA NA SIMULAÇÃO', 'Nota emitida!', `Você ajudou ${m.name} a registrar sua venda e contribuiu para a reconstrução da Vila do ED.`)}<p>Se todos fazem, todos ganham. Sua contribuição nesta tentativa está concluída.</p></section><article class="receipt"><div class="receipt-header"><div><p class="eyebrow">VILA DO ED · REPRESENTAÇÃO DIDÁTICA</p><h2>Nota de venda simulada</h2></div><strong>Simulação educacional — sem validade fiscal</strong></div><div class="receipt-parties"><div><small>Emitente</small><h3>${m.name}</h3><p>${m.shop}</p></div><div><small>Destinatário fictício</small><h3>${f.recipient}</h3><p>${f.destination}</p></div></div><div class="table-scroll"><table><caption>Produtos da venda · ${m.order.id}</caption><thead><tr><th scope="col">Produto</th><th scope="col">Quantidade</th><th scope="col">Unidade</th><th scope="col">Unitário</th><th scope="col">Subtotal</th></tr></thead><tbody>${f.lines.map((l, i) => `<tr><th scope="row">${C.products[l.product].name}</th><td>${l.quantity}</td><td>${l.unit}</td><td>${R.money(R.cents(l.price))}</td><td>${R.money(total.subtotals[i])}</td></tr>`).join('')}</tbody></table></div><div class="total-row"><span>Total comercial da venda</span><strong>${R.money(total.total)}</strong></div><dl class="fiscal-summary"><dt>Operação</dt><dd>Venda de mercadorias</dd><dt>IBS</dt><dd>Competência compartilhada: estados e municípios. Não apurado.</dd><dt>CBS</dt><dd>Esfera federal. Não apurada.</dd></dl><p class="quiet">Não foram atribuídos códigos fiscais ou alíquotas. Esta representação não é NF-e, DANFE ou autorização de uso.</p></article><div class="finish-actions"><button class="primary" data-action="finish">Concluir atividade ✓</button><button class="secondary" data-action="choose">Ajudar outro empresário</button></div><p class="center quiet">Explorar outro percurso preserva sua aprovação e não gera uma nova contribuição.</p>`;
  }
  function render(focus = true) {
    document.querySelector('#mode').textContent = bridge.mode === 'demo' ? 'Modo demonstração • progresso apenas neste navegador, sem registro no Moodle' : 'Modo Moodle • registro via SCORM 1.2';
    main.innerHTML = state.step === 'home' ? home() : state.step === 'choose' ? choose() : state.step === 'form' ? form() : state.step === 'receipt' ? receipt() : `<section class="end">${heading('CONTRIBUIÇÃO CONCLUÍDA', 'Obrigado por ajudar a vila.', bridge.mode === 'demo' ? 'Você concluiu a demonstração. Nenhum resultado foi enviado ao Moodle.' : 'Sua aprovação e nota 100 foram confirmadas pela API do Moodle. Você pode voltar ao curso.')}<p>O registro correto de cada operação faz parte do esforço coletivo.</p></section>`;
    syncNotice(); if (focus) { main.focus(); window.scrollTo(0, 0); }
  }
  function check(emit) {
    errors = R.validate(state.merchant, state.form);
    if (Object.keys(errors).length) {
      save(); render(false);
      document.querySelector('#validation').textContent = `${Object.keys(errors).length} ponto(s) para revisar. Seu preenchimento foi mantido.`;
      const first = document.querySelector('[aria-invalid="true"]'); if (first) first.focus();
      return;
    }
    if (!emit) { save(); const box = document.querySelector('#validation'); box.textContent = 'Tudo certo! Os itens, conceitos tributários e totais conferem com o pedido. Você já pode emitir.'; box.focus(); return; }
    if (state.step !== 'form') return;
    if (!state.completed) { state.first = { merchant: state.merchant, form: JSON.parse(JSON.stringify(state.form)) }; state.contributions = 1; }
    state.completed = true; state.step = 'receipt'; save(); render();
  }
  main.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || bridge.finished) return;
    const action = button.dataset.action;
    if (button.dataset.merchant) {
      const id = button.dataset.merchant;
      if (state.merchant !== id || !state.form || !Object.keys(R.validate(id, state.form)).length) state.form = R.blank(id);
      state.merchant = id; state.step = 'form'; errors = {}; save(); render();
    } else if (action === 'choose') { state.step = 'choose'; errors = {}; save(); render(); }
    else if (action === 'check') check(false);
    else if (action === 'finish' && state.completed) {
      const prior = state.step; state.step = 'end';
      if (bridge.finish(state)) render(); else { state.step = prior; syncNotice(); }
    }
  });
  main.addEventListener('submit', e => { e.preventDefault(); if (!bridge.finished && state.step === 'form') check(true); });
  main.addEventListener('input', e => {
    if (state.step !== 'form' || bridge.finished) return;
    const el = e.target, match = /^(product|quantity|price|unit)-(\d)$/.exec(el.id);
    if (match) state.form.lines[Number(match[2])][match[1]] = el.value;
    else if (['operation', 'ibs', 'cbs', 'reviewed'].includes(el.id)) state.form[el.id] = el.id === 'reviewed' ? el.checked : el.value;
    else return;
    if (el.id !== 'reviewed') { state.form.reviewed = false; document.querySelector('#reviewed').checked = false; }
    document.querySelector('#validation').textContent = '';
    const total = R.totals(state.form.lines);
    total.subtotals.forEach((n, i) => document.querySelector(`#subtotal-${i}`).textContent = R.money(n));
    document.querySelector('#grand-total').textContent = R.money(total.total);
    clearTimeout(saveTimer); saveTimer = setTimeout(save, 300);
  });
  // Persist at changes and important transitions; unload is a final best effort only.
  document.addEventListener('visibilitychange', () => { if (document.hidden && !bridge.finished) save(); });
  window.addEventListener('pagehide', () => { clearTimeout(saveTimer); if (!bridge.finished) bridge.finish(state); });
  window.addEventListener('pageshow', event => { if (event.persisted) window.location.reload(); });
  render(false);
  if (!bridge.error) save(); else syncNotice();
})();
