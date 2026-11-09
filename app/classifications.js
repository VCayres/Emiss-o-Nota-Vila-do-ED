/* CNAEs e códigos de serviços candidatos; revisão oficial e profissional pendente.
   Não representam enquadramento universal ou novas obrigações da reforma. */
(function (root) {
  const cnaes = {
    '4744099': ['4744-0/99', 'Comércio varejista de materiais de construção em geral'],
    '2330305': ['2330-3/05', 'Preparação de massa de concreto e argamassa para construção'],
    '1622699': ['1622-6/99', 'Fabricação de outros artigos de carpintaria para construção'],
    '3329501': ['3329-5/01', 'Serviços de montagem de móveis de qualquer material'],
    '4330402': ['4330-4/02', 'Instalação de portas, janelas, tetos, divisórias e armários embutidos de qualquer material']
  };
  const ctns = { '141301': ['14.13.01', 'Carpintaria'], '141302': ['14.13.02', 'Serralheria'] };
  const nbs = { '101075000': ['1.0107.50.00', 'Serviços de carpintaria e de serralharia'] };
  const nbsByCtn = { '141301': ['101075000'], '141302': ['101075000'] };
  root.VilaFiscal = { cnaes, ctns, nbs, nbsByCtn, officialVerified: false,
    notice: 'Simulação educacional. Códigos de referência candidatos, sujeitos à confirmação oficial e revisão especializada.',
    version: 'comercio-industria-servicos-v3' };
  if (typeof module !== 'undefined') module.exports = root.VilaFiscal;
})(typeof window === 'undefined' ? globalThis : window);
