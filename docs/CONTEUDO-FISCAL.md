# NFS-e simplificada — recorte e pesquisa fiscal

Revisão: **09/11/2026**, para a Semana Tributária 2026. A versão 2 atende ao pedido de um emissor **de serviços**, com CNAE → CTN → NBS, retenção de ISS e classificações de IBS/CBS. A versão 1 tratava de vendas de mercadorias. Os dados de aprovação anteriores são preservados, mas a nota antiga não é convertida em nota de serviço.

## Resultado e limite da pesquisa

Os códigos desta versão são **candidatos pesquisados**, e não números inventados. Foram encontrados em catálogos públicos secundários, com versões e cópias dos registros selecionados nas evidências. A confirmação nas tabelas oficiais vigentes e a revisão do enquadramento de cada contrato continuam pendentes. A interface informa essa condição; a validação comprova apenas a correspondência com a hipótese didática configurada.

Em 09/11/2026, as consultas oficiais abaixo retornaram **403 no túnel do proxy**, com TLS preservado:

- Portal NFS-e, documentação técnica: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica
- IBGE/CONCLA, CNAE: https://concla.ibge.gov.br/busca-online-cnae.html
- Receita Federal, Reforma Tributária do Consumo: https://www.gov.br/receitafederal/pt-br/assuntos/reforma-tributaria-do-consumo

O rascunho do ambiente recebeu `concla.ibge.gov.br`, preservando `www.gov.br`, `www.nfe.fazenda.gov.br` e `www.cgibs.gov.br`. Essa atualização do rascunho não liberou as consultas na instância. A revisão/salvamento das configurações é necessária para aplicá-la; publicação se refere à configuração/snapshot de tarefas futuras.

**Não foi possível verificar uma versão oficial vigente das notas técnicas, Anexos I/B/VIII ou tabelas da NFS-e em novembro de 2026.** A tela de exemplo fornecida pelo usuário é referência de fluxo, não prova de obrigação nacional universal a partir de 01/11/2026. Não copiamos essa afirmação como regra legal.

## Fontes secundárias efetivamente consultadas

| Fonte | Versão/conteúdo | Uso e limite |
| --- | --- | --- |
| https://github.com/rvgestaointeligente/nfse-rules | `tabela-lc116-nbs.json`, versão declarada 2026-09-14 | Descrições NBS, itens LC 116, desdobramentos CTN e sugestões IBS/CBS. A própria tabela registra ambiguidades e alternativas de CTN; elas foram resolvidas apenas pela hipótese do contrato didático. |
| https://github.com/JBCCONTABIL/codigosfiscais | Snapshot de `index.html` consultado em 09/11/2026 | Relações candidatas de CNAE com itens de serviço e descrições. Não é confirmação cadastral oficial ou autorização para NFS-e. |
| https://www.npmjs.com/package/@sinete/ibs-cbs-dados | Pacote 2026.9.3; dataset declarado 2026.09; manifesto conhecido em 30/09/2026 | Segunda conferência de NBS × item LC116 × cClassTrib e nomes de CST/cClassTrib. O fornecedor declara extração da Calculadora RFB V0059 e do IT 2025.002 v1.60, com hashes. As fontes primárias declaradas **não foram acessadas por nós**. |

Os pacotes npm usados na pesquisa foram conferidos contra seu SRI publicado. Nenhum código de terceiros foi executado ou incorporado como dependência da aplicação. Os snapshots GitHub têm hashes de arquivo registrados nas evidências; não são assinaturas ou autenticação oficial do conteúdo.

Foram também inspecionados `nfse-js@0.3.0`, `nfse-nacional@0.3.0`, `open-nfse@0.11.1` e `nfse-node@0.3.2` para entender estruturas e localizar referências, sem copiá-los como emissor real. O catálogo `br-data@1.0.1` foi **descartado**: sua NBS era 1.1, atualização de 2016, incompatível com a tabela de referência recente. Não foram transplantados seus números antigos.

Evidências dos registros e versões:

- [Candidatos CNAE/CTN/NBS e hashes dos snapshots](evidencias/candidatos-nfse.json).
- [Correlações e nomes IBS/CBS, com manifesto declarado pelo fornecedor](evidencias/ibs-cbs-candidatos.json).

## Hipóteses didáticas selecionadas

Todos os prestadores, tomadores, locais, contratos e preços são fictícios. Não há CPF/CNPJ, inscrição, e-mail real, consulta cadastral ou autorização. Serviços complementares foram criados expressamente para esta versão, sem tratar a venda de concreto/tábuas como serviço.

