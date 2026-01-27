# Guia de Deploy - Portainer & Docker

Este guia explica como implantar a aplicação CTAMFOX usando Portainer e Docker, migrando de SQLite para PostgreSQL.

## 1. Preparação do Código (Antes de subir)

Como você vai usar PostgreSQL em produção (ao invés do SQLite que estamos usando localmente), você precisa ajustar o arquivo `prisma/schema.prisma`.

### Alterar o Provider do Banco de Dados
No arquivo `prisma/schema.prisma`, altere:
```prisma
datasource db {
  provider = "sqlite" // <--- MUDAR ISTO
  url      = env("DATABASE_URL")
}
```
Para:
```prisma
datasource db {
  provider = "postgresql" // <--- PARA ISTO
  url      = env("DATABASE_URL")
}
```

> **Nota:** Se você tentar rodar `npm run dev` localmente após isso sem ter um Postgres rodando, vai dar erro. Mantenha "sqlite" localmente se não tiver Postgres local, ou altere apenas no momento de criar a imagem Docker (ou tenha um branch separado para deploy).

## 2. Configuração no Portainer (Stacks)

1.  Acesse seu Portainer.
2.  Vá em **Stacks** -> **Add stack**.
3.  Dê um nome, por exemplo `ctamfox-sistema`.
4.  **Método de Criação**: Escolha **Repository** (Repositório).
    *   **Por que?** Como você quer que o Portainer construa a imagem do seu projeto (`build: .` no docker-compose), ele precisa ter acesso a **todos** os arquivos do seu código (Dockerfile, package.json, src, etc.), não apenas ao arquivo docker-compose.
    *   Simplesmente colar o texto no "Web editor" *não funciona* para builds, pois o Portainer não terá acesso aos arquivos locais do seu computador.

5.  **Repository URL**: Coloque a URL do seu repositório Git (ex: `https://github.com/seu-usuario/ctamfox-sistema.git`).
    *   Certifique-se de que você subiu (push) todo o código atualizado para lá.
    *   Se for privado, ative a opção "Authentication" e coloque seu usuário/token.

6.  **Compose path**: Mantenha `docker-compose.yml`.

### Variáveis de Ambiente (Environment variables)
No Portainer, adicione as variáveis (baseado no `.env.production.example`):

- `POSTGRES_USER`: `ctamfox` (ou outro usuário)
- `POSTGRES_PASSWORD`: `sua_senha_segura`
- `POSTGRES_DB`: `ctamfox_db`
- `NEXTAUTH_URL`: `http://seu-dominio-ou-ip:3000`
- `NEXTAUTH_SECRET`: `gere_uma_string_aleatoria_segura`

## 3. Primeiro Deploy e Migração

Ao rodar a stack pela primeira vez, o banco de dados estará vazio. Precisamos criar as tabelas.

Como o Prisma precisa rodar as migrações contra o banco Postgres:

1.  Aguarde o container do banco (`db`) e da app (`app`) iniciarem. A app pode falhar ou reiniciar continuamente porque o banco não tem tabelas ainda.
2.  No Portainer, acesse o Console do container **`app`** (clique em `>_ Console`, use `/bin/sh`).
3.  Dentro do console, execute:
    ```bash
    npx prisma migrate deploy
    ```
    Isso criará as tabelas no PostgreSQL.
4.  Reinicie o container `app` se necessário.

## 4. Atualizações Futuras

Sempre que alterar o `schema.prisma` (criar novas tabelas, campos), você precisará rodar `npx prisma migrate deploy` novamente no console do container após atualizar a imagem.
