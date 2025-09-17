// js/main.js
import { LegalAIModule } from './legalAiModule.js';
import { UIManager } from './uiManager.js';

class HarveyApp {
    constructor() {
        this.init();
    }

    init() {
        console.log("Harvey Licitações App Inicializado.");
        this.setupEventListeners();

        // Inicializa os módulos
        LegalAIModule.init();
        
        // Futuramente, outros módulos seriam inicializados aqui.
        // Ex: CaseManager.init();
    }

    setupEventListeners() {
        // Lógica de Navegação Principal
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = item.getAttribute('data-section');
                if (sectionName) {
                    UIManager.switchSection(sectionName);
                }
            });
        });
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.harveyApp = new HarveyApp();
});
