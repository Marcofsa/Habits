# Habits

Aplicacao full stack para acompanhamento de habitos diarios. O projeto permite cadastrar habitos com recorrencia semanal, visualizar o resumo do ano em formato de grade e marcar a conclusao de cada habito no dia atual tanto pela web quanto pelo app mobile.

## O que o projeto faz

O sistema foi dividido em tres frentes que compartilham a mesma API:

- `server`: API HTTP responsavel por criar habitos, consultar habitos de um dia, alternar conclusao e gerar o resumo.
- `web`: interface web com calendario anual, barra de progresso por dia e modal para criar novos habitos.
- `mobile`: aplicativo em Expo/React Native com telas de resumo, criacao de habito e detalhes de um dia.

## Fluxo principal

1. O usuario cria um habito informando o titulo e os dias da semana em que ele deve acontecer.
2. O backend grava esse habito e sua recorrencia no SQLite via Prisma.
3. Web e mobile consultam a API para montar o resumo do ano.
4. Ao abrir um dia especifico, o sistema lista os habitos possiveis para aquela data e os que ja foram concluidos.
5. O usuario pode marcar ou desmarcar habitos no dia atual.
6. O resumo consolidado mostra, para cada dia, quantos habitos existiam e quantos foram concluidos.

## Arquitetura

```text
Habits/
|-- server/   API Fastify + Prisma + SQLite
|-- web/      Frontend React + Vite + Tailwind
|-- mobile/   App Expo + React Native + NativeWind
`-- README.md
```

## Stack

### Backend

- Node.js
- TypeScript
- Fastify
- Prisma
- SQLite
- Zod
- Day.js

### Web

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Axios

### Mobile

- Expo
- React Native
- TypeScript
- NativeWind
- React Navigation
- Axios

## Backend e banco de dados

O backend roda na porta `3333` e expoe uma API REST consumida pelas interfaces web e mobile.

### Modelagem

O banco foi modelado para representar:

- `habits`: habitos cadastrados.
- `habit_week_days`: dias da semana em que cada habito deve acontecer.
- `days`: dias efetivamente registrados no sistema.
- `day_habits`: relacao entre um dia e os habitos concluidos nele.

O Prisma usa SQLite com `DATABASE_URL` apontando para um arquivo local `dev.db`.

### Endpoints principais

- `POST /habits`: cria um novo habito com titulo e recorrencia semanal.
- `GET /day?date=...`: retorna os habitos possiveis para uma data e quais estao concluidos.
- `PATCH /habits/:id/toggle`: alterna o status de conclusao de um habito no dia atual.
- `GET /summary`: retorna o consolidado diario usado no calendario/resumo.

## Frontend web

A aplicacao web apresenta:

- grade com os dias do ano;
- indicador visual de progresso por dia;
- pop-up para criar novos habitos;
- consulta do resumo diretamente na API do backend.

Por padrao, a web consome `http://localhost:3333`.

## Aplicativo mobile

O app mobile oferece:

- tela inicial com resumo dos dias do ano;
- navegacao para o detalhe de um dia especifico;
- barra de progresso baseada em habitos concluidos;
- tela para criar novos habitos;
- bloqueio de edicao para datas passadas.

Atualmente o arquivo de configuracao HTTP do mobile tambem aponta para `http://localhost:3333`. Em dispositivo fisico, isso normalmente precisa ser ajustado para o IP da maquina que esta rodando o backend.

## Como executar o projeto

### Pre-requisitos

- Node.js instalado
- npm instalado
- Expo Go ou ambiente Expo configurado para o app mobile

### 1. Backend

Copie o arquivo de ambiente em `server/.env.example` para `server/.env`.

Exemplo:

```env
DATABASE_URL="file:./dev.db"
```

Depois execute:

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

Se quiser popular o banco manualmente com seed, o projeto ja possui a configuracao do Prisma para isso:

```bash
cd server
npx prisma db seed
```

### 2. Web

```bash
cd web
npm install
npm run dev
```

### 3. Mobile

```bash
cd mobile
npm install
npm start
```

Atalhos disponiveis no mobile:

- `npm run android`
- `npm run ios`
- `npm run web`

## Observacoes importantes

- O repositorio esta organizado como monorepo simples, mas cada aplicacao possui seu proprio `package.json`.
- Web e mobile dependem da API em execucao para funcionar corretamente.
- Existe um `ERD.svg` em `server/prisma/` com o diagrama do banco.
- O README anterior estava generico e nao refletia o comportamento real do projeto; este arquivo passa a documentar o que de fato existe no codigo.
