# Sistema de Controle de Refeições

## Aviso Ético
Este sistema é um exercício acadêmico. Desenvolvido com foco na neutralidade e na informação, este projeto evita linguagem que reforce dietas restritivas ou metas agressivas.

## Descrição

Aplicação de gerenciamento de dieta focada no controle de consumo calórico diário. O sistema permite o registro de refeições, visualização de histórico e exportação de dados (CSV) para análise externa.

## Stack

- Frontend: Next.js, React, Tailwind CSS

- Backend: Firebase (Firestore)

- Exportação: Sistema de exportação nativa em CSV com suporte a encoding UTF-8 (compatível com Excel e ferramentas de Data Science).

## Instruções de Setup Local

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo .env.local na raiz com as credenciais do seu Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_dominio
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
```

## Screenshots

## Tela Inicial

![Tela Inicial](/public/screenshots/tela-inicial.png)

### Tela Autenticação

![Tela de Login](/public/screenshots/login.png)

### Dashboard de Refeições
![Dashboard Refeições](/public/screenshots/dashboard-refeicoes.png)

### Dashboard de Jejuns
![Dashboard Jejum](/public/screenshots/dashboard-jejum.png)

### Dashboard de Relatório Semanal
![Dashboard Jejum](/public/screenshots/dashboard-relatorios.png)


