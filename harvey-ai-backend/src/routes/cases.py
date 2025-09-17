from flask import Blueprint, request, jsonify
from src.models.case import Case
from src.models.user import db
from datetime import datetime
from sqlalchemy import or_

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('/cases', methods=['GET'])
def get_cases():
    """Listar todos os casos com filtros opcionais"""
    try:
        # Parâmetros de filtro
        status = request.args.get('status')
        priority = request.args.get('priority')
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Construir query
        query = Case.query
        
        if status:
            query = query.filter(Case.status == status)
        
        if priority:
            query = query.filter(Case.priority == priority)
        
        if search:
            query = query.filter(
                or_(
                    Case.title.contains(search),
                    Case.number.contains(search),
                    Case.organ.contains(search),
                    Case.description.contains(search)
                )
            )
        
        # Ordenar por data de criação (mais recentes primeiro)
        query = query.order_by(Case.created_at.desc())
        
        # Paginação
        paginated = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        cases = [case.to_dict() for case in paginated.items]
        
        return jsonify({
            'cases': cases,
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
        return jsonify({'error': f'Erro ao buscar casos: {str(e)}'}), 500

@cases_bp.route('/cases', methods=['POST'])
def create_case():
    """Criar um novo caso"""
    try:
        data = request.get_json()
        
        # Validações obrigatórias
        required_fields = ['number', 'title']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se o número já existe
        existing_case = Case.query.filter_by(number=data['number']).first()
        if existing_case:
            return jsonify({'error': 'Número do caso já existe'}), 400
        
        # Criar novo caso
        new_case = Case(
            number=data['number'],
            title=data['title'],
            description=data.get('description', ''),
            status=data.get('status', 'Em Andamento'),
            priority=data.get('priority', 'Média'),
            organ=data.get('organ', ''),
            modality=data.get('modality', ''),
            object_description=data.get('object_description', ''),
            estimated_value=data.get('estimated_value'),
            deadline=datetime.fromisoformat(data['deadline']) if data.get('deadline') else None,
            user_id=data.get('user_id', 1)  # Por enquanto, usuário padrão
        )
        
        db.session.add(new_case)
        db.session.commit()
        
        return jsonify({
            'message': 'Caso criado com sucesso',
            'case': new_case.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao criar caso: {str(e)}'}), 500

@cases_bp.route('/cases/<int:case_id>', methods=['GET'])
def get_case(case_id):
    """Obter um caso específico"""
    try:
        case = Case.query.get_or_404(case_id)
        return jsonify({'case': case.to_dict()})
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar caso: {str(e)}'}), 500

@cases_bp.route('/cases/<int:case_id>', methods=['PUT'])
def update_case(case_id):
    """Atualizar um caso"""
    try:
        case = Case.query.get_or_404(case_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        updatable_fields = [
            'title', 'description', 'status', 'priority', 'organ', 
            'modality', 'object_description', 'estimated_value'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(case, field, data[field])
        
        # Tratar deadline separadamente
        if 'deadline' in data and data['deadline']:
            case.deadline = datetime.fromisoformat(data['deadline'])
        
        case.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Caso atualizado com sucesso',
            'case': case.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao atualizar caso: {str(e)}'}), 500

@cases_bp.route('/cases/<int:case_id>', methods=['DELETE'])
def delete_case(case_id):
    """Deletar um caso"""
    try:
        case = Case.query.get_or_404(case_id)
        db.session.delete(case)
        db.session.commit()
        
        return jsonify({'message': 'Caso deletado com sucesso'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao deletar caso: {str(e)}'}), 500

@cases_bp.route('/cases/stats', methods=['GET'])
def get_cases_stats():
    """Obter estatísticas dos casos"""
    try:
        total_cases = Case.query.count()
        active_cases = Case.query.filter_by(status='Em Andamento').count()
        completed_cases = Case.query.filter_by(status='Concluído').count()
        analysis_cases = Case.query.filter_by(status='Em Análise').count()
        
        # Estatísticas por prioridade
        high_priority = Case.query.filter_by(priority='Alta').count()
        medium_priority = Case.query.filter_by(priority='Média').count()
        low_priority = Case.query.filter_by(priority='Baixa').count()
        
        # Casos recentes (últimos 30 dias)
        from datetime import timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_cases = Case.query.filter(Case.created_at >= thirty_days_ago).count()
        
        return jsonify({
            'total_cases': total_cases,
            'active_cases': active_cases,
            'completed_cases': completed_cases,
            'analysis_cases': analysis_cases,
            'high_priority': high_priority,
            'medium_priority': medium_priority,
            'low_priority': low_priority,
            'recent_cases': recent_cases,
            'success_rate': round((completed_cases / total_cases * 100) if total_cases > 0 else 0, 1)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro ao obter estatísticas: {str(e)}'}), 500

@cases_bp.route('/cases/search', methods=['GET'])
def search_cases():
    """Buscar casos por termo"""
    try:
        query_term = request.args.get('q', '')
        if not query_term:
            return jsonify({'error': 'Termo de busca é obrigatório'}), 400
        
        cases = Case.query.filter(
            or_(
                Case.title.contains(query_term),
                Case.number.contains(query_term),
                Case.organ.contains(query_term),
                Case.description.contains(query_term)
            )
        ).order_by(Case.created_at.desc()).limit(20).all()
        
        return jsonify({
            'cases': [case.to_dict() for case in cases],
            'count': len(cases)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erro na busca: {str(e)}'}), 500

@cases_bp.route('/cases/options', methods=['GET'])
def get_case_options():
    """Obter opções para formulários de casos"""
    return jsonify({
        'status_options': Case.get_status_options(),
        'priority_options': Case.get_priority_options(),
        'modality_options': [
            'Concorrência',
            'Tomada de Preços',
            'Convite',
            'Concurso',
            'Leilão',
            'Pregão',
            'Manifestação de Interesse',
            'Credenciamento',
            'Pré-qualificação',
            'Procedimento de Manifestação de Interesse'
        ]
    })

