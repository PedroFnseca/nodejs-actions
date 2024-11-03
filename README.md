# Do código ao Ambiente de Produção

Este repositório foi criado para ajudar na criação de GitHub Actions com foco em APIs. Ele fornece um exemplo prático de como configurar e utilizar diversas tecnologias para construir, testar e implantar uma API de forma eficiente.

Aqui você verá como automatizar processos como a criação de testes automatizados, configuração de um ambiente de integração contínua (CI) e a implantação em um ambiente de produção.

## Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript no lado do servidor.
- **[PostgreSQL](https://www.postgresql.org/)**: Sistema de gerenciamento de banco de dados relacional de código aberto.
- **[Express](https://expressjs.com/)**: Framework web para Node.js, utilizado para construir a API.
- **[Prisma](https://www.prisma.io/)**: ORM (Object-Relational Mapping) para interagir com o banco de dados PostgreSQL.
- **[Supabase](https://supabase.com/)**: Serviço de banco de dados utilizado neste projeto.
- **[GitHub Actions](https://github.com/features/actions)**: Plataforma de CI/CD para automação de fluxos de trabalho.
- **[Docker](https://www.docker.com/)**: Plataforma de código aberto para construir, enviar e executar aplicativos em contêineres.
- **[Jest](https://jestjs.io/)**: Framework de testes em JavaScript.
- **[Logger](https://github.com/PedroFnseca/logger-endpoints-api)** : Logger para monitoramento de requisições. (Desenvolvido por mim)

## Banco de Dados

Este projeto utiliza o [Supabase](https://supabase.com/) como serviço de banco de dados e o [Prisma](https://www.prisma.io/) como ORM (Object-Relational Mapping) para interagir com o banco de dados PostgreSQL.

### Esquema do Banco de Dados

Abaixo está o esquema do banco de dados utilizado neste projeto:

| Nome       | Descrição                | Tipo      | Regras                          |
|------------|--------------------------|-----------|---------------------------------|
| id         | Identificador único      | Int       | @id @default(autoincrement())   |
| createdAt  | Data de criação          | DateTime  | @default(now())                 |
| updatedAt  | Data de atualização      | DateTime  | @updatedAt                      |
| name       | Nome do usuário          | String    |                                 |
| email      | Email do usuário         | String    | @unique   