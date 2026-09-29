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

## Parâmetros de `GET /api/books`
`title`, `categoryId`, `minPrice`, `maxPrice`, `available`, `release`, `page` (0), `size` (12, máx. 50),
`sort` = `newest` | `price_asc` | `price_desc` | `title`.

## Regras de segurança já ativas
- `GET` em `/api/books|categories|authors|banners`: público.
- `POST/PUT/PATCH/DELETE` nessas rotas: somente `ADMIN`.
- Demais rotas: autenticadas (Bearer JWT).

## Próximos (Etapas 3 e 4)
CRUD admin de livros/categorias/autores/banners, `/api/favorites`, `/api/cart`, `/api/orders`.
