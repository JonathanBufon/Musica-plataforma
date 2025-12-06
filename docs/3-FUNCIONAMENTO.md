# 3. Funcionamento do Protótipo

Este documento descreve o roteiro recomendado para apresentar o MVP, cobrindo três cenários principais.

## Passo a Passo (User Walkthrough)
1. **Iniciar ambiente** – com o banco já populado (`docker compose up -d` + `node seed.js`), execute `npm run dev` e acesse `http://localhost:3000`.
2. **Verificar login** – caso o cookie não esteja definido, o sistema redireciona para `/login` automaticamente.
3. **Percorrer os cenários abaixo**.

### Cenário 1 – Login Simulado
1. Acesse `/login` (link "Entrar" na navbar ou redirecionamento automático).
2. Informe o email `admin@teste.com` (qualquer email simples funciona, porém este já possui dados).
3. Ao submeter, o servidor grava o email em um cookie e verifica se há gêneros cadastrados:
   - Se não houver, o usuário é levado para `/onboarding`.
   - Se já existir histórico, redireciona direto para `/`.

### Cenário 2 – Onboarding (Cold Start)
1. Na tela `/onboarding`, selecione múltiplos gêneros musicais.
2. Ao confirmar, os valores são enviados via POST para o servidor, que atualiza o array `generos_preferidos` no documento do usuário.
3. Retorne automaticamente para a Home e observe que o bloco "Recomendado para Você" passa a refletir os gêneros escolhidos (consulta `$in`).

### Cenário 3 – Interação no Dashboard
1. **Favoritar**: clique no ícone de coração em qualquer música (seções "Recomendado" ou "Explorar"). O sistema realiza um toggle em `/favoritar/:id`, salvando o estado no MongoDB.
2. **Filtros**: utilize os chips de gênero na seção "Explorar" (`/?filtro=Rock`, por exemplo). A lista é recarregada mostrando apenas o gênero selecionado; o chip "Todos" limpa o filtro.
3. **Feedback visual**: destaque o efeito de animações (hover nos cards, coração pulsando quando favorito) para evidenciar a responsividade do MVP.

Com esse roteiro, o avaliador consegue comprovar: (a) autenticação simplificada, (b) personalização inicial via onboarding e (c) persistência/filtragem em tempo real no dashboard.
