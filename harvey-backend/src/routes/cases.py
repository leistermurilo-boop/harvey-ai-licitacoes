from flask import Blueprint, request, jsonify
from src.models.user import db
from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

cases_bp = Blueprint('cases', __name__)

# Case model
class Case(db.Model):
    __tablename__ = 'cases'
    
    id = Column(Integer, primary_key=True)
    numero = Column(String(100), nullable=False)
    objeto = Column(Text, nullable=False)
    modalidade = Column(String(50), nullable=False)
    orgao = Column(String(200), nullable=False)
    data_publicacao = Column(DateTime, nullable=False)
    status = Column(String(20), default='open')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'numero': self.numero,
            'objeto': self.objeto,
            'modalidade': self.modalidade,
            'orgao': self.orgao,
            'data_publicacao': self.data_publicacao.isoformat() if self.data_publicacao else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

@cases_bp.route('/cases', methods=['GET'])
def get_cases():
    """Retorna todos os casos"""
    try:
        cases = Case.query.order_by(Case.created_at.desc()).all()
        return jsonify({
            'cases': [case.to_dict() for case in cases],
            'total': len(cases)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cases_bp.route('/cases', methods=['POST'])
def create_case():
    """Cria um novo caso"""
    try:
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        required_fields = ['numero', 'objeto', 'modalidade', 'orgao', 'data_publicacao']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Parse da data
        try:
            data_publicacao = datetime.fromisoformat(data['data_publicacao'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido'}), 400
        
        # Criar novo caso
        new_case = Case(
            numero=data['numero'],
            objeto=data['objeto'],
            modalidade=data['modalidade'],
            orgao=data['orgao'],
            data_publicacao=data_publicacao,
            status=data.get('status', 'open')
        )
        
        db.session.add(new_case)
        db.session.commit()
        
        return jsonify({
            'message': 'Caso criado com sucesso',
            'case': new_case.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cases_bp.route('/cases/<int:case_id>', methods=['GET'])
def get_case(case_id):
    """Retorna um caso específico"""
    try:
        case = Case.query.get_or_404(case_id)
        return jsonify({'case': case.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cases_bp.route('/cases/<int:case_id>', methods=['PUT'])
def update_case(case_id):
    """Atualiza um caso"""
    try:
        case = Case.query.get_or_404(case_id)
        data = request.get_json()
        
        # Atualizar campos
        if 'numero' in data:
            case.numero = data['numero']
        if 'objeto' in data:
            case.objeto = data['objeto']
        if 'modalidade' in data:
            case.modalidade = data['modalidade']
        if 'orgao' in data:
            case.orgao = data['orgao']
        if 'status' in data:
            case.status = data['status']
        if 'data_publicacao' in data:
            try:
                case.data_publicacao = datetime.fromisoformat(data['data_publicacao'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Formato de data inválido'}), 400
        
        case.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Caso atualizado com sucesso',
            'case': case.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cases_bp.route('/cases/<int:case_id>', methods=['DELETE'])
def delete_case(case_id):
    """Deleta um caso"""
    try:
        case = Case.query.get_or_404(case_id)
        db.session.delete(case)
        db.session.commit()
        
        return jsonify({'message': 'Caso deletado com sucesso'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cases_bp.route('/cases/search', methods=['GET'])
def search_cases():
    """Busca casos por termo"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'cases': [], 'total': 0})
        
        cases = Case.query.filter(
            db.or_(
                Case.numero.contains(query),
                Case.objeto.contains(query),
                Case.orgao.contains(query)
            )
        ).order_by(Case.created_at.desc()).all()
        
        return jsonify({
            'cases': [case.to_dict() for case in cases],
            'total': len(cases),
            'query': query
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cases_bp.route('/cases/stats', methods=['GET'])
def get_cases_stats():
    """Retorna estatísticas dos casos"""
    try:
        total_cases = Case.query.count()
        open_cases = Case.query.filter_by(status='open').count()
        analysis_cases = Case.query.filter_by(status='analysis').count()
        completed_cases = Case.query.filter_by(status='completed').count()
        
        return jsonify({
            'total': total_cases,
            'open': open_cases,
            'analysis': analysis_cases,
            'completed': completed_cases
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

