// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// --- Configuração da API do Google Gemini ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("ERRO: A variável de ambiente GEMINI_API_KEY não foi definida. Crie um arquivo .env");
  process.exit(1); // Encerra a aplicação se a chave não existir
}
const genAI = new GoogleGenerativeAI(apiKey);
// --- Fim da Configuração ---

// ROTA DA API para gerar o documento jurídico
app.post('/api/gerar-documento-ia', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "O prompt é obrigatório." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ textoGerado: text });
  } catch (error) {
    console.error("Erro na API da Gemini:", error);
    res.status(500).json({ message: "Ocorreu um erro ao se comunicar com a IA." });
  }
});

// Servir os arquivos estáticos (HTML, CSS, JS do frontend)
app.use(express.static(path.join(__dirname, '/')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
