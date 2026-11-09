# Recorte fiscal — comércio, indústria e serviço (versão 3)

Revisão: **09/11/2026**. O usuário pediu operações coerentes com os prints, identificou Tina como indústria produtora de concreto, confirmou que ISS é relativo a serviço e retirou por enquanto as perguntas específicas de reforma tributária. Esta versão substitui os contratos complementares de carga, concretagem e suportes metálicos da versão 2.

## Operações da vila

| Percurso | Operação avaliada | Referência cadastral candidata | Campos exercitados |
| --- | --- | --- | --- |
| Zé do Comércio — Comércio | Venda de 4 UD de concreto e 6 UD de tábua à Associação da Praça, total R$ 232,50 | CNAE 4744-0/99 — Comércio varejista de materiais de construção em geral | Seleção dos produtos, conferência de quantidade, unidade, preço e total. CNAE de referência já preenchido. |
| Tina Rocha — Pedreira | **Indústria: produção e venda do concreto fabricado**. Venda de 8 UD ao Centro Comunitário, total R$ 228,00 | CNAE 2330-3/05 — Preparação de massa de concreto e argamassa para construção | Produto, quantidade, unidade, preço e total. CNAE industrial de referência já preenchido. |
| Bené Tronco — Serralheria | Serviço didático de processamento de madeira fornecida pela biblioteca para preparar tábuas de uso final. Apenas serviço, R$ 150,00 | CNAE candidato 1622-6/99 — Fabricação de outros artigos de carpintaria para construção | CNAE → CTN → NBS e pergunta **ISS retido pelo tomador?** |

Zé mantém o catálogo completo: Concreto, Ervas Medicinais, Madeira, Pedra, Poção de Cura Menor, Tangerina e Tábua. Somente os materiais do pedido compõem a nota avaliada. Os preços são didáticos; o estoque 999 dos prints não foi usado como preço ou quantidade obrigatória.

Tina tem contexto produtivo explícito: **Processar Concreto**, 3 unidades de pedra e 6 segundos no jogo. Não há empreitada nem prestação de concretagem neste percurso. O material está pronto para venda; não se exige fabricar/coletar antes de emitir. O print não informa rendimento, composição técnica ou unidade comercial. **UD** não é m³.

Na Serralheria, a identificação do personagem continua sendo Serralheiro. O processo mostrado é **Processar Tábua**, 2 unidades de madeira e 5 segundos. Isso não determina quantidade faturada nem rendimento. Para modelar a prestação de serviço, o contrato declara expressamente que a madeira pertence ao tomador e que o destino é uso final na biblioteca, sem industrialização posterior ou revenda. Essa condição é hipótese didática, não uma informação presente no print.

## Serviço do Bené: códigos e pendências

Candidatos usados no exercício:

- **CNAE 1622-6/99** — Fabricação de outros artigos de carpintaria para construção.
- **CTN 14.13.01** — Carpintaria.
- **NBS 1.0107.50.00** — Serviços de carpintaria e de serralharia.
- **ISS não retido pelo tomador**: premissa explicitada na solicitação, sem alíquota ou valor de imposto calculado.

A natureza do processamento de madeira orienta a escolha do CTN; a placa Serralheiro não obriga a usar 14.13.02 para qualquer trabalho realizado no estabelecimento. A NBS pesquisada reúne carpintaria e serralharia, por isso o ramo tem uma opção de NBS, sem códigos falsos criados como distratores.

**Pendência de revisão profissional:** o CNAE candidato tem descrição de fabricação e não determina, sozinho, incidência de ISS. É necessário confirmar atividade cadastral e efetiva, natureza contratual e fronteira entre serviço, venda e industrialização por encomenda. Fornecimento de material pelo cliente, isoladamente, também não resolve essa análise. A hipótese de uso final declarada no exercício deve ser revisada com legislação e entendimento aplicáveis antes da homologação fiscal. Não afirmamos que todo processamento de madeira ou toda operação desse CNAE é sujeito a ISS.

A ausência de retenção não foi inferida do CNAE nem apresentada como regra geral nacional. Município, regime, responsabilidades e eventuais obrigações precisam ser conferidos. O simulador não calcula ISS ou valor líquido após retenções.

## Mercadorias e reforma

CTN/NBS e a pergunta de retenção de ISS **não aparecem nas vendas do Zé ou da Tina**. Isso não significa ausência de mudanças da reforma para comércio e indústria. Foram encontrados nos esquemas de NF-e/NFC-e os códigos CST de IBS/CBS e cClassTrib e os grupos de base, alíquota, valores e totalização. A pesquisa e seus limites estão em [REFORMA-COMERCIO-INDUSTRIA.md](REFORMA-COMERCIO-INDUSTRIA.md).

