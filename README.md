# Neri InfoTech Site

Site institucional estático da Neri InfoTech, preparado para deploy automático no Netlify.

## Tecnologias

- HTML5 semântico
- CSS moderno e responsivo
- JavaScript puro
- Sem frameworks ou dependências de runtime

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

O arquivo `netlify.toml` já contém headers de segurança e cache.

## Segurança

Não adicione `.env`, tokens, senhas ou credenciais ao repositório. O site não usa chaves privadas no frontend.
