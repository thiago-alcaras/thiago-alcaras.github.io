# Demonstração pública do Lead Local

Interface derivada do projeto Lead Local, com adaptador local e dados fictícios. Sem API, chave ou chamadas ao Gemini. Imagens originais do cão reaproveitadas sem edição.

Para sincronizar após mudanças no aplicativo, com Node 22+ e dependências do Lead Local instaladas:

```sh
node scripts/sync-lead-local-demo.mjs ../lead-local
```

O adaptador falha se os marcadores esperados mudarem, para exigir revisão em vez de publicar uma integração incorreta. O bundle React inclui as notificações de licença de dependências.

Versão dos assets: 2360366a56f1.
