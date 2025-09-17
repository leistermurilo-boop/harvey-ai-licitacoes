from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Case(db.Model):
    __tablename__ = 'cases'
    
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='Em Andamento')  # Em Andamento, Em Análise, Concluído
    priority = db.Column(db.String(20), default='Média')  # Alta, Média, Baixa
    organ = db.Column(db.String(200))  # Órgão responsável
    modality = db.Column(db.String(100))  # Modalidade da licitação
    object_description = db.Column(db.Text)  # Objeto da licitação
    estimated_value = db.Column(db.Float)
    deadline = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relacionamentos
    documents = db.relationship('Document', backref='case', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'number': self.number,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'organ': self.organ,
            'modality': self.modality,
            'object_description': self.object_description,
            'estimated_value': self.estimated_value,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id,
            'documents_count': len(self.documents) if self.documents else 0
        }
    
    @staticmethod
    def get_status_options():
        return ['Em Andamento', 'Em Análise', 'Concluído', 'Suspenso', 'Cancelado']
    
    @staticmethod
    def get_priority_options():
        return ['Alta', 'Média', 'Baixa']
    
    def __repr__(self):
        return f'<Case {self.number}: {self.title}>'

