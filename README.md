# Neri InfoTech Site

Site institucional estático da Neri InfoTech, preparado para deploy automático no Netlify.

## Tecnologias

- HTML5 semântico
- CSS moderno e responsivo
- JavaScript puro
- Canvas 2D para a camada visual do hero
- CSS 3D e animações nativas
- IntersectionObserver e requestAnimationFrame
- Sem frameworks ou dependências de runtime

## Experiência visual

A interface utiliza preloader, navegação fullscreen, cursor contextual em desktop, microinterações magnéticas, storytelling por scroll, seção de serviços com painel sticky e modo de performance reduzida para aparelhos mais fracos.

A camada visual é progressiva: conteúdo, SEO, formulário e links continuam funcionando mesmo sem Canvas ou animações. `prefers-reduced-motion` é respeitado.

## Executar localmente

Como o projeto é estático, não existe etapa de build. Na pasta do projeto, use qualquer servidor HTTP local, por exemplo:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Deploy no Netlify

Conecte o repositório GitHub ao Netlify e use:

- Build command: deixar vazio
- Publish directory: `.`
- Branch de produção: `master`

O arquivo `netlify.toml` já contém headers de segurança e cache.

## Segurança

Não adicione `.env`, tokens, senhas ou credenciais ao repositório. O site não usa chaves privadas no frontend.
