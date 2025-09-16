// Harvey Licitações - Sistema Completo
class HarveySystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.cases = this.loadCases();
        this.apiConfig = this.loadApiConfig();
        this.aiPrompt = this.loadAiPrompt();
        this.currentUser = this.loadUserSession();
        this.sharedData = this.loadSharedData(); // Dados compartilhados entre seções
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCasesGrid();
        this.loadSavedConfigurations();
        this.updateUserInterface();
        this.setupSectionIntegration();
        this.initializeReports();
    }

    // Gerenciamento de dados compartilhados entre seções
    loadSharedData() {
        const saved = localStorage.getItem('harvey_shared_data');
        return saved ? JSON.parse(saved) : {
            currentCase: null,
            analysisResults: [],
            documentTemplates: {},
            workflowState: {}
        };
    }

    saveSharedData() {
        localStorage.setItem('harvey_shared_data', JSON.stringify(this.sharedData));
    }

    // Configurar integração entre seções
    setupSectionIntegration() {
        // Observar mudanças de seção para atualizar dados
        this.setupSectionObserver();
        
        // Configurar transferência automática de dados
        this.setupDataTransfer();
    }

    setupSectionObserver() {
        // Observer para detectar mudanças de seção
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('active') && target.classList.contains('section')) {
                        this.onSectionChange(target.id);
                    }
                }
            });
        });

        // Observar todas as seções
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section, { attributes: true });
        });
    }

    setupDataTransfer() {
        // Configurar botões de transferência de dados
        this.addDataTransferButtons();
    }

    addDataTransferButtons() {
        // Adicionar botões de integração nos casos
        const casesGrid = document.getElementById('cases-grid');
        if (casesGrid) {
            // Observer para detectar quando novos casos são adicionados
            const observer = new MutationObserver(() => {
                this.updateCaseCards();
            });
            observer.observe(casesGrid, { childList: true });
        }
    }

    updateCaseCards() {
        // Adicionar botões de ação rápida nos cards de casos
        document.querySelectorAll('.case-card').forEach(card => {
            if (!card.querySelector('.quick-actions')) {
                const quickActions = document.createElement('div');
                quickActions.className = 'quick-actions';
                quickActions.style.cssText = 'margin-top: 10px; display: flex; gap: 5px;';
                
                const analyzeBtn = document.createElement('button');
                analyzeBtn.className = 'btn btn-primary';
                analyzeBtn.style.cssText = 'font-size: 12px; padding: 5px 10px;';
                analyzeBtn.textContent = 'Analisar';
                analyzeBtn.onclick = () => this.transferCaseToAnalysis(card);
                
                const reportBtn = document.createElement('button');
                reportBtn.className = 'btn btn-primary';
                reportBtn.style.cssText = 'font-size: 12px; padding: 5px 10px; background: #27ae60;';
                reportBtn.textContent = 'Relatório';
                reportBtn.onclick = () => this.transferCaseToReports(card);
                
                quickActions.appendChild(analyzeBtn);
                quickActions.appendChild(reportBtn);
                card.appendChild(quickActions);
            }
        });
    }

    onSectionChange(sectionId) {
        // Atualizar interface baseada na seção ativa
        switch(sectionId) {
            case 'analise':
                this.populateAnalysisFromSharedData();
                break;
            case 'relatorios':
                this.populateReportsFromSharedData();
                break;
            case 'casos':
                this.refreshCasesWithAnalysisData();
                break;
        }
    }

    // Transferir caso para análise jurídica
    transferCaseToAnalysis(caseCard) {
        const caseNumber = caseCard.querySelector('.case-number')?.textContent?.replace('Processo: ', '') || '';
        const caseObject = caseCard.querySelector('.case-object')?.textContent || '';
        
        // Encontrar o caso completo
        const fullCase = this.cases.find(c => c.numero === caseNumber);
        
        if (fullCase) {
            // Salvar caso atual nos dados compartilhados
            this.sharedData.currentCase = fullCase;
            this.saveSharedData();
            
            // Mudar para seção de análise
            this.switchSection('analise');
            
            // Preencher dados automaticamente
            this.populateAnalysisFromCase(fullCase);
            
            this.showNotification(`Caso ${caseNumber} transferido para análise jurídica.`, 'success');
        }
    }

    // Transferir caso para relatórios
    transferCaseToReports(caseCard) {
        const caseNumber = caseCard.querySelector('.case-number')?.textContent?.replace('Processo: ', '') || '';
        const fullCase = this.cases.find(c => c.numero === caseNumber);
        
        if (fullCase) {
            this.sharedData.currentCase = fullCase;
            this.saveSharedData();
            
            this.switchSection('relatorios');
            this.populateReportsFromCase(fullCase);
            
            this.showNotification(`Caso ${caseNumber} transferido para relatórios.`, 'success');
        }
    }

    // Preencher análise com dados do caso
    populateAnalysisFromCase(caseData) {
        // Preencher dados da empresa se disponível
        const empresaDados = document.getElementById('empresa-dados');
        if (empresaDados && caseData) {
            empresaDados.value = `Processo: ${caseData.numero}\nObjeto: ${caseData.objeto}\nÓrgão: ${caseData.orgao}\nModalidade: ${caseData.modalidade}`;
        }

        // Se há dados de análise prévia, mostrar
        const analysisResult = this.sharedData.analysisResults.find(r => r.caseId === caseData.id);
        if (analysisResult) {
            const resultDiv = document.getElementById('analise-resultado');
            if (resultDiv) {
                resultDiv.innerHTML = analysisResult.content;
            }
        }
    }

    // Preencher análise com dados compartilhados
    populateAnalysisFromSharedData() {
        if (this.sharedData.currentCase) {
            this.populateAnalysisFromCase(this.sharedData.currentCase);
        }
    }

    // Preencher relatórios com dados do caso
    populateReportsFromCase(caseData) {
        // Implementar preenchimento automático de relatórios
        const reportSection = document.getElementById('relatorios');
        if (reportSection) {
            // Adicionar informações do caso no relatório
            this.updateReportWithCaseData(caseData);
        }
    }

    // Preencher relatórios com dados compartilhados
    populateReportsFromSharedData() {
        if (this.sharedData.currentCase) {
            this.populateReportsFromCase(this.sharedData.currentCase);
        }
        
        // Incluir resultados de análises
        if (this.sharedData.analysisResults.length > 0) {
            this.updateReportWithAnalysisResults();
        }
    }

    // Atualizar casos com dados de análise
    refreshCasesWithAnalysisData() {
        this.cases.forEach(caseItem => {
            const analysisResult = this.sharedData.analysisResults.find(r => r.caseId === caseItem.id);
            if (analysisResult) {
                caseItem.hasAnalysis = true;
                caseItem.analysisDate = analysisResult.date;
            }
        });
        this.loadCasesGrid();
    }

    // Salvar resultado de análise
    saveAnalysisResult(caseId, content, type = 'edital') {
        const result = {
            id: Date.now(),
            caseId: caseId,
            type: type,
            content: content,
            date: new Date().toISOString(),
            user: this.currentUser?.name || 'Sistema'
        };
        
        this.sharedData.analysisResults.push(result);
        this.saveSharedData();
        
        // Atualizar dashboard com nova análise
        this.updateDashboardStats();
    }

    // Atualizar estatísticas do dashboard
    updateDashboardStats() {
        const casosAtivos = this.cases.filter(c => c.status === 'open').length;
        const editaisAnalisados = this.sharedData.analysisResults.filter(r => r.type === 'edital').length;
        const defesasElaboradas = this.sharedData.analysisResults.filter(r => ['recurso', 'contrarrazao', 'defesa'].includes(r.type)).length;

        const casosAtivosEl = document.getElementById('casos-ativos');
        const editaisAnalisadosEl = document.getElementById('editais-analisados');
        const defesasElaboradasEl = document.getElementById('defesas-elaboradas');
        
        if (casosAtivosEl) casosAtivosEl.textContent = casosAtivos;
        if (editaisAnalisadosEl) editaisAnalisadosEl.textContent = editaisAnalisados;
        if (defesasElaboradasEl) defesasElaboradasEl.textContent = defesasElaboradas;
    }

    // Criar workflow entre seções
    createWorkflow(steps) {
        this.sharedData.workflowState = {
            steps: steps,
            currentStep: 0,
            completed: false,
            startDate: new Date().toISOString()
        };
        this.saveSharedData();
    }

    // Avançar no workflow
    advanceWorkflow() {
        if (this.sharedData.workflowState.currentStep < this.sharedData.workflowState.steps.length - 1) {
            this.sharedData.workflowState.currentStep++;
            this.saveSharedData();
            
            const nextStep = this.sharedData.workflowState.steps[this.sharedData.workflowState.currentStep];
            this.showNotification(`Próximo passo: ${nextStep.name}`, 'info');
            
            if (nextStep.section) {
                this.switchSection(nextStep.section);
            }
        } else {
            this.sharedData.workflowState.completed = true;
            this.saveSharedData();
            this.showNotification('Workflow concluído!', 'success');
        }
    }

    // Gerenciamento de usuário
    loadUserSession() {
        const userData = localStorage.getItem('harvey_user_session');
        return userData ? JSON.parse(userData) : null;
    }

    saveUserSession(userData) {
        localStorage.setItem('harvey_user_session', JSON.stringify(userData));
        this.currentUser = userData;
        this.updateUserInterface();
    }

    clearUserSession() {
        localStorage.removeItem('harvey_user_session');
        this.currentUser = null;
        this.updateUserInterface();
    }

    updateUserInterface() {
        const preLoginState = document.getElementById('preLoginState');
        const postLoginState = document.getElementById('postLoginState');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (this.currentUser && preLoginState && postLoginState) {
            // Estado pós-login
            preLoginState.style.display = 'none';
            postLoginState.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.name || 'Usuário';
            if (userAvatar) userAvatar.textContent = (this.currentUser.name || 'U').charAt(0).toUpperCase();
        } else if (preLoginState && postLoginState) {
            // Estado pré-login
            preLoginState.style.display = 'flex';
            postLoginState.style.display = 'none';
        }
    }

    openLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
            this.showLoginForm();
        }
    }

    closeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const modalTitle = document.querySelector('#loginModal h3');
        
        if (loginForm) loginForm.style.display = 'flex';
        if (registerForm) registerForm.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Entrar no Sistema';
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const modalTitle = document.querySelector('#loginModal h3');
        
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'flex';
        if (modalTitle) modalTitle.textContent = 'Cadastrar no Sistema';
    }

    async handleLogin(email, password) {
        try {
            // Simulação de autenticação (em produção, seria uma chamada para API)
            if (email && password) {
                const userData = {
                    id: Date.now(),
                    name: email.split('@')[0],
                    email: email,
                    loginTime: new Date().toISOString()
                };
                
                this.saveUserSession(userData);
                this.closeLoginModal();
                this.showNotification('Login realizado com sucesso!', 'success');
                return true;
            }
        } catch (error) {
            this.showNotification('Erro ao fazer login. Tente novamente.', 'error');
            return false;
        }
    }

    async handleRegister(name, email, password, confirmPassword) {
        try {
            if (password !== confirmPassword) {
                this.showNotification('As senhas não coincidem.', 'error');
                return false;
            }

            if (name && email && password) {
                const userData = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    loginTime: new Date().toISOString()
                };
                
                this.saveUserSession(userData);
                this.closeLoginModal();
                this.showNotification('Cadastro realizado com sucesso!', 'success');
                return true;
            }
        } catch (error) {
            this.showNotification('Erro ao fazer cadastro. Tente novamente.', 'error');
            return false;
        }
    }

    logout() {
        this.clearUserSession();
        this.showNotification('Logout realizado com sucesso!', 'success');
        // Fechar dropdown se estiver aberto
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    editProfile() {
        // Implementar edição de perfil
        this.showNotification('Funcionalidade de edição de perfil em desenvolvimento.', 'info');
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = '#27ae60';
                break;
            case 'error':
                notification.style.background = '#e74c3c';
                break;
            case 'info':
            default:
                notification.style.background = '#3498db';
                break;
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Métodos implementados que estavam faltando
    initializeReports() {
        console.log('Sistema de relatórios inicializado');
        // Carregar templates de relatório se existirem
        this.loadReportTemplates();
    }

    loadReportTemplates() {
        // Carregar templates salvos
        const templates = localStorage.getItem('harvey_report_templates');
        if (templates) {
            this.sharedData.documentTemplates = JSON.parse(templates);
        }
    }

    updateReportWithCaseData(caseData) {
        console.log('Atualizando relatório com dados do caso:', caseData.numero);
        
        // Buscar área de relatório na interface
        const reportArea = document.getElementById('report-content') || document.querySelector('.report-content');
        if (reportArea && caseData) {
            const caseInfo = `
                <div class="case-report-section">
                    <h4>Informações do Caso</h4>
                    <p><strong>Processo:</strong> ${caseData.numero}</p>
                    <p><strong>Objeto:</strong> ${caseData.objeto}</p>
                    <p><strong>Órgão:</strong> ${caseData.orgao}</p>
                    <p><strong>Modalidade:</strong> ${caseData.modalidade}</p>
                    <p><strong>Data de Publicação:</strong> ${caseData.dataPublicacao}</p>
                    <p><strong>Status:</strong> ${caseData.status}</p>
                </div>
            `;
            reportArea.innerHTML = caseInfo + (reportArea.innerHTML || '');
        }
    }

    updateReportWithAnalysisResults() {
        console.log('Incluindo resultados de análises no relatório');
        
        const reportArea = document.getElementById('report-content') || document.querySelector('.report-content');
        if (reportArea && this.sharedData.analysisResults.length > 0) {
            const analysisSection = `
                <div class="analysis-report-section">
                    <h4>Resultados de Análises</h4>
                    ${this.sharedData.analysisResults.map(result => `
                        <div class="analysis-item">
                            <h5>Análise ${result.type} - ${new Date(result.date).toLocaleDateString()}</h5>
                            <div class="analysis-content">${result.content}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            reportArea.innerHTML += analysisSection;
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Chat functionality
        const sendButton = document.getElementById('send-button');
        const userInput = document.getElementById('user-input');
        
        if (sendButton && userInput) {
            sendButton.addEventListener('click', () => this.sendMessage());
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // New case button
        const newCaseBtn = document.getElementById('new-case-btn');
        if (newCaseBtn) {
            newCaseBtn.addEventListener('click', () => {
                this.openModal('newCaseModal');
            });
        }

        // New case form
        const newCaseForm = document.getElementById('newCaseForm');
        if (newCaseForm) {
            newCaseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNewCase();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCases(e.target.value);
            });
        }

        // File upload for edital analysis
        const editalUpload = document.getElementById('edital-upload');
        if (editalUpload) {
            editalUpload.addEventListener('change', (e) => {
                this.handleEditalUpload(e.target.files[0]);
            });
        }

        // Login/Register buttons
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.openLoginModal());
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail')?.value || '';
                const password = document.getElementById('loginPassword')?.value || '';
                this.handleLogin(email, password);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName')?.value || '';
                const email = document.getElementById('registerEmail')?.value || '';
                const password = document.getElementById('registerPassword')?.value || '';
                const confirmPassword = document.getElementById('registerConfirmPassword')?.value || '';
                this.handleRegister(name, email, password, confirmPassword);
            });
        }

        // User menu
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => this.toggleUserMenu());
        }

        // Switch to register form
        const switchToRegister = document.getElementById('switchToRegister');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        // Switch to login form
        const switchToLogin = document.getElementById('switchToLogin');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }
        });

        // API configuration save
        const saveApiBtn = document.getElementById('save-api-config');
        if (saveApiBtn) {
            saveApiBtn.addEventListener('click', () => this.saveApiConfig());
        }

        // AI prompt save
        const savePromptBtn = document.getElementById('save-prompt');
        if (savePromptBtn) {
            savePromptBtn.addEventListener('click', () => this.savePrompt());
        }

        // Clear chat button
        const clearChatBtn = document.getElementById('clear-chat');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.clearChat());
        }

        // Edital analysis button
        const analyzeBtn = document.getElementById('analyze-edital-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analisarEdital());
        }
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentSection = sectionName;

        // Update stats when returning to dashboard
        if (sectionName === 'dashboard') {
            this.updateDashboardStats();
        }
    }

    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput?.value?.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        userInput.value = '';

        // Disable send button temporarily
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.innerHTML = '<div class="loading"></div>';
        }

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.addMessage(response, false);
        } catch (error) {
            this.addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Verifique as configurações da API.', false);
        } finally {
            // Re-enable send button
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }
        }
    }

    addMessage(text, isUser = false) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user' : 'assistant'}`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageElement.innerHTML = `${text}<div class="message-time">${time}</div>`;
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async getAIResponse(message) {
        const apiConfig = this.loadApiConfig();
        
        if (!apiConfig.openaiApiKey) {
            return this.getLocalResponse(message);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    prompt: this.loadAiPrompt(),
                    apiKey: apiConfig.openaiApiKey,
                    model: apiConfig.model || 'gpt-3.5-turbo'
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('API Error:', error);
            return this.getLocalResponse(message);
        }
    }

    getLocalResponse(message) {
        const responses = {
            "saudacao": "Olá! Sou o Harvey, seu assistente jurídico especializado em licitações públicas. Baseio minhas análises na Lei nº 14.133/2021, jurisprudência atualizada e doutrina de referência. Como posso ajudá-lo hoje?",
            "analise_edital": "Para análise de edital, preciso dos seguintes dados: 1) Número do processo; 2) Objeto da licitação; 3) Empresa participante; 4) Motivo da contestação. Com essas informações, posso realizar uma análise jurídica detalhada.",
            "elaborar_defesa": "Para elaborar uma defesa, preciso que você forneça: 1) Dados completos da empresa; 2) Número do processo/licitação; 3) Objeto; 4) Motivo da impugnação/recursos. Após coletar essas informações, poderei elaborar a peça jurídica com fundamentação técnica.",
            "lei_14133": "A Lei nº 14.133/2021 (Nova Lei de Licitações) trouxe significativas mudanças para o regime jurídico licitatório. Principais aspectos: 1) Modalidades de licitação; 2) Registro de preços; 3) Contratação direta; 4) Julgamento; 5) Recursos administrativos. Sobre qual aspecto específico você gostaria de saber mais?",
            "default": "Compreendo sua questão. Para fornecer uma resposta precisa e fundamentada, preciso de mais detalhes sobre o caso: 1) Número do processo; 2) Objeto da licitação; 3) Modalidade; 4) Ponto específico de contestação. Com essas informações, posso analisar com base na Lei 14.133/2021 e jurisprudência aplicável."
        };

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
            return responses.saudacao;
        } else if (lowerMessage.includes('analisar') || lowerMessage.includes('edital') || lowerMessage.includes('licitação')) {
            return responses.analise_edital;
        } else if (lowerMessage.includes('elaborar') || lowerMessage.includes('defesa') || lowerMessage.includes('recurso')) {
            return responses.elaborar_defesa;
        } else if (lowerMessage.includes('14.133') || lowerMessage.includes('lei nova') || lowerMessage.includes('licitações')) {
            return responses.lei_14133;
        } else {
            return responses.default;
        }
    }

    clearChat() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="message assistant">
                    Olá! Sou o Harvey, seu assistente jurídico especializado em licitações públicas (Lei 14.133/2021). Como posso ajudá-lo hoje?
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    createNewCase() {
        const formData = {
            numero: document.getElementById('processo-numero')?.value || '',
            objeto: document.getElementById('objeto-licitacao')?.value || '',
            modalidade: document.getElementById('modalidade')?.value || '',
            orgao: document.getElementById('orgao-publico')?.value || '',
            dataPublicacao: document.getElementById('data-publicacao')?.value || '',
            status: 'open',
            id: Date.now().toString()
        };

        // Validar dados obrigatórios
        if (!formData.numero || !formData.objeto) {
            this.showNotification('Por favor, preencha pelo menos o número do processo e objeto da licitação.', 'error');
            return;
        }

        this.cases.push(formData);
        this.saveCases();
        this.loadCasesGrid();
        this.closeModal('newCaseModal');
        this.updateDashboardStats();

        // Clear form
        const form = document.getElementById('newCaseForm');
        if (form) {
            form.reset();
        }

        // Show success message
        this.addMessage(`Novo caso criado: ${formData.numero} - ${formData.objeto}`, false);
        this.showNotification('Caso criado com sucesso!', 'success');
    }

    loadCasesGrid() {
        const casesGrid = document.getElementById('cases-grid');
        if (!casesGrid) return;

        casesGrid.innerHTML = '';

        this.cases.forEach(case_ => {
            const caseCard = document.createElement('div');
            caseCard.className = 'case-card';
            caseCard.onclick = () => this.openCaseDetails(case_.id);
            
            const statusClass = case_.status === 'open' ? 'status-open' : 
                               case_.status === 'analysis' ? 'status-analysis' : 'status-completed';
            
            const statusText = case_.status === 'open' ? 'Em Andamento' : 
                              case_.status === 'analysis' ? 'Em Análise' : 'Concluído';

            caseCard.innerHTML = `
                <div class="case-number">Processo: ${case_.numero}</div>
                <div class="case-object">${case_.objeto}</div>
                <div class="case-status ${statusClass}">${statusText}</div>
            `;
            
            casesGrid.appendChild(caseCard);
        });

        // Adicionar botões de ação após carregar os cards
        setTimeout(() => {
            this.updateCaseCards();
        }, 100);
    }

    openCaseDetails(caseId) {
        const case_ = this.cases.find(c => c.id === caseId);
        if (case_) {
            this.addMessage(`Abrindo detalhes do caso: ${case_.numero} - ${case_.objeto}`, false);
            
            // Salvar caso atual para uso em outras seções
            this.sharedData.currentCase = case_;
            this.saveSharedData();
        }
    }

    searchCases(query) {
        const casesGrid = document.getElementById('cases-grid');
        if (!casesGrid) return;

        const filteredCases = this.cases.filter(case_ => 
            case_.numero.toLowerCase().includes(query.toLowerCase()) ||
            case_.objeto.toLowerCase().includes(query.toLowerCase()) ||
            case_.orgao.toLowerCase().includes(query.toLowerCase())
        );

        casesGrid.innerHTML = '';
        filteredCases.forEach(case_ => {
            const caseCard = document.createElement('div');
            caseCard.className = 'case-card';
            caseCard.onclick = () => this.openCaseDetails(case_.id);
            
            const statusClass = case_.status === 'open' ? 'status-open' : 
                               case_.status === 'analysis' ? 'status-analysis' : 'status-completed';
            
            const statusText = case_.status === 'open' ? 'Em Andamento' : 
                              case_.status === 'analysis' ? 'Em Análise' : 'Concluído';

            caseCard.innerHTML = `
                <div class="case-number">Processo: ${case_.numero}</div>
                <div class="case-object">${case_.objeto}</div>
                <div class="case-status ${statusClass}">${statusText}</div>
            `;
            
            casesGrid.appendChild(caseCard);
        });

        // Atualizar cards com botões
        setTimeout(() => {
            this.updateCaseCards();
        }, 100);
    }

    handleEditalUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Here you would typically send the file to the backend for processing
            this.addMessage(`Arquivo ${file.name} carregado com sucesso. Iniciando análise...`, false);
            
            // Simulate analysis
            setTimeout(() => {
                const analysisResult = 'Análise do edital concluída. Principais pontos identificados: 1) Especificações técnicas compatíveis; 2) Documentação exigida conforme; 3) Prazos adequados. Deseja uma análise mais detalhada de algum aspecto específico?';
                this.addMessage(analysisResult, false);
                
                // Salvar resultado da análise se há um caso atual
                if (this.sharedData.currentCase) {
                    this.saveAnalysisResult(this.sharedData.currentCase.id, analysisResult, 'edital');
                }
            }, 2000);
        };
        reader.readAsDataURL(file);
    }

    analisarEdital() {
        const empresaDados = document.getElementById('empresa-dados')?.value || '';
        const editalFile = document.getElementById('edital-upload')?.files[0];

        if (!empresaDados && !editalFile) {
            this.showNotification('Por favor, forneça os dados da empresa ou faça upload do edital.', 'error');
            return;
        }

        const resultadoDiv = document.getElementById('analise-resultado');
        if (resultadoDiv) {
            resultadoDiv.innerHTML = '<div class="loading">⏳ Analisando edital...</div>';

            // Simulate analysis
            setTimeout(() => {
                const analysisContent = `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <h4>Resultado da Análise</h4>
                        <p><strong>Status:</strong> Análise concluída</p>
                        <p><strong>Compatibilidade:</strong> 85% compatível com os requisitos</p>
                        <p><strong>Pontos de atenção:</strong></p>
                        <ul>
                            <li>Verificar certificação ISO 9001</li>
                            <li>Confirmar prazo de entrega</li>
                            <li>Revisar garantia técnica</li>
                        </ul>
                        <button class="btn btn-primary" onclick="gerarRelatorio()">Gerar Relatório Completo</button>
                    </div>
                `;
                
                resultadoDiv.innerHTML = analysisContent;

                // Salvar resultado se há um caso atual
                if (this.sharedData.currentCase) {
                    this.saveAnalysisResult(this.sharedData.currentCase.id, analysisContent, 'edital');
                }

                this.showNotification('Análise concluída com sucesso!', 'success');
            }, 3000);
        }
    }

    savePrompt() {
        const prompt = document.getElementById('ai-prompt')?.value || '';
        localStorage.setItem('harvey_ai_prompt', prompt);
        this.showNotification('Prompt salvo com sucesso!', 'success');
    }

    saveApiConfig() {
        const config = {
            openaiApiKey: document.getElementById('openai-api-key')?.value || '',
            googleDocsApi: document.getElementById('google-docs-api')?.value || '',
            model: document.getElementById('model-selection')?.value || 'gpt-3.5-turbo'
        };
        
        localStorage.setItem('harvey_api_config', JSON.stringify(config));
        this.apiConfig = config;
        this.showNotification('Configurações salvas com sucesso!', 'success');
    }

    loadSavedConfigurations() {
        // Load AI prompt
        const savedPrompt = this.loadAiPrompt();
        const promptElement = document.getElementById('ai-prompt');
        if (savedPrompt && promptElement) {
            promptElement.value = savedPrompt;
        }

        // Load API config
        const savedConfig = this.loadApiConfig();
        if (savedConfig.openaiApiKey) {
            const apiKeyElement = document.getElementById('openai-api-key');
            if (apiKeyElement) {
                apiKeyElement.value = savedConfig.openaiApiKey;
            }
        }
        if (savedConfig.googleDocsApi) {
            const googleApiElement = document.getElementById('google-docs-api');
            if (googleApiElement) {
                googleApiElement.value = savedConfig.googleDocsApi;
            }
        }
        if (savedConfig.model) {
            const modelElement = document.getElementById('model-selection');
            if (modelElement) {
                modelElement.value = savedConfig.model;
            }
        }
    }

    // Local storage methods
    loadCases() {
        const saved = localStorage.getItem('harvey_cases');
        return saved ? JSON.parse(saved) : [
            {
                id: '1',
                numero: '14552/2023',
                objeto: 'Pregão Eletrônico - Aquisição de Computadores',
                modalidade: 'pregao',
                orgao: 'Prefeitura Municipal',
                dataPublicacao: '2023-10-01',
                status: 'open'
            },
            {
                id: '2',
                numero: '14876/2023',
                objeto: 'Contratação de Serviços de Limpeza',
                modalidade: 'pregao',
                orgao: 'Secretaria de Saúde',
                dataPublicacao: '2023-10-05',
                status: 'analysis'
            },
            {
                id: '3',
                numero: '14231/2023',
                objeto: 'Concorrência - Obra de Infraestrutura',
                modalidade: 'concorrencia',
                orgao: 'Departamento de Obras',
                dataPublicacao: '2023-09-15',
                status: 'completed'
            }
        ];
    }

    saveCases() {
        localStorage.setItem('harvey_cases', JSON.stringify(this.cases));
    }

    loadApiConfig() {
        const saved = localStorage.getItem('harvey_api_config');
        return saved ? JSON.parse(saved) : {};
    }

    loadAiPrompt() {
        const saved = localStorage.getItem('harvey_ai_prompt');
        const defaultPrompt = document.getElementById('ai-prompt')?.value || '';
        return saved || defaultPrompt || '';
    }
}

