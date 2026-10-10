# Portfólio Ana Beatriz Manso

Site estático em HTML, CSS e JavaScript, sem dependências para instalar.

## Arquivos

- `index.html` é a página inicial, com hero, trabalhos, sobre, trajetória e contato.
- `assessoria-de-imprensa.html`, `reportagem.html` e `podcast.html` são as páginas de cada projeto.
- `assets/style.css` guarda cores, fontes e layout.
- `assets/main.js` cuida da troca de idioma, do menu no celular, dos vídeos e da ampliação dos recortes.
- `assets/img/ana-beatriz-manso.jpg` é o retrato.

## Como editar os textos

Cada texto aparece duas vezes, uma em português e outra em inglês.

```html
<span lang="pt-BR">Texto em português</span>
<span lang="en">Text in English</span>
```

Ao mudar um, mude o outro também. O botão PT/EN no topo mostra só a versão escolhida e lembra a escolha do visitante.

## Cores

As cores ficam no começo de `assets/style.css`. A cor de destaque é `--accent`. O site também tem um modo escuro automático, que segue a configuração do aparelho de quem visita.

## Vídeos

Os seis vídeos da TV ficam em `assets/video/`, em MP4 720p, cada um com uma imagem de capa em JPG de mesmo nome. Eles não dependem mais do Squarespace.

O vídeo da macrodrenagem tinha um defeito no arquivo do Squarespace. Depois dos 2 minutos, as marcações de tempo estavam corrompidas e o site antigo mostrava só 2 min 06 s. A versão nova foi corrigida e tem a duração real, 4 min 05 s, com som e imagem sincronizados.

Para trocar um vídeo, substitua o MP4 e o JPG em `assets/video/` mantendo os mesmos nomes.

## Imagens

Os recortes de jornal e as páginas de reportagem ficam em `assets/img/recortes/`. Cada imagem tem duas versões. A que termina em `-thumb.jpg` é menor e aparece na página. A outra abre quando o visitante clica para ampliar. A capa do podcast fica em `assets/img/quarentena-global-capa.jpg`.

O site não depende mais do Squarespace. Ele só usa serviços externos para as fontes (Google Fonts) e para os episódios do podcast (Spotify).

Os originais em tamanho cheio, os vídeos em 1080p e uma cópia das páginas antigas estão na pasta `backup-squarespace-manso-portfolio`, ao lado desta. Aquela pasta não deve ser publicada.

## Como publicar

1. Crie uma conta gratuita no Netlify ou no GitHub Pages. Evite o Cloudflare Pages, porque ele não aceita arquivos acima de 25 MB e os vídeos passam disso.
2. Envie a pasta inteira `portfolio-ana-manso`.
3. Aponte o domínio `manso-portfolio.com` para o novo serviço, seguindo as instruções dele.
4. Só cancele o Squarespace depois que o site novo abrir no endereço. O domínio está registrado no Squarespace e não deve ser excluído. A ordem completa está no LEIA-ME da pasta de backup.

Para ver no computador antes de publicar, abra o Terminal na pasta e rode o comando abaixo. Depois acesse `http://localhost:8000`.

```bash
python3 -m http.server 8000
```
