# 2. Banco de Dados

## Schemas Mongoose

### User
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | String | Nome exibido no dashboard e navbar. |
| `email` | String (único) | Identificador do usuário; utilizado para login simulado e vínculo de preferências. |
| `generos_preferidos` | [String] | Lista de gêneros escolhidos no onboarding. Serve como input para a recomendação. |
| `favoritos` | [ObjectId ref `Music`] | Coleção de músicas marcadas como favoritas. Armazenada como array de referências. |
| `timestamps` | Date | Metadados automáticos (`createdAt`, `updatedAt`). |

### Music
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `titulo` | String | Nome da música exibido nas seções "Recomendado" e "Explorar". |
| `artista` | String | Artista/grupo associado. |
| `genero` | String | Categoria utilizada para filtros e recomendações. |
| `capa` | String (URL) | Imagem exibida nos cards e listas. |
| `data_lancamento` | Date | Data base para ordenação cronológica (placeholder). |
| `timestamps` | Date | Metadados automáticos do Mongoose. |

## Script de Seed (`seed.js`)
O script cumpre três etapas principais:
1. **Conexão** com o MongoDB usando as credenciais definidas no `docker-compose.yml`.
2. **Limpeza** das coleções `Music` e `User` (`deleteMany({})`) para garantir reprodutibilidade.
3. **Inserção de dados iniciais**:
   ```js
   const musicData = Array.from({ length: 20 }).map((_, index) => {
     const genreIndex = index % sampleGenres.length;
     return {
       titulo: `Música ${index + 1}`,
       artista: `Artista ${index + 1}`,
       genero: sampleGenres[genreIndex],
       capa: sampleCovers[genreIndex],
       data_lancamento: new Date(2010 + index, 0, 1)
     };
   });
   const musics = await Music.insertMany(musicData);
   ```
   - As 20 músicas cobrem múltiplos gêneros (Rock, Pop, Pagode, etc.) com placeholders nas capas.
   - Em seguida, o script cria o usuário `admin@teste.com`, atribuindo dois gêneros preferidos e uma lista inicial de favoritos baseada nos IDs inseridos.

## Persistência dos Favoritos
- O campo `favoritos` em `User` é um array de `ObjectId` com referência à coleção `Music`.
- Na rota `GET /favoritar/:id`, o sistema faz um *toggle*: adiciona o ID quando ausente e remove quando já presente (
`user.favoritos.findIndex(...)`).
- Essa abordagem mantém o relacionamento N:N de forma leve e permite consultar rapidamente se uma música está favoritada (`user.favoritos.map(...toString())`).

Com essa estrutura, o banco armazena tanto o catálogo básico quanto o histórico de preferências, garantindo que o MVP possa demonstrar recomendações e interações persistentes.