// Global functions for HTML onclick events
function clearChat() {
    if (window.harveySystem) {
        window.harveySystem.clearChat();
    }
}

function closeModal(modalId) {
    if (window.harveySystem) {
        window.harveySystem.closeModal(modalId);
    }
}

function analisarEdital() {
    if (window.harveySystem) {
        window.harveySystem.analisarEdital();
    }
}

function savePrompt() {
    if (window.harveySystem) {
        window.harveySystem.savePrompt();
    }
}

function saveApiConfig() {
    if (window.harveySystem) {
        window.harveySystem.saveApiConfig();
    }
}

function gerarRelatorio() {
    if (window.harveySystem) {
        window.harveySystem.showNotification('Funcionalidade de geração de relatório será implementada com a integração do Google Docs API.', 'info');
    } else {
        alert('Funcionalidade de geração de relatório será implementada com a integração do Google Docs API.');
    }
}

function showRegisterForm() {
    if (window.harveySystem) {
        window.harveySystem.showRegisterForm();
    }
}

function showLoginForm() {
    if (window.harveySystem) {
        window.harveySystem.showLoginForm();
    }
}

function logout() {
    if (window.harveySystem) {
        window.harveySystem.logout();
    }
}

function editProfile() {
    if (window.harveySystem) {
        window.harveySystem.editProfile();
    }
}

// Initialize system when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.harveySystem = new HarveySystem();
        console.log('Harvey System initialized successfully');
    } catch (error) {
        console.error('Error initializing Harvey System:', error);
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Error handling for the system
window.addEventListener('error', function(event) {
    console.error('Harvey System Error:', event.error);
});

// Prevent form submissions that might cause page reload
document.addEventListener('submit', function(event) {
    if (event.target.id === 'newCaseForm' || 
        event.target.id === 'loginForm' || 
        event.target.id === 'registerForm') {
        event.preventDefault();
    }
});
