# 💰 Financial API

API REST para controle financeiro pessoal, com autenticação de usuários, gerenciamento de transações e cálculo de saldo. Desenvolvido com foco em boas práticas, validações robustas e testes automatizados.

---

## 🚀 Tecnologias utilizadas

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma ORM**
- **Zod** – validação de schemas
- **JWT** – autenticação com tokens
- **Swagger** – documentação interativa da API
- **Jest** – testes unitários, integração e E2E
- **Docker** – ambiente isolado de desenvolvimento

---

## 📦 Instalação e execução

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/financial-api.git
cd financial-api
````

### 2. Instale as dependências:

```bash
npm install
````

### 3. Crie um arquivo .env baseado no .env_example:

```bash
cp .env_example .env
````

### 4. Preencha as variáveis de ambiente no arquivo .env:

```bash
POSTGRES_PASSWORD=your_password
POSTGRES_USER=your_user
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
POSTGRES_DB=financial_db
PORT=3000

DATABASE_URL=postgresql://your_user:your_password@localhost:5432/financial_db
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
````

## Executando com Docker (Recomendado)

### 1. Inicie os containers:

```bash
docker-compose up -d
````

### 2. Execute as migrações do Prisma:

```bash
npx prisma migrate dev
````

## Executando Localmente

## 1. Inicie o servidor:

```bash
npm run dev
````

## 2. A API estará disponível em:

```bash
http://localhost:3000
````

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI após iniciar o servidor:

- Acesse: http://localhost:3000/docs

A documentação inclui:

- Todas as rotas disponíveis

- Parâmetros necessários

- Exemplos de requisições e respostas

- Esquemas de validação

## 🧪 Testes

O projeto inclui três tipos de testes:

Para executar todos os testes:

```bash
npm run test
````

## 📌 Rotas da API

### Usuários
```POST /users``` - Cria um novo usuário

```GET /users/me``` - Retorna informações do usuário autenticado

```PATCH /users/me``` - Atualiza informações do usuário

```DELETE /users/me``` - Remove o usuário

```GET /users/me/balance``` - Retorna o saldo do usuário (com filtros opcionais de período)

### Transações
```GET /transactions/me``` - Lista todas as transações do usuário (com filtros opcionais)

```POST /transactions/me``` - Cria uma nova transação

```PATCH /transactions/me/:transactionId``` - Atualiza uma transação

```DELETE /transactions/me/:transactionId``` - Remove uma transação

## 🤝 Contribuição
Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto

2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

3. Commit suas mudanças (git commit -m 'Add some AmazingFeature')

4. Push para a branch (git push origin feature/AmazingFeature)

5. Abra um Pull Request

## 📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.
