(() => {
  'use strict';
  const C = window.VilaConfig, F = window.VilaFiscal, R = window.VilaRules;
  const bridge = new window.VilaScorm.Bridge(), main = document.querySelector('main');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
  const loaded = bridge.init();
  let state = R.restore(loaded, bridge.passed), errors = {}, saveTimer;
  const merchant = () => C.merchants[state.merchant];
  function syncNotice() {
    const box = document.querySelector('#sync'); box.replaceChildren();
    if (bridge.error) {
      const span = document.createElement('span'); span.textContent = bridge.error; box.append(span);
      const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Tentar salvar novamente'; button.onclick = save; box.append(button);
    }
    document.querySelector('#achievement').textContent = state.completed ? '✓ Conclusão preservada nesta tentativa' : 'Uma emissão correta conclui a atividade';
  }
  function save() { clearTimeout(saveTimer); const ok = bridge.save(state); syncNotice(); return ok; }
  function heading(eyebrow, title, intro = '') { return `<p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>${intro ? `<p class="intro">${esc(intro)}</p>` : ''}`; }
  function steps(current) { return `<nav class="steps" aria-label="Etapas">${['Escolher', 'Preparar a NFS-e', 'Emissão'].map((s, i) => `<span ${i === current ? 'aria-current="step"' : ''}><b>${i + 1}</b>${s}</span>`).join('')}</nav>`; }
  function ed(text) { return `<aside class="ed-help"><span class="ed-dot" aria-hidden="true">ED</span><p><strong>Uma dica do Ed</strong>${esc(text)}</p></aside>`; }
  function home() {
    return `<section class="hero"><div class="hero-copy"><p class="eyebrow">SEMANA TRIBUTÁRIA 2026 · SIMULADOR DE NFS-e</p><h1>A reconstrução<br>começa com<br><em>uma boa emissão.</em></h1><p class="intro">Ajude os empresários da Vila do ED a emitir corretamente suas notas fiscais.</p><p>Um serviço contratado. Um cliente já cadastrado. Sua missão é escolher a classificação e conferir a nota.</p><button class="primary" data-action="choose">Escolher empresário <span aria-hidden="true">→</span></button><div class="hero-meta"><span>◷ Cerca de 5 minutos</span><span>✓ Basta concluir um percurso</span></div></div><figure class="hero-art"><img src="./assets/vila.png" alt="Ed, Tina Rocha, Zé do Comércio e Bené Tronco reunidos na praça da Vila do ED."><figcaption>Vila do ED · Juntos, a gente reconstrói.</figcaption></figure></section>${ed('Escolha quem você vai ajudar. O cliente, o local, a descrição e o valor do serviço já estão preenchidos. Leia a solicitação e escolha os códigos adequados.')}<section class="scope"><strong>Aprender no emissor</strong><p>Escolha CNAE, CTN e NBS, confira IBS/CBS e indique se o ISS é retido pelo tomador. Uma emissão correta conclui a atividade.</p><small>${esc(F.notice)}</small></section>`;
  }
  function choose() {
    return `${steps(0)}${heading('01 / A VILA PRECISA DE VOCÊ', 'Quem você vai ajudar?', 'Cada estabelecimento tem um cliente e um serviço próprios. Uma nota correta é suficiente para concluir.')}${state.legacyCompleted ? '<p class="migration-note">Sua conclusão da versão anterior foi preservada. Estes serviços ficam disponíveis para exploração.</p>' : ''}<div class="merchant-grid">${Object.entries(C.merchants).map(([id, m]) => `<article class="merchant-card"><div class="portrait ${m.portrait}" role="img" aria-label="Arte adaptada de ${m.name}"></div><div class="card-body"><p class="eyebrow">${m.shop}</p><h2>${m.name}</h2><p>${m.description}</p><span class="tag">${m.tag}</span><button class="primary" data-merchant="${id}">Ajudar ${id === 'ze' ? 'Zé' : id === 'tina' ? 'Tina' : 'Bené'} <span aria-hidden="true">→</span></button></div></article>`).join('')}</div><p class="quiet">Contratos fictícios de serviços complementares. A venda de mercadorias é uma operação diferente. Arte de apoio sujeita à aprovação visual.</p>`;
  }
  function order(m) {
    const e = m.order.expected;
    return `<aside class="order" aria-label="Solicitação de serviço"><div class="order-title"><span class="eyebrow">CONSULTE DURANTE A EMISSÃO</span><h2>Solicitação de serviço</h2><span class="tag">${m.order.id} · Dados fictícios</span></div><p>${m.order.purpose}</p><dl><dt>Cliente / tomador</dt><dd>${m.order.recipient}</dd><dt>Local da prestação</dt><dd>${m.order.destination}</dd></dl><div class="service-brief"><strong>O que foi contratado?</strong><p>${m.order.description}</p></div><div class="order-total"><span>Valor contratado</span><strong>${R.money(m.order.amount)}</strong></div><div class="order-task"><strong>Retenção do ISS</strong><p>${m.order.retentionNote}</p></div><div class="order-task"><strong>Orientação IBS/CBS do exercício</strong><p>${e.cst === '000' ? 'Tratamento proposto: tributação integral. Procure a classificação de situações tributadas integralmente pelo IBS e CBS.' : 'Tratamento proposto: alíquota reduzida, na classificação de operações com bens imóveis. Não foi caracterizado projeto legal de reabilitação urbana de zona histórica.'}</p></div><p class="quiet">Os tratamentos são hipóteses de trabalho para revisão fiscal. Não há apuração de tributos ou definição de alíquotas.</p><a class="return-to-form" href="#invoice">Voltar ao emissor ↑</a></aside>`;
  }
  const optionText = row => row ? `${row[0]} — ${row[1]}` : '';
  function choices(key) {
    if (key === 'cnae') return merchant().cnaes.map(id => [id, ...F.cnaes[id]]);
    if (key === 'ctn') return R.ctnOptions(state.merchant, state.form).map(id => [id, ...F.ctns[id]]);
    if (key === 'nbs') return R.nbsOptions(state.merchant, state.form).map(id => [id, ...F.nbs[id]]);
    if (key === 'cst') return Object.entries(F.csts).map(([id, row]) => [id, ...row]);
    if (key === 'classTrib') return R.classOptions(state.form).map(id => [id, F.classes[id].code, F.classes[id].label]);
    return [['nao', 'Não', 'ISS não retido pelo tomador'], ['sim', 'Sim', 'ISS retido pelo tomador']];
  }
  const placeholders = { ctn: 'Selecione o CNAE para liberar o CTN', nbs: 'Selecione o CTN para liberar a NBS', classTrib: 'Selecione o CST para liberar a classificação' };
  function options(key) {
    const list = choices(key);
    return `<option value="">${list.length ? 'Selecione…' : placeholders[key] || 'Selecione…'}</option>${list.map(([id, code, label]) => `<option value="${id}" ${state.form[key] === id ? 'selected' : ''}>${esc(`${code} — ${label}`)}</option>`).join('')}`;
  }
  function attrs(key) { return `id="${key}" aria-describedby="hint-${key} error-${key}" ${errors[key] ? 'aria-invalid="true"' : ''}`; }
  function error(key) { return `<span class="field-error" id="error-${key}">${esc(errors[key] || '')}</span>`; }
  function fieldHint(key) {
    const row = choices(key).find(x => x[0] === state.form[key]);
    return row ? row[2] : key === 'cnae' ? 'Atividade econômica do prestador. A descrição do contrato orienta sua escolha.' : key === 'ctn' ? 'Código do serviço na classificação nacional do ISSQN. Não é o código de IBS/CBS.' : key === 'nbs' ? 'Nomenclatura Brasileira de Serviços. Escolha segundo o serviço efetivamente prestado.' : key === 'issWithheld' ? 'Use a condição informada na solicitação, sem inferir retenção apenas pelo CNAE.' : 'Escolha conforme a orientação deste contrato.';
  }
  function select(key, label) {
    return `<label class="field" for="${key}"><span>${label}</span><select ${attrs(key)} ${choices(key).length ? '' : 'disabled'}>${options(key)}</select><small class="choice-description" id="hint-${key}">${esc(fieldHint(key))}</small>${error(key)}</label>`;
  }
  function form() {
    const m = merchant(), f = state.form;
    return `${steps(1)}<div class="page-title"><div>${heading('02 / EMISSOR SIMPLIFICADO DE NFS-e', `Uma nota para ${m.name}`, 'Os dados do contrato estão prontos. Leia a discriminação e escolha as classificações do serviço.')}</div><button class="secondary" data-action="choose">Trocar empresário</button></div><p class="fiscal-pending">${esc(F.notice)}</p><div class="workspace"><div class="editor"><form id="invoice" novalidate><section class="panel"><div class="section-heading"><span>01</span><h2>Prestador e tomador</h2></div><div class="issuer"><div><small>Prestador fictício</small><strong>${m.name}</strong><span>${m.shop} · Vila do ED</span></div><span class="tag">Cadastro preenchido</span></div><div class="field-pair fixed-data"><label class="field" for="recipient">Cliente / tomador<input id="recipient" value="${esc(f.recipient)}" readonly><small>Cadastro fictício do contrato. Não informe dados pessoais reais.</small></label><label class="field" for="destination">Local da prestação<input id="destination" value="${esc(f.destination)}" readonly></label></div><details class="context-details"><summary>Sobre este serviço na vila</summary><p class="context">${esc(m.context)}</p></details></section><section class="panel"><div class="section-heading"><span>02</span><h2>Serviço prestado</h2></div><label class="field" for="description">Discriminação do serviço<textarea id="description" rows="5" readonly>${esc(f.description)}</textarea><small>Esta descrição é o ponto de partida para selecionar os códigos.</small></label><label class="field" for="amount"><span>Valor do serviço (R$)</span><input ${attrs('amount')} inputmode="decimal" maxlength="10" value="${esc(f.amount)}"><small id="hint-amount">Valor contratado já preenchido. Confira com a solicitação; use vírgula ou ponto, sem separador de milhar.</small>${error('amount')}</label></section><section class="panel"><div class="section-heading"><span>03</span><h2>Classificação do serviço</h2></div>${select('cnae', 'Serviço — CNAE')}${select('ctn', 'CTN — Código de Tributação Nacional')}${select('nbs', 'NBS — Nomenclatura Brasileira de Serviços')}${ed('O CNAE identifica a atividade do prestador; CTN e NBS classificam o serviço. Alterar uma escolha libera novas opções e limpa as escolhas que dependiam dela.')}</section><section class="panel"><div class="section-heading"><span>04</span><h2>ISS e IBS/CBS</h2></div>${select('issWithheld', 'ISS retido pelo tomador?')}<div class="tax-divider"><h3>Classificação de IBS e CBS</h3><p class="quiet">Campos próprios da reforma, separados do CTN e da NBS. Os códigos abaixo são candidatos para revisão.</p></div>${select('cst', 'CST — Situação tributária de IBS/CBS')}${select('classTrib', 'cClassTrib — Classificação tributária de IBS/CBS')}<p class="quiet">O município, o regime do prestador e as regras aplicáveis precisam ser confirmados para uma emissão real. Este protótipo não calcula ISS, IBS ou CBS.</p></section><section class="panel"><div class="section-heading"><span>05</span><h2>Conferência</h2></div><div class="total-row"><span>Valor total do serviço</span><output id="grand-total">${R.cents(f.amount) === null ? 'Confira o valor' : R.money(R.cents(f.amount))}</output></div><p class="quiet">Tributos e valor líquido após retenções: não apurados. Retenção “não” não significa isenção; retenção “sim” não altera o valor bruto contratado.</p><label class="check"><input type="checkbox" id="reviewed" aria-describedby="error-reviewed" ${errors.reviewed ? 'aria-invalid="true"' : ''} ${f.reviewed ? 'checked' : ''}><span>Conferi o serviço, o valor, os códigos e a retenção. Reconheço que esta é uma simulação sem validade fiscal.</span></label>${error('reviewed')}<div id="validation" class="validation" role="status" tabindex="-1">${Object.keys(errors).length ? 'Revise os campos indicados. Seu preenchimento foi mantido.' : ''}</div><div class="actions"><button class="secondary" type="button" data-action="check">Conferir nota</button><button class="primary" type="submit">Emitir nota simulada <span aria-hidden="true">→</span></button></div></section></form></div><div class="order-column"><a class="order-jump" href="#order-mobile">Consultar solicitação ↓</a><div id="order-mobile">${order(m)}</div></div></div>`;
  }
  function receipt() {
    const m = merchant(), f = state.form;
    const rows = [['CNAE', optionText(F.cnaes[f.cnae])], ['CTN', optionText(F.ctns[f.ctn])], ['NBS', optionText(F.nbs[f.nbs])], ['ISS retido', f.issWithheld === 'sim' ? 'Sim — responsabilidade do tomador neste cenário' : 'Não — responsabilidade do prestador neste cenário'], ['CST IBS/CBS', optionText(F.csts[f.cst])], ['cClassTrib', `${f.classTrib} — ${F.classes[f.classTrib].label}`]];
    return `${steps(2)}<section class="success-banner"><span class="success-mark" aria-hidden="true">✓</span>${heading('SERVIÇO REGISTRADO NA SIMULAÇÃO', 'Nota emitida!', `Você ajudou ${m.name} a registrar seu serviço e contribuiu para a reconstrução da Vila do ED.`)}<p>Uma contribuição por participante nesta tentativa. Explorar outros serviços preserva sua conclusão.</p></section><article class="receipt"><div class="receipt-header"><div><p class="eyebrow">REPRESENTAÇÃO DIDÁTICA · NFS-e</p><h2>Nota de serviço simulada</h2></div><strong>Simulação educacional — sem validade fiscal</strong></div><div class="receipt-parties"><div><small>Prestador</small><h3>${m.name}</h3><p>${m.shop}</p></div><div><small>Tomador fictício</small><h3>${esc(f.recipient)}</h3><p>${esc(f.destination)}</p></div></div><section class="receipt-service"><h3>Discriminação do serviço</h3><p>${esc(f.description)}</p></section><dl class="classification-summary">${rows.map(([label, value]) => `<dt>${label}</dt><dd>${esc(value)}</dd>`).join('')}</dl><div class="total-row"><span>Valor bruto do serviço</span><strong>${R.money(R.cents(f.amount))}</strong></div><p class="quiet">ISS, IBS, CBS e valor líquido após retenções não apurados. Códigos candidatos sujeitos à confirmação oficial e revisão especializada. Não há autorização fiscal, chave, protocolo ou DANFSe.</p></article><div class="finish-actions"><button class="primary" data-action="finish">Concluir atividade ✓</button><button class="secondary" data-action="choose">Ajudar outro empresário</button></div>`;
  }
  function render(focus = true) {
    document.querySelector('#mode').textContent = bridge.mode === 'demo' ? 'Modo demonstração • progresso neste navegador, sem registro no Moodle' : 'Modo Moodle • registro via SCORM 1.2';
    main.innerHTML = state.step === 'home' ? home() : state.step === 'choose' ? choose() : state.step === 'form' ? form() : state.step === 'receipt' ? receipt() : `<section class="end">${heading('CONTRIBUIÇÃO CONCLUÍDA', 'Obrigado por ajudar a vila.', bridge.mode === 'demo' ? 'Você concluiu a demonstração. Nenhum resultado foi enviado ao Moodle.' : 'Sua aprovação e nota 100 foram confirmadas pela API do Moodle. Você pode voltar ao curso.')}</section>`;
    syncNotice(); if (focus) { main.focus(); window.scrollTo(0, 0); }
  }
  function check(emit) {
    errors = R.validate(state.merchant, state.form);
    if (Object.keys(errors).length) { save(); render(false); document.querySelector('#validation').textContent = `${Object.keys(errors).length} ponto(s) para revisar. Seu preenchimento foi mantido.`; document.querySelector('[aria-invalid="true"]')?.focus(); return; }
    if (!emit) { save(); const box = document.querySelector('#validation'); box.textContent = 'Tudo certo com as escolhas deste cenário! Você já pode emitir a nota simulada.'; box.focus(); return; }
    if (state.step !== 'form') return;
    if (!state.completed) { state.first = { merchant: state.merchant, form: JSON.parse(JSON.stringify(state.form)) }; state.contributions = 1; }
    state.completed = true; state.step = 'receipt'; save(); render();
  }
  function refresh(key) {
    const el = document.getElementById(key); el.innerHTML = options(key); el.disabled = !choices(key).length;
    document.querySelector(`#hint-${key}`).textContent = fieldHint(key);
    el.removeAttribute('aria-invalid'); document.querySelector(`#error-${key}`).textContent = ''; delete errors[key];
  }
  main.addEventListener('click', e => {
    const button = e.target.closest('button'); if (!button || bridge.finished) return;
    const action = button.dataset.action, id = button.dataset.merchant;
    if (id && Object.hasOwn(C.merchants, id)) {
      if (state.merchant !== id || !state.form || !Object.keys(R.validate(id, state.form)).length) state.form = R.blank(id);
      state.merchant = id; state.step = 'form'; errors = {}; save(); render();
    } else if (action === 'choose') { state.step = 'choose'; errors = {}; save(); render(); }
    else if (action === 'check') check(false);
    else if (action === 'finish' && state.completed) { const prior = state.step; state.step = 'end'; if (bridge.finish(state)) render(); else { state.step = prior; syncNotice(); } }
  });
  main.addEventListener('submit', e => { e.preventDefault(); if (!bridge.finished && state.step === 'form') check(true); });
  main.addEventListener('input', e => {
    if (state.step !== 'form' || bridge.finished) return;
    const key = e.target.id;
    if (!R.fields.includes(key) && key !== 'reviewed') return;
    state.form = R.update(state.merchant, state.form, key, key === 'reviewed' ? e.target.checked : e.target.value);
    if (key !== 'reviewed') document.querySelector('#reviewed').checked = false;
    if (key === 'cnae') { refresh('ctn'); refresh('nbs'); }
    if (key === 'ctn') refresh('nbs');
    if (key === 'cst') refresh('classTrib');
    if (key !== 'amount' && key !== 'reviewed') document.querySelector(`#hint-${key}`).textContent = fieldHint(key);
    delete errors[key]; e.target.removeAttribute('aria-invalid'); document.querySelector(`#error-${key}`).textContent = '';
    document.querySelector('#validation').textContent = '';
    const amount = R.cents(state.form.amount); document.querySelector('#grand-total').textContent = amount === null ? 'Confira o valor' : R.money(amount);
    clearTimeout(saveTimer); saveTimer = setTimeout(save, 300);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !bridge.finished) save(); });
  window.addEventListener('pagehide', () => { clearTimeout(saveTimer); if (!bridge.finished) bridge.finish(state); });
  window.addEventListener('pageshow', event => { if (event.persisted) window.location.reload(); });
  render(false); if (!bridge.error) save(); else syncNotice();
})();
