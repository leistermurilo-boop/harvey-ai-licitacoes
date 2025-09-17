// js/apiService.js

export const APIService = {
    /**
     * Envia um prompt para o backend e retorna a resposta da IA.
     * @param {string} endpoint - O endpoint da API no backend (ex: '/api/gerar-documento-ia').
     * @param {object} body - O corpo da requisição a ser enviado.
     * @returns {Promise<object>} - A resposta da API em formato JSON.
     */
    async post(endpoint, body) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `Erro na API: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error(`Erro ao chamar a API em ${endpoint}:`, error);
            throw error; // Re-lança o erro para que o módulo que chamou possa tratá-lo
        }
    }
};
