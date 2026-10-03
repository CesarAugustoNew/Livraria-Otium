<div align="center">

# Livraria Otium

<<<<<<< HEAD
E-commerce de livros completo — catálogo, carrinho, checkout e autenticação — construído em **Java** com **Spring Boot** no back-end e **React** com **TypeScript** no front-end.

![Java](https://img.shields.io/badge/Java-25-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/PostgreSQL%20dev-Docker%20Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

[**📘 Contrato da API**](docs/api.md) · [**🗺️ Modelagem do banco**](docs/modelagem.md)

</div>

---

## Sobre este projeto

O Livraria Otium é um monorepo com os dois lados do e-commerce: a API que guarda e organiza livros, categorias, autores, coleções e usuários, e o site em React que consome essa API (com um modo de dados de exemplo para rodar sem backend). Carrinho, favoritos e cupom ainda vivem só no front-end — a integração com pedidos persistidos no banco é o próximo passo do roadmap.

## Funcionalidades

- Cadastro de usuário e login com senha, autenticado por **JWT**, com dois papéis: **usuário comum** e **administrador**
- Catálogo de livros com busca por título, filtro por assunto/autor/coleção, paginação e 8 modos de ordenação (relevância, mais vendidos, mais recentes, desconto, preço e nome)
- Página de detalhe do livro: sinopse, sumário, especificações, avaliação, preço com desconto e parcelamento, e simulador de frete
- Carrinho de compras com cupom de desconto e barra de frete grátis
- Checkout com endereço de entrega e forma de pagamento (cartão, Pix ou boleto)
- Banners promocionais em carrossel e vitrine de lançamentos na home
- Preço promocional (`originalPrice`/`discountPercent`) calculado automaticamente ao salvar o livro
- Avaliações de livros já modeladas no banco (nota 1–5, uma por usuário/livro), com média e contagem exibidas no catálogo — ainda sem endpoint de CRUD

## Tecnologias usadas

**Back-end**

| Item | Tecnologia |
|---|---|
| Linguagem | Java 25 |
| Framework | Spring Boot 4.1 |
| Acesso ao banco | Spring Data JPA (Hibernate) |
| Autenticação | Spring Security + JWT (jjwt) |
| Banco de dados | PostgreSQL |
| Documentação | Swagger / OpenAPI (springdoc) |
| Build | Maven |

**Front-end**

| Item | Tecnologia |
|---|---|
| Biblioteca de UI | React 19 |
| Linguagem | TypeScript |
| Build/Dev server | Vite |
| Roteamento | React Router |
| Estilo | CSS mobile-first, sem framework de UI |

## Como o projeto é organizado

```
Livraria-Otium/
├── Back-End/     API Spring Boot
├── Front-End/    React + Vite + TypeScript
├── docs/         Modelagem do banco e contrato da API
└── docker-compose.yml   PostgreSQL para desenvolvimento
```

O back-end segue o modelo em camadas mais comum para esse tipo de projeto:

- **Controller** — recebe a requisição HTTP (ex.: "listar livros filtrados") e devolve a resposta.
- **Service** — contém as regras de negócio (ex.: calcular o desconto, validar o login).
- **Repository** — conversa com o banco de dados (Spring Data JPA + Specifications para os filtros).
- **DTO** — formato dos dados que entram e saem da API, sem expor as entidades internas diretamente.
- **Mapper / Exception / Security / Config** — conversão entidade↔DTO, erros padronizados, JWT e CORS.


## Segurança

O login funciona com **JWT** (JSON Web Token): ao entrar com e-mail e senha, o usuário recebe um token que deve ser enviado nas próximas requisições, provando quem ele é sem precisar mandar a senha de novo. As rotas administrativas (escrita no catálogo) exigem que o token pertença a um usuário com papel **ADMIN**. Erros de autenticação e autorização seguem o mesmo formato padronizado das demais respostas de erro da API, sem vazar detalhe interno algum.

