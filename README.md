# Vila do ED · Semana Tributária 2026

> **Análise de segurança do download:** foi relatado o aviso **“Vírus detectado”** durante o download pelo Chrome. A causa e o nome técnico daquela detecção não foram recuperados. Em análise independente posterior, o **ClamAV 1.5.4**, com base **28171 de 01/11/2026**, examinou os três artefatos de distribuição e os arquivos da aplicação: **10 arquivos examinados, 0 infectados, código de saída 0**. Consulte o [relatório e as evidências](docs/SEGURANCA-DOWNLOAD.md). Isso não reproduz o mecanismo do Windows/Chrome nem comprova falso positivo. Mantenha as proteções habilitadas; se houver novo bloqueio, preserve o alerta e obtenha os detalhes da detecção no antivírus ativo.
>
> O ZIP SCORM publicado foi comparado com o original e tem SHA-256 `4759e3c0c52db6d88e3fe62e48d4f71a6febd25abfdd295e639000e6bbb2d179`. Essa igualdade confirma integridade, sem comprovar ausência de malware. O pacote original foi preservado, sem alterações destinadas a contornar a detecção.

Simulador educacional funcional, estático e offline, com três percursos e um SCO SCORM 1.2. Uma nota validada conclui a tentativa. Explorar outros estabelecimentos não duplica a contribuição nem reduz a aprovação.

**Recorte entregue: protótipo fiscal demonstrativo.** As esferas de IBS/CBS são trabalhadas conceitualmente. Não há enquadramento por produto, códigos fiscais, alíquotas ou apuração. As consultas oficiais foram bloqueadas pela rede; veja [documentação fiscal](docs/CONTEUDO-FISCAL.md). A aplicação pode ser importada para homologação pedagógica, sem representar orientação fiscal validada para novembro de 2026.

## Usar

- Demonstração sem instalação: baixe `dist/vila-do-ed-demonstracao.html` e abra no navegador. Esse arquivo único já inclui código, estilos e imagens, e é gerado por `npm run build`. O modo demonstração não registra resultados no Moodle. Caso o navegador restrinja arquivos locais, use o servidor descrito abaixo.
- Demonstração: execute `npm start` na raiz e acesse a porta 8000 localmente. Também é possível abrir `app/index.html` em navegadores que permitam arquivos locais; a política do Chromium deste ambiente bloqueia `file://`, portanto essa modalidade não foi validada aqui. Nenhuma instalação de dependências é necessária para executar a aplicação.
- Pacote Moodle: `dist/vila-do-ed-scorm12.zip`, criado com `npm run build` (Python 3.10+).
- Entrega editável: `dist/vila-do-ed-projeto.zip`, com fontes, documentação, pacote SCORM e evidências de testes disponíveis no momento do build. Importe no Moodle apenas o ZIP SCORM.
- Código: `app/`. Dados/preços em `config.js`; recorte e validação em `rules.js`; integração em `scorm.js`; interface em `app.js` e `styles.css`.
- Testes: `npm test` (Node 22+). Testes funcionais: `npm run build` seguido de `npm run test:browser`, com Python Playwright e Chromium instalados. O script de teste usa apenas servidor local temporário e API SCORM simulada; não exige acesso externo nem Moodle.

O armazenamento local é exclusivo da demonstração. Com uma API SCORM detectada, falhas no LMS são apresentadas e não são mascaradas por armazenamento local. Navegação privada e restrições a `file://` podem impedir a persistência da demonstração; nesse caso use o servidor local.

## Importar no Moodle

1. No curso, adicione uma atividade **Pacote SCORM** e envie o ZIP, sem descompactar. `imsmanifest.xml` já está na raiz; o ponto de entrada é `index.html`.
2. Use nota máxima 100, método de avaliação **Nota mais alta** e exibição na janela atual/iframe. Não habilite opções que substituam o status enviado pelo SCO (por exemplo, forçar conclusão ou status ao atingir a nota máxima), salvo decisão pedagógica testada.
3. Para conclusão do curso, configure a atividade para exigir aprovação. Não exija todos os percursos, nem múltiplas tentativas. Se desejar nova tentativa, use o mecanismo de tentativas do Moodle.
4. Homologue com um aluno de teste: iniciar e sair incompleto; retomar; emitir uma nota correta; confirmar `passed` e 100 no relatório; reabrir e explorar outro personagem sem perder aprovação; concluir e voltar ao curso.

**Importação em um Moodle real ainda não foi executada:** não foram fornecidos instância ou acesso. O pacote foi verificado localmente e o fluxo foi testado em iframe com API SCORM 1.2 simulada. Confira [relatório de verificação](docs/VERIFICACAO.md).

## Resultados e dados

O SCO envia `cmi.core.lesson_status`, nota, limites 0–100, localização, tempo de sessão e `cmi.suspend_data`. Neste último ficam `v`, `step`, `merchant`, `form`, `completed`, `first` (primeiro percurso validado) e `contributions` (0 ou 1 por tentativa). O tempo é acumulado pelo LMS a partir das sessões, sem cronômetro eliminatório. O pacote não faz chamadas externas, não coleta dados pessoais, não cria ranking, não gera chave, protocolo ou QR Code fiscal.

O responsável pode consolidar aprovações nos relatórios do Moodle; os dados de retomada podem ser consultados no acompanhamento SCORM conforme permissões e versão do Moodle. Para contar pessoas, consolide uma aprovação por participante, não todas as tentativas ou reaberturas. O SCO não conhece totais globais e não envia eventos para um contador externo.

## Arte e revisão

Os anexos fornecidos orientaram o catálogo, os processos e a aparência. A arte `app/assets/vila.png` é uma adaptação gerada, não um novo asset canônico aprovado. As imagens dos cartões são recortes CSS dessa mesma imagem. Substituição e pendências em [ASSETS.md](docs/ASSETS.md).

Não há SEFAZ, certificado, autorização, API externa, CDN, backend ou dependência de IA na execução. Somente a geração inicial da arte utilizou ferramenta de imagem.
