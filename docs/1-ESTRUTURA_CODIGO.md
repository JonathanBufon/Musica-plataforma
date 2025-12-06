# 1. Estrutura do Código Fonte

## Visão Geral da Arquitetura
O projeto segue uma arquitetura MVC simplificada construída sobre Node.js e Express:
- **Model (M)**: Definido nos Schemas Mongoose dentro de `src/models`, responsáveis por mapear `Music` e `User` no MongoDB.
- **View (V)**: Renderizações server-side com EJS em `views`, aproveitando os mockups em Tailwind convertidos para templates dinâmicos.
- **Controller (C)**: As rotas declaradas em `app.js` conectam os Models aos templates, aplicando regras de negócio (recomendações, favoritos, onboarding).

Esse arranjo garante baixo acoplamento: alterações visuais ficam encapsuladas nas Views, enquanto ajustes de dados e lógica permanecem nos Models/Controllers.

## Árvore de Diretórios
```
.
├── app.js              # Ponto de entrada Express + rotas e integrações
├── docker-compose.yml  # Infraestrutura MongoDB + mongo-express
├── seed.js             # Script de povoamento inicial do banco
├── src/
│   └── models/
│       ├── Music.js    # Schema das músicas
│       └── User.js     # Schema dos usuários
├── views/
│   ├── partials/       # Head e Navbar reutilizáveis
│   ├── home.ejs        # Dashboard principal (recomendações + explorar)
│   ├── login.ejs       # Tela de login simulado
│   └── onboarding.ejs  # Seleção de gêneros (cold start)
├── mockups/            # Referência original HTML/Tailwind
├── docs/               # Documentação de handover
└── package.json        # Metadados do projeto e dependências
```

### Responsabilidades por Pasta
- **`src/models`**: contratos de dados (Schemas) e validações básicas.
- **`views`**: templates em EJS estilizados com Tailwind via CDN, incluindo parciais compartilhadas.
- **`mockups`**: fontes originais e estáticas, mantidas como referência visual.
- **`docs`**: documentação de entrega (este diretório).
- **Raiz**: arquivos de infraestrutura (`docker-compose.yml`), script de seed e entrada do servidor (`app.js`).

## Principais Dependências
| Dependência     | Uso no MVP | Justificativa |
|-----------------|------------|---------------|
| `express`       | Servidor HTTP e roteamento. | Framework leve, com sintaxe simples e comunidade consolidada, ideal para MVPs. |
| `mongoose`      | ODM para MongoDB. | Facilita definição de Schemas, validações e abstrai queries, acelerando o desenvolvimento. |
| `ejs`           | Motor de template server-side. | Permite reaproveitar os mockups em HTML/Tailwind, gerando páginas dinâmicas sem build frontend complexo. |
| `cookie-parser` | Leitura/escrita de cookies. | Usado para persistir o email ativo durante a sessão e direcionar o onboarding. |

Essas escolhas priorizam produtividade e clareza para o protótipo acadêmico, reduzindo a necessidade de configuração adicional.
