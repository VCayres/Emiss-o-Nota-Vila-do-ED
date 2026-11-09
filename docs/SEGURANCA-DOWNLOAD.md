# Investigação do alerta de download

Este documento distingue a versão 1 analisada em 03/11/2026 e a versão 2 de NFS-e analisada em 09/11/2026. Os hashes são diferentes por causa das mudanças funcionais solicitadas, não para contornar a detecção.

## Registro histórico — versão 1

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


## Versão 2 — emissor simplificado de NFS-e, 09/11/2026

O novo ZIP inclui classificações e validações de serviços solicitadas pelo usuário. A análise anterior não foi reaproveitada como evidência para esses bytes.

- Motor oficial: **ClamAV 1.5.4**.
- Base: **28177, 08/11/2026 06:23:52 UTC**, da imagem oficial `clamav/clamav:stable` disponível na data da consulta.
- Manifesto da plataforma amd64: `sha256:2a9be29239aea6c6fe17da9625f3c192f91974e61059d364e293f20277f931a3`.
- Digests de manifesto, configuração, blobs e camadas descomprimidas conferidos. TLS preservado.
- Contêiner sem rede, sem capacidades adicionais e com projeto somente de leitura; nenhum arquivo do projeto foi executado ou enviado para análise externa.
- Alvos: ZIP SCORM, HTML único de demonstração e oito arquivos de aplicação. O ZIP editável completo não foi alvo desta análise final: ele é montado depois para incluir também documentação e evidências.
- Resultado: **10 arquivos examinados, 2 diretórios, 0 infectados, saída 0**, sem avisos ou erros na execução final; 16,36 MiB analisados; 22,903 segundos.
- A primeira execução da versão 2, com a base antiga de 01/11, também não detectou ameaças, mas emitiu aviso de base com mais de sete dias. Esse aviso motivou a obtenção da imagem oficial mais recente e a execução final acima; não foi omitido nem contornado.

SHA-256 do novo ZIP SCORM:

```text
5f22f649297f05f57acaf466eb69a6c9a074f8b7458a19ecb0ad4e1ac7fb5bfd
```

Evidências: [log final](evidencias/clamav-nfse-v2.log) e [relatório com hashes dos arquivos examinados](evidencias/clamav-nfse-v2.json). Os hashes foram novamente conferidos após o empacotamento final. O resultado vale para esse motor/base e esses arquivos; não comprova falso positivo do alerta original nem ausência universal de malware.


## Versão 3 — comércio, indústria, serviço e figuras transparentes, 09/11/2026

O novo build foi alterado para atender ao recorte de operações e às imagens pedido pelo usuário. As análises das versões anteriores foram preservadas como histórico e não usadas como prova para esses novos bytes.

- ClamAV **1.5.4**, base **28177, 08/11/2026 06:23:52 UTC**, imagem oficial stable com manifesto amd64 `sha256:2a9be29239aea6c6fe17da9625f3c192f91974e61059d364e293f20277f931a3`.
- Contêiner sem rede, sem capacidades adicionais, arquivos somente de leitura e temporários separados. Nenhum código do pacote foi executado pelo scanner, e nenhum arquivo foi enviado a serviço externo de análise.
- Alvos: ZIP SCORM, HTML único e nove arquivos de aplicação, incluindo a nova imagem PNG transparente. O ZIP editável completo é gerado depois para incluir os relatórios e não foi alvo desta análise.
- **11 arquivos examinados, 2 diretórios, 0 infectados, saída 0**, sem avisos/erros; 25,33 MiB analisados; 24,840 segundos.
- Hashes registrados antes e conferidos após a execução e o build final.

SHA-256 do ZIP SCORM da versão 3:

```text
e7e13cdec29acbc13506b5edda6e668df44134df111ec600425732a180d2ae93
```

Evidências: [log](evidencias/clamav-v3.log) e [relatório e hashes](evidencias/clamav-v3.json). O resultado é limitado a esse motor/base e a esses arquivos e não é certificação de ausência de malware ou diagnóstico do alerta original do Chrome. Não houve alteração de formato para contornar uma detecção.
