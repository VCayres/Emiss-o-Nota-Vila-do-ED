/* Universo ficcional dos prints. Contratos, quantidades vendidas e preços são didáticos. */
(function (root) {
  const products = {
    concreto: { name: 'Concreto', price: 2850, unit: 'UD', note: 'Unidade didática, sem equivalência presumida a m³.' },
    ervas: { name: 'Ervas Medicinais', price: 750, unit: 'UD', note: 'Exploração do catálogo; sem enquadramento fiscal atribuído.' },
    madeira: { name: 'Madeira', price: 1800, unit: 'UD', note: 'Exploração do catálogo; espécie e dimensões não definidas.' },
    pedra: { name: 'Pedra', price: 1250, unit: 'UD', note: 'Exploração do catálogo; sem classificação fiscal atribuída.' },
    pocao: { name: 'Poção de Cura Menor', price: 990, unit: 'UD', note: 'Item ficcional, sem NCM ou tratamento fiscal inventado.' },
    tangerina: { name: 'Tangerina', price: 250, unit: 'UD', note: 'Exploração do catálogo; não herda a tributação dos materiais.' },
    tabua: { name: 'Tábua', price: 1975, unit: 'UD', note: 'Unidade didática; dimensões e espécie não especificadas.' }
  };
  const merchants = {
    ze: { name: 'Zé do Comércio', shop: 'Comércio', category: 'Comércio · venda de mercadorias', kind: 'goods', portrait: 'ze', portraitViewBox: '0 0 540 1024', tag: 'Produtos para a reconstrução',
      description: 'Vende concreto, ervas medicinais, madeira, pedra, poção de cura menor, tangerina e tábua.',
      context: 'O catálogo vem do print do comércio. O estoque 999 não é preço nem quantidade obrigatória de venda. Este pedido é de mercadorias, sem serviço de carga ou frete.',
      catalog: Object.keys(products), cnae: '4744099',
      order: { id: 'VENDA-ZE', recipient: 'Associação da Praça', destination: 'Praça das Águas — Vila do ED',
        description: 'Venda de concreto e tábuas para a recuperação dos caminhos e dos bancos da praça.',
        purpose: 'Separar os materiais que a praça precisa para o recomeço.', amount: 23250,
        items: [{ product: 'concreto', quantity: 4 }, { product: 'tabua', quantity: 6 }] } },
    tina: { name: 'Tina Rocha', shop: 'Pedreira', category: 'Indústria · produção e venda de concreto', kind: 'goods', portrait: 'tina', portraitViewBox: '540 0 512 1024', tag: 'Concreto produzido na vila',
      description: 'Na Pedreira, transforma pedra em concreto e vende o produto da sua fabricação.',
      context: 'Processar Concreto: 3 unidades de pedra e 6 segundos no jogo. O print não informa rendimento ou unidade comercial. Tina é tratada como indústria; esta é a venda de concreto já produzido, não uma prestação de concretagem.',
      catalog: ['concreto'], cnae: '2330305',
      order: { id: 'VENDA-TINA', recipient: 'Centro Comunitário da Vila', destination: 'Caminho do Ipê — Vila do ED',
        description: 'Venda de oito unidades didáticas de concreto produzido na Pedreira de Tina Rocha para a reconstrução do Centro Comunitário.',
        purpose: 'Fornecer concreto produzido na vila para recuperar o espaço da comunidade.', amount: 22800,
        items: [{ product: 'concreto', quantity: 8 }] } },
    bene: { name: 'Bené Tronco', shop: 'Serralheria', category: 'Serviço · processamento de madeira', kind: 'service', portrait: 'bene', portraitViewBox: '1052 0 484 1024', tag: 'Da madeira às tábuas',
      description: 'Na Serralheria, executa o processamento de madeira para preparar tábuas.',
      context: 'A identificação do personagem no jogo é Serralheiro. Processar Tábua usa 2 unidades de madeira e leva 5 segundos. Esses dados não informam o rendimento. Neste contrato didático, a madeira é do cliente e o serviço prepara tábuas para uso final na biblioteca.',
      cnaes: ['1622699', '3329501', '4330402'], ctns: ['141301', '141302'],
      order: { id: 'SERV-BENE', recipient: 'Biblioteca Sementes do Amanhã', destination: 'Alameda das Árvores — Vila do ED',
        description: 'Processamento de madeira fornecida pela Biblioteca Sementes do Amanhã para preparar tábuas destinadas ao uso final em suas prateleiras. Cobrança apenas pelo serviço, sem venda de madeira e sem destinação à industrialização ou revenda.',
        purpose: 'Preparar as tábuas que serão usadas nas prateleiras da biblioteca.', amount: 15000, retention: 'nao',
        retentionNote: 'Premissa deste contrato didático: ISS não retido pelo tomador. A legislação e as condições do prestador precisam ser conferidas para uma operação real.',
        expected: { cnae: '1622699', ctn: '141301', nbs: '101075000' } } }
  };
  root.VilaConfig = { merchants, products, originalCatalog: Object.values(products).map(p => p.name), event: 'Semana Tributária 2026', version: 3 };
  if (typeof module !== 'undefined') module.exports = root.VilaConfig;
})(typeof window === 'undefined' ? globalThis : window);
