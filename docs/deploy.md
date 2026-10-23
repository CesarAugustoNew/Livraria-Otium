# Deploy: Supabase + Render + Vercel

| Peça | Serviço | O que roda |
|---|---|---|
| Banco | Supabase | PostgreSQL (só o banco; autenticação e o resto ficam no Spring) |
| API | Render | `Back-End/`, pelo `Dockerfile` |
| Loja | Vercel | `Front-End/`, build estático do Vite |

A ordem importa: a Vercel precisa da URL do Render, e o Render precisa da URL da Vercel (CORS).
Siga os passos na sequência abaixo.

**Dica de região:** coloque o banco e a API na mesma região (ex.: Supabase em *East US (North Virginia)* e
Render em *Virginia*). Cada página faz várias consultas da API ao banco, então essa distância pesa mais do que
a distância entre o visitante e a API.

## 1. Supabase (banco)

1. Crie um projeto e anote a **senha do banco** definida na criação.
2. Clique em **Connect** e escolha **Session pooler**, com o tipo de conexão **JDBC**.
   - Não use a *Direct connection*: ela só funciona por IPv6 e o Render só conecta por IPv4.
   - Não use o *Transaction pooler* (porta 6543): o Hibernate depende de recursos que ele não suporta.
3. Da string exibida, separe os valores para o Render:

| Variável | Valor |
|---|---|
| `DB_URL` | `jdbc:postgresql://<host-do-pooler>:5432/postgres?sslmode=require` (copie o host do painel) |
| `DB_USER` | `postgres.<id-do-projeto>` (com o id, não só `postgres`) |
| `DB_PASSWORD` | a senha do banco |

As tabelas são criadas pela própria API na primeira subida.

## 2. Render (API)

1. **New → Web Service** e conecte o repositório do GitHub.
2. Configure:
   - **Branch:** `main`
   - **Root Directory:** `Back-End`
   - **Language:** Docker (o Render detecta o `Dockerfile`)
   - **Instance Type:** Free
   - **Health Check Path** (em *Advanced*): `/api/banners`
3. Em **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | os valores do Supabase (passo 1) |
| `JWT_SECRET` | um texto aleatório com 32+ caracteres (veja abaixo) |
| `ADMIN_PASSWORD` | a senha do usuário `admin@otium.com` em produção |
| `CORS_ALLOWED_ORIGINS` | a URL da Vercel, ex.: `https://livraria-otium.vercel.app` (sem `/` no final) |

Para gerar o `JWT_SECRET` no PowerShell:

```powershell
$b = New-Object byte[] 48; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
```

Se ainda não souber a URL da Vercel, use o nome que pretende dar ao projeto lá (`https://<nome>.vercel.app`)
e corrija depois.

4. Clique em **Deploy**. O primeiro build leva alguns minutos. No log deve aparecer
   `Dados iniciais criados (27 livros)`.
5. Teste no navegador: `https://<sua-api>.onrender.com/api/books` deve listar os livros.

No perfil `prod` a API **não sobe** se faltar alguma das variáveis acima. O log mostra qual:
`Could not resolve placeholder 'JWT_SECRET'`.

## 3. Vercel (loja)

1. **Add New → Project** e importe o mesmo repositório.
2. Configure:
   - **Root Directory:** `Front-End`
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Environment Variable:** `VITE_API_URL` = `https://<sua-api>.onrender.com/api`
3. Clique em **Deploy**.

O `vercel.json` já faz as rotas do React (`/livros`, `/livro/...`) funcionarem ao recarregar a página.

## 4. Ajuste final

Se a URL da Vercel ficou diferente da que você colocou em `CORS_ALLOWED_ORIGINS`, corrija a variável no Render.
Salvar a variável dispara um novo deploy. Para liberar mais de uma origem, separe por vírgula.

Depois disso, cada `git push` no `main` atualiza o Render e a Vercel automaticamente.

## Plano gratuito: o que esperar

- **Render:** a API dorme após 15 minutos sem acesso. A primeira visita depois disso demora cerca de 1 minuto.
  Antes de mostrar o projeto, abra o site uns minutos antes.
- **Supabase:** o projeto é pausado após 7 dias sem uso do banco. Para reativar, entre no painel e clique em
  *Restore*.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| Log do Render: `Could not resolve placeholder '...'` | Falta a variável citada no Render. |
| Log do Render: timeout ou `Network is unreachable` ao conectar no banco | Está usando a *Direct connection*. Troque para o *Session pooler*. |
| Log do Render: `Tenant or user not found` | `DB_USER` precisa ser `postgres.<id-do-projeto>`. |
| A loja abre, mas sem livros, com erro de CORS no console | `CORS_ALLOWED_ORIGINS` não bate com a URL da Vercel (confira `https` e a ausência de `/` no final). |
| A loja chama `/api/...` na própria Vercel e recebe 404 | Falta `VITE_API_URL`. Ela entra no build: depois de criar, refaça o deploy na Vercel. |
| Erro 404 ao recarregar `/livros` | O *Root Directory* da Vercel precisa ser `Front-End`, onde está o `vercel.json`. |
| API fora do ar depois de dias sem uso | O Supabase pausou o projeto. Reative no painel. |
