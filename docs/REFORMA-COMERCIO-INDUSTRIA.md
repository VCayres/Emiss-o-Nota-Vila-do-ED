# Verificação: mudanças da reforma na NF-e/NFC-e de comércio e indústria

Consulta realizada em **09/11/2026**, antes de concluir a versão 3 do simulador, a pedido do usuário.

**Sim, existem novos códigos e campos de IBS/CBS para operações documentadas por NF-e/NFC-e, tanto no comércio quanto na indústria.** Eles não são CTN/NBS da NFS-e e não dependem apenas do ramo da empresa: a operação, o produto, o regime e a data precisam ser considerados.

## O que foi constatado

Foi inspecionada a cópia pública de esquemas mantida pelo NFePHP, pasta `schemes/PL_010_V1.30`, arquivos `leiauteNFe_v4.00.xsd` e `DFeTiposBasicos_v1.00.xsd`:

| Código / grupo | Função no leiaute |
| --- | --- |
| `IBSCBS` | Grupo de informações de IBS/CBS do item. |
| `CST` dentro do tipo de tributação IBS/CBS | Situação tributária específica de IBS/CBS, distinta dos CST de ICMS, PIS ou Cofins presentes em outros grupos. |
| `cClassTrib` | Classificação tributária de IBS/CBS, relacionada ao tratamento aplicável. Não é CNAE, NCM ou NBS. |
| `gIBSCBS` / `vBC` | Grupo de tributação e base de cálculo. |
| `gIBSUF`, `pIBSUF`, `vIBSUF` | Informações do componente estadual do IBS. |
| `gIBSMun`, `pIBSMun`, `vIBSMun` | Informações do componente municipal do IBS. |
| `gCBS`, `pCBS`, `vCBS` | Informações da CBS. |
| `IBSCBSTot` | Totalização dos novos tributos no documento. |
| `vItem` e `vNFTot` | Valores de item/nota previstos no leiaute relacionado às mudanças. |

O esquema também contempla `IS` e `ISTot` para Imposto Seletivo. A existência desses grupos **não significa incidência sobre todos os produtos** e não foi usada para atribuir IS ao concreto, às tábuas ou ao catálogo ficcional. Vigência e aplicabilidade dependem de confirmação legal/técnica.

As tabelas secundárias já consultadas de `@sinete/ibs-cbs-dados@2026.9.3` também relacionam classificações IBS/CBS a NF-e modelo 55 e NFC-e modelo 65. Não selecionamos uma classificação como padrão para todos os produtos, nem copiamos automaticamente a tributação dos serviços para as mercadorias.

## Distinções necessárias

- **CNAE:** atividade econômica do estabelecimento. Não foi criado pela reforma e não é o código fiscal do produto.
- **NCM:** classificação da mercadoria. Não foi criada pela reforma. Exige informações técnicas do produto que os prints não fornecem.
- **CFOP:** natureza/circulação da operação fiscal; também preexistente.
- **CTN, no sentido usado pela tela de NFS-e:** Código de Tributação Nacional do serviço. Não confundir com a lei denominada Código Tributário Nacional.
- **NBS:** nomenclatura de serviços, intangíveis e outras operações abrangidas por essa classificação. Não substitui NCM na venda de concreto.
- **CST de IBS/CBS e cClassTrib:** novos elementos de classificação dos tributos da reforma. Não substituem indistintamente todos os códigos anteriores durante a transição.
- **ISS:** imposto relativo a serviços. Não introduzimos retenção de ISS nas vendas de mercadorias do Zé ou do concreto produzido por Tina.

Uma indústria pode prestar um serviço e, nessa operação, precisar de campos de NFS-e. Isso não transforma a venda de seu produto fabricado em prestação de serviço.

## O que não foi possível confirmar

As consultas ao Portal Nacional da NF-e, à Receita Federal e à SVRS receberam **403 no túnel HTTPS do proxy do ambiente**, com TLS preservado. Portanto:

- A consulta ao NFePHP é uma **fonte secundária**, não acesso direto à publicação oficial.
- O nome da pasta `PL_010_V1.30` não é apresentado como prova da versão oficial vigente da nota técnica na data do evento.
- A presença de um campo no XSD não comprova obrigatoriedade universal. Regras de validação podem exigir grupos condicionalmente; `minOccurs=0` no esquema não demonstra dispensa fiscal.
- Não foram confirmados cronograma de exigência por regime, dispensas em 2026, alíquotas, códigos adequados a cada mercadoria ou atos posteriores às versões copiadas.

Fonte efetivamente inspecionada: https://github.com/nfephp-org/sped-nfe/tree/master/schemes

Registros de campos, contexto no esquema, hash do snapshot e tentativas oficiais: [evidência técnica](evidencias/reforma-nfe-campos.json).

Portais oficiais tentados:

- https://www.nfe.fazenda.gov.br/portal/principal.aspx
- https://www.gov.br/receitafederal/pt-br/assuntos/reforma-tributaria-do-consumo
- https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos

## Aplicação ao simulador

Conforme o recorte pedido pelo usuário, **CST, cClassTrib, bases, alíquotas e cálculos de IBS/CBS não são perguntas desta etapa**. A documentação reconhece que esses campos existem para comércio e indústria; sua retirada do exercício é uma decisão pedagógica, não afirmação de inexistência ou dispensa na emissão real.

Os percursos do Zé e da Tina exercitam as vendas efetivas da vila e a conferência comercial, sem simular uma NF-e fiscal completa. O de Bené exercita a classificação do serviço de processamento de madeira e a retenção de ISS, conforme o contrato didático. Não são inventados NCM, CFOP, chave, protocolo ou autorização para preencher as lacunas. Uma revisão fiscal poderá acrescentar as etapas pertinentes em versão futura.