Conforme o recorte pedido, **não há perguntas, gabaritos ativos ou cálculos de CST/cClassTrib/IBS/CBS** nesta versão. Eles não ficaram escondidos como requisitos de validação. Sua retirada é pedagógica, não afirmação de dispensa em documentos reais.

Não foram inventados NCM, CFOP, CST de ICMS, alíquotas ou tributação padrão para os sete produtos. O ícone de concreto dos prints não define sua composição ou apresentação técnica. O CNAE 2330-3/05 é uma referência candidata para massa de concreto; se o produto for um artefato ou outro tipo de concreto, essa referência precisa ser revista. CNAE identifica atividade econômica e não substitui NCM nem classifica automaticamente cada operação/produto.

## Fontes e grau de confirmação

Consulta em 09/11/2026. Sites oficiais tentados por HTTPS, mantendo TLS:

- https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica
- https://concla.ibge.gov.br/busca-online-cnae.html
- https://www.nfe.fazenda.gov.br/portal/principal.aspx
- https://www.gov.br/receitafederal/pt-br/assuntos/reforma-tributaria-do-consumo
- https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos

Essas consultas foram bloqueadas pelo proxy com **403**. Não foi confirmado diretamente o conteúdo oficial vigente, cronograma de obrigatoriedade por regime ou versão de nota técnica aplicável em novembro de 2026. A existência de um campo em cópia de XSD não estabelece, sozinha, sua obrigatoriedade fiscal.

Fontes secundárias efetivamente lidas, sem executar código de terceiros:

| Fonte | Conteúdo e uso |
| --- | --- |
| https://github.com/GuiCoimbraDeveloper/Tabela-CNAE-2.3 | Planilha CNAE 2.3; o repositório declara origem IBGE/CADESP e vigência a partir de 01/01/2019. Confirmou os códigos/descrições candidatos de comércio de materiais, preparação de concreto e artigos de carpintaria. Não é uma tabela de novos códigos da reforma. |
| https://github.com/JBCCONTABIL/codigosfiscais | Catálogo de relações candidatas CNAE/itens de serviços, inspecionado na pesquisa anterior. Não é confirmação cadastral oficial. |
| https://github.com/rvgestaointeligente/nfse-rules | `tabela-lc116-nbs.json`, versão declarada 2026-09-14; descrição de NBS e desdobramentos de CTN. |
| https://github.com/nfephp-org/sped-nfe | Cópia dos XSD na pasta `PL_010_V1.30`; confirmou existência e nomes dos campos de IBS/CBS da NF-e/NFC-e, não sua vigência oficial universal. |

A planilha foi lida como dados, e os arquivos das fontes têm hashes registrados. Evidências: [CNAEs pesquisados](evidencias/cnae-v3-pesquisa.json), [registro anterior de CTN/NBS](evidencias/candidatos-nfse.json), [campos da reforma](evidencias/reforma-nfe-campos.json). As fontes de CST/cClassTrib consultadas na versão 2 permanecem como histórico, sem serem dependência ou gabarito da versão atual.

O antigo catálogo NBS 1.1 de `br-data@1.0.1`, com atualização de 2016, foi descartado. Não transplantamos seus números para a versão recente.

## Implementação e limites

- `app/config.js`: estabelecimentos, operação, catálogo, pedidos, preços e premissas didáticas.
- `app/classifications.js`: referências candidatas de CNAE e códigos do serviço; sem catálogo ativo de CST/cClassTrib.
- `app/rules.js`: regras separadas para mercadoria e serviço. Valores em centavos inteiros; quantidades inteiras de 1–9999.
- `app/app.js`: formulário e representação da operação correspondente. Nunca apresenta a venda industrial como NFS-e.

Todos os dados cadastrais são fictícios e preenchidos automaticamente. Não há coleta de CPF/CNPJ real, envio à SEFAZ ou prefeitura, certificado, XML/DPS autorizado, DANFE/DANFSe, chave, protocolo ou QR Code. A representação contém **Simulação educacional — sem validade fiscal**. “Tributos não apurados” não significa isenção ou alíquota zero.

O resultado pedagógico comprova correspondência com o pedido e com a hipótese configurada, não certificação fiscal. Confirmar fontes oficiais e revisão profissional continua necessário antes de usar a atividade como orientação de emissão real.
