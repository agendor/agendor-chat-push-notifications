## Push Notifications API

### Tecnologias

- Node.js 20, Express 5, Prisma, PostgreSQL
- Testes com Vitest + Supertest
- Lint com ESLint + Prettier
- Docker + docker-compose

---

## Pré-requisitos

- Node.js 20+
- NPM 10+
- Docker & Docker Compose

---

## Execução com Docker

```bash
docker compose up --build
```

---

## Scripts úteis

- `npm run dev` — inicia API com reload (ts-node-dev)
- `npm run build` — gera artefatos em `dist/`
- `npm start` — executa versão compilada
- `npm run db:migrate` — aplica migrações do Prisma (produção)
- `npm run db:migrate:dev` — cria e aplica novas migrações (desenvolvimento)
- `npm run db:generate` — gera o Prisma Client
- `npm run db:studio` — abre o Prisma Studio (interface visual do banco)
- `npm test` — roda todos os testes (serviço + controller)
- `npm run test:watch` — roda testes em modo watch
- `npm run test:ui` — abre interface visual do Vitest
- `npm run test:coverage` — gera relatório de cobertura
- `npm run lint` — validação ESLint/TypeScript
- `npm run format` — formata código com Prettier
- `npm run format:check` — verifica formatação

---

## Testes & Lint

```bash
npm test                  # todos os testes
npm run test:watch        # modo watch
npm run test:ui           # interface visual
npm run test:coverage     # relatório de cobertura
npm run lint              # analisa src/ e tests/
npm run format            # formata código
```

Os testes de serviço usam um repositório em memória e capturam eventos emitidos para garantir a regra de negócio. Os testes de controller exercitam o endpoint `POST /v1/tokens` via Supertest. Utilizamos Vitest para execução dos testes com suporte nativo a TypeScript e execução rápida.

---

### Gerando Tokens de Teste

Para facilitar os testes, há um script que gera tokens JWT válidos:

```bash
# Sintaxe básica
node scripts/generate-jwt.js <account_id> <user_id>

# Exemplo
node scripts/generate-jwt.js account-123 user-456
```

---

## Documentação do endpoint

### POST `/v1/tokens`

Registra ou atualiza o token FCM para um dispositivo do usuário autenticado.

**Headers**

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body**

```json
{
  "deviceId": "device-abc",
  "fcmToken": "fcm-token"
}
```

**Responses**

- `201 Created` (novo registro) ou `200 OK` (atualização)

```json
{
  "data": {
    "id": "uuid",
    "accountId": "account-123",
    "userId": "user-456",
    "deviceId": "device-abc",
    "fcmToken": "fcm-token",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  },
  "meta": {
    "created": true
  }
}
```

- `400 Bad Request` para payload inválido (retorna lista de erros por campo)
- `401 Unauthorized` para token ausente, inválido ou expirado

---

