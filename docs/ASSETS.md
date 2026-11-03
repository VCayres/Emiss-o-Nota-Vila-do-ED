# Referências e arte

Foram inspecionados o checkout e os arquivos sob `/workspace` antes de criar assets. O repositório estava vazio, sem commit, README ou assets. Os sete anexos visíveis na conversa foram examinados visualmente: três prints do jogo e as imagens de Ed, Tina, Zé e Bené. Não havia cópias desses anexos disponíveis como arquivos locais para inclusão direta.

O conteúdo dos prints prevaleceu sobre a ordem em que foram anexados: catálogo com sete itens; Processar Tábua / Serralheiro / madeira 2 / 5 s; Processar Concreto / Pedreira / Operário / pedra 3 / 6 s.

`app/assets/vila.png` foi gerada a partir das quatro últimas imagens de referência da conversa, com Ed, Tina, Zé e Bené. A arte mantém o Zé sem bigode e Bené com cabelos cacheados, óculos e camisa verde, seguindo a referência fornecida. Mostra praça brasileira aberta com caminhos de pedra, estabelecimentos espaçados, vegetação e paleta verde/azul. A imagem possui 1536 × 1024 pixels. Nenhum texto, campo ou botão faz parte da arte.

**Pendência de aprovação:** é uma adaptação de apoio gerada, não uma imagem aprovada da HQ. Conferir fidelidade dos personagens e estabelecimentos com o responsável pela identidade visual. Não foi inventada uma aparência substituta de personagem ausente; as quatro referências estavam presentes.

Para substituir: coloque a nova imagem em `app/assets/vila.png`, preservando a composição ou ajuste `.portrait.ze`, `.portrait.tina`, `.portrait.bene` e `.hero-art` em `app/styles.css`. Os três cartões usam recortes por CSS da mesma arte. Imagens individuais também podem substituir essas classes, sem mudar regras ou dados. Textos alternativos estão no HTML gerado em `app/app.js`.

O pacote inclui a imagem localmente. Nenhuma geração de imagem ou download acontece durante o uso. Não foram incluídos os prints nem reproduzidas suas interfaces Roblox como arte final. Após substituição, repetir testes de tela e `npm run build`.
