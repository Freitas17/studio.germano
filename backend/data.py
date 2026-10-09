"""Catalogo fixo de servicos do estudio.

Para adicionar/editar servicos, basta alterar esta lista.
- "id" deve ser unico e estavel (usado nos agendamentos).
- "imagem" e o nome do arquivo dentro de backend/static/images/.
"""

SERVICOS = [
    {
        "id": "design-sobrancelha",
        "nome": "Design de Sobrancelha",
        "descricao": "Mapeamento e design personalizado para valorizar o seu olhar.",
        "preco": 40.0,
        "duracao": "40 min",
        "duracao_min": 40,
        "imagem": "design-sobrancelha.svg",
    },
    {
        "id": "design-brown",
        "nome": "Design com Henna",
        "descricao": "Design com aplicacao de henna para preencher falhas.",
        "preco": 55.0,
        "duracao": "50 min",
        "duracao_min": 50,
        "imagem": "design-henna.svg",
    },
    {
        "id": "laminacao-egipcio",
        "nome": "Laminação de Sobrancelhas",
        "descricao": "Alinha e fixa os fios, deixando as sobrancelhas volumosas.",
        "preco": 90.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "laminacao-sobrancelha.svg",
    },
    {
        "id": "volume-brasileiro",
        "nome": "Volume Brasileiro",
        "descricao": "Tecnica com fios em Y para maior densidade e efeito natural.",
        "preco": 150.0,
        "duracao": "2h",
        "duracao_min": 120,
        "imagem": "volume-brasileiro.svg",
    },
    {
        "id": "lash-lifting",
        "nome": "Lash Lifting",
        "descricao": "Curvatura duradoura dos cílios naturais, sem extensao.",
        "preco": 110.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "lash-lifting.svg",
    },
    {
        "id": "manutencao-cilios",
        "nome": "Manutenção de Cílios",
        "descricao": "Retoque para manter a extensao impecavel por mais tempo.",
        "preco": 80.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "manutencao-cilios.svg",
    },
]


def get_servico(servico_id):
    """Retorna o servico pelo id ou None."""
    return next((s for s in SERVICOS if s["id"] == servico_id), None)
