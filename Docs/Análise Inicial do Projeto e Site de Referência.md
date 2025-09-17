# Análise Inicial do Projeto e Site de Referência

## Projeto Atual: harvey-ai-licitacoes

### Descrição Geral
O projeto atual é um assistente jurídico especializado em licitações públicas brasileiras, baseado na Lei nº 14.133/2021. Ele oferece análise de editais, elaboração de defesas, gerenciamento de casos e integração com APIs de inteligência artificial e Google Docs.

### Funcionalidades Implementadas:
1.  **Dashboard Interativo**: Estatísticas em tempo real, interface responsiva, navegação entre seções.
2.  **Chat com IA**: Interface de chat, integração com APIs de IA (OpenAI GPT-4, GPT-3.5, Claude), respostas especializadas em licitações, sistema de fallback.
3.  **Gerenciamento de Casos**: Criação, edição, visualização de casos, status, busca, filtros, armazenamento em SQLite.
4.  **Análise de Editais**: Upload de PDFs, formulário para dados da empresa, análise automatizada com IA.
5.  **Configurações Avançadas**: Editor de prompt personalizado, configuração de APIs (OpenAI, Google Docs), seleção de modelos de IA, armazenamento local das configurações.
6.  **Integração Google Docs**: Criação, atualização de documentos, geração automática de relatórios, teste de credenciais.

### Estrutura do Projeto:
-   **Frontend**: `index.html`, `script.js`, `style.css` (HTML, CSS, JavaScript puro).
-   **Backend**: `harvey-backend/` (Flask com Python), `src/` (main.py, static/, routes/, models/, database/), `venv/`, `requirements.txt`.

### Tecnologias Utilizadas:
-   **Frontend**: HTML5, CSS3, JavaScript (ES6+), Font Awesome, LocalStorage.
-   **Backend**: Flask (Python), SQLAlchemy (ORM), SQLite, Flask-CORS.
-   **APIs Integradas**: OpenAI API, Google Docs API, Google Cloud Platform.

### Próximos Passos (Melhorias Sugeridas no README):
-   Autenticação de Usuários.
-   Banco de Dados Avançado (PostgreSQL).
-   Funcionalidades Adicionais (Calendário, Notificações, Relatórios avançados, Integração com sistemas governamentais).
-   Mobile App.

## Site de Referência: ComprasGov Pro (https://calm-custard-519c22.netlify.app/)

### Estilo Visual e UX/UI:
-   **Layout**: Moderno, limpo, com seções bem definidas e espaçamento adequado.
-   **Cores**: Predominantemente azul escuro como cor de fundo, com elementos em amarelo vibrante para destaque (títulos, botões). Texto em branco para contraste.
-   **Tipografia**: Fontes sans-serif, limpas e legíveis. Tamanhos de fonte variados para hierarquia visual.
-   **Componentes**: Botões com cantos arredondados e efeitos de hover sutis. Ícones simples e claros.
-   **Responsividade**: O site parece ser responsivo, adaptando-se bem a diferentes tamanhos de tela.
-   **Navegação**: Simples e direta, com um menu no cabeçalho e chamadas para ação claras.
-   **Elementos Visuais**: Uso de estrelas como ícones ou elementos decorativos. Imagens ou ilustrações abstratas no fundo.

### Observações para Refatoração:
-   A refatoração deve adotar uma paleta de cores similar (azul escuro, amarelo, branco).
-   A tipografia deve seguir um estilo moderno e limpo.
-   Os componentes (botões, cards, campos de input) devem ter um design coeso e arredondado.
-   A estrutura de navegação deve ser intuitiva e responsiva, similar ao site de referência.
-   A interface deve ser limpa e focada na usabilidade, minimizando distrações.

