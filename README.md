# New Life — primeiro protótipo

Protótipo inicial de um simulador de vida 3D para navegador, feito com Babylon.js e JavaScript puro.

## O que já funciona
- Bairro 3D pequeno com casas, estrada, loja e árvores.
- Personagem provisório controlável.
- Câmara de terceira pessoa e câmara próxima.
- Controlos por teclado e joystick táctil.
- Dois NPCs de demonstração com movimento simples.
- Ponto de trabalho e primeira recompensa de 150 MT.
- Relógio, HUD e gravação local do dinheiro/missão.
- Manifest PWA e cache inicial para recursos do próprio projeto.

## Como testar
1. Publica estes ficheiros num alojamento HTTPS (por exemplo GitHub Pages ou Vercel).
2. Abre o endereço no navegador.
3. A primeira abertura precisa de internet para carregar Babylon.js do CDN.
4. Depois de o jogo carregar, abre novamente para testar a cache offline.
5. No Android, roda o ecrã para horizontal e usa o joystick no canto inferior esquerdo.

Também podes testar localmente com um servidor estático. Não abras index.html diretamente como ficheiro, porque os módulos de cache/PWA exigem um servidor.

## Limitações conhecidas
- Este é um protótipo, não um jogo comercial pronto.
- Personagem e NPCs são formas geométricas temporárias.
- Ainda não existem colisões completas, animações, áudio, veículos, edifícios interiores, missões completas, contas ou sincronização online.
- A cache offline do motor Babylon depende da primeira transferência bem-sucedida.
- O desempenho varia conforme o telemóvel e o navegador.

## Próximos passos
1. Testar no telemóvel real.
2. Melhorar movimento, colisões e controlos.
3. Substituir formas provisórias por modelos 3D licenciados.
4. Construir sistema de diálogo, trabalho e economia.
5. Acrescentar gravação de estado do mundo e menus.