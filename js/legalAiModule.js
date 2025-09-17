// js/legalAiModule.js
import { APIService } from './apiService.js';
import { UIManager } from './uiManager.js';

export const LegalAIModule = {
    init() {
        const btnGerar = document.getElementById('btnGerarEsboco');
        const btnCopiar = document.getElementById('btnCopiarTexto');

        if (btnGerar) {
            btnGerar.addEventListener('click', () => this.gerarEsboco());
        }
        if (btnCopiar) {
            btnCopiar.addEventListener('click', () => this.copiarTexto());
        }
        console.log("Módulo de IA Jurídica inicializado.");
    },

    async gerarEsboco() {
        const tipoPeca = document.querySelector('input[name="tipoPeca"]:checked').value;
        const fatos = document.getElementById('fatosDecisao').value.trim();
        const pontos = document.getElementById('pontosArgumentar').value.trim();

        if (!fatos || !pontos) {
            alert("Por favor, preencha todos os campos para gerar o esboço.");
            return;
        }

        UIManager.setLoadingState('btnGerarEsboco', true, 'Gerando...');
        UIManager.updateResultadoIA('<span class="placeholder-text">Processando sua solicitação...</span>');

        const prompt = this.buildPrompt(tipoPeca, fatos, pontos);

        try {
            const data = await APIService.post('/api/gerar-documento-ia', { prompt });
            UIManager.updateResultadoIA(data.textoGerado);
        } catch (error) {
            UIManager.updateResultadoIA(`<span class="placeholder-text" style="color: red;">Ocorreu um erro: ${error.message}</span>`);
        } finally {
            UIManager.setLoadingState('btnGerarEsboco', false);
        }
    },

    buildPrompt(tipoPeca, fatos, pontos) {
        return `
            Aja como um advogado especialista em direito público brasileiro, com foco em licitações e contratos administrativos (Lei 14.133/2021).
            Sua tarefa é elaborar um esboço inicial e bem fundamentado para uma peça processual do tipo "${tipoPeca}".

            **Contexto do Caso (Fatos e Decisão):**
            ${fatos}

            **Pontos Principais a serem Argumentados:**
            ${pontos}

            **Instruções de Estrutura:**
            1.  **Endereçamento:** Sugira um endereçamento apropriado.
            2.  **Síntese dos Fatos:** Resuma o contexto de forma clara e objetiva.
            3.  **Do Direito (Fundamentação Jurídica):** Desenvolva cada um dos "Pontos Principais a serem Argumentados", citando, se possível, artigos da Lei nº 14.133/2021, princípios do direito administrativo e jurisprudência pertinente de tribunais superiores (STJ, STF, TCU).
            4.  **Dos Pedidos:** Elabore os pedidos de forma consequente com a argumentação.

            **Estilo e Tom:**
            - Utilize uma linguagem formal, técnica e persuasiva.
            - Organize o texto de forma clara, com parágrafos bem definidos.
            - Não inclua nomes de advogados, OAB, ou informações de contato. Apenas a estrutura da peça.
        `;
    },

    copiarTexto() {
        const resultadoDiv = document.getElementById('resultadoIA');
        const texto = resultadoDiv.textContent;
        UIManager.copiarTexto('btnCopiarTexto', texto);
    }
};
