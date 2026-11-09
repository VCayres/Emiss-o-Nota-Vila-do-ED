/* Contratos fictícios; valores didáticos em centavos. */
(function (root) {
  const merchants = {
    ze: { name: 'Zé do Comércio', shop: 'Comércio da vila', portrait: 'ze', tag: 'Materiais bem organizados',
      description: 'Além do comércio, ajuda a movimentar os materiais da reconstrução.',
      context: 'Este contrato fictício é de um serviço independente. Não há venda de mercadorias, frete ou armazenagem cobrada.',
      order: { id: 'SERV-ZE', recipient: 'Associação da Praça', destination: 'Praça das Águas — Vila do ED',
        description: 'Carga, descarga e arrumação de materiais de construção, sem contêineres, no depósito da Associação da Praça. Serviço independente, sem transporte, armazenagem ou venda de mercadorias.',
        purpose: 'Organizar os materiais da recuperação da praça.', amount: 25000, retention: 'nao',
        retentionNote: 'Condição didática deste contrato: ISS não retido pelo tomador. O recolhimento cabe ao prestador, sujeito às regras aplicáveis.',
        expected: { cnae: '5212500', ctn: '110402', nbs: '106019000', cst: '000', classTrib: '000001' } },
      cnaes: ['5212500', '5211799', '5250804'], ctns: ['110401', '110402'] },
    tina: { name: 'Tina Rocha', shop: 'Pedreira • Operário', portrait: 'tina', tag: 'Uma base para o recomeço',
      description: 'Apoia a reconstrução com um serviço complementar de concretagem.',
      context: 'O concreto da venda original não virou serviço automaticamente. Aqui há um contrato fictício específico de execução por empreitada, somente com mão de obra.',
      order: { id: 'SERV-TINA', recipient: 'Centro Comunitário da Vila', destination: 'Caminho do Ipê — Vila do ED',
        description: 'Execução por empreitada do serviço de concretagem do piso do Centro Comunitário. Valor referente apenas à mão de obra; materiais fornecidos pelo tomador. Não é administração de obra nem venda de concreto.',
        purpose: 'Preparar o piso do espaço de encontro da comunidade.', amount: 180000, retention: 'sim',
        retentionNote: 'Condição didática deste contrato: o tomador é responsável pela retenção e pelo recolhimento do ISS. Não escolha a retenção apenas pelo CNAE.',
        expected: { cnae: '4399199', ctn: '070202', nbs: '101054000', cst: '200', classTrib: '200046' } },
      cnaes: ['4399199', '4399101', '4330404'], ctns: ['070201', '070202'] },
    bene: { name: 'Bené Tronco', shop: 'Serralheiro', portrait: 'bene', tag: 'Cuidado em cada ajuste',
      description: 'Presta um serviço de serralheria com peças fornecidas pelo cliente.',
      context: 'Bené mantém a identificação Serralheiro das referências. O contrato é complementar e fictício, distinto do processamento e da venda de tábuas.',
      order: { id: 'SERV-BENE', recipient: 'Biblioteca Sementes do Amanhã', destination: 'Alameda das Árvores — Vila do ED',
        description: 'Serviço de serralheria em bancada: ajuste de suportes metálicos avulsos da biblioteca, com peças fornecidas pelo tomador. Somente mão de obra, sem venda de peças novas e sem instalação incorporada ao imóvel.',
        purpose: 'Ajustar os suportes usados na organização da biblioteca.', amount: 45000, retention: 'nao',
        retentionNote: 'Condição didática deste contrato: ISS não retido pelo tomador. O prestador permanece responsável pelo recolhimento, sujeito às regras aplicáveis.',
        expected: { cnae: '2542000', ctn: '141302', nbs: '101075000', cst: '000', classTrib: '000001' } },
      cnaes: ['2542000', '4330402', '3329501'], ctns: ['141301', '141302'] }
  };
  const originalCatalog = ['Concreto', 'Ervas Medicinais', 'Madeira', 'Pedra', 'Poção de Cura Menor', 'Tangerina', 'Tábua'];
  root.VilaConfig = { merchants, originalCatalog, event: 'Semana Tributária 2026', version: 2 };
  if (typeof module !== 'undefined') module.exports = root.VilaConfig;
})(typeof window === 'undefined' ? globalThis : window);
