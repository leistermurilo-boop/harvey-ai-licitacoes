from flask import Blueprint, request, jsonify
import openai
import os
from datetime import datetime
from src.models.case import Case
from src.models.document import Document
from src.models.user import db

analysis_bp = Blueprint('analysis', __name__)

ANALYSIS_PROMPT = """
Você é um especialista em análise de editais de licitação pública brasileira. 
Analise o edital fornecido e identifique:

1. **Vícios e Irregularidades:**
   - Cláusulas restritivas à competitividade
   - Exigências desproporcionais ou desnecessárias
   - Violações à Lei 14.133/2021
   - Critérios de julgamento inadequados

2. **Oportunidades de Impugnação:**
   - Pontos passíveis de questionamento
   - Fundamentação jurídica para recursos
   - Artigos da lei aplicáveis

3. **Estratégias Recomendadas:**
   - Abordagem para participação
   - Documentação necessária
   - Prazos importantes

4. **Riscos Identificados:**
   - Aspectos que podem prejudicar a participação
   - Cláusulas ambíguas ou problemáticas

Forneça uma análise detalhada, fundamentada na legislação brasileira.
"""

@analysis_bp.route('/analysis/edital', methods=['POST'])
def analyze_edital():
    """Analisar edital de licitação com IA"""
    try:
        data = request.get_json()
        
        # Validações
        required_fields = ['edital_content', 'company_data']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        edital_content = data['edital_content']
        company_data = data['company_data']
        case_id = data.get('case_id')
        
        # Verificar API key
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return jsonify({
                'error': 'API key não configurada',
                'fallback_analysis': generate_fallback_analysis(edital_content, company_data)
            }), 500
        
        # Preparar prompt personalizado
        analysis_prompt = f"""
{ANALYSIS_PROMPT}

**Dados da Empresa:**
{company_data}

**Conteúdo do Edital:**
{edital_content}
"""
        
        # Configurar cliente OpenAI
        client = openai.OpenAI(api_key=api_key)
        
        # Fazer análise com IA
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": ANALYSIS_PROMPT},
                {"role": "user", "content": f"Dados da empresa: {company_data}\n\nEdital: {edital_content}"}
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        analysis_result = response.choices[0].message.content
        
        # Salvar análise no banco se case_id foi fornecido
        if case_id:
            case = Case.query.get(case_id)
            if case:
                analysis_doc = Document(
                    title=f'Análise de Edital - {case.title}',
                    content=analysis_result,
                    document_type='analise',
                    status='Finalizado',
                    case_id=case_id,
                    user_id=1
                )
                
                db.session.add(analysis_doc)
                db.session.commit()
        
        return jsonify({
            'analysis': analysis_result,
            'timestamp': datetime.utcnow().isoformat(),
            'tokens_used': response.usage.total_tokens if response.usage else 0,
            'saved_to_case': case_id is not None
        })
        
    except openai.AuthenticationError:
        return jsonify({
            'error': 'Erro de autenticação com OpenAI',
            'fallback_analysis': generate_fallback_analysis(data.get('edital_content', ''), data.get('company_data', ''))
        }), 401
        
    except Exception as e:
        return jsonify({
            'error': f'Erro na análise: {str(e)}',
            'fallback_analysis': generate_fallback_analysis(data.get('edital_content', ''), data.get('company_data', ''))
        }), 500

def generate_fallback_analysis(edital_content, company_data):
    """Gerar análise básica quando a IA não está disponível"""
    return f"""
# Análise Básica do Edital

## Resumo
Esta é uma análise básica gerada automaticamente. Para uma análise completa com IA, configure a API key do OpenAI.

## Pontos de Atenção Gerais
1. **Verificar Habilitação Jurídica:**
   - Certidão de regularidade fiscal
   - Certidão trabalhista
   - Certidão municipal

2. **Qualificação Técnica:**
   - Atestados de capacidade técnica
   - Registro no órgão competente
   - Experiência mínima exigida

3. **Qualificação Econômico-Financeira:**
   - Balanço patrimonial
   - Certidão negativa de falência
   - Índices de liquidez

## Recomendações
- Revisar todos os anexos do edital
- Verificar prazos de entrega
- Analisar critérios de julgamento
- Confirmar local de entrega das propostas

## Próximos Passos
1. Configure a API key do OpenAI para análise detalhada
2. Revise manualmente o edital
3. Consulte especialista jurídico se necessário

**Dados da empresa considerados:** {company_data[:200]}...
**Conteúdo do edital:** {len(edital_content)} caracteres analisados.
"""

