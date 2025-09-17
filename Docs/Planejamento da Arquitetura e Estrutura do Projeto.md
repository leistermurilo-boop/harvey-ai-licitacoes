# Planejamento da Arquitetura e Estrutura do Projeto

## 1. Arquitetura Proposta

Para a refatoração do projeto "Harvey - Assistente Jurídico de Licitações", propõe-se uma arquitetura moderna e escalável, dividida em Frontend e Backend, com foco em performance, manutenibilidade e experiência do desenvolvedor. A escolha de tecnologias visa atender aos requisitos de interface limpa, responsiva, integração com múltiplas APIs de IA e Google Docs, e preparação para deploy contínuo.

### 1.1. Frontend: Next.js com React

**Justificativa:**
- **Performance e SEO**: Next.js oferece Server-Side Rendering (SSR), Static Site Generation (SSG) e Incremental Static Regeneration (ISR), que melhoram significativamente a performance de carregamento e a otimização para motores de busca, crucial para uma plataforma profissional.
- **Experiência do Desenvolvedor**: O ecossistema React é vasto e maduro, com uma grande comunidade e bibliotecas robustas. Next.js simplifica a configuração e o roteamento, permitindo focar na lógica de negócio.
- **Responsividade**: Com React e bibliotecas de UI modernas, é mais fácil construir interfaces responsivas e adaptáveis a diferentes dispositivos.
- **Escalabilidade**: A estrutura de componentes do React facilita a reutilização de código e a expansão de funcionalidades.

**Tecnologias e Bibliotecas Chave:**
- **Next.js**: Framework React para produção, com roteamento baseado em arquivos, otimização de imagens, divisão de código e API Routes.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Para adicionar tipagem estática ao JavaScript, melhorando a detecção de erros e a manutenibilidade do código.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e consistente, seguindo o estilo visual do site de referência (cores, espaçamento, tipografia).
- **Radix UI / Headless UI**: Para componentes de UI acessíveis e sem estilo, permitindo total controle sobre o visual com Tailwind CSS.
- **React Query / SWR**: Para gerenciamento de estado assíncrono e cache de dados, otimizando as chamadas de API.
- **Zustand / Jotai / Recoil**: Para gerenciamento de estado global leve e eficiente, se necessário.
- **Formik / React Hook Form**: Para gerenciamento de formulários complexos.
- **Axios / Fetch API**: Para requisições HTTP ao backend.

### 1.2. Backend: Node.js com Express.js

**Justificativa:**
- **Unificação de Linguagem**: Permite que desenvolvedores full-stack trabalhem com JavaScript/TypeScript tanto no frontend quanto no backend, otimizando o fluxo de trabalho.
- **Performance**: Node.js é conhecido por sua arquitetura assíncrona e não bloqueante, ideal para lidar com múltiplas requisições simultâneas, como as integrações com APIs de IA.
- **Ecossistema Rico**: O npm possui uma vasta coleção de pacotes para diversas funcionalidades, desde autenticação até manipulação de dados.
- **Escalabilidade**: Facilmente escalável horizontalmente, podendo ser distribuído em múltiplos servidores.

**Tecnologias e Bibliotecas Chave:**
- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express.js**: Framework web minimalista e flexível para Node.js, ideal para construir APIs RESTful.
- **TypeScript**: Para tipagem estática, assim como no frontend.
- **PostgreSQL**: Banco de dados relacional robusto e escalável, recomendado para substituir SQLite em produção, conforme sugerido no README original. Será utilizado para armazenamento de usuários, casos, configurações e histórico.
- **Prisma ORM**: ORM (Object-Relational Mapper) moderno e type-safe para interagir com o banco de dados, facilitando operações CRUD e migrações.
- **JWT (JSON Web Tokens)**: Para autenticação e autorização de usuários.
- **Bcrypt**: Para hash de senhas, garantindo a segurança.
- **Joi / Zod**: Para validação de esquemas de dados de entrada.
- **Dotenv**: Para gerenciamento de variáveis de ambiente.
- **Winston / Pino**: Para logging eficiente.
- **OpenAI SDK / Google Cloud SDK**: Para integração com as APIs de IA e Google Docs.

## 2. Estrutura de Pastas e Arquivos (Monorepo)

Propõe-se a utilização de um monorepo, gerenciado por ferramentas como `pnpm workspace` ou `Turborepo`, para abrigar tanto o frontend quanto o backend. Isso facilita o compartilhamento de código (ex: tipos, utilitários) e a gestão de dependências.

