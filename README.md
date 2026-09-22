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

A interface utiliza navegação fullscreen, cursor contextual em desktop, microinterações, storytelling por scroll, seção de serviços com painel sticky e modo de performance reduzida para aparelhos mais fracos.

Os refinamentos visuais ficam separados em `refinements.css` e `refinements.js`. No deploy, o Netlify combina esses arquivos com `styles.css` e `script.js`, preservando a estrutura principal do projeto e facilitando manutenção e rollback.

A camada visual é progressiva: conteúdo, SEO, formulário e links continuam funcionando mesmo sem Canvas ou animações. `prefers-reduced-motion` é respeitado.

## Executar localmente

O site continua sem dependências de runtime. Para visualizar exatamente a mesma composição usada no Netlify, execute primeiro:

```bash
cat responsive-fixes.css refinements.css >> styles.css
cat refinements.js >> script.js
```

Depois inicie um servidor HTTP local, por exemplo:

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`.

> Em uma cópia de desenvolvimento, restaure `styles.css` e `script.js` antes de repetir a composição para não duplicar os refinamentos.

## Deploy no Netlify

Conecte o repositório GitHub ao Netlify. O próprio `netlify.toml` define:

- Build command: composição automática dos ajustes responsivos e refinamentos
- Publish directory: `.`
- Branch de produção: `master`

O arquivo também contém headers de segurança e cache.

## Segurança

Não adicione `.env`, tokens, senhas ou credenciais ao repositório. O site não usa chaves privadas no frontend.
