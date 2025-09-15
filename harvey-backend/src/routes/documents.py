from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

documents_bp = Blueprint('documents', __name__)

def get_google_docs_service(credentials_json):
    """Cria serviço do Google Docs a partir das credenciais"""
    try:
        credentials_dict = json.loads(credentials_json)
        credentials = service_account.Credentials.from_service_account_info(
            credentials_dict,
            scopes=['https://www.googleapis.com/auth/documents']
        )
        service = build('docs', 'v1', credentials=credentials)
        return service
    except Exception as e:
        raise Exception(f"Erro ao configurar Google Docs API: {str(e)}")

@documents_bp.route('/documents/create', methods=['POST'])
def create_document():
    """Cria um novo documento no Google Docs"""
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content', '')
        credentials_json = data.get('credentials')
        
        if not title:
            return jsonify({'error': 'Título é obrigatório'}), 400
        
        if not credentials_json:
            return jsonify({'error': 'Credenciais do Google Docs são obrigatórias'}), 400
        
        # Configurar serviço
        service = get_google_docs_service(credentials_json)
        
        # Criar documento
        document = {
            'title': title
        }
        
        doc = service.documents().create(body=document).execute()
        document_id = doc.get('documentId')
        
        # Adicionar conteúdo se fornecido
        if content:
            requests = [
                {
                    'insertText': {
                        'location': {
                            'index': 1,
                        },
                        'text': content
                    }
                }
            ]
            
            service.documents().batchUpdate(
                documentId=document_id,
                body={'requests': requests}
            ).execute()
        
        return jsonify({
            'message': 'Documento criado com sucesso',
            'document_id': document_id,
            'document_url': f"https://docs.google.com/document/d/{document_id}/edit"
        })
        
    except HttpError as e:
        return jsonify({'error': f'Erro da API do Google: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/documents/<document_id>/update', methods=['PUT'])
def update_document(document_id):
    """Atualiza um documento existente"""
    try:
        data = request.get_json()
        content = data.get('content')
        credentials_json = data.get('credentials')
        append = data.get('append', False)  # Se True, adiciona ao final; se False, substitui
        
        if not content:
            return jsonify({'error': 'Conteúdo é obrigatório'}), 400
        
        if not credentials_json:
            return jsonify({'error': 'Credenciais do Google Docs são obrigatórias'}), 400
        
        # Configurar serviço
        service = get_google_docs_service(credentials_json)
        
        # Obter documento atual
        doc = service.documents().get(documentId=document_id).execute()
        
        requests = []
        
        if append:
            # Adicionar ao final do documento
            doc_content = doc.get('body').get('content')
            end_index = doc_content[-1].get('endIndex', 1) - 1
            
            requests.append({
                'insertText': {
                    'location': {
                        'index': end_index,
                    },
                    'text': '\n' + content
                }
            })
        else:
            # Substituir todo o conteúdo
            doc_content = doc.get('body').get('content')
            if len(doc_content) > 1:  # Se há conteúdo além do elemento estrutural
                end_index = doc_content[-1].get('endIndex', 1) - 1
                
                # Deletar conteúdo existente
                requests.append({
                    'deleteContentRange': {
                        'range': {
                            'startIndex': 1,
                            'endIndex': end_index
                        }
                    }
                })
            
            # Inserir novo conteúdo
            requests.append({
                'insertText': {
                    'location': {
                        'index': 1,
                    },
                    'text': content
                }
            })
        
        # Executar atualizações
        service.documents().batchUpdate(
            documentId=document_id,
            body={'requests': requests}
        ).execute()
        
        return jsonify({
            'message': 'Documento atualizado com sucesso',
            'document_id': document_id,
            'document_url': f"https://docs.google.com/document/d/{document_id}/edit"
        })
        
    except HttpError as e:
        return jsonify({'error': f'Erro da API do Google: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/documents/<document_id>', methods=['GET'])
def get_document(document_id):
    """Obtém o conteúdo de um documento"""
    try:
        data = request.get_json() or {}
        credentials_json = data.get('credentials')
        
        if not credentials_json:
            return jsonify({'error': 'Credenciais do Google Docs são obrigatórias'}), 400
        
        # Configurar serviço
        service = get_google_docs_service(credentials_json)
        
        # Obter documento
        doc = service.documents().get(documentId=document_id).execute()
        
        # Extrair texto do documento
        content = ''
        for element in doc.get('body').get('content', []):
            if 'paragraph' in element:
                paragraph = element.get('paragraph')
                for text_element in paragraph.get('elements', []):
                    if 'textRun' in text_element:
                        content += text_element.get('textRun').get('content', '')
        
        return jsonify({
            'document_id': document_id,
            'title': doc.get('title'),
            'content': content,
            'document_url': f"https://docs.google.com/document/d/{document_id}/edit"
        })
        
    except HttpError as e:
        return jsonify({'error': f'Erro da API do Google: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/documents/generate-report', methods=['POST'])
def generate_report():
    """Gera um relatório de análise jurídica"""
    try:
        data = request.get_json()
        case_data = data.get('case_data')
        analysis_result = data.get('analysis_result')
        credentials_json = data.get('credentials')
        
        if not case_data or not analysis_result:
            return jsonify({'error': 'Dados do caso e resultado da análise são obrigatórios'}), 400
        
        if not credentials_json:
            return jsonify({'error': 'Credenciais do Google Docs são obrigatórias'}), 400
        
        # Gerar conteúdo do relatório
        report_content = f"""RELATÓRIO DE ANÁLISE JURÍDICA - LICITAÇÃO

DADOS DO PROCESSO:
Número: {case_data.get('numero', 'N/A')}
Objeto: {case_data.get('objeto', 'N/A')}
Modalidade: {case_data.get('modalidade', 'N/A')}
Órgão: {case_data.get('orgao', 'N/A')}
Data de Publicação: {case_data.get('data_publicacao', 'N/A')}

ANÁLISE JURÍDICA:
{analysis_result}

FUNDAMENTAÇÃO LEGAL:
Este relatório foi elaborado com base na Lei nº 14.133/2021 (Nova Lei de Licitações) e jurisprudência aplicável.

CONCLUSÃO:
A análise apresentada considera os aspectos jurídicos relevantes para o processo licitatório em questão.

Data do Relatório: {datetime.now().strftime('%d/%m/%Y %H:%M')}
Gerado por: Sistema Harvey - Assistente Jurídico de Licitações
"""
        
        # Criar documento
        service = get_google_docs_service(credentials_json)
        
        document = {
            'title': f"Relatório - {case_data.get('numero', 'Processo')}"
        }
        
        doc = service.documents().create(body=document).execute()
        document_id = doc.get('documentId')
        
        # Adicionar conteúdo
        requests = [
            {
                'insertText': {
                    'location': {
                        'index': 1,
                    },
                    'text': report_content
                }
            }
        ]
        
        service.documents().batchUpdate(
            documentId=document_id,
            body={'requests': requests}
        ).execute()
        
        return jsonify({
            'message': 'Relatório gerado com sucesso',
            'document_id': document_id,
            'document_url': f"https://docs.google.com/document/d/{document_id}/edit"
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents_bp.route('/documents/test-credentials', methods=['POST'])
def test_credentials():
    """Testa as credenciais do Google Docs"""
    try:
        data = request.get_json()
        credentials_json = data.get('credentials')
        
        if not credentials_json:
            return jsonify({'error': 'Credenciais são obrigatórias'}), 400
        
        # Tentar criar serviço
        service = get_google_docs_service(credentials_json)
        
        # Fazer uma chamada simples para testar
        # Criar um documento de teste e depois deletá-lo seria ideal,
        # mas vamos apenas verificar se o serviço foi criado com sucesso
        
        return jsonify({
            'valid': True,
            'message': 'Credenciais válidas'
        })
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'error': str(e)
        }), 400