@analysis_bp.route('/analysis/recurso', methods=['POST'])
def generate_recurso():
    """Gerar minuta de recurso administrativo"""
    try:
        data = request.get_json()
        
        required_fields = ['motivo', 'fundamentacao', 'case_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        motivo = data['motivo']
        fundamentacao = data['fundamentacao']
        case_id = data['case_id']
        
        # Verificar se o caso existe
        case = Case.query.get(case_id)
        if not case:
            return jsonify({'error': 'Caso não encontrado'}), 404
        
        # Verificar API key
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            recurso_content = generate_fallback_recurso(motivo, fundamentacao, case)
        else:
            # Gerar recurso com IA
            recurso_prompt = f"""
Elabore um recurso administrativo formal para licitação pública brasileira com base nos seguintes dados:

**Caso:** {case.title}
**Número:** {case.number}
**Órgão:** {case.organ}
**Motivo do Recurso:** {motivo}
**Fundamentação:** {fundamentacao}

O recurso deve:
1. Seguir a estrutura formal exigida
2. Citar artigos relevantes da Lei 14.133/2021
3. Apresentar argumentação jurídica sólida
4. Incluir pedidos específicos
5. Respeitar linguagem jurídica apropriada

Estruture o documento com:
- Cabeçalho
- Identificação das partes
- Dos fatos
- Do direito
- Dos pedidos
- Fecho
"""
            
            client = openai.OpenAI(api_key=api_key)
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": recurso_prompt}],
                max_tokens=2000,
                temperature=0.3
            )
            
            recurso_content = response.choices[0].message.content
        
        # Salvar recurso como documento
        recurso_doc = Document(
            title=f'Recurso Administrativo - {case.title}',
            content=recurso_content,
            document_type='recurso',
            status='Rascunho',
            case_id=case_id,
            user_id=1
        )
        
        db.session.add(recurso_doc)
        db.session.commit()
        
        return jsonify({
            'message': 'Recurso gerado com sucesso',
            'recurso': recurso_doc.to_dict(),
            'content': recurso_content
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao gerar recurso: {str(e)}'}), 500

def generate_fallback_recurso(motivo, fundamentacao, case):
    """Gerar recurso básico quando a IA não está disponível"""
    return f"""
RECURSO ADMINISTRATIVO

Ao(À) {case.organ or '[ÓRGÃO RESPONSÁVEL]'}

PROCESSO: {case.number}
OBJETO: {case.title}

[NOME DA EMPRESA], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ], com sede na [ENDEREÇO], vem, respeitosamente, perante Vossa Senhoria, interpor o presente

RECURSO ADMINISTRATIVO

contra [ESPECIFICAR ATO RECORRIDO], com fundamento no art. 164 da Lei nº 14.133/2021, pelas razões de fato e de direito a seguir expostas:

I - DOS FATOS

{motivo}

II - DO DIREITO

{fundamentacao}

A Lei nº 14.133/2021, em seu artigo 164, assegura o direito de recurso aos interessados que se sintam prejudicados por atos da Administração no curso do procedimento licitatório.

III - DOS PEDIDOS

Diante do exposto, requer-se:

a) O recebimento e processamento do presente recurso;
b) A reconsideração da decisão recorrida;
c) [PEDIDOS ESPECÍFICOS CONFORME O CASO]

Termos em que pede deferimento.

[LOCAL], [DATA]

[NOME DO RESPONSÁVEL]
[CARGO]
[EMPRESA]
"""

@analysis_bp.route('/analysis/contrarrazao', methods=['POST'])
def generate_contrarrazao():
    """Gerar contrarrazões"""
    try:
        data = request.get_json()
        
        required_fields = ['recurso_adverso', 'argumentos_defesa', 'case_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        recurso_adverso = data['recurso_adverso']
        argumentos_defesa = data['argumentos_defesa']
        case_id = data['case_id']
        
        case = Case.query.get(case_id)
        if not case:
            return jsonify({'error': 'Caso não encontrado'}), 404
        
        # Gerar contrarrazões (versão simplificada)
        contrarrazao_content = f"""
CONTRARRAZÕES

Ao(À) {case.organ or '[ÓRGÃO RESPONSÁVEL]'}

PROCESSO: {case.number}
OBJETO: {case.title}

[NOME DA EMPRESA] vem, respeitosamente, apresentar CONTRARRAZÕES ao recurso interposto por [RECORRENTE], nos seguintes termos:

I - DO RECURSO ADVERSO

{recurso_adverso}

II - DAS CONTRARRAZÕES

{argumentos_defesa}

III - DO PEDIDO

Requer-se a manutenção da decisão recorrida, por estar em consonância com a legislação vigente e com os princípios que regem a Administração Pública.

[LOCAL], [DATA]

[NOME DO RESPONSÁVEL]
[CARGO]
[EMPRESA]
"""
        
        # Salvar contrarrazões como documento
        contrarrazao_doc = Document(
            title=f'Contrarrazões - {case.title}',
            content=contrarrazao_content,
            document_type='contrarrazao',
            status='Rascunho',
            case_id=case_id,
            user_id=1
        )
        
        db.session.add(contrarrazao_doc)
        db.session.commit()
        
        return jsonify({
            'message': 'Contrarrazões geradas com sucesso',
            'contrarrazao': contrarrazao_doc.to_dict(),
            'content': contrarrazao_content
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao gerar contrarrazões: {str(e)}'}), 500

