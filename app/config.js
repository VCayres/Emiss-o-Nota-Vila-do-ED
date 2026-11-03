/* Dados narrativos e comerciais fictícios. Valores em centavos. */
(function (root) {
  const products = {
    concreto: { name: 'Concreto', price: 2850, unit: 'UD', note: 'Unidade didática; não corresponde a m³.' },
    ervas: { name: 'Ervas Medicinais', price: 750, unit: 'UD', note: 'Exploração: enquadramento fiscal não definido.' },
    madeira: { name: 'Madeira', price: 1800, unit: 'UD', note: 'Exploração: especificação e enquadramento pendentes.' },
    pedra: { name: 'Pedra', price: 1250, unit: 'UD', note: 'Exploração: especificação e enquadramento pendentes.' },
    pocao: { name: 'Poção de Cura Menor', price: 990, unit: 'UD', note: 'Item ficcional. Sem classificação fiscal oficial atribuída.' },
    tangerina: { name: 'Tangerina', price: 250, unit: 'UD', note: 'Exploração: tratamento próprio a revisar; não herda regras de outros itens.' },
    tabua: { name: 'Tábua', price: 1975, unit: 'UD', note: 'Unidade didática; espécie e dimensões não especificadas.' }
  };
  const merchants = {
    ze: { name: 'Zé do Comércio', shop: 'Comércio da vila', tag: 'Variedade para reconstruir', portrait: 'ze',
      description: 'Materiais, alimentos e outros produtos para o dia a dia da vila.',
      context: 'O estoque 999 do catálogo original não é preço nem quantidade da venda.',
      catalog: Object.keys(products), order: { id: 'PED-ZE', recipient: 'Associação da Praça', destination: 'Praça das Águas — Vila do ED', purpose: 'Reparar os caminhos e os bancos da praça.', items: [{ product: 'concreto', quantity: 4 }, { product: 'tabua', quantity: 6 }] } },
    tina: { name: 'Tina Rocha', shop: 'Pedreira • Operário', tag: 'Base para novos começos', portrait: 'tina',
      description: 'Produz concreto para as obras de reconstrução.',
      context: 'Processar Concreto: 3 unidades de pedra e 6 segundos no jogo. O rendimento não é informado. Aqui, o concreto já está pronto para a venda.',
      catalog: ['concreto'], order: { id: 'PED-TINA', recipient: 'Centro Comunitário da Vila', destination: 'Caminho do Ipê — Vila do ED', purpose: 'Recuperar o espaço de encontro dos moradores.', items: [{ product: 'concreto', quantity: 8 }] } },
    bene: { name: 'Bené Tronco', shop: 'Serralheiro', tag: 'Cada tábua, uma possibilidade', portrait: 'bene',
      description: 'Processa madeira e comercializa tábuas para a reconstrução.',
      context: 'Processar Tábua: 2 unidades de madeira e 5 segundos no jogo. O rendimento não é informado. As tábuas deste pedido já estão disponíveis.',
      catalog: ['tabua'], order: { id: 'PED-BENE', recipient: 'Biblioteca Sementes do Amanhã', destination: 'Alameda das Árvores — Vila do ED', purpose: 'Montar novas estantes para a biblioteca.', items: [{ product: 'tabua', quantity: 10 }] } }
  };
  const data = { products, merchants, event: 'Semana Tributária 2026', version: 1 };
  root.VilaConfig = data;
  if (typeof module !== 'undefined') module.exports = data;
})(typeof window === 'undefined' ? globalThis : window);
