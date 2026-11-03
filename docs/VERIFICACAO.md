# Verificação da entrega

Execução em 03/11/2026. Ambiente: Python 3.12.14, Node 24.22.1, npm 11.9.0, Chromium do ambiente e Playwright Python. Os testes de navegador usam a cópia de distribuição em `dist/site`, produzida pelo mesmo empacotador que cria o ZIP.

## Verificado

- 16 testes automatizados de regras e adaptador, todos aprovados, sem testes desabilitados. O comando `npm test` usa execução sem isolamento entre arquivos para expor a contagem dos casos individuais neste runtime.
- Nos três percursos, nota vazia é rejeitada e o preenchimento correto é aceito. Valores esperados: Zé R$ 232,50; Tina R$ 228,00; Bené R$ 197,50.
- Cálculos em centavos inteiros; rejeição de valores negativos, notação exponencial, frações indevidas e formato inválido; unidade e destinatário conferidos; item repetido ou incompatível rejeitado; itens ficcionais fora dos pedidos avaliados.
- Navegador desktop: preencher, conferir, corrigir erro de preço e produto, preservar outros valores e emitir. Clique/submissão repetida não cria segunda contribuição. Representação legível da venda e avisos educacionais presentes.
- Navegador móvel 390 × 844: percurso da Tina concluído, ausência de transbordamento horizontal da página e acesso ao pedido durante o formulário.
- Teclado: entrada por Enter e Tab em todos os controles interativos do formulário; `input` e `select` com rótulos associados. Foco visível, erros por campo, mensagens de status e preferência de movimento reduzido implementados. Não foi realizada auditoria WCAG completa com leitores de tela reais.
- Sem LMS: modo demonstração explicitamente identificado, retomada local e preservação da primeira contribuição ao explorar um segundo percurso.
- Dentro de iframe com API SCORM 1.2 simulada: initialize, incomplete, retomada parcial, passed, nota 100, limites 0–100, localização, tempo, suspend_data inferior a 4096 bytes, commits importantes e finish único.
- Falha simulada de commit: aviso visível, botão de nova tentativa e confirmação de gravação após recuperação. API LMS com falha não recebe fallback silencioso para armazenamento local.
- Reentrada aprovada e exploração opcional não rebaixam status. Nova tentativa com `entry=ab-initio` não herda progresso da tentativa anterior. Descoberta da API suporta pais/opener com guardas de origem e limite de percurso.
- Nenhuma exceção JavaScript ou solicitação externa nos testes funcionais sobre HTTP local.
- Empacotamento: ZIP com CRC válido, manifesto XML com namespace IMS e ADL SCORM 1.2, uma organização, um item, um SCO e `index.html` como entrada. Cada arquivo local é declarado e está presente. Não há caminhos absolutos, travessia de diretório ou URLs externas no código de execução. Asserções estruturais foram executadas; não foi realizada validação XSD independente ou certificação ADL.
- O comando de desenvolvimento `npm start` foi executado; a página e os scripts foram servidos com HTTP 200. Não há instalação de dependências de aplicação.

Evidências geradas: `test-results/browser-report.json`, capturas `desktop-opening.png`, `desktop-receipt.png`, `mobile-form.png`; `dist/package-verification.json` contém o SHA-256 do ZIP. `npm run build` é determinístico para os mesmos arquivos de entrada.

## Limitações e pendências

- **Moodle real:** não foi fornecida instância. A importação e os relatórios finais precisam de homologação no Moodle de destino. O teste de API simulada não substitui essa verificação.
- **Conteúdo fiscal vigente:** acesso às fontes oficiais bloqueado pelo proxy com 403. A entrega é o recorte demonstrativo descrito em `CONTEUDO-FISCAL.md`, sem códigos/alíquotas ou apuração. Nenhuma versão técnica fiscal foi validada.
- **Arte:** adaptação gerada das referências anexadas, sujeita à aprovação visual; substituível sem alterar regras.
- **Arquivo local:** `file://` bloqueado pela política administrativa do Chromium do ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`). Demonstração autônoma validada por HTTP local; não foram alteradas políticas do navegador para contornar esse bloqueio.
- Navegadores adicionais, leitores de tela reais e a versão específica do Moodle de destino não foram testados.

## Reproduzir

Na raiz do repositório:

```sh
npm test
npm run build
npm run test:browser
```

O teste funcional inicia e encerra seu próprio servidor temporário. No ambiente gerenciado, os comandos que abrem sockets e executam Chromium podem exigir a permissão de execução fornecida pela plataforma. Não desabilite TLS ou controles de rede.
