// Harvey Licitações - Sistema Completo
class HarveySystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.cases = this.loadCases();
        this.apiConfig = this.loadApiConfig();
        this.aiPrompt = this.loadAiPrompt();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCasesGrid();
        this.loadSavedConfigurations();
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
        
        sendButton.addEventListener('click', () => this.sendMessage());
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // New case button
        document.getElementById('new-case-btn').addEventListener('click', () => {
            this.openModal('newCaseModal');
        });

        // New case form
        document.getElementById('newCaseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewCase();
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchCases(e.target.value);
        });

        // File upload for edital analysis
        document.getElementById('edital-upload').addEventListener('change', (e) => {
            this.handleEditalUpload(e.target.files[0]);
        });
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;
    }

    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        userInput.value = '';

        // Disable send button temporarily
        const sendButton = document.getElementById('send-button');
        sendButton.disabled = true;
        sendButton.innerHTML = '<div class="loading"></div>';

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.addMessage(response, false);
        } catch (error) {
            this.addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Verifique as configurações da API.', false);
        } finally {
            // Re-enable send button
            sendButton.disabled = false;
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }

    addMessage(text, isUser = false) {
        const chatMessages = document.getElementById('chat-messages');
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
        chatMessages.innerHTML = `
            <div class="message assistant">
                Olá! Sou o Harvey, seu assistente jurídico especializado em licitações públicas (Lei 14.133/2021). Como posso ajudá-lo hoje?
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    createNewCase() {
        const formData = {
            numero: document.getElementById('processo-numero').value,
            objeto: document.getElementById('objeto-licitacao').value,
            modalidade: document.getElementById('modalidade').value,
            orgao: document.getElementById('orgao-publico').value,
            dataPublicacao: document.getElementById('data-publicacao').value,
            status: 'open',
            id: Date.now().toString()
        };

        this.cases.push(formData);
        this.saveCases();
        this.loadCasesGrid();
        this.closeModal('newCaseModal');
        this.updateDashboardStats();

        // Clear form
        document.getElementById('newCaseForm').reset();

        // Show success message
        this.addMessage(`Novo caso criado: ${formData.numero} - ${formData.objeto}`, false);
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
    }

    openCaseDetails(caseId) {
        const case_ = this.cases.find(c => c.id === caseId);
        if (case_) {
            this.addMessage(`Abrindo detalhes do caso: ${case_.numero} - ${case_.objeto}`, false);
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
    }

    handleEditalUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Here you would typically send the file to the backend for processing
            this.addMessage(`Arquivo ${file.name} carregado com sucesso. Iniciando análise...`, false);
            
            // Simulate analysis
            setTimeout(() => {
                this.addMessage('Análise do edital concluída. Principais pontos identificados: 1) Especificações técnicas compatíveis; 2) Documentação exigida conforme; 3) Prazos adequados. Deseja uma análise mais detalhada de algum aspecto específico?', false);
            }, 2000);
        };
        reader.readAsDataURL(file);
    }

    analisarEdital() {
        const empresaDados = document.getElementById('empresa-dados').value;
        const editalFile = document.getElementById('edital-upload').files[0];

        if (!empresaDados || !editalFile) {
            alert('Por favor, forneça os dados da empresa e faça upload do edital.');
            return;
        }

        const resultadoDiv = document.getElementById('analise-resultado');
        resultadoDiv.innerHTML = '<div class="loading"></div> Analisando edital...';

        // Simulate analysis
        setTimeout(() => {
            resultadoDiv.innerHTML = `
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
        }, 3000);
    }

    savePrompt() {
        const prompt = document.getElementById('ai-prompt').value;
        localStorage.setItem('harvey_ai_prompt', prompt);
        alert('Prompt salvo com sucesso!');
    }

    saveApiConfig() {
        const config = {
            openaiApiKey: document.getElementById('openai-api-key').value,
            googleDocsApi: document.getElementById('google-docs-api').value,
            model: document.getElementById('model-selection').value
        };
        
        localStorage.setItem('harvey_api_config', JSON.stringify(config));
        this.apiConfig = config;
        alert('Configurações salvas com sucesso!');
    }

    loadSavedConfigurations() {
        // Load AI prompt
        const savedPrompt = this.loadAiPrompt();
        if (savedPrompt) {
            document.getElementById('ai-prompt').value = savedPrompt;
        }

        // Load API config
        const savedConfig = this.loadApiConfig();
        if (savedConfig.openaiApiKey) {
            document.getElementById('openai-api-key').value = savedConfig.openaiApiKey;
        }
        if (savedConfig.googleDocsApi) {
            document.getElementById('google-docs-api').value = savedConfig.googleDocsApi;
        }
        if (savedConfig.model) {
            document.getElementById('model-selection').value = savedConfig.model;
        }
    }

    updateDashboardStats() {
        const casosAtivos = this.cases.filter(c => c.status === 'open').length;
        const editaisAnalisados = this.cases.length;
        const defesasElaboradas = this.cases.filter(c => c.status === 'completed').length;

        document.getElementById('casos-ativos').textContent = casosAtivos;
        document.getElementById('editais-analisados').textContent = editaisAnalisados;
        document.getElementById('defesas-elaboradas').textContent = defesasElaboradas;
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
        return localStorage.getItem('harvey_ai_prompt') || document.getElementById('ai-prompt')?.value || '';
    }
}

// Global functions for HTML onclick events
function clearChat() {
    window.harveySystem.clearChat();
}

function closeModal(modalId) {
    window.harveySystem.closeModal(modalId);
}

function analisarEdital() {
    window.harveySystem.analisarEdital();
}

function savePrompt() {
    window.harveySystem.savePrompt();
}

function saveApiConfig() {
    window.harveySystem.saveApiConfig();
}

function gerarRelatorio() {
    alert('Funcionalidade de geração de relatório será implementada com a integração do Google Docs API.');
}

// Initialize system when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.harveySystem = new HarveySystem();
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

