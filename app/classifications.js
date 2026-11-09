/* Candidatos pesquisados em fontes secundárias, sem homologação fiscal.
   Proveniência: docs/CONTEUDO-FISCAL.md e docs/evidencias/candidatos-nfse.json. */
(function (root) {
  const cnaes = {
    '5212500': ['5212-5/00', 'Carga e descarga'],
    '5211799': ['5211-7/99', 'Depósitos de mercadorias para terceiros, exceto armazéns gerais e guarda-móveis'],
    '5250804': ['5250-8/04', 'Organização logística do transporte de carga'],
    '4399199': ['4399-1/99', 'Serviços especializados para construção não especificados anteriormente'],
    '4399101': ['4399-1/01', 'Administração de obras'],
    '4330404': ['4330-4/04', 'Serviços de pintura de edifícios em geral'],
    '2542000': ['2542-0/00', 'Fabricação de artigos de serralheria, exceto esquadrias'],
    '4330402': ['4330-4/02', 'Instalação de portas, janelas, tetos, divisórias e armários embutidos de qualquer material'],
    '3329501': ['3329-5/01', 'Serviços de montagem de móveis de qualquer material']
  };
  const ctns = {
    '110401': ['11.04.01', 'Armazenamento, depósito, guarda de bens de qualquer espécie'],
    '110402': ['11.04.02', 'Carga, descarga, arrumação de bens de qualquer espécie'],
    '070201': ['07.02.01', 'Execução por administração de obras de construção civil e semelhantes'],
    '070202': ['07.02.02', 'Execução por empreitada ou subempreitada de obras de construção civil e semelhantes'],
    '141301': ['14.13.01', 'Carpintaria'], '141302': ['14.13.02', 'Serralheria']
  };
  const nbs = {
    '106019000': ['1.0601.90.00', 'Serviços de manuseio de cargas não classificados em subposições anteriores'],
    '106011000': ['1.0601.10.00', 'Serviços de manuseio de contêineres'],
    '106029000': ['1.0602.90.00', 'Serviços de armazenagem não classificados em subposições anteriores'],
    '106021000': ['1.0602.10.00', 'Serviços de armazenagem frigorificada'],
    '101054000': ['1.0105.40.00', 'Serviços de concretagem'],
    '101032000': ['1.0103.20.00', 'Serviços de preparação de terrenos e de canteiros de obras'],
    '101073000': ['1.0107.30.00', 'Serviços de pintura'],
    '101075000': ['1.0107.50.00', 'Serviços de carpintaria e de serralharia']
  };
  // Opções do exercício, não uma correlação universal entre cadastros fiscais.
  const nbsByCtn = {
    '110401': ['106029000', '106021000'], '110402': ['106019000', '106011000'],
    '070201': ['101054000', '101032000', '101073000'], '070202': ['101054000', '101032000', '101073000'],
    '141301': ['101075000'], '141302': ['101075000']
  };
  const csts = { '000': ['000', 'Tributação integral'], '200': ['200', 'Alíquota reduzida'] };
  const classes = {
    '000001': { cst: '000', code: '000001', label: 'Situações tributadas integralmente pelo IBS e CBS' },
    '200046': { cst: '200', code: '200046', label: 'Operações com bens imóveis' },
    '200045': { cst: '200', code: '200045', label: 'Projetos de reabilitação urbana de zonas históricas e áreas críticas, nas condições legais específicas' }
  };
  root.VilaFiscal = { cnaes, ctns, nbs, nbsByCtn, csts, classes, officialVerified: false,
    notice: 'Protótipo educacional: códigos candidatos pesquisados em fontes secundárias; confirmação oficial e revisão fiscal pendentes.',
    version: 'nfse-candidatos-2026-11-09' };
  if (typeof module !== 'undefined') module.exports = root.VilaFiscal;
})(typeof window === 'undefined' ? globalThis : window);
