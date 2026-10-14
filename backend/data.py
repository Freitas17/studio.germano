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
        "preco": 30.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "/design.webp",
    },
    {
        "id": "design-henna",
        "nome": "Design com Henna",
        "descricao": "Design com aplicacao de henna para preencher falhas.",
        "preco": 55.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "/design-henna.webp",
    },
    {
        "id": "volume-egipcio",
        "nome": "Volume Egipcio",
        "descricao": "Tecnica com fios em leque para maior volume e efeito dramatico.",
        "preco": 120.0,
        "duracao": "3h 15min",
        "duracao_min": 195,
        "imagem": "/volume-egipcio.webp",
    },
    {
        "id": "brasileiro-marrom",
        "nome": "Volume Brasileiro Marrom",
        "descricao": "TTecnica de extensão de cílios que utiliza fios sintéticos em formato de \"Y\" (ou YY) na tonalidade marrom em vez do preto tradicional",
        "preco": 120.0,
        "duracao": "3h 15min",
        "duracao_min": 195,
        "imagem": "/volume-brasileiro.webp",
    },
    {
        "id": "lash-lifting",
        "nome": "Lash Lifting",
        "descricao": "Curvatura duradoura dos cílios naturais, sem extensao.",
        "preco": 110.0,
        "duracao": "3h 15min",
        "duracao_min": 195,
        "imagem": "/lash-lifting.webp",
    },
    {
        "id": "hidragloss",
        "nome": "Hidragloss sem microagulhamento",
        "descricao": "Tratamento hidratante para cílios e sobrancelhas.",
        "preco": 50.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "/hidragloss.webp",
    },
    {
        "id": "manutencao-volume-brasileiro",
        "nome": "Manutenção de Cílios",
        "descricao": "Retoque para manter a extensao impecavel por mais tempo.",
        "preco": 80.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "",
    },
    {
        "id": "manutencao-egipcio",
        "nome": "Manutenção de Cílios",
        "descricao": "Retoque para manter a extensao impecavel por mais tempo.",
        "preco": 85.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "",
    },
    {
        "id": "manutencao-fox",
        "nome": "Manutenção de Cílios",
        "descricao": "Retoque para manter a extensao impecavel por mais tempo.",
        "preco": 100.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "manutencao-cilios.svg",
    },
    {
        "id": "manutencao-brasileiro-marrom",
        "nome": "Manutenção de Cílios",
        "descricao": "Retoque para manter a extensao impecavel por mais tempo.",
        "preco": 90.0,
        "duracao": "1h",
        "duracao_min": 60,
        "imagem": "manutencao-cilios.svg",
    },
]


def get_servico(servico_id):
    """Retorna o servico pelo id ou None."""
    return next((s for s in SERVICOS if s["id"] == servico_id), None)