| Prestador / serviço fictício | Valor | CNAE candidato | CTN candidato | NBS candidata | CST / cClassTrib propostos | ISS no contrato didático |
| --- | ---: | --- | --- | --- | --- | --- |
| Zé: carga, descarga e arrumação de materiais sem contêineres, sem frete, armazenagem ou venda | R$ 250,00 | 5212-5/00 — Carga e descarga | 11.04.02 — Carga, descarga, arrumação | 1.0601.90.00 — Manuseio de cargas não classificado anteriormente | 000 / 000001 — Tributação integral | Não retido |
| Tina: concretagem por empreitada, somente mão de obra, materiais do tomador | R$ 1.800,00 | 4399-1/99 — Serviços especializados para construção não especificados anteriormente | 07.02.02 — Execução por empreitada/subempreitada | 1.0105.40.00 — Concretagem | 200 / 200046 — Operações com bens imóveis | Retido pelo tomador |
| Bené: serralheria em bancada, ajuste de suportes metálicos avulsos do cliente, sem venda de peças novas ou instalação em imóvel | R$ 450,00 | 2542-0/00 — Fabricação de artigos de serralheria, exceto esquadrias | 14.13.02 — Serralheria | 1.0107.50.00 — Carpintaria e serralharia | 000 / 000001 — Tributação integral | Não retido |

**Pendência especial do Bené:** o CNAE candidato tem descrição de fabricação. É indispensável confirmar a atividade cadastral, a natureza efetiva do ajuste/serviço e a fronteira entre prestação de serviço e industrialização/venda antes de homologar esse percurso. O simulador não afirma que toda operação de um estabelecimento nesse CNAE é sujeita a ISS. Se o especialista preferir outra prestação, trocam-se contrato e conjunto de opções em configuração, sem reescrever a interface.

**Pendência especial da Tina:** confirmar aplicabilidade do regime de bens imóveis, classificação da concretagem, condições legais e obrigações acessórias de obra. O recorte não implementa grupo de obra/CNO, município/UF reais, regime do prestador, cálculo ou XML/DPS. Portanto não é um emissor fiscal nacional completo nem uma simulação de todos os seus campos obrigatórios.

## Como as escolhas funcionam

- O cliente, o local, a discriminação e o valor vêm da escolha do personagem. O valor permanece editável para conferência, com validação contra o contrato.
- CNAEs exibidos pertencem apenas ao conjunto relacionado ao estabelecimento, com alternativas próximas. Não se expõe um catálogo nacional inteiro.
- O CTN é liberado após o CNAE e a NBS após o CTN. Alterar o CNAE limpa CTN/NBS; alterar CTN limpa NBS. As opções são relações **do exercício**, não um cadastro oficial universal e exclusivo CNAE → CTN.
- O mesmo item da LC 116 pode ter desdobramentos nacionais: a carga de Zé usa o candidato `110402`, e não `110401` de armazenagem; a empreitada de Tina usa `070202`, e não `070201` de administração; Bené usa `141302`, e não `141301` de carpintaria.
- A NBS de Bené encontrada na fonte reúne carpintaria e serralharia. Por isso esse ramo tem uma única opção de NBS, em vez de criar códigos falsos para servir de distrator.
- CST e cClassTrib são campos separados de CTN/NBS. Alterar CST limpa a classificação dependente. A narrativa de reconstrução **não** habilita automaticamente `200045`, de reabilitação urbana em condições legais específicas.
- Retenção é premissa explicitada no contrato. Não é inferida do CNAE nem tratada como verdade nacional para qualquer tomador. É necessária validação com LC 116/2003 e legislação municipal aplicável antes de uso real.

## Simplificações e revisão obrigatória

Não foram definidos alíquotas, benefícios, dispensa de recolhimento em 2026, NCM/CFOP de mercadorias, bases, reduções ou valores de ISS/IBS/CBS. A classificação candidata `200046` não foi usada para calcular qualquer benefício. O total é o valor bruto do serviço em centavos inteiros. Com ISS retido, o protótipo informa a responsabilidade do tomador, mas **não inventa valor líquido**; tributos e líquido são mostrados como não apurados. “Não apurado” não significa zero, isenção ou dispensa.

Antes da homologação pedagógica fiscal, o especialista deve conferir todas as tabelas oficiais vigentes, enquadramentos de cada contrato, registros CNAE, regime e município, retenção e dados acessórios. Registre as versões oficiais e a data dessa aprovação. Até lá, `VilaFiscal.officialVerified` permanece `false` e o aviso de candidatos pendentes aparece no emissor e na representação da nota.

Separação para manutenção: `app/config.js` contém contratos, preços e gabaritos didáticos; `app/classifications.js`, códigos, descrições e opções; `app/rules.js`, validação e dependências; `app/app.js`, interface. Nenhuma alíquota é definida apenas para fazer o exercício passar.
