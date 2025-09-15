from flask import Blueprint, request, jsonify
import openai
import os

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message')
        prompt = data.get('prompt', '')
        api_key = data.get('apiKey')
        model = data.get('model', 'gpt-3.5-turbo')
        
        if not message:
            return jsonify({'error': 'Mensagem é obrigatória'}), 400
        
        if not api_key:
            return jsonify({'error': 'Chave da API é obrigatória'}), 400
        
        # Configure OpenAI
        openai.api_key = api_key
        
        # Prepare messages
        messages = []
        if prompt:
            messages.append({"role": "system", "content": prompt})
        messages.append({"role": "user", "content": message})
        
        # Make API call
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'response': ai_response,
            'status': 'success'
        })
        
    except openai.error.AuthenticationError:
        return jsonify({'error': 'Chave da API inválida'}), 401
    except openai.error.RateLimitError:
        return jsonify({'error': 'Limite de taxa excedido'}), 429
    except openai.error.APIError as e:
        return jsonify({'error': f'Erro da API: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@chat_bp.route('/chat/models', methods=['GET'])
def get_available_models():
    """Retorna lista de modelos disponíveis"""
    models = [
        {'id': 'gpt-4', 'name': 'GPT-4', 'description': 'Modelo mais avançado'},
        {'id': 'gpt-3.5-turbo', 'name': 'GPT-3.5 Turbo', 'description': 'Rápido e eficiente'},
        {'id': 'gpt-3.5-turbo-16k', 'name': 'GPT-3.5 Turbo 16K', 'description': 'Contexto estendido'}
    ]
    return jsonify({'models': models})

@chat_bp.route('/chat/validate-key', methods=['POST'])
def validate_api_key():
    """Valida a chave da API OpenAI"""
    try:
        data = request.get_json()
        api_key = data.get('apiKey')
        
        if not api_key:
            return jsonify({'valid': False, 'error': 'Chave da API é obrigatória'}), 400
        
        # Test the API key with a simple request
        openai.api_key = api_key
        openai.Model.list()
        
        return jsonify({'valid': True})
        
    except openai.error.AuthenticationError:
        return jsonify({'valid': False, 'error': 'Chave da API inválida'}), 401
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 500

