# Harvey AI - Assistente Jurídico de Licitações (Versão 2.0)

![Harvey AI](https://img.shields.io/badge/Harvey%20AI-v2.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.1-000000)
![Python](https://img.shields.io/badge/Python-3.11-3776AB)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Visão Geral

Harvey AI é uma plataforma web moderna e intuitiva, especializada em assistência jurídica para licitações públicas brasileiras. Completamente refatorada com tecnologias de ponta, oferece análise automatizada de editais, geração de recursos e contrarrazões através de inteligência artificial, e integração com Google Docs para exportação de documentos.

### ✨ Principais Funcionalidades

- 🤖 **Chat com IA Especializada** - Assistente jurídico com conhecimento em Lei 14.133/2021
- 📊 **Dashboard Interativo** - Estatísticas em tempo real e visão geral dos casos
- 📁 **Gerenciamento de Casos** - CRUD completo com filtros e busca avançada
- 📄 **Análise de Editais** - Análise automatizada com IA para identificação de vícios
- ⚖️ **Geração de Documentos** - Recursos e contrarrazões gerados automaticamente
- 📝 **Integração Google Docs** - Exportação automática de documentos
- 📱 **Interface Responsiva** - Design moderno adaptável a todos os dispositivos

## 🏗️ Arquitetura

### Frontend (React)
- **Framework**: React 18 com Vite
- **Estilização**: Tailwind CSS + Shadcn/UI
- **Ícones**: Lucide React
- **Roteamento**: React Router DOM
- **Estado**: React Hooks

### Backend (Flask)
- **Framework**: Flask 3.1 com Python 3.11
- **ORM**: SQLAlchemy
- **Banco de Dados**: SQLite (dev) / PostgreSQL (prod)
- **APIs**: RESTful com validação robusta
- **CORS**: Configurado para integração frontend-backend

### Integrações
- **OpenAI API**: GPT-4 e GPT-3.5 Turbo para análise jurídica
- **Google Docs API**: Criação automática de documentos
- **Preparado para**: Gemini, Claude e outras APIs de IA

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm/pnpm
- Python 3.11+
- Git

### 1. Clone o Repositório
```bash
git clone https://github.com/leistermurilo-boop/harvey-ai-licitacoes
cd harvey-ai-licitacoes
```

### 2. Configuração do Frontend
```bash
cd harvey-ai-frontend
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:5173`

### 3. Configuração do Backend
```bash
cd harvey-ai-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python src/main.py
```
O backend estará disponível em `http://localhost:5000`

### 4. Configuração das APIs (Opcional)

#### OpenAI API
1. Obtenha sua API key em [OpenAI Platform](https://platform.openai.com/)
2. Configure a variável de ambiente:
```bash
export OPENAI_API_KEY="sua-api-key-aqui"
```

#### Google Docs API
1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a Google Docs API
3. Crie uma conta de serviço e baixe o arquivo JSON
4. Configure as credenciais através da interface da aplicação

## 📁 Estrutura do Projeto

```
harvey-ai-licitacoes/
├── harvey-ai-frontend/          # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── assets/             # Assets estáticos
│   │   ├── App.jsx             # Componente principal
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Arquivos públicos
│   └── package.json            # Dependências frontend
│
├── harvey-ai-backend/           # Backend Flask
│   ├── src/
│   │   ├── models/             # Modelos SQLAlchemy
│   │   ├── routes/             # Blueprints das APIs
│   │   ├── database/           # Banco de dados
│   │   └── main.py             # Aplicação principal
│   ├── venv/                   # Ambiente virtual Python
│   └── requirements.txt        # Dependências backend
│
├── docs/                       # Documentação
├── README.md                   # Este arquivo
└── LICENSE                     # Licença do projeto
```

## 🔧 APIs Disponíveis

### Chat API
- `POST /api/chat` - Conversar com IA
- `GET /api/chat/models` - Listar modelos disponíveis
- `POST /api/chat/validate-key` - Validar API key

### Cases API
- `GET /api/cases` - Listar casos
- `POST /api/cases` - Criar caso
- `PUT /api/cases/<id>` - Atualizar caso
- `DELETE /api/cases/<id>` - Deletar caso
- `GET /api/cases/stats` - Estatísticas

### Documents API
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Criar documento
- `POST /api/documents/google-docs/create` - Criar no Google Docs

### Analysis API
- `POST /api/analysis/edital` - Analisar edital
- `POST /api/analysis/recurso` - Gerar recurso
- `POST /api/analysis/contrarrazao` - Gerar contrarrazões

## 🎨 Design e UX

A interface segue o estilo visual moderno do site de referência:
- **Cores**: Azul escuro (#1e3a8a) e amarelo (#fbbf24)
- **Tipografia**: Sans-serif moderna e legível
- **Layout**: Limpo, espaçado e profissional
- **Responsividade**: Mobile-first design
- **Componentes**: Botões arredondados, cards com sombra, badges coloridos

## 🚀 Deploy

### Frontend (Netlify/Vercel)
```bash
cd harvey-ai-frontend
npm run build
# Deploy da pasta dist/
```

### Backend (Heroku/Railway)
```bash
cd harvey-ai-backend
# Configure as variáveis de ambiente
# Deploy do diretório harvey-ai-backend/
```

### Variáveis de Ambiente
```bash
# Backend
OPENAI_API_KEY=sua-openai-api-key
DATABASE_URL=sua-database-url
FLASK_ENV=production

# Frontend
VITE_API_URL=https://seu-backend.herokuapp.com
```

## 🧪 Testes

### Frontend
```bash
cd harvey-ai-frontend
npm run test
```

### Backend
```bash
cd harvey-ai-backend
python -m pytest
```

## 📚 Documentação

- [Documentação Completa](docs/documentacao_completa.md)
- [Guia de APIs](docs/api-guide.md)
- [Guia de Deploy](docs/deploy-guide.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para dúvidas, problemas ou sugestões:

1. Verifique a [documentação](docs/)
2. Consulte as [issues existentes](https://github.com/leistermurilo-boop/harvey-ai-licitacoes/issues)
3. Abra uma nova issue se necessário

## 🎯 Roadmap

### Versão 2.1
- [ ] Autenticação JWT completa
- [ ] Testes automatizados
- [ ] Integração com Gemini e Claude
- [ ] Upload de arquivos PDF

### Versão 2.2
- [ ] Aplicativo móvel
- [ ] Notificações em tempo real
- [ ] Relatórios avançados
- [ ] Integração com sistemas governamentais

### Versão 3.0
- [ ] Multi-tenancy
- [ ] Analytics avançado
- [ ] API pública
- [ ] Marketplace de templates

## 👥 Equipe

- **Desenvolvimento**: Manus AI
- **Design**: Baseado em https://calm-custard-519c22.netlify.app/
- **Consultoria Jurídica**: Especialistas em licitações públicas

## 📊 Status do Projeto

- ✅ Frontend React completo
- ✅ Backend Flask funcional
- ✅ Integração OpenAI implementada
- ✅ Google Docs preparado
- ✅ Interface responsiva
- ✅ Documentação completa
- 🔄 Testes automatizados (em desenvolvimento)
- 🔄 Deploy em produção (preparado)

---

**Harvey AI v2.0** - Transformando a assistência jurídica em licitações públicas através da tecnologia.

*Desenvolvido com ❤️ por Manus AI*

