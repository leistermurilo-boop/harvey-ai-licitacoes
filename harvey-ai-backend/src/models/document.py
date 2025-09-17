from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    document_type = db.Column(db.String(50), nullable=False)  # recurso, contrarrazao, analise, relatorio
    file_path = db.Column(db.String(500))  # Caminho para arquivo físico
    google_docs_id = db.Column(db.String(100))  # ID do documento no Google Docs
    google_docs_url = db.Column(db.String(500))  # URL do documento no Google Docs
    status = db.Column(db.String(50), default='Rascunho')  # Rascunho, Em Revisão, Finalizado
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'document_type': self.document_type,
            'file_path': self.file_path,
            'google_docs_id': self.google_docs_id,
            'google_docs_url': self.google_docs_url,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'case_id': self.case_id,
            'user_id': self.user_id
        }
    
    @staticmethod
    def get_document_types():
        return ['recurso', 'contrarrazao', 'analise', 'relatorio', 'edital', 'proposta']
    
    @staticmethod
    def get_status_options():
        return ['Rascunho', 'Em Revisão', 'Finalizado', 'Enviado']
    
    def __repr__(self):
        return f'<Document {self.title} ({self.document_type})>'

