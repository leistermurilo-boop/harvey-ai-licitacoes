# Instruções de Setup - Harvey Licitações

## 🚀 Guia Rápido de Instalação

### 1. Preparação do Ambiente

```bash
# Navegue até o diretório do projeto
cd harvey-licitacoes-projeto

# Entre no diretório do backend
cd harvey-backend

# Ative o ambiente virtual (já criado)
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 2. Executar o Sistema

```bash
# Execute o servidor Flask
python src/main.py
```

O sistema estará disponível em: `http://localhost:5000`

### 3. Configuração Inicial

#### 3.1 Configurar API OpenAI

1. Acesse: `http://localhost:5000`
2. Clique em "Configurações" na barra lateral
3. No campo "Chave da API OpenAI", insira sua chave: `sk-...`
4. Selecione o modelo desejado (GPT-4 recomendado)
5. Clique em "Salvar Configurações"

**Como obter a chave OpenAI:**
- Acesse: https://platform.openai.com/api-keys
- Faça login ou crie uma conta
- Clique em "Create new secret key"
- Copie a chave gerada

#### 3.2 Configurar Google Docs API (Opcional)

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a "Google Docs API"
4. Vá em "Credenciais" > "Criar credenciais" > "Conta de serviço"
5. Baixe o arquivo JSON de credenciais
6. Copie todo o conteúdo do arquivo JSON
7. No Harvey, vá em "Configurações"
8. Cole o JSON no campo "Configuração Google Docs API"
9. Clique em "Salvar Configurações"

### 4. Personalizar o Agente Harvey

1. Na seção "Configurações"
2. Edite o campo "Prompt do Agente Harvey"
3. Personalize o comportamento do assistente conforme suas necessidades
4. Clique em "Salvar Prompt"

**Exemplo de prompt personalizado:**
```
Você é Harvey, um assistente jurídico especializado em licitações públicas brasileiras.

ESPECIALIZAÇÃO:
- Lei nº 14.133/2021 (Nova Lei de Licitações)
- Jurisprudência do TCU
- Doutrina administrativa

SUAS FUNÇÕES:
1. Análise de editais
2. Elaboração de defesas administrativas
3. Orientação sobre procedimentos licitatórios
4. Interpretação da legislação

DIRETRIZES:
- Sempre cite a base legal
- Mantenha linguagem técnica mas acessível
- Solicite informações específicas quando necessário
- Priorize a segurança jurídica

Para análises detalhadas, sempre solicite:
- Número do processo
- Objeto da licitação
- Modalidade
- Dados da empresa
- Documentação específica
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` no diretório `harvey-backend/`:

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=sua_chave_secreta_aqui
OPENAI_API_KEY=sua_chave_openai_aqui
```

### Banco de Dados

O sistema usa SQLite por padrão. O banco é criado automaticamente em:
`harvey-backend/src/database/app.db`

Para resetar o banco:
```bash
rm harvey-backend/src/database/app.db
python harvey-backend/src/main.py  # Recria automaticamente
```

## 📱 Como Usar o Sistema

### 1. Dashboard
- Visualize estatísticas dos casos
- Acesse o chat com Harvey
- Veja casos recentes

### 2. Chat com Harvey
- Digite perguntas sobre licitações
- Solicite análises de editais
- Peça orientações jurídicas

### 3. Análise Jurídica
- Faça upload de editais (PDF)
- Insira dados da empresa
- Obtenha análise automatizada

### 4. Gerenciamento de Casos
- Crie novos casos de licitação
- Acompanhe o status
- Busque casos específicos

## 🚨 Solução de Problemas

### Erro: "Port 5000 is in use"
```bash
# Encontre o processo usando a porta
lsof -i :5000

# Mate o processo (substitua PID pelo número encontrado)
kill -9 PID

# Ou use uma porta diferente
python src/main.py --port 5001
```

### Erro: "Module not found"
```bash
# Certifique-se de que o ambiente virtual está ativo
source venv/bin/activate

# Reinstale as dependências
pip install -r requirements.txt
```

### Erro de API OpenAI
- Verifique se a chave está correta
- Confirme se há créditos na conta OpenAI
- Teste a chave em: https://platform.openai.com/playground

### Erro do Google Docs
- Verifique se o JSON está correto
- Confirme se a API está ativada
- Teste as credenciais na seção "Configurações"

## 🔒 Segurança

### Dados Sensíveis
- Chaves de API são armazenadas apenas no navegador (localStorage)
- Não são enviadas para servidores externos
- Limpe o cache do navegador para remover as chaves

### Backup
```bash
# Backup do banco de dados
cp harvey-backend/src/database/app.db backup_$(date +%Y%m%d).db

# Backup das configurações (se necessário)
# As configurações ficam no localStorage do navegador
```

## 📈 Monitoramento

### Logs do Sistema
Os logs aparecem no terminal onde o Flask está rodando:
```bash
python src/main.py
# Logs aparecerão aqui
```

### Verificar Status das APIs
- Teste a API OpenAI na seção "Configurações"
- Teste o Google Docs na seção "Configurações"
- Monitore os logs para erros

## 🚀 Deploy em Produção

### Usando Gunicorn
```bash
# Instale o Gunicorn
pip install gunicorn

# Execute em produção
cd harvey-backend
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

### Usando Docker (Opcional)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY harvey-backend/ .

RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "src/main.py"]
```

## 📞 Suporte

### Checklist de Verificação
- [ ] Ambiente virtual ativado
- [ ] Dependências instaladas
- [ ] Servidor Flask rodando
- [ ] Chave OpenAI configurada
- [ ] Sistema acessível no navegador

### Logs Importantes
- Erros de API aparecem no console do navegador (F12)
- Erros do servidor aparecem no terminal do Flask
- Status das requisições no Network tab do navegador

---

**✅ Sistema pronto para uso!**

Acesse `http://localhost:5000` e comece a usar o Harvey!

