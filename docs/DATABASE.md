# Documentação do Banco de Dados MongoDB

Esta documentação descreve a estrutura e o funcionamento do banco de dados MongoDB utilizado na plataforma de músicas.

## Visão Geral

O sistema utiliza o MongoDB como banco de dados NoSQL, com o Mongoose como ODM (Object Data Modeling) para interação com o banco de dados. A aplicação está configurada para se conectar a um banco de dados MongoDB local por padrão, mas pode ser configurada para usar um banco de dados remoto através de variáveis de ambiente.

## Estrutura do Banco de Dados

O banco de dados contém duas coleções principais:

1. **users** - Armazena informações dos usuários
2. **musics** - Armazena informações sobre as músicas

## Modelos de Dados

### 1. Usuário (User)

```javascript
{
  nome: String,              // Nome do usuário
  email: {                   // E-mail do usuário (único)
    type: String,
    required: true,
    unique: true
  },
  generos_preferidos: [String], // Lista de gêneros musicais preferidos
  favoritos: [                // Referências para músicas favoritas
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music'
    }
  ],
  createdAt: Date,           // Data de criação (gerado automaticamente)
  updatedAt: Date            // Data da última atualização (gerado automaticamente)
}
```

### 2. Música (Music)

```javascript
{
  titulo: {                  // Título da música
    type: String,
    required: true
  },
  artista: {                 // Nome do artista
    type: String,
    required: true
  },
  genero: {                  // Gênero musical
    type: String,
    required: true
  },
  capa: {                    // URL da imagem de capa
    type: String,
    required: true
  },
  data_lancamento: {         // Data de lançamento
    type: Date,
    required: true
  },
  createdAt: Date,           // Data de criação (gerado automaticamente)
  updatedAt: Date            // Data da última atualização (gerado automaticamente)
}
```

## Relacionamentos

- Um usuário pode ter várias músicas favoritas (relacionamento one-to-many)
- As músicas são referenciadas nos favoritos dos usuários através de seus IDs

## Configuração da Conexão

A conexão com o MongoDB é configurada no arquivo `app.js` com as seguintes opções:

- **URI de conexão padrão**: `mongodb://root:root@localhost:27017/music_platform?authSource=admin`
- **Opções do Mongoose**:
  - `useNewUrlParser: true`
  - `useUnifiedTopology: true`

A URI de conexão pode ser personalizada através da variável de ambiente `MONGO_URI`.

## Operações Comuns

### Inserir uma nova música

```javascript
const novaMusica = await Music.create({
  titulo: "Nome da Música",
  artista: "Nome do Artista",
  genero: "Pop",
  capa: "url-da-capa.jpg",
  data_lancamento: new Date()
});
```

### Buscar músicas por gênero

```javascript
const musicasPop = await Music.find({ genero: "Pop" });
```

### Adicionar música aos favoritos do usuário

```javascript
await User.findOneAndUpdate(
  { email: "usuario@exemplo.com" },
  { $addToSet: { favoritos: musicaId } },
  { new: true }
);
```

### Buscar usuário com seus favoritos populados

```javascript
const usuario = await User.findOne({ email: "usuario@exemplo.com" })
  .populate('favoritos');
```

## Índices

- **Usuários**: O campo `email` possui um índice único para otimizar buscas e garantir unicidade.
- **Músicas**: Não há índices adicionais além do `_id` padrão. Índices podem ser adicionados conforme a necessidade de desempenho.

## Boas Práticas

1. **Validação**: Utilize os validadores do Mongoose para garantir a integridade dos dados.
2. **Índices**: Considere adicionar índices para campos frequentemente consultados.
3. **Populate**: Use o método `populate()` para carregar documentos relacionados quando necessário.
4. **Transações**: Para operações atômicas que envolvam múltiplas coleções, utilize transações do MongoDB.
5. **Variáveis de Ambiente**: Nunca armazene credenciais diretamente no código-fonte. Use variáveis de ambiente para informações sensíveis.
