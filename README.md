# Vila do ED · Semana Tributária 2026

> **Histórico do download:** houve um bloqueio pelo Chrome na versão 1. O [relatório de segurança](docs/SEGURANCA-DOWNLOAD.md) separa o alerta original e as análises realizadas por versão. A versão 2 foi examinada com ClamAV 1.5.4 e base 28177 de 08/11/2026: 10 arquivos, 0 infectados, saída 0. Uma análise vale apenas para os hashes e assinaturas registrados, sem esclarecer o alerta antigo do Chrome.

Simulador educacional funcional, estático e offline, com três percursos e um SCO SCORM 1.2. Uma nota validada conclui a tentativa. Explorar outros estabelecimentos não duplica a contribuição nem reduz a aprovação.

**Versão 2: emissor simplificado de NFS-e de serviços.** Cliente, local, discriminação e valor vêm preenchidos conforme o personagem. O participante escolhe CNAE → CTN → NBS, retenção do ISS e CST/cClassTrib de IBS/CBS. Os códigos são candidatos reais encontrados em fontes secundárias, com [proveniência e pendências de revisão](docs/CONTEUDO-FISCAL.md). As consultas oficiais seguem bloqueadas pela rede; não há enquadramento homologado, alíquotas ou apuração. A aprovação pedagógica significa correspondência com o cenário, não certificação fiscal.

[Ver uma captura do emissor corrigido](docs/evidencias/nfse-v2.png).

## Usar

- Demonstração sem instalação: baixe `dist/vila-do-ed-demonstracao.html` e abra no navegador. Esse arquivo único já inclui código, estilos e imagens, e é gerado por `npm run build`. O modo demonstração não registra resultados no Moodle. Caso o navegador restrinja arquivos locais, use o servidor descrito abaixo.
- Demonstração: execute `npm start` na raiz e acesse a porta 8000 localmente. Também é possível abrir `app/index.html` em navegadores que permitam arquivos locais; a política do Chromium deste ambiente bloqueia `file://`, portanto essa modalidade não foi validada aqui. Nenhuma instalação de dependências é necessária para executar a aplicação.
- Pacote Moodle: `dist/vila-do-ed-scorm12.zip`, criado com `npm run build` (Python 3.10+).
- Entrega editável: `dist/vila-do-ed-projeto.zip`, com fontes, documentação, pacote SCORM e evidências de testes disponíveis no momento do build. Importe no Moodle apenas o ZIP SCORM.
- Código: `app/`. Contratos/preços em `config.js`; códigos e opções em `classifications.js`; validação em `rules.js`; integração em `scorm.js`; interface em `app.js` e `styles.css`.
- Testes: `npm test` (Node 22+). Testes funcionais: `npm run build` seguido de `npm run test:browser`, com Python Playwright e Chromium instalados. O script de teste usa apenas servidor local temporário e API SCORM simulada; não exige acesso externo nem Moodle.

O armazenamento local é exclusivo da demonstração. Com uma API SCORM detectada, falhas no LMS são apresentadas e não são mascaradas por armazenamento local. Navegação privada e restrições a `file://` podem impedir a persistência da demonstração; nesse caso use o servidor local.

## Importar no Moodle

1. No curso, adicione uma atividade **Pacote SCORM** e envie o ZIP, sem descompactar. `imsmanifest.xml` já está na raiz; o ponto de entrada é `index.html`.
2. Use nota máxima 100, método de avaliação **Nota mais alta** e exibição na janela atual/iframe. Não habilite opções que substituam o status enviado pelo SCO (por exemplo, forçar conclusão ou status ao atingir a nota máxima), salvo decisão pedagógica testada.
3. Para conclusão do curso, configure a atividade para exigir aprovação. Não exija todos os percursos, nem múltiplas tentativas. Se desejar nova tentativa, use o mecanismo de tentativas do Moodle.
4. Homologue com um aluno de teste: iniciar e sair incompleto; retomar; emitir uma nota correta; confirmar `passed` e 100 no relatório; reabrir e explorar outro personagem sem perder aprovação; concluir e voltar ao curso.

**Importação em um Moodle real ainda não foi executada:** não foram fornecidos instância ou acesso. O pacote foi verificado localmente e o fluxo foi testado em iframe com API SCORM 1.2 simulada. Confira [relatório de verificação](docs/VERIFICACAO.md).

## Resultados e dados

A versão 2 preserva aprovações anteriores na retomada. Um formulário antigo de mercadorias é reiniciado no novo fluxo de serviços, sem converter sua nota em NFS-e. O SCO envia `cmi.core.lesson_status`, nota, limites 0–100, localização, tempo de sessão e `cmi.suspend_data`. Neste último ficam `v`, `step`, `merchant`, `form`, `completed`, `first` (primeiro percurso validado) e `contributions` (0 ou 1 por tentativa), além de `legacyCompleted` quando houve conclusão na versão anterior. O tempo é acumulado pelo LMS a partir das sessões, sem cronômetro eliminatório. O pacote não faz chamadas externas, não coleta dados pessoais, não cria ranking, não gera chave, protocolo ou QR Code fiscal.

O responsável pode consolidar aprovações nos relatórios do Moodle; os dados de retomada podem ser consultados no acompanhamento SCORM conforme permissões e versão do Moodle. Para contar pessoas, consolide uma aprovação por participante, não todas as tentativas ou reaberturas. O SCO não conhece totais globais e não envia eventos para um contador externo.

## Arte e revisão

Os anexos fornecidos orientaram o catálogo, os processos e a aparência. A arte `app/assets/vila.png` é uma adaptação gerada, não um novo asset canônico aprovado. As imagens dos cartões são recortes CSS dessa mesma imagem. Substituição e pendências em [ASSETS.md](docs/ASSETS.md).

Não há SEFAZ, certificado, autorização, API externa, CDN, backend ou dependência de IA na execução. Não são produzidos XML/DPS, DANFSe, chave, protocolo ou QR Code fiscal. Somente a geração inicial da arte utilizou ferramenta de imagem.
