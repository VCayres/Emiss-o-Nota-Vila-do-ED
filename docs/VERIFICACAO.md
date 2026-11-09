# Verificação da versão 2 — emissor NFS-e simplificado

Data: 09/11/2026. Python 3.12, Node 24, Chromium e Playwright do ambiente. Aplicação estática, sem dependências de produção. Testes funcionais executados sobre `dist/site`, a mesma cópia de arquivos usada pelo empacotador do ZIP.

## Resultados

- **22 testes unitários aprovados**: 14 de regras/retomada/classificações e 8 do adaptador SCORM. Nenhum caso desabilitado ou marcado como esperado falhar.
- Os três contratos trazem cliente, local, descrição e valor corretos; classificações vazias são rejeitadas e as escolhas do cenário são aceitas. Valores brutos: Zé R$ 250,00; Tina R$ 1.800,00; Bené R$ 450,00.
- Mudança de CNAE limpa CTN e NBS; mudança de CTN limpa NBS; CTN e NBS ficam desabilitados até a escolha anterior. As opções são limitadas ao estabelecimento e ao ramo selecionado.
- CST muda as opções de cClassTrib e limpa a seleção anterior. Classificações incompatíveis e o benefício não caracterizado de reabilitação urbana são rejeitados.
- Retenção ISS validada separadamente por contrato. Nenhuma alíquota ou valor líquido foi inventado. Campo monetário usa centavos inteiros; formatos negativos, exponenciais, inválidos e com milhar são rejeitados.
- Desktop: erro de preço, NBS, CTN e retenção sinalizado por campo; cliente e escolhas independentes preservados; correção, conferência e emissão concluídas. Submissão repetida não duplica contribuição.
- Celular 390 × 844: percurso da Tina emitido com retenção, sem transbordamento horizontal, com solicitação consultável durante o formulário.
- Teclado: Enter inicia a seleção; Tab alcança todos os campos após liberação. Todos os inputs, selects e textarea têm rótulos associados. Há foco visível, mensagens associadas e status acessível. Não foi feita auditoria completa com leitor de tela real.
- Demonstração: HTML único testado sobre HTTP local, incluindo imagem, estilos e novo catálogo de códigos incorporados; emissão completa do Bené. A política administrativa do navegador deste ambiente impede abrir `file://`; essa modalidade não foi homologada aqui.
- Retomada SCORM em iframe: cliente e escolhas dependentes recuperados; pendências corrigidas; passed/100 e limites 0–100 após validação; localização e tempo de sessão registrados; suspend_data abaixo de 4096 bytes.
- Falha de commit simulada produz aviso e nova tentativa funciona. Reabrir, explorar outro estabelecimento e emitir outra nota não reduz aprovação nem cria contribuição adicional. Finish executado uma vez.
- Migração de estado da versão 1 preserva uma aprovação/contribuição anterior e reinicia os formulários no fluxo de serviços. A nota antiga não é apresentada como NFS-e.
- **Zero exceções JavaScript e zero solicitações externas** no teste funcional concluído. Um primeiro teste falhou porque sua preparação de armazenamento tentava acessar localStorage de uma página sem origem; a preparação foi limitada a páginas HTTP e o teste completo foi reexecutado com sucesso. A aplicação não teve sua validação enfraquecida para aprovar o teste.
- Análise antivírus final do ZIP SCORM, HTML único e fontes: ClamAV 1.5.4, base 28177 de 08/11/2026, 10 arquivos examinados, 0 infectados, saída 0. Evidências em `docs/SEGURANCA-DOWNLOAD.md`.
- ZIP verificado: CRC válido, manifesto na raiz, namespaces IMS/ADL SCORM 1.2, uma organização/item/SCO, entrada `index.html`, oito arquivos de aplicação declarados (incluindo `classifications.js`) mais manifesto. Nenhuma URL externa de execução ou caminho de travessia. Não houve validação XSD independente ou certificação ADL.

Evidências geradas em `test-results/browser-report.json`, `desktop-opening.png`, `desktop-form.png`, `desktop-receipt.png` e `mobile-form.png`. `dist/package-verification.json` registra o SHA-256 do pacote. O pacote editável inclui as evidências disponíveis no momento do build.

## Limites

- Importação no Moodle real e relatórios da instância de destino não foram executados por falta de acesso a um Moodle fornecido. A integração foi testada com API SCORM 1.2 simulada em iframe.
- Códigos e hipóteses fiscais são candidatos de fontes secundárias; confirmação oficial vigente e revisão profissional pendentes. Ver `CONTEUDO-FISCAL.md`, incluindo a pendência específica de CNAE do Bené e os requisitos de obra de Tina omitidos no recorte.
- A arte adaptada continua sujeita à aprovação do responsável pela identidade visual.
- Qualquer resultado antivírus vale para os hashes, motor e base registrados em `SEGURANCA-DOWNLOAD.md`; não é certificação de ausência de malware ou diagnóstico do bloqueio original do Chrome.

## Reproduzir

```sh
npm test
npm run build
npm run test:browser
```

Na raiz do checkout. O teste funcional abre e fecha seu próprio servidor local. Servidor/Chromium podem exigir a execução suportada fora da sandbox local; preservar proxy, TLS e política de rede.
