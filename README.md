# Harvey - Assistente Jurídico de Licitações

## Descrição

Harvey é um sistema completo de assistente jurídico especializado em licitações públicas brasileiras, baseado na Lei nº 14.133/2021. O sistema oferece análise de editais, elaboração de defesas, gerenciamento de casos e integração com APIs de inteligência artificial e Google Docs.

## Funcionalidades

### ✅ Funcionalidades Implementadas

1. **Dashboard Interativo**
   - Estatísticas em tempo real de casos, editais e defesas
   - Interface responsiva e moderna
   - Navegação entre seções

2. **Chat com IA**
   - Interface de chat funcional
   - Integração com APIs de IA (OpenAI GPT-4, GPT-3.5, Claude)
   - Respostas especializadas em licitações
   - Sistema de fallback para respostas locais

3. **Gerenciamento de Casos**
   - Criação, edição e visualização de casos
   - Sistema de status (Em Andamento, Em Análise, Concluído)
   - Busca e filtros
   - Armazenamento em banco de dados SQLite

4. **Análise de Editais**
   - Upload de arquivos PDF
   - Formulário para dados da empresa
   - Análise automatizada com IA

5. **Configurações Avançadas**
   - Editor de prompt personalizado para o agente Harvey
   - Configuração de APIs (OpenAI, Google Docs)
   - Seleção de modelos de IA
   - Armazenamento local das configurações

6. **Integração Google Docs**
   - Criação de documentos
   - Atualização de documentos existentes
   - Geração automática de relatórios
   - Teste de credenciais

## Estrutura do Projeto

```
harvey-licitacoes-projeto/
├── index.html                 # Frontend principal
├── script.js                  # JavaScript com todas as funcionalidades
├── README.md                  # Esta documentação
└── harvey-backend/            # Backend Flask
    ├── src/
    │   ├── main.py            # Aplicação principal Flask
    │   ├── static/            # Arquivos estáticos (HTML, JS)
    │   ├── routes/            # Rotas da API
    │   │   ├── chat.py        # API de chat com IA
    │   │   ├── cases.py       # API de gerenciamento de casos
    │   │   ├── documents.py   # API do Google Docs
    │   │   └── user.py        # API de usuários (template)
    │   ├── models/            # Modelos do banco de dados
    │   └── database/          # Banco de dados SQLite
    ├── venv/                  # Ambiente virtual Python
    └── requirements.txt       # Dependências Python
```

## Instalação e Configuração

### Pré-requisitos

- Python 3.11+
- pip
- Navegador web moderno

### Passo a Passo

1. **Clone ou baixe o projeto**
   ```bash
   cd harvey-licitacoes-projeto
   ```

2. **Configure o backend Flask**
   ```bash
   cd harvey-backend
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências** (já instaladas no ambiente virtual)
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o servidor**
   ```bash
   python src/main.py
   ```

5. **Acesse o sistema**
   - Abra o navegador em: `http://localhost:5000`

## Configuração das APIs

### OpenAI API

1. Acesse a seção "Configurações" no sistema
2. Insira sua chave da API OpenAI no campo "Chave da API OpenAI"
3. Selecione o modelo desejado (GPT-4, GPT-3.5 Turbo, etc.)
4. Clique em "Salvar Configurações"

### Google Docs API

1. Crie um projeto no Google Cloud Console
2. Ative a Google Docs API
3. Crie uma conta de serviço e baixe o arquivo JSON de credenciais
4. Cole o conteúdo do arquivo JSON no campo "Configuração Google Docs API"
5. Clique em "Salvar Configurações"

## Como Usar

### 1. Chat com Harvey

- Digite suas perguntas no campo de chat
- Harvey responderá com base no prompt configurado e na API de IA
- Use comandos como:
  - "Analisar edital de licitação"
  - "Elaborar defesa administrativa"
  - "Explicar Lei 14.133/2021"

### 2. Gerenciar Casos

- Clique em "Novo Caso" para criar um caso
- Preencha os dados: número do processo, objeto, modalidade, órgão, data
- Visualize casos existentes na seção "Casos Recentes"
- Use a busca para encontrar casos específicos

### 3. Análise de Editais

- Acesse a seção "Análise Jurídica"
- Faça upload do edital em PDF
- Insira os dados da empresa
- Clique em "Analisar Edital" para obter análise automatizada

### 4. Personalizar o Agente

- Acesse "Configurações"
- Edite o prompt do agente Harvey para personalizar seu comportamento
- O prompt define como Harvey responde e quais informações prioriza

## APIs Disponíveis

### Chat API
- `POST /api/chat` - Enviar mensagem para IA
- `GET /api/chat/models` - Listar modelos disponíveis
- `POST /api/chat/validate-key` - Validar chave da API

### Cases API
- `GET /api/cases` - Listar todos os casos
- `POST /api/cases` - Criar novo caso
- `GET /api/cases/<id>` - Obter caso específico
- `PUT /api/cases/<id>` - Atualizar caso
- `DELETE /api/cases/<id>` - Deletar caso
- `GET /api/cases/search?q=termo` - Buscar casos
- `GET /api/cases/stats` - Estatísticas dos casos

### Documents API
- `POST /api/documents/create` - Criar documento no Google Docs
- `PUT /api/documents/<id>/update` - Atualizar documento
- `GET /api/documents/<id>` - Obter conteúdo do documento
- `POST /api/documents/generate-report` - Gerar relatório
- `POST /api/documents/test-credentials` - Testar credenciais

## Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome (ícones)
- Design responsivo
- LocalStorage para persistência

### Backend
- Flask (Python)
- SQLAlchemy (ORM)
- SQLite (banco de dados)
- Flask-CORS (CORS)

### APIs Integradas
- OpenAI API (GPT-4, GPT-3.5)
- Google Docs API
- Google Cloud Platform

## Segurança

- Chaves de API armazenadas localmente no navegador
- Validação de entrada em todas as APIs
- Tratamento de erros robusto
- CORS configurado para desenvolvimento

## Deployment

### Opção 1: Servidor Local
```bash
cd harvey-backend
source venv/bin/activate
python src/main.py
```

### Opção 2: Servidor de Produção
1. Configure um servidor WSGI (Gunicorn, uWSGI)
2. Configure um proxy reverso (Nginx)
3. Configure variáveis de ambiente para produção
4. Use um banco de dados mais robusto (PostgreSQL)

## Troubleshooting

### Problemas Comuns

1. **Erro de API Key**
   - Verifique se a chave da OpenAI está correta
   - Confirme se há créditos disponíveis na conta

2. **Erro do Google Docs**
   - Verifique se as credenciais JSON estão corretas
   - Confirme se a API está ativada no Google Cloud

3. **Servidor não inicia**
   - Verifique se a porta 5000 está livre
   - Confirme se o ambiente virtual está ativado

## Próximos Passos

### Melhorias Sugeridas

1. **Autenticação de Usuários**
   - Sistema de login/registro
   - Controle de acesso por perfil

2. **Banco de Dados Avançado**
   - Migração para PostgreSQL
   - Backup automático

3. **Funcionalidades Adicionais**
   - Calendário de licitações
   - Notificações automáticas
   - Relatórios avançados
   - Integração com sistemas governamentais

4. **Mobile App**
   - Aplicativo móvel nativo
   - Notificações push

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte os logs do servidor Flask
3. Teste as APIs individualmente
4. Verifique as configurações das chaves de API

## Licença

Este projeto foi desenvolvido para uso interno e educacional. Respeite os termos de uso das APIs integradas (OpenAI, Google).

---

**Harvey - Seu Assistente Jurídico Especializado em Licitações Públicas**

