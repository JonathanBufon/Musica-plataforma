# Música Plataforma

MVP fullstack (Node.js + Express + MongoDB + EJS) que transforma os mockups Tailwind em uma aplicação dinâmica com recomendações, favoritos e onboarding por gênero.

## Pré-requisitos do Sistema (Dependencies)

- **Docker & Docker Compose** – responsáveis por provisionar o MongoDB e o mongo-express em containers isolados, evitando conflitos com instalações locais.
- **Node.js v18+** – runtime utilizado pelo servidor Express; a versão 18 garante compatibilidade com as dependências atuais.
- **NPM** – gerenciador de pacotes utilizado para instalar as bibliotecas listadas no `package.json`.

## Como rodar

1. **Subir o banco**
   ```bash
   docker compose up -d
   ```
2. **Instalar dependências**
   ```bash
   npm install
   ```
3. **Popular o banco**
   ```bash
   node seed.js
   ```
4. **Rodar o servidor**
   ```bash
   npm run dev
   ```
5. Acesse http://localhost:3000/login

## Tecnologias
- Node.js + Express
- MongoDB (Docker) + Mongoose
- EJS (SSR)
- Tailwind CSS via CDN

## Funcionalidades
- **Home dinâmica**: carrega recomendações com base nos gêneros preferidos do usuário seed.
- **Favoritar/Desfavoritar**: toggle persistido no banco com feedback visual imediato (coração cheio/vazio).
- **Onboarding**: formulário que atualiza os gêneros preferidos e recalcula as recomendações em tempo real.
- **Filtros por gênero**: chips na seção "Explorar" filtram músicas por gênero usando query string.

## Guia de Uso (User Journey)
1. **Login Simulado** – utilize o email `admin@teste.com` (ou qualquer email simples) na tela de login. Não há senha neste MVP, permitindo avaliar rapidamente o fluxo.
2. **Onboarding (Cold Start)** – ao acessar pela primeira vez, selecione os gêneros favoritos. Essa etapa alimenta o algoritmo inicial e determina as recomendações personalizadas.
3. **Dashboard** – a seção “Recomendado para Você” exibe músicas alinhadas aos gêneros escolhidos; já “Explorar” lista o catálogo completo, com filtros por gênero acessíveis na barra de chips.
4. **Interação** – o botão de coração salva/remover a música da lista de favoritos diretamente no MongoDB, fornecendo feedback visual imediato (coração cheio vs. vazio).

## Lógica da Aplicação (Architecture Logic)
- **Arquitetura MVC Simplificada** – o Express coordena as rotas (Controller), os Schemas do Mongoose (`Music` e `User`) representam os Models, e as Views EJS renderizam o HTML final no servidor.
- **Algoritmo de Recomendação** – a Home executa uma query `Music.find({ genero: { $in: user.generos_preferidos } })`, aplicando o operador `$in` para intersectar os gêneros selecionados no onboarding com o catálogo.
- **Persistência de Favoritos** – o documento `User` mantém um array `favoritos` com `ObjectId` referenciando a coleção `Music`. Esse relacionamento flexível permite adicionar/remover favoritos em tempo real sem duplicar dados.
