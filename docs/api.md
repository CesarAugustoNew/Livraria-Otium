# Endpoints implementados (Etapa 2)

Erros seguem o formato `{ timestamp, status, error, message, path, details[] }`.

| Recurso | Método | URL | Acesso | Sucesso | Erros |
|---|---|---|---|---|---|
| Cadastro | POST | `/api/auth/register` | público | 201 `AuthResponse` | 400, 409 |
| Login | POST | `/api/auth/login` | público | 200 `AuthResponse` | 400, 401 |
| Perfil | GET | `/api/users/me` | autenticado | 200 `UserResponse` | 401 |
| Livros (lista) | GET | `/api/books` | público | 200 `PageResponse<BookSummary>` | 422 (sort inválido) |
| Livro (detalhe) | GET | `/api/books/{id}` | público | 200 `BookDetail` | 400, 404 |
| Categorias | GET | `/api/categories` | público | 200 `Category[]` | |
| Banners | GET | `/api/banners` | público | 200 `Banner[]` | |
| Autores | GET | `/api/authors` | público | 200 `Author[]` | |
| Importar catálogo | POST | `/api/admin/catalog/import` | ADMIN | 200 `CatalogImportReport` | 401, 403, 502 |

## Parâmetros de `GET /api/books`
`title`, `categoryId`, `minPrice`, `maxPrice`, `available`, `release`, `page` (0), `size` (12, máx. 50),
`sort` = `newest` | `price_asc` | `price_desc` | `title`.

## Regras de segurança já ativas
- `GET` em `/api/books|categories|authors|banners`: público.
- `POST/PUT/PATCH/DELETE` nessas rotas: somente `ADMIN`.
- `/api/admin/**`: somente `ADMIN`.
- Demais rotas: autenticadas (Bearer JWT).

## Catálogo (Open Library)
Os livros vêm da API pública do [Open Library](https://openlibrary.org/dev/docs/api/books), sem chave.

- `Back-End/src/main/resources/catalog/curated-books.json` lista os ISBNs que a loja vende, por categoria.
- O import busca em lote os dados bibliográficos (título, autores, editora, páginas, ano, capa, idioma, sinopse).
- Preço, desconto, estoque, lançamento e vendas são da loja (`StorePricing`): gerados com o ISBN como semente,
  então são sempre os mesmos. Reimportar atualiza só os dados bibliográficos e preserva preço e estoque.
- No profile `dev` o import roda na subida com o banco vazio. Se o Open Library estiver fora do ar, a API sobe
  com o catálogo vazio e o import pode ser refeito por `POST /api/admin/catalog/import` (responde 502 se falhar).
- `CatalogImportReport`: `{ created, updated, notFound[] }`.

## Próximos (Etapas 3 e 4)
CRUD admin de livros/categorias/autores/banners, `/api/favorites`, `/api/cart`, `/api/orders`.
