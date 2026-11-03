# Investigação do alerta de download

Em 03/11/2026, foi relatado e mostrado em captura o aviso do Chrome **“Falha — Vírus detectado”** para `vila-do-ed-scorm12.zip`, com origem `chatgpt.com`. Não foi informado nome técnico de ameaça ou arquivo interno. O usuário informou que o histórico anterior do Windows deixou de estar disponível após instalar o Avast e que uma verificação posterior do computador não encontrou ameaças. Essa verificação do computador não demonstra que o ZIP interrompido foi examinado integralmente.

## Integridade e revisão inicial

O ZIP no GitHub foi obtido por Git e comparado byte a byte com o original local. Ambos têm SHA-256:

```text
4759e3c0c52db6d88e3fe62e48d4f71a6febd25abfdd295e639000e6bbb2d179
```

Seus oito membros são `app.js`, `config.js`, `rules.js`, `scorm.js`, `styles.css`, `index.html`, `imsmanifest.xml` e `assets/vila.png`. O CRC do ZIP é válido, não há membros criptografados e os sete arquivos de aplicação correspondem às fontes. O manifesto é gerado pelo empacotador. A revisão estática não identificou executáveis nativos, execução por `eval`/`Function` ou requisições externas na aplicação. Isso não substitui análise por antivírus.

## Análise independente realizada

- Motor: **ClamAV 1.5.4**.
- Base incluída na imagem: **28171, 01/11/2026 06:27:34 UTC**. Não foi afirmado que essa era a base mais recente: o acesso direto ao servidor de atualizações recebeu bloqueio 403.
- Fonte: imagem oficial `clamav/clamav:1.5.4`, plataforma Linux amd64, manifesto `sha256:26509520043b68576c95e76576673d90b423fccb765dc8cba3a9fdc143891bf5`.
- A imagem foi obtida pelo proxy autorizado via protocolo do registro Docker. Foram verificados os digests de manifesto, configuração e blobs, além dos hashes das camadas descomprimidas. TLS e verificação de integridade permaneceram habilitados.
- A execução ocorreu em contêiner sem rede, sem capacidades adicionais, com raiz e projeto somente de leitura e área temporária própria. Nenhum arquivo do projeto foi executado. Não foram enviados arquivos a serviços de análise externos.
- Alvos: ZIP SCORM original, HTML de demonstração, ZIP completo do projeto e diretório `app`. Os hashes desses alvos foram registrados e conferidos após a análise.
- Arquivos examinados: **10**, com análise de arquivos compactados habilitada. A contagem é a reportada pelo motor; não representa a soma de cada membro descompactado.
- Diretórios examinados: **2**.
- Dados analisados: **31,31 MiB**.
- Detecções: **0 arquivos infectados**.
- Código de saída: **0**, sem erros ou avisos no log final.
- Duração: **68,230 segundos**.
- Assinaturas conhecidas pelo motor: **3.628.245**.

Uma execução anterior não conseguiu ler os arquivos por permissões do usuário do contêiner, terminou com código 2 e examinou zero arquivos. Ela foi descartada como evidência de segurança. A execução válida acima usou o UID/GID proprietário dos arquivos e confirmou que arquivos foram efetivamente examinados.

Evidências da execução válida:

- [Log original do ClamAV](evidencias/clamav-scan.log).
- [Relatório com hashes dos alvos](evidencias/clamav-scan.json).

## Limites e orientação

O resultado registra ausência de detecções por **esse motor e essa base, nesses arquivos**. Não é certificação de segurança, não reproduz os mecanismos de Windows/Chrome/Avast e não permite classificar definitivamente o alerta original como falso positivo. A causa original continua sem diagnóstico por falta do registro técnico da detecção.

Não foram renomeados, reempacotados ou alterados os arquivos para contornar o alerta. O hash do ZIP SCORM permanece o mesmo da entrega original. Os únicos arquivos alterados nesta atualização são documentação e evidências.

Com o antivírus instalado, atualizado e ativo, uma nova tentativa normal de download pode gerar um resultado atual ou um novo registro de detecção. Se ocorrer novo bloqueio, interrompa a tentativa e registre nome técnico, caminho afetado e horário no antivírus ativo. Não desative proteções, não crie exceções e não use outro navegador ou formato para contornar o bloqueio.
