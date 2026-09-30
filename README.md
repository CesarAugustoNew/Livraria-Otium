# Livraria Otium

E-commerce de livros. Monorepo:

```
Livraria-Otium/
├── Back-End/            API Spring Boot (Java 25, Spring Boot 4.1, PostgreSQL, JWT)
├── Front-End/           React + Vite + TypeScript (mobile-first)
├── docs/                Modelagem do banco e contrato da API
└── docker-compose.yml   PostgreSQL para desenvolvimento
```

<<<<<<< HEAD
## Como rodar

### 1. Banco
```bash
docker compose up -d
```

### 2. Backend (requer JDK 25 e Maven)
```bash
cd Back-End
mvn spring-boot:run
```
- Swagger: http://localhost:8080/swagger-ui.html
- Profile `dev` (padrão) cria dados de exemplo e um admin: `admin@otium.com` / `admin12345`
  (altere com `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Em produção defina `JWT_SECRET` (mín. 32 caracteres), `DB_URL`, `DB_USER`, `DB_PASSWORD`,
  `CORS_ALLOWED_ORIGINS` e `SPRING_PROFILES_ACTIVE=prod`.

### 3. Frontend (requer Node 20+)
```bash
cd Front-End
npm install
npm run dev
```
Abre em http://localhost:5173. O Vite encaminha `/api` para `localhost:8080`.
Por padrão usa dados de exemplo (`VITE_USE_MOCKS=true` em `.env.development`);
mude para `false` para usar o backend.
=======
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
