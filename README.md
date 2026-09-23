# Neri InfoTech Site

Site institucional multipágina da Neri InfoTech, preparado para deploy automático no Netlify.

## Estrutura

- `/` — Home
- `/servicos/` — serviços de informática e valores base
- `/sites/` — criação de Página de Bio, Landing Page e Site Institucional
- `/negocios/` — soluções para pequenos negócios
- `/sobre/` — posicionamento e forma de trabalho
- `/contato/` — orçamento e contato pelo WhatsApp

## Tecnologias

- HTML5 semântico
- CSS moderno e responsivo
- JavaScript puro
- Canvas 2D e microinterações na Home
- Sem frameworks ou dependências de runtime

## Execução local

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`.

## Deploy no Netlify

O projeto usa a branch de produção conectada ao Netlify. O `netlify.toml` aplica os refinamentos visuais no build e mantém headers de segurança e cache.

- Publish directory: `.`
- Build: definido em `netlify.toml`

## Segurança

Não adicionar `.env`, tokens, senhas ou credenciais ao repositório. O site não usa segredos no frontend.
