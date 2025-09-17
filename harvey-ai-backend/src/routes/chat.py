from flask import Blueprint, request, jsonify
import openai
import os
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

# Configuração padrão do Harvey AI
DEFAULT_HARVEY_PROMPT = """
Você é Harvey, um assistente jurídico especializado em licitações públicas brasileiras, 
baseado na Lei nº 14.133/2021. Você auxilia advogados e empresas na elaboração de recursos, 
contrarrazões e análise de editais de licitação.

Suas especialidades incluem:
- Análise de editais de licitação
- Elaboração de recursos administrativos
- Redação de contrarrazões
- Interpretação da Lei 14.133/2021
- Orientações sobre procedimentos licitatórios
- Identificação de vícios em editais
- Sugestões de estratégias jurídicas

Sempre forneça respostas precisas, fundamentadas na legislação brasileira e com linguagem 
jurídica apropriada. Quando necessário, cite artigos específicos da lei.
"""

@chat_bp.route('/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message', '')
        model = data.get('model', 'gpt-3.5-turbo')
        custom_prompt = data.get('custom_prompt', DEFAULT_HARVEY_PROMPT)
        
        if not message:
            return jsonify({'error': 'Mensagem é obrigatória'}), 400
        
        # Verificar se a API key está configurada
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return jsonify({
                'error': 'API key não configurada',
                'fallback_response': 'Desculpe, não consigo processar sua solicitação no momento. Por favor, configure a API key do OpenAI.'
            }), 500
        
        # Configurar cliente OpenAI
        client = openai.OpenAI(api_key=api_key)
        
        # Preparar mensagens para a API
        messages = [
            {"role": "system", "content": custom_prompt},
            {"role": "user", "content": message}
        ]
        
        # Fazer chamada para a API
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'response': ai_response,
            'model_used': model,
            'timestamp': datetime.utcnow().isoformat(),
            'tokens_used': response.usage.total_tokens if response.usage else 0
        })
        
    except openai.AuthenticationError:
        return jsonify({
            'error': 'Erro de autenticação com OpenAI',
            'fallback_response': 'Verifique se sua API key está correta e ativa.'
        }), 401
        
    except openai.RateLimitError:
        return jsonify({
            'error': 'Limite de requisições excedido',
            'fallback_response': 'Muitas requisições. Tente novamente em alguns minutos.'
        }), 429
        
    except Exception as e:
        return jsonify({
            'error': f'Erro interno: {str(e)}',
            'fallback_response': 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        }), 500

@chat_bp.route('/chat/models', methods=['GET'])
def get_available_models():
    """Retorna lista de modelos disponíveis"""
    models = [
        {
            'id': 'gpt-4',
            'name': 'GPT-4',
            'description': 'Modelo mais avançado, melhor para análises complexas'
        },
        {
            'id': 'gpt-4-turbo',
            'name': 'GPT-4 Turbo',
            'description': 'Versão otimizada do GPT-4, mais rápida'
        },
        {
            'id': 'gpt-3.5-turbo',
            'name': 'GPT-3.5 Turbo',
            'description': 'Modelo rápido e eficiente para uso geral'
        }
    ]
    
    return jsonify({'models': models})

@chat_bp.route('/chat/validate-key', methods=['POST'])
def validate_api_key():
    """Valida a API key do OpenAI"""
    try:
        data = request.get_json()
        api_key = data.get('api_key', '')
        
        if not api_key:
            return jsonify({'valid': False, 'error': 'API key não fornecida'}), 400
        
        # Testar a API key fazendo uma requisição simples
        client = openai.OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Teste"}],
            max_tokens=5
        )
        
        return jsonify({'valid': True, 'message': 'API key válida'})
        
    except openai.AuthenticationError:
        return jsonify({'valid': False, 'error': 'API key inválida'}), 401
    except Exception as e:
        return jsonify({'valid': False, 'error': f'Erro ao validar: {str(e)}'}), 500

@chat_bp.route('/chat/prompt', methods=['GET', 'POST'])
def manage_prompt():
    """Gerenciar prompt personalizado do Harvey"""
    if request.method == 'GET':
        # Retornar prompt atual (por enquanto, sempre o padrão)
        return jsonify({'prompt': DEFAULT_HARVEY_PROMPT})
    
    elif request.method == 'POST':
        data = request.get_json()
        custom_prompt = data.get('prompt', '')
        
        if not custom_prompt:
            return jsonify({'error': 'Prompt não pode estar vazio'}), 400
        
        # Por enquanto, apenas validamos o prompt
        # Em uma implementação completa, salvaria no banco de dados
        return jsonify({
            'message': 'Prompt atualizado com sucesso',
            'prompt': custom_prompt
        })

