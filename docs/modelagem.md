# Modelagem do banco (Etapa 1)

Todas as entidades herdam de `BaseEntity` (`id` UUID, `created_at`, `updated_at`).

```
User 1──1 Cart 1──N CartItem N──1 Book
User 1──N Favorite N──1 Book
User 1──N Order 1──N OrderItem N──1 Book
User 1──N Review N──1 Book
Book N──1 Category
Book N──1 BookCollection (opcional)
Book 1──N BookAuthor N──1 Author
Banner (independente)
```

| Tabela | Observações |
|---|---|
| `users` | `email` UNIQUE; `role` USER/ADMIN; `password_hash` (BCrypt) |
| `categories` | `name` e `slug` UNIQUE (menu "Assuntos") |
| `collections` | coleção editorial; entidade `BookCollection` |
| `authors` | índice em `name` |
| `books` | `price >= 0`, `stock_quantity >= 0` (CHECK); disponibilidade é derivada; `is_release` alimenta a vitrine |
| `book_authors` | UNIQUE (`book_id`,`author_id`); `position` mantém a ordem dos autores |
| `favorites` | UNIQUE (`user_id`,`book_id`) |
| `carts` | `user_id` UNIQUE (1 carrinho por usuário) |
| `cart_items` | UNIQUE (`cart_id`,`book_id`); `quantity > 0` |
| `orders` | entidade `PurchaseOrder`; snapshot do endereço (`shipping_*`); índices em user/status/created_at |
| `order_items` | snapshot de `book_title` e `unit_price` |
| `reviews` | UNIQUE (`user_id`,`book_id`); `rating` 1..5; média e contagem calculadas por query |
| `banners` | `display_order`, janela `starts_at`/`ends_at`, `active` |

## Decisões
- `BookAuthor` é entidade (não `@ManyToMany`) para guardar a ordem dos autores.
- Preço e título são copiados para `order_items`: reajustes não alteram pedidos antigos.
- `ddl-auto=update` só em desenvolvimento; migrar para Flyway antes de produção.