```
/harvey-ai-licitacoes-refatorado
├── apps/
│   ├── web/                  # Aplicação Frontend (Next.js)
│   │   ├── public/           # Arquivos estáticos
│   │   ├── src/
│   │   │   ├── app/          # Roteamento e layout (Next.js App Router)
│   │   │   ├── components/   # Componentes React reutilizáveis
│   │   │   ├── lib/          # Funções utilitárias, hooks, clientes de API
│   │   │   ├── styles/       # Configuração do Tailwind CSS, estilos globais
│   │   │   ├── types/        # Definições de tipos TypeScript
│   │   │   └── hooks/        # Custom React Hooks
│   │   ├── tailwind.config.ts
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── server/               # Aplicação Backend (Node.js/Express)
│       ├── src/
│       │   ├── config/       # Configurações (DB, APIs, etc.)
│       │   ├── controllers/  # Lógica de negócio dos endpoints
│       │   ├── middlewares/  # Middlewares Express (autenticação, validação)
│       │   ├── models/       # Definições de modelos Prisma
│       │   ├── routes/       # Definição de rotas da API
│       │   ├── services/     # Lógica de integração com APIs externas (IA, Google Docs)
│       │   ├── utils/        # Funções utilitárias
│       │   └── app.ts        # Ponto de entrada da aplicação Express
│       ├── prisma/           # Esquemas Prisma e migrações
│       ├── .env.example
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── ui/                   # Biblioteca de componentes UI compartilhados (opcional, para componentes mais genéricos)
│   ├── types/                # Tipos TypeScript compartilhados entre frontend e backend
│   └── config/               # Configurações compartilhadas (ESLint, Prettier, TSConfig)
├── .gitignore
├── package.json              # Gerenciador de monorepo (pnpm-workspace.yaml ou package.json com workspaces)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md                 # Documentação geral do monorepo
```

## 3. Detalhamento das Tecnologias e Justificativas

### Frontend (Next.js)
- **Next.js App Router**: Será utilizado para um roteamento mais moderno e flexível, com Server Components e Server Actions, otimizando a performance e a experiência do usuário.
- **TypeScript**: Essencial para garantir a robustez do código, especialmente em um projeto de médio a grande porte com múltiplas integrações.
- **Tailwind CSS**: Permite um desenvolvimento ágil da interface, garantindo que o estilo visual do site de referência seja replicado com precisão e consistência, sem a necessidade de escrever CSS customizado em excesso.
- **Componentes Reutilizáveis**: A abordagem de componentes do React será fundamental para construir uma UI modular e de fácil manutenção, com foco na reutilização de elementos como botões, cards, inputs, etc.

### Backend (Node.js/Express.js)
- **PostgreSQL**: Oferece maior robustez, escalabilidade e integridade de dados em comparação com SQLite, sendo a escolha padrão para aplicações em produção.
- **Prisma ORM**: Simplifica a interação com o banco de dados, gera tipos TypeScript automaticamente a partir do esquema do banco, e facilita a gestão de migrações, tornando o desenvolvimento mais produtivo e menos propenso a erros.
- **Autenticação JWT**: Um padrão seguro e amplamente utilizado para autenticação de APIs, permitindo controle de acesso baseado em tokens.
- **Integração de APIs de IA**: Será implementado um módulo de serviço para cada API de IA (OpenAI, Gemini, Claude), abstraindo os detalhes de cada SDK e fornecendo uma interface unificada para o frontend. Isso permitirá fácil adição ou remoção de provedores de IA no futuro.
- **Integração Google Docs**: Similarmente, um serviço dedicado gerenciará a comunicação com a Google Docs API, encapsulando a lógica de autenticação e manipulação de documentos.

## 4. Plano de Migração de Dados

Considerando que o projeto atual utiliza SQLite e o novo projeto utilizará PostgreSQL, será necessário um plano de migração de dados. No entanto, como o projeto original não parece ter uma base de usuários ou dados em produção, a abordagem inicial será criar um novo esquema de banco de dados no PostgreSQL e popular com dados de teste. Se houver dados existentes no SQLite que precisem ser migrados, um script de migração de dados será desenvolvido para exportar os dados do SQLite e importá-los para o PostgreSQL, mapeando os campos conforme o novo esquema.

## 5. Melhorias de UX/UI e Performance

Além de replicar o estilo visual do site de referência, as seguintes melhorias serão incorporadas:
- **Feedback Visual**: Adição de loaders, mensagens de sucesso/erro e estados de carregamento para melhorar a percepção de responsividade da interface.
- **Otimização de Imagens**: Uso das funcionalidades de otimização de imagens do Next.js para garantir carregamento rápido de assets visuais.
- **Acessibilidade**: Implementação de padrões de acessibilidade (ARIA attributes, semântica HTML) para garantir que a plataforma seja utilizável por todos.
- **Tratamento de Erros**: Mensagens de erro claras e amigáveis para o usuário, tanto no frontend quanto no backend.
- **Cache de Dados**: Utilização de React Query/SWR no frontend para cache de dados e revalidação, reduzindo o número de requisições ao backend e melhorando a experiência do usuário.
- **Paginação/Infinite Scroll**: Implementação para listagens de dados (ex: histórico de documentos, casos) para melhorar a performance e a usabilidade.

Este planejamento serve como base para as próximas fases de desenvolvimento, garantindo uma abordagem estruturada e eficiente para a refatoração completa do projeto.

