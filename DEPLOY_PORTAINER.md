# Guia de Deploy no Portainer

Siga este guia para subir sua aplicação CTAMFOX no Portainer.

## Pré-requisitos

- Acesso ao painel do Portainer.
- As imagens Docker devem estar construídas e acessíveis (caso use registro privado) ou o Portainer deve ter permissão para construir (se usar git repository).
- **Recomendado**: Construir a imagem localmente e enviar para um registro (Docker Hub, GHCR, etc.) ou usar o recurso "Build" do Portainer conectado ao seu repositório Git.

## Opção 1: Usando Repositório Git (Recomendado)

1. No Portainer, vá em **Stacks** > **Add stack**.
2. Escolha **Repository** como método de build.
3. **Repository URL**: Coloque a URL do seu repositório Git.
4. **Compose path**: `docker-compose.yml`.
5. **Environment variables**: Adicione as variáveis definidas no `.env.production.example`.

## Opção 2: Editor Web (Upload Manual)

Se você não quiser conectar o Git, pode copiar e colar os arquivos.

1. No Portainer, vá em **Stacks** > **Add stack**.
2. Escolha **Web editor**.
3. Copie o conteúdo do `docker-compose.yml` ajustado e cole no editor.
4. **Importante**: Você precisará alterar a linha `image: ctamfox-app:latest` e `build: .` se não estiver construindo a imagem no próprio Portainer.
    - Se o Portainer estiver no mesmo servidor e tiver acesso ao código, pode funcionar com o contexto (menos comum em production remoto).
    - O ideal é alterar para `image: seu-usuario/ctamfox-app:latest` após ter feito o push da imagem.

## Configuração de Variáveis de Ambiente

No Portainer, na seção **Environment variables**, clique em **Add an environment variable** para cada uma abaixo:

| Variável | Exemplo de Valor | Descrição |
|----------|------------------|-----------|
| `POSTGRES_USER` | `ctamfox` | Usuário do Banco |
| `POSTGRES_PASSWORD` | `sua_senha_segura` | Senha do Banco |
| `POSTGRES_DB` | `ctamfox_db` | Nome do Banco |
| `NEXTAUTH_URL` | `http://seu-ip:3001` | URL final de acesso |
| `NEXTAUTH_SECRET` | `(gere uma string)` | Chave de segurança (`openssl rand -base64 32`) |

## Deploy

1. Clique em **Deploy the stack**.
2. Aguarde o processo finalizar.
3. Verifique os logs do container `ctamfox-app` e `ctamfox-db`.
   - O `ctamfox-db` deve mostrar "database system is ready to accept connections".
   - O `ctamfox-app` deve mostrar "Ready in Xms".

## Solução de Problemas

- **Erro de Conexão com Banco**: Verifique se o container `db` está "Healthy". O `app` só deve iniciar depois disso.
- **Erro de Prisma**: Se ver erros sobre "libssl", certifique-se de que a imagem foi reconstruída com o novo `Dockerfile` que inclui `openssl`.
