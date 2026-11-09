(() => {
  'use strict';
  const C = window.VilaConfig, F = window.VilaFiscal, R = window.VilaRules;
  const bridge = new window.VilaScorm.Bridge(), main = document.querySelector('main');
  const esc = v => String(v ?? '').replace(/[&<>"']/g, s => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[s]));
  const loaded = bridge.init();
  let state = R.restore(loaded, bridge.passed), errors = {}, saveTimer;
  const merchant = () => C.merchants[state.merchant];
  const service = () => R.isService(state.merchant);
  const optionText = row => row ? `${row[0]} — ${row[1]}` : '';
  function syncNotice() {
    const box = document.querySelector('#sync'); box.replaceChildren();
    if (bridge.error) {
      const span = document.createElement('span'); span.textContent = bridge.error; box.append(span);
      const button = document.createElement('button'); button.type='button'; button.textContent='Tentar salvar novamente'; button.onclick=save; box.append(button);
    }
    document.querySelector('#achievement').textContent=state.completed?'✓ Conclusão preservada nesta tentativa':'Uma emissão correta conclui a atividade';
  }
  function save() { clearTimeout(saveTimer);const ok=bridge.save(state);syncNotice();return ok; }
  function heading(eye,title,intro='') { return `<p class="eyebrow">${esc(eye)}</p><h1>${esc(title)}</h1>${intro?`<p class="intro">${esc(intro)}</p>`:''}`; }
  function steps(current) { return `<nav class="steps" aria-label="Etapas">${['Escolher','Preparar a nota','Emissão'].map((s,i)=>`<span ${i===current?'aria-current="step"':''}><b>${i+1}</b>${s}</span>`).join('')}</nav>`; }
  function ed(text) { return `<aside class="ed-help"><span class="ed-dot" aria-hidden="true">ED</span><p><strong>Uma dica do Ed</strong>${esc(text)}</p></aside>`; }
  function home() {
    return `<section class="hero"><div class="hero-copy"><p class="eyebrow">SEMANA TRIBUTÁRIA 2026 · EMISSOR EDUCACIONAL</p><h1>A reconstrução<br>começa com<br><em>uma boa emissão.</em></h1><p class="intro">Ajude os empresários da Vila do ED a emitir corretamente suas notas fiscais.</p><p>O comércio do Zé abastece a vila. Na Pedreira, Tina produz concreto. Na Serralheria, Bené processa madeira para tábuas. Cada operação tem sua nota.</p><button class="primary" data-action="choose">Escolher empresário <span aria-hidden="true">→</span></button><div class="hero-meta"><span>◷ Cerca de 5 minutos</span><span>✓ Basta concluir um percurso</span></div></div><figure class="hero-art"><img src="./assets/vila.png" alt="Ed, Tina Rocha, Zé do Comércio e Bené Tronco reunidos na praça da Vila do ED."><figcaption>Vila do ED · Juntos, a gente reconstrói.</figcaption></figure></section>${ed('Escolha quem você vai ajudar. O cliente e o pedido já estão prontos. Confira os produtos ou classifique o serviço, conforme a operação.')}<section class="scope"><strong>Comércio, indústria e serviço</strong><p>Venda os produtos do Zé, registre a venda do concreto fabricado por Tina ou prepare a nota do serviço de Bené. Sem missão extra de fabricação e sem pressa.</p><small>${esc(F.notice)}</small></section>`;
  }
  function choose() {
    return `${steps(0)}${heading('01 / A VILA PRECISA DE VOCÊ','Quem você vai ajudar?','Três estabelecimentos, três operações. Basta emitir uma nota correta para concluir.')}${state.legacyCompleted?'<p class="migration-note">Sua conclusão da versão anterior foi preservada. Os novos percursos ficam disponíveis para exploração.</p>':''}<div class="merchant-grid">${Object.entries(C.merchants).map(([id,m])=>`<article class="merchant-card"><div class="portrait ${m.portrait}"><svg class="character-cutout" viewBox="${m.portraitViewBox}" role="img" aria-label="${m.name}, de corpo inteiro" focusable="false"><defs><clipPath id="character-clip-${id}" clipPathUnits="userSpaceOnUse"><rect x="${m.portraitViewBox.split(' ')[0]}" y="0" width="${m.portraitViewBox.split(' ')[2]}" height="1024"/></clipPath></defs><image href="./assets/personagens.png" width="1536" height="1024" clip-path="url(#character-clip-${id})"/></svg></div><div class="card-body"><p class="eyebrow">${m.shop}</p><h2>${m.name}</h2><p class="merchant-category">${m.category}</p><p>${m.description}</p><span class="tag">${m.tag}</span><button class="primary" data-merchant="${id}">Ajudar ${id==='ze'?'Zé':id==='tina'?'Tina':'Bené'} <span aria-hidden="true">→</span></button></div></article>`).join('')}</div><p class="quiet">Personagens de corpo inteiro, isolados do fundo a partir das referências fornecidas. Preços e pedidos são didáticos.</p>`;
  }
  function order(m) {
    const svc=m.kind==='service';
    return `<aside class="order" aria-label="${svc?'Solicitação de serviço':'Pedido de venda'}"><div class="order-title"><span class="eyebrow">CONSULTE DURANTE A EMISSÃO</span><h2>${svc?'Solicitação de serviço':'Pedido de venda'}</h2><span class="tag">${m.order.id} · Dados fictícios</span></div><p>${m.order.purpose}</p><dl><dt>${svc?'Cliente / tomador':'Destinatário'}</dt><dd>${m.order.recipient}</dd><dt>${svc?'Local da prestação':'Local de entrega'}</dt><dd>${m.order.destination}</dd></dl>${svc?`<div class="service-brief"><strong>O serviço contratado</strong><p>${m.order.description}</p></div>`:`<div class="order-items">${m.order.items.map(l=>`<div><strong>${C.products[l.product].name}</strong><span>${l.quantity} UD × ${R.money(C.products[l.product].price)}</span><b>${R.money(l.quantity*C.products[l.product].price)}</b></div>`).join('')}</div>`}<div class="order-total"><span>${svc?'Valor do serviço':'Total esperado'}</span><strong>${R.money(m.order.amount)}</strong></div>${svc?`<div class="order-task"><strong>Retenção do ISS</strong><p>${m.order.retentionNote}</p></div>`:'<p class="quiet">UD = unidade didática. Quantidades e preços do pedido foram criados para a atividade e não representam estoque ou preços do jogo.</p>'}<a class="return-to-form" href="#invoice">Voltar ao emissor ↑</a></aside>`;
  }
  function error(key) {return `<span class="field-error" id="error-${key}">${esc(errors[key]||'')}</span>`;}
  function attrs(key) {return `id="${key}" aria-describedby="hint-${key} error-${key}" ${errors[key]?'aria-invalid="true"':''}`;}
  function choices(key) {
    if(key==='cnae')return merchant().cnaes.map(id=>[id,...F.cnaes[id]]);
    if(key==='ctn')return R.ctnOptions(state.merchant,state.form).map(id=>[id,...F.ctns[id]]);
    if(key==='nbs')return R.nbsOptions(state.merchant,state.form).map(id=>[id,...F.nbs[id]]);
    return [['nao','Não','ISS não retido pelo tomador'],['sim','Sim','ISS retido pelo tomador']];
  }
  function options(key) {
    const list=choices(key),placeholder=key==='ctn'?'Selecione o CNAE para liberar o CTN':'Selecione o CTN para liberar a NBS';
    return `<option value="">${list.length?'Selecione…':placeholder}</option>${list.map(([id,code,label])=>`<option value="${id}" ${state.form[key]===id?'selected':''}>${esc(`${code} — ${label}`)}</option>`).join('')}`;
  }
  function fieldHint(key) {
    const row=choices(key).find(x=>x[0]===state.form[key]);
    if(row)return row[2];
    return key==='cnae'?'Atividade econômica de referência do prestador, candidata a revisão.':key==='ctn'?'Classifique o serviço efetivamente contratado, conforme a discriminação.':key==='nbs'?'Nomenclatura Brasileira de Serviços. Não é uma classificação de mercadorias.':'Use a condição informada no pedido; a retenção não é decidida apenas pelo CNAE.';
  }
  function select(key,label) {return `<label class="field" for="${key}"><span>${label}</span><select ${attrs(key)} ${choices(key).length?'':'disabled'}>${options(key)}</select><small class="choice-description" id="hint-${key}">${esc(fieldHint(key))}</small>${error(key)}</label>`;}
  function panel(number,title,body) {return `<section class="panel"><div class="section-heading"><span>${number}</span><h2>${title}</h2></div>${body}</section>`;}
  function goodsFields(m,f) {
    return f.lines.map((line,i)=>`<fieldset class="line"><legend>Item ${i+1}</legend><label class="field" for="product-${i}"><span>Produto</span><select ${attrs(`product-${i}`)}><option value="">Selecione…</option>${m.catalog.map(id=>`<option value="${id}" ${line.product===id?'selected':''}>${C.products[id].name}</option>`).join('')}</select><small id="hint-product-${i}">Escolha o item informado no pedido.</small>${error(`product-${i}`)}</label><div class="line-fields"><label class="field" for="quantity-${i}"><span>Quantidade</span><input ${attrs(`quantity-${i}`)} inputmode="numeric" maxlength="4" value="${esc(line.quantity)}"><small id="hint-quantity-${i}">Confira com o pedido.</small>${error(`quantity-${i}`)}</label><label class="field" for="unit-${i}"><span>Unidade</span><input id="unit-${i}" value="UD" readonly aria-describedby="error-unit-${i}">${error(`unit-${i}`)}</label><label class="field" for="price-${i}"><span>Preço unitário (R$)</span><input ${attrs(`price-${i}`)} inputmode="decimal" maxlength="10" value="${esc(line.price)}"><small id="hint-price-${i}">Preço didático do pedido.</small>${error(`price-${i}`)}</label></div><p class="subtotal">Subtotal <output id="subtotal-${i}">${R.money(R.totals(f.lines).subtotals[i])}</output></p></fieldset>`).join('')+`<details class="catalog"><summary>Consultar o catálogo do estabelecimento</summary><ul>${m.catalog.map(id=>`<li><strong>${C.products[id].name}</strong> · ${R.money(C.products[id].price)} / UD<br><small>${C.products[id].note}</small></li>`).join('')}</ul><p>A nota avaliada deve corresponder ao pedido. Não atribuímos classificação fiscal aos itens ficcionais.</p></details>`;
  }
  function form() {
    const m=merchant(),f=state.form,svc=service();
    const parties=`<div class="issuer"><div><small>${svc?'Prestador':'Emitente'} fictício</small><strong>${m.name}</strong><span>${m.shop} · ${m.category}</span></div><span class="tag">Cadastro preenchido</span></div><p class="context">${m.context}</p><div class="field-pair fixed-data"><label class="field" for="recipient">${svc?'Cliente / tomador':'Destinatário'}<input id="recipient" value="${esc(f.recipient)}" readonly><small>Dados fictícios do pedido. Não informe dados pessoais reais.</small></label><label class="field" for="destination">${svc?'Local da prestação':'Local de entrega'}<input id="destination" value="${esc(f.destination)}" readonly></label></div>${svc?'':`<label class="field" for="cnae-reference">CNAE de referência do estabelecimento<input id="cnae-reference" value="${esc(optionText(F.cnaes[m.cnae]))}" readonly><small>Referência cadastral candidata, não um novo código da reforma nem classificação fiscal do produto.</small></label>`}`;
    const operation=svc?`<label class="field" for="description">Discriminação do serviço<textarea id="description" rows="4" readonly>${esc(f.description)}</textarea><small>Leia a descrição para escolher os códigos.</small></label><label class="field" for="amount"><span>Valor do serviço (R$)</span><input ${attrs('amount')} inputmode="decimal" maxlength="10" value="${esc(f.amount)}"><small id="hint-amount">Valor didático já preenchido. Confira com a solicitação.</small>${error('amount')}</label>`:`<p class="quiet">${esc(m.order.description)} Quantidades e preços vêm preenchidos para você conferir.</p>${goodsFields(m,f)}`;
    const classification=svc?panel('03','Classificação do serviço',`${select('cnae','Serviço — CNAE')}${select('ctn','CTN — Código de Tributação Nacional')}${select('nbs','NBS — Nomenclatura Brasileira de Serviços')}${ed('A placa identifica a Serralheria do Bené. Para classificar a nota, considere o processamento de madeira descrito no pedido, e não apenas o nome do estabelecimento.')}`)+panel('04','Retenção do ISS',select('issWithheld','ISS retido pelo tomador?')):'';
    const total=svc?R.cents(f.amount):R.totals(f.lines).total;
    const confirm=`<div class="total-row"><span>${svc?'Valor bruto do serviço':'Total da venda'}</span><output id="grand-total">${total===null?'Confira o valor':R.money(total)}</output></div>${error('total')}<p class="quiet">${svc?'Tributos e valor líquido após retenções não apurados. Retenção “não” não significa isenção.':'Tributos não apurados. Esta venda de mercadorias não é uma nota de serviço; não há retenção de ISS nesta operação simulada.'}</p><label class="check"><input type="checkbox" id="reviewed" aria-describedby="error-reviewed" ${errors.reviewed?'aria-invalid="true"':''} ${f.reviewed?'checked':''}><span>Conferi ${svc?'o serviço, o valor, os códigos e a retenção':'os produtos, as quantidades, os preços e o total'}. Reconheço que esta é uma simulação sem validade fiscal.</span></label>${error('reviewed')}<div id="validation" class="validation" role="status" tabindex="-1">${Object.keys(errors).length?'Revise os campos indicados. Seu preenchimento foi mantido.':''}</div><div class="actions"><button class="secondary" type="button" data-action="check">Conferir nota</button><button class="primary" type="submit">Emitir nota simulada <span aria-hidden="true">→</span></button></div>`;
    return `${steps(1)}<div class="page-title"><div>${heading(svc?'02 / EMISSOR DE SERVIÇO':'02 / EMISSOR DE VENDA DE MERCADORIAS',`Uma nota para ${m.name}`,m.category)}</div><button class="secondary" data-action="choose">Trocar empresário</button></div><p class="fiscal-pending">${esc(F.notice)}</p><div class="workspace"><div class="editor"><form id="invoice" novalidate>${panel('01',svc?'Prestador e tomador':'Emitente e destinatário',parties)}${panel('02',svc?'Serviço contratado':'Produtos da venda',operation)}${classification}${panel(svc?'05':'03','Conferência',confirm)}</form></div><div class="order-column"><a class="order-jump" href="#order-mobile">Consultar pedido ↓</a><div id="order-mobile">${order(m)}</div></div></div>`;
  }
  function receipt() {
    const m=merchant(),f=state.form,svc=service(),total=svc?R.cents(f.amount):R.totals(f.lines).total;
    const codes=svc?[['CNAE',optionText(F.cnaes[f.cnae])],['CTN',optionText(F.ctns[f.ctn])],['NBS',optionText(F.nbs[f.nbs])],['ISS retido',f.issWithheld==='sim'?'Sim — conforme o contrato didático':'Não — conforme o contrato didático']]:[['Operação',m.category],['CNAE de referência',optionText(F.cnaes[m.cnae])]];
    const items=svc?`<section class="receipt-service"><h3>Discriminação do serviço</h3><p>${esc(f.description)}</p></section>`:`<div class="table-scroll"><table><caption>Produtos do pedido ${m.order.id}</caption><thead><tr><th scope="col">Produto</th><th scope="col">Quantidade</th><th scope="col">Unidade</th><th scope="col">Unitário</th><th scope="col">Subtotal</th></tr></thead><tbody>${f.lines.map((l,i)=>`<tr><th scope="row">${C.products[l.product].name}</th><td>${l.quantity}</td><td>${l.unit}</td><td>${R.money(R.cents(l.price))}</td><td>${R.money(R.totals(f.lines).subtotals[i])}</td></tr>`).join('')}</tbody></table></div>`;
    return `${steps(2)}<section class="success-banner"><span class="success-mark" aria-hidden="true">✓</span>${heading('OPERAÇÃO REGISTRADA NA SIMULAÇÃO','Nota emitida!',`Você ajudou ${m.name} a registrar ${svc?'seu serviço':'sua venda'} e contribuiu para a reconstrução da Vila do ED.`)}<p>Uma contribuição por tentativa. Explorar os outros percursos preserva sua conclusão.</p></section><article class="receipt"><div class="receipt-header"><div><p class="eyebrow">${m.category}</p><h2>${svc?'Nota de serviço simulada':'Nota de venda simulada'}</h2></div><strong>Simulação educacional — sem validade fiscal</strong></div><div class="receipt-parties"><div><small>${svc?'Prestador':'Emitente'}</small><h3>${m.name}</h3><p>${m.shop}</p></div><div><small>${svc?'Tomador':'Destinatário'} fictício</small><h3>${esc(f.recipient)}</h3><p>${esc(f.destination)}</p></div></div>${items}<dl class="classification-summary">${codes.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl><div class="total-row"><span>${svc?'Valor bruto do serviço':'Total da venda'}</span><strong>${R.money(total)}</strong></div><p class="quiet">Tributos não apurados. Códigos de referência sujeitos à revisão. Esta representação não é autorização fiscal, NF-e, DANFE, NFS-e ou DANFSe e não gera chave, protocolo ou QR Code.</p></article><div class="finish-actions"><button class="primary" data-action="finish">Concluir atividade ✓</button><button class="secondary" data-action="choose">Ajudar outro empresário</button></div>`;
  }
  function render(focus=true) {
    document.querySelector('#mode').textContent=bridge.mode==='demo'?'Modo demonstração • progresso neste navegador, sem registro no Moodle':'Modo Moodle • registro via SCORM 1.2';
    main.innerHTML=state.step==='home'?home():state.step==='choose'?choose():state.step==='form'?form():state.step==='receipt'?receipt():`<section class="end">${heading('CONTRIBUIÇÃO CONCLUÍDA','Obrigado por ajudar a vila.',bridge.mode==='demo'?'Você concluiu a demonstração. Nenhum resultado foi enviado ao Moodle.':'Sua aprovação e nota 100 foram confirmadas pela API do Moodle. Você pode voltar ao curso.')}</section>`;
    syncNotice();if(focus){main.focus();window.scrollTo(0,0);}
  }
  function check(emit) {
    errors=R.validate(state.merchant,state.form);
    if(Object.keys(errors).length){save();render(false);document.querySelector('#validation').textContent=`${Object.keys(errors).length} ponto(s) para revisar. Seu preenchimento foi mantido.`;document.querySelector('[aria-invalid="true"]')?.focus();return;}
    if(!emit){save();const b=document.querySelector('#validation');b.textContent='Tudo certo com os dados deste pedido! Você já pode emitir a nota simulada.';b.focus();return;}
    if(state.step!=='form')return;
    if(!state.completed){state.first={merchant:state.merchant,form:JSON.parse(JSON.stringify(state.form))};state.contributions=1;}
    state.completed=true;state.step='receipt';save();render();
  }
  function refresh(key) {const el=document.getElementById(key);el.innerHTML=options(key);el.disabled=!choices(key).length;document.querySelector(`#hint-${key}`).textContent=fieldHint(key);el.removeAttribute('aria-invalid');document.querySelector(`#error-${key}`).textContent='';delete errors[key];}
  main.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||bridge.finished)return;
    const action=b.dataset.action,id=b.dataset.merchant;
    if(id&&Object.hasOwn(C.merchants,id)){if(state.merchant!==id||!state.form||!Object.keys(R.validate(id,state.form)).length)state.form=R.blank(id);state.merchant=id;state.step='form';errors={};save();render();}
    else if(action==='choose'){state.step='choose';errors={};save();render();}
    else if(action==='check')check(false);
    else if(action==='finish'&&state.completed){const prior=state.step;state.step='end';if(bridge.finish(state))render();else{state.step=prior;syncNotice();}}
  });
  main.addEventListener('submit',e=>{e.preventDefault();if(!bridge.finished&&state.step==='form')check(true);});
  main.addEventListener('input',e=>{
    if(state.step!=='form'||bridge.finished)return;
    const key=e.target.id,match=/^(product|quantity|price)-(\d)$/.exec(key);
    if(match&&!service())state.form=R.updateLine(state.merchant,state.form,Number(match[2]),match[1],e.target.value);
    else if(key==='reviewed'||service()&&R.fields.includes(key))state.form=R.update(state.merchant,state.form,key,key==='reviewed'?e.target.checked:e.target.value);
    else return;
    if(key!=='reviewed')document.querySelector('#reviewed').checked=false;
    if(service()){
      if(key==='cnae'){refresh('ctn');refresh('nbs');}if(key==='ctn')refresh('nbs');
      if(!['amount','reviewed'].includes(key))document.querySelector(`#hint-${key}`).textContent=fieldHint(key);
    }
    delete errors[key];e.target.removeAttribute('aria-invalid');document.querySelector(`#error-${key}`).textContent='';document.querySelector('#validation').textContent='';
    const total=service()?R.cents(state.form.amount):R.totals(state.form.lines).total;
    document.querySelector('#grand-total').textContent=total===null?'Confira o valor':R.money(total);
    if(!service())R.totals(state.form.lines).subtotals.forEach((n,i)=>document.querySelector(`#subtotal-${i}`).textContent=R.money(n));
    clearTimeout(saveTimer);saveTimer=setTimeout(save,300);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&!bridge.finished)save();});
  window.addEventListener('pagehide',()=>{clearTimeout(saveTimer);if(!bridge.finished)bridge.finish(state);});
  window.addEventListener('pageshow',e=>{if(e.persisted)window.location.reload();});
  render(false);if(!bridge.error)save();else syncNotice();
})();
