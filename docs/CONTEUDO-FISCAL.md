# Recorte fiscal e fontes

Data da tentativa de consulta: **03/11/2026** (America/Bahia). Evento previsto para novembro de 2026.

## Consulta e limites de evidência

| Fonte oficial pretendida | Endereço consultado | Resultado |
| --- | --- | --- |
| Portal Nacional da NF-e | https://www.nfe.fazenda.gov.br/portal/principal.aspx | Proxy retornou `403 Forbidden` no estabelecimento do túnel HTTPS |
| Receita Federal — Reforma Tributária do Consumo | https://www.gov.br/receitafederal/pt-br/assuntos/reforma-tributaria-do-consumo | Mesmo bloqueio de rede |
| CGIBS | https://www.cgibs.gov.br/ | Mesmo bloqueio de rede |

Esses endereços são pontos de consulta, **não conteúdo consultado com sucesso**. Não foi possível confirmar a disponibilidade do endereço do CGIBS, redirecionamentos, a versão vigente de notas técnicas, tabelas ou legislação nessas páginas. As tentativas conservaram TLS e usaram o proxy da plataforma. Foram solicitados no rascunho os três domínios, preservando os presets existentes; salvar o rascunho não altera a rede da instância atual.

**Versões de documentos técnicos utilizadas: nenhuma.** Não foi alegada conformidade com uma versão da NT 2025.002, esquema XML de NF-e, tabela CST/cClassTrib ou legislação vigente em novembro de 2026. O pacote SCORM é tecnicamente funcional; seu conteúdo fiscal é um protótipo demonstrativo a revisar. Não se deve promovê-lo como emissor fiscal ou treinamento de enquadramento validado.

## Cenário adotado

- Venda fictícia de mercadorias já disponíveis, para destinatários institucionais fictícios dentro da Vila do ED. Não representa um regime de empresa, município ou UF real.
- A aprendizagem consiste em registrar produtos, quantidades, unidade, preço, natureza didática da operação, conferir total e reconhecer as esferas de IBS (estados/municípios) e CBS (federal). Essas associações conceituais ainda exigem revisão do especialista para a edição do evento.
- A unidade `UD` é exclusivamente didática. Concreto não é convertido para m³. Madeira e tábua não têm espécie, dimensão ou rendimento presumidos.
- Quantidades de insumos e tempos dos prints são contexto do jogo: Bené usa 2 unidades de madeira/5 segundos para processar tábua; Tina usa 3 unidades de pedra/6 segundos para processar concreto. Nada disso determina rendimento ou quantidade vendida.
- Os pedidos avaliados contêm concreto e/ou tábuas, mas **também não lhes atribuem tratamento tributário confirmado**. A avaliação é comercial/conceitual, não uma certificação fiscal desses materiais.
- O catálogo do Zé mantém os sete itens. Ervas Medicinais, Madeira, Pedra e Tangerina têm especificação/enquadramento pendentes, sem herdar regras de concreto ou tábuas. Poção de Cura Menor é ficcional e não recebe classificação oficial. Selecionar produto fora do pedido gera orientação para corrigi-lo, sem apagar o formulário.
- Valores em centavos inteiros e quantidades inteiras de 1–9999. Preços fictícios centralizados em `app/config.js`. Estoque 999 do print não foi usado como preço ou obrigação de venda.
- Não há NCM, CFOP, CST, cClassTrib ou percentuais preenchidos/inventados. “Não apurado” não equivale a zero, isento, suspenso ou dispensado. O total exibido é exclusivamente comercial, soma de quantidade × preço.
- Cadastro fixo preenchido automaticamente, sem CPF/CNPJ. Nenhuma chave de acesso, número de autorização, protocolo ou QR Code é produzido. A representação não é DANFE ou XML fiscal.

## Configuração e revisão especializada

O cenário está em `app/rules.js` (`fiscal.id = conceitual-sem-apuracao-v1`); produtos, preços e pedidos em `app/config.js`. Interface e integração LMS estão separadas. Alterações de regras requerem repetir os testes e gerar novamente o pacote.

Antes de apresentar a atividade como orientação fiscal validada:

1. Liberar as fontes oficiais, consultar o material vigente na data do evento e registrar URLs finais, datas e versões exatas, inclusive notas técnicas e tabelas pertinentes.
2. Definir operação real, regime do emitente, localização, características dos produtos e destinatário; confirmar se são necessários NCM, CFOP, CST, cClassTrib e demais elementos para a finalidade didática escolhida.
3. Revisar a explicação de IBS/CBS e regras de transição, inclusive obrigações e tratamentos aplicáveis em 2026. Não incorporar alíquotas de referência sem sustentação e sem observar condições de aplicação.
4. Manter produtos ficcionais fora de enquadramentos oficiais não demonstráveis e analisar alimentos, materiais e ervas individualmente.
5. Se for acrescentada apuração, definir base, arredondamento por item/total e forma de apresentação antes de alterar cálculos e objetivos.

O bloqueio de fontes não impede o fluxo técnico da simulação. Ele impede afirmar que regras fiscais de novembro de 2026 foram verificadas.
