from flask import Blueprint, request, jsonify
from src.models.document import Document
from src.models.case import Case
from src.models.user import db
from datetime import datetime
import os
import json

documents_bp = Blueprint('documents', __name__)

@documents_bp.route('/documents', methods=['GET'])
def get_documents():
    """Listar documentos com filtros opcionais"""
    try:
        case_id = request.args.get('case_id')
        document_type = request.args.get('type')
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        query = Document.query
        
        if case_id:
            query = query.filter(Document.case_id == case_id)
        
        if document_type:
            query = query.filter(Document.document_type == document_type)
        
        if status:
            query = query.filter(Document.status == status)
        
        query = query.order_by(Document.created_at.desc())
        
        paginated = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        documents = [doc.to_dict() for doc in paginated.items]
        
        return jsonify({
            'documents': documents,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar documentos: {str(e)}'}), 500

@documents_bp.route('/documents', methods=['POST'])
def create_document():
    """Criar um novo documento"""
    try:
        data = request.get_json()
        
        # Validações obrigatórias
        required_fields = ['title', 'document_type', 'case_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se o caso existe
        case = Case.query.get(data['case_id'])
        if not case:
            return jsonify({'error': 'Caso não encontrado'}), 404
        
        # Criar novo documento
        new_document = Document(
            title=data['title'],
            content=data.get('content', ''),
            document_type=data['document_type'],
            status=data.get('status', 'Rascunho'),
            case_id=data['case_id'],
            user_id=data.get('user_id', 1)  # Por enquanto, usuário padrão
        )
        
        db.session.add(new_document)
        db.session.commit()
        
        return jsonify({
            'message': 'Documento criado com sucesso',
            'document': new_document.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao criar documento: {str(e)}'}), 500

@documents_bp.route('/documents/<int:document_id>', methods=['GET'])
def get_document(document_id):
    """Obter um documento específico"""
    try:
        document = Document.query.get_or_404(document_id)
        return jsonify({'document': document.to_dict()})
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar documento: {str(e)}'}), 500

@documents_bp.route('/documents/<int:document_id>', methods=['PUT'])
def update_document(document_id):
    """Atualizar um documento"""
    try:
        document = Document.query.get_or_404(document_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        updatable_fields = ['title', 'content', 'status']
        
        for field in updatable_fields:
            if field in data:
                setattr(document, field, data[field])
        
        document.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Documento atualizado com sucesso',
            'document': document.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao atualizar documento: {str(e)}'}), 500

@documents_bp.route('/documents/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    """Deletar um documento"""
    try:
        document = Document.query.get_or_404(document_id)
        db.session.delete(document)
        db.session.commit()
        
        return jsonify({'message': 'Documento deletado com sucesso'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao deletar documento: {str(e)}'}), 500

@documents_bp.route('/documents/google-docs/create', methods=['POST'])
def create_google_doc():
    """Criar documento no Google Docs"""
    try:
        data = request.get_json()
        
        # Validações
        required_fields = ['title', 'content']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Por enquanto, simular criação no Google Docs
        # Em uma implementação real, usaria a Google Docs API
        
        # Simular resposta da API do Google Docs
        mock_google_doc = {
            'documentId': f'mock_doc_{datetime.utcnow().timestamp()}',
            'title': data['title'],
            'documentUrl': f'https://docs.google.com/document/d/mock_doc_{datetime.utcnow().timestamp()}/edit'
        }
        
        # Se um document_id foi fornecido, atualizar o documento existente
        if data.get('document_id'):
            document = Document.query.get(data['document_id'])
            if document:
                document.google_docs_id = mock_google_doc['documentId']
                document.google_docs_url = mock_google_doc['documentUrl']
                document.updated_at = datetime.utcnow()
                db.session.commit()
        
        return jsonify({
            'message': 'Documento criado no Google Docs com sucesso',
            'google_doc': mock_google_doc
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro ao criar documento no Google Docs: {str(e)}'}), 500

@documents_bp.route('/documents/google-docs/test-credentials', methods=['POST'])
def test_google_credentials():
    """Testar credenciais do Google Docs"""
    try:
        data = request.get_json()
        credentials = data.get('credentials')
        
        if not credentials:
            return jsonify({'valid': False, 'error': 'Credenciais não fornecidas'}), 400
        
        # Por enquanto, simular validação das credenciais
        # Em uma implementação real, tentaria autenticar com a Google API
        
        try:
            # Tentar fazer parse do JSON das credenciais
            creds_json = json.loads(credentials)
            required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
            
            for field in required_fields:
                if field not in creds_json:
                    return jsonify({'valid': False, 'error': f'Campo {field} ausente nas credenciais'}), 400
            
            return jsonify({'valid': True, 'message': 'Credenciais válidas'})
            
        except json.JSONDecodeError:
            return jsonify({'valid': False, 'error': 'Formato JSON inválido'}), 400
        
    except Exception as e:
        return jsonify({'valid': False, 'error': f'Erro ao validar credenciais: {str(e)}'}), 500

@documents_bp.route('/documents/generate-report', methods=['POST'])
def generate_report():
    """Gerar relatório de documentos"""
    try:
        data = request.get_json()
        case_id = data.get('case_id')
        report_type = data.get('report_type', 'summary')
        
        if case_id:
            case = Case.query.get(case_id)
            if not case:
                return jsonify({'error': 'Caso não encontrado'}), 404
            
            documents = Document.query.filter_by(case_id=case_id).all()
            
            # Gerar conteúdo do relatório
            report_content = f"""
# Relatório do Caso: {case.title}

## Informações Gerais
- **Número:** {case.number}
- **Status:** {case.status}
- **Prioridade:** {case.priority}
- **Órgão:** {case.organ or 'Não informado'}
- **Modalidade:** {case.modality or 'Não informada'}

## Documentos Associados
Total de documentos: {len(documents)}

"""
            
            for doc in documents:
                report_content += f"""
### {doc.title}
- **Tipo:** {doc.document_type}
- **Status:** {doc.status}
- **Criado em:** {doc.created_at.strftime('%d/%m/%Y %H:%M')}
- **Atualizado em:** {doc.updated_at.strftime('%d/%m/%Y %H:%M')}

"""
            
            # Criar documento de relatório
            report_doc = Document(
                title=f'Relatório - {case.title}',
                content=report_content,
                document_type='relatorio',
                status='Finalizado',
                case_id=case_id,
                user_id=1
            )
            
            db.session.add(report_doc)
            db.session.commit()
            
            return jsonify({
                'message': 'Relatório gerado com sucesso',
                'report': report_doc.to_dict()
            })
        
        else:
            return jsonify({'error': 'case_id é obrigatório'}), 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao gerar relatório: {str(e)}'}), 500

@documents_bp.route('/documents/options', methods=['GET'])
def get_document_options():
    """Obter opções para formulários de documentos"""
    return jsonify({
        'document_types': Document.get_document_types(),
        'status_options': Document.get_status_options()
    })

