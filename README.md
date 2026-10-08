# Links · Nicolas Schulze

Página de links para a bio do Instagram, recrutadores e clientes. Segue o manual da marca: monograma N, Barlow / Barlow Condensed e o roxo da série Estudos. Tem modo claro e escuro e um carrossel com as imagens dos projetos.

**Endereço público:** https://nicschulze123-sudo.github.io/links/

## Dois modos

| Modo | Onde | Quem vê |
| --- | --- | --- |
| **Público** | o site acima | qualquer pessoa. Só leitura, ninguém consegue alterar nada por ele. |
| **Edição e pré-visualização** | `_editor/editar.html`, aberto direto do seu computador | só você. A pasta `_editor` está no `.gitignore` e nunca é enviada para o GitHub. |

## Como editar

1. Abra `_editor/editar.html` no Chrome ou no Edge (duplo clique no arquivo).
2. Mude textos, links e imagens. A pré-visualização à direita atualiza na hora, nos tamanhos celular e computador.
3. Para novas imagens: copie para a pasta `projetos` (nome sem espaço nem acento) e use **+ Imagens**.
4. Clique em **Salvar conteudo.js** e escolha o `conteudo.js` desta pasta para substituir.
5. No GitHub Desktop: confira as mudanças, **Commit to main** e **Push origin**. O site atualiza em cerca de 1 minuto.

Nada muda no site público até o push.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | Estrutura da página |
| `conteudo.js` | Textos, links e lista de imagens (o editor gera este arquivo) |
| `css/style.css` | Visual da página |
| `js/app.js` | Monta a página e o carrossel |
| `js/tema.js` | Aplica o tema claro/escuro salvo |
| `fontes/` | Fontes da marca, servidas pelo próprio site |
| `projetos/` | Imagens do carrossel |
| `preview-logo.jpg` | Imagem da prévia do link no WhatsApp/LinkedIn |

## Segurança

- **Política de segurança de conteúdo (CSP):** a página só carrega scripts, estilos, fontes e imagens do próprio site. Não há scripts de terceiros, rastreadores nem formulários.
- **Sem dados sensíveis:** nada de senhas, chaves ou dados pessoais no repositório.
- **Conteúdo validado:** links só aceitam `https://`, imagens só aceitam arquivos da própria pasta, e todo texto é inserido como texto puro (sem HTML).
- **Links externos** abrem em nova aba com `noopener noreferrer`.
- **Quem pode alterar o site:** só quem tem acesso de escrita a este repositório no GitHub. Mantenha a verificação em duas etapas (2FA) ativada na sua conta.
