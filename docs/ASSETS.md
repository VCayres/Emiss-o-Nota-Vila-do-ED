# Referências e arte

Foram inspecionados o checkout e os arquivos sob `/workspace` antes de criar assets. O repositório estava vazio, sem commit, README ou assets. Os sete anexos visíveis na conversa foram examinados visualmente: três prints do jogo e as imagens de Ed, Tina, Zé e Bené. Não havia cópias desses anexos disponíveis como arquivos locais para inclusão direta.

O conteúdo dos prints prevaleceu sobre a ordem em que foram anexados: catálogo com sete itens; Processar Tábua / Serralheiro / madeira 2 / 5 s; Processar Concreto / Pedreira / Operário / pedra 3 / 6 s.

`app/assets/vila.png` foi gerada a partir das quatro últimas imagens de referência da conversa, com Ed, Tina, Zé e Bené. A arte mantém o Zé sem bigode e Bené com cabelos cacheados, óculos e camisa verde, seguindo a referência fornecida. Mostra praça brasileira aberta com caminhos de pedra, estabelecimentos espaçados, vegetação e paleta verde/azul. A imagem possui 1536 × 1024 pixels. Nenhum texto, campo ou botão faz parte da arte.

**Pendência de aprovação:** é uma adaptação de apoio gerada, não uma imagem aprovada da HQ. Conferir fidelidade dos personagens e estabelecimentos com o responsável pela identidade visual. Não foi inventada uma aparência substituta de personagem ausente; as quatro referências estavam presentes.

Para substituir: coloque a nova imagem em `app/assets/vila.png`, preservando a composição ou ajuste `.portrait.ze`, `.portrait.tina`, `.portrait.bene` e `.hero-art` em `app/styles.css`. Os três cartões usam recortes por CSS da mesma arte. Imagens individuais também podem substituir essas classes, sem mudar regras ou dados. Textos alternativos estão no HTML gerado em `app/app.js`.

O pacote inclui a imagem localmente. Nenhuma geração de imagem ou download acontece durante o uso. Não foram incluídos os prints nem reproduzidas suas interfaces Roblox como arte final. Após substituição, repetir testes de tela e `npm run build`.

## Versão 3 — seleção com corpo inteiro

O usuário forneceu novamente os retratos de Zé, Tina e Bené e pediu figuras de corpo inteiro isoladas do fundo, preservando a arte da abertura. `app/assets/vila.png` permanece inalterada.

Como os retratos estavam disponíveis visualmente na conversa, sem cópias locais dos anexos, a ferramenta de edição de imagem produziu `app/assets/personagens.png` com base nas três referências mais recentes. É uma folha de recortes assistidos por IA, não um novo desenho canônico aprovado. Mantém Zé sem bigode, Tina com capacete e uniforme marrom e Bené de óculos, cabelos cacheados e camisa verde.

A folha é PNG RGBA de 1536 × 1024, com transparência real. Os valores RGB invisíveis sob alfa zero podem conter o antigo fundo, mas esses pixels não são pintados. Os testes verificaram transparência e margens para chapéu/cabelo e pés em cada recorte. Não houve recorte raster por Python; a imagem foi gerada/editada pela ferramenta e inspecionada com análise de pixels.

A seleção usa três janelas SVG com máscaras retangulares, evitando que a área de ajuste proporcional mostre partes dos vizinhos:

- Zé: `viewBox="0 0 540 1024"`.
- Tina: `viewBox="540 0 512 1024"`.
- Bené: `viewBox="1052 0 484 1024"`.

O fundo do cartão é HTML/CSS, separado do personagem. O desenho inteiro fica visível tanto no desktop quanto no celular. Nomes, textos, campos e botões continuam HTML acessível. A mesma folha é incorporada no HTML único e incluída localmente no SCORM, sem downloads em execução.

Se for necessário usar exatamente os pixels dos arquivos originais aprovados, substitua a folha por exportações transparentes oficiais e ajuste as três janelas. Não trate a adaptação gerada como homologação de identidade visual.
