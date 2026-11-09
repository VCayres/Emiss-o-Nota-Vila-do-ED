# Verificação da versão 3

Data: 09/11/2026. Aplicação estática em Python/Node/Chromium/Playwright disponíveis no ambiente. Os testes funcionais usam a cópia `dist/site` produzida pelo mesmo empacotador do ZIP.

## Funcionalidade e regressão

**27 testes unitários aprovados**, sem casos desabilitados: 19 de regras/retomada e 8 do adaptador SCORM.

- Comércio do Zé: catálogo com os sete produtos dos prints. Pedido avaliado de concreto/tábua, total R$ 232,50. Produto fora do pedido (inclusive ficcional), repetição, quantidade, unidade, preço e total incorretos rejeitados. Correção mantém o resto do trabalho.
- Pedreira da Tina: categoria de **indústria**, produção de concreto a partir de pedra e venda de produto próprio. CNAE de referência industrial, só concreto disponível no pedido, total R$ 228,00. Não há prestação de concretagem, CTN, NBS ou retenção de ISS sobre essa venda.
- Serralheria do Bené: processamento de madeira do tomador para preparar tábuas, serviço de R$ 150,00. Mantida a identificação Serralheiro; retiradas as peças metálicas da hipótese anterior. CNAE, CTN, NBS e retenção validados conforme o contrato didático, sujeitos à revisão fiscal documentada.
- CTN libera após CNAE; NBS após CTN. Mudar antecedente limpa dependentes. Dados fixos e valor permanecem.
- Os formulários de mercadorias não contêm dados de retenção/CTN/NBS, nem mesmo ocultos no estado salvo. CST/cClassTrib deixaram de ser requisito de qualquer percurso. Retomada sanitiza campos obsoletos.
- Valores em centavos inteiros; formatos monetários inválidos e quantidades fora de 1–9999 rejeitados. Vendas podem ter os itens reordenados, sem omissão ou duplicação.
- Uma emissão correta basta. Submissão repetida e exploração de outro estabelecimento não duplicam contribuição.

## Tela e acessibilidade

- A arte da abertura foi preservada. Os retratos novos têm transparência verdadeira, com margens para cabeça e pés em cada personagem. PNG RGBA de 1536 × 1024, separado em janelas SVG; nenhum pixel do arquivo foi editado por scripts locais.
- Inspeção visual detectou fragmentos dos vizinhos nas faixas laterais de ajuste do SVG. Foram adicionadas máscaras explícitas por personagem e o teste completo foi repetido com sucesso. A versão final mostra somente uma figura completa por cartão.
- Desktop e celular 390 × 844: figuras de corpo inteiro, cartões responsivos, sem transbordamento horizontal da página. Solicitação consultável durante o formulário.
- Teclado por Enter/Tab alcança seleção e campos; inputs, selects e textarea têm labels. Foco visível, mensagens por campo e status acessível. Não foi feita auditoria completa com leitor de tela real.
- HTML único testado por HTTP local, com a arte e a folha transparente incorporadas como dados. Navegação e emissão do serviço funcionaram sem arquivos externos. A política do navegador deste ambiente bloqueia `file://`; essa modalidade não foi homologada aqui.
- Zero exceções JavaScript e zero solicitações externas no teste concluído.

## SCORM e empacotamento

- Iframe com API SCORM simulada: initialize/incomplete, retomada parcial de venda industrial, correção, passed/100, limites 0–100, localização e tempo de sessão. Falha de commit visível e nova tentativa bem-sucedida.
- Reabrir e explorar serviço após venda aprovada preserva a aprovação e a primeira contribuição. Finish executado uma vez. Suspend_data abaixo de 4096 bytes.
- Migração das versões 1 e 2 preserva conclusões; notas antigas incompatíveis não são apresentadas como novas notas válidas.
- ZIP com manifesto XML na raiz, uma organização/item/SCO, namespaces IMS e ADL SCORM 1.2, entrada `index.html`; nove arquivos de aplicação (incluindo duas imagens) mais manifesto, todos declarados. CRC, referências e caminhos verificados. Sem URL externa de execução ou caminho de travessia.
- Não houve validação XSD independente ou certificação ADL. Homologação em um Moodle real permanece pendente por falta de acesso fornecido.

Evidências: `test-results/browser-report.json`, capturas desktop/mobile, `docs/evidencias/selecionar-v3.png` e `docs/evidencias/browser-v3.json`. SHA-256 do pacote em `dist/package-verification.json`. O ZIP editável inclui fontes, documentação e evidências disponíveis no build.

O build final foi examinado com ClamAV 1.5.4 e base 28177 de 08/11/2026: 11 arquivos, 0 infectados, saída 0. O resultado antivírus de outra versão não é reaproveitado como prova de segurança de novos bytes; consulte os registros por versão em `SEGURANCA-DOWNLOAD.md`.

## Conteúdo fiscal: limite da verificação

Os códigos de atividade e serviço são candidatos de fontes secundárias; confirmação oficial e revisão especializada permanecem pendentes. Foram verificados nomes/estrutura de novos campos de IBS/CBS em cópia pública de esquemas da NF-e/NFC-e, sem alegar obrigatoriedade universal por regime/data. Veja `CONTEUDO-FISCAL.md` e `REFORMA-COMERCIO-INDUSTRIA.md`.

## Reproduzir

```sh
npm test
npm run build
npm run test:browser
```

Na raiz do checkout. O teste funcional abre e fecha servidor temporário próprio. Sockets, Chromium e Docker podem exigir execução suportada fora da sandbox; preserve proxy, TLS e política de rede.
