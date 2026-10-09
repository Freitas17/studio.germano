"""Montagem das mensagens de agendamento."""

from datetime import datetime
from urllib.parse import quote


def format_brl(value):
    return f"R$ {float(value):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def format_date(iso):
    try:
        return datetime.strptime(iso, "%Y-%m-%d").strftime("%d/%m/%Y")
    except (ValueError, TypeError):
        return iso or ""


def build_message(nome, data, hora, servicos, observacao=None, total=None):
    lines = ["Olá! Gostaria de agendar:"]
    for servico in servicos:
        lines.append(f"• {servico['nome']} ({format_brl(servico['preco'])})")
    lines.append("")
    lines.append(f"Nome: {nome}")
    lines.append(f"Data: {format_date(data)} às {hora}")
    if observacao:
        lines.append(f"Observação: {observacao}")
    if total is not None:
        lines.append(f"Total: {format_brl(total)}")
    return "\n".join(lines)


def build_whatsapp_url(number, message):
    digits = "".join(ch for ch in str(number or "") if ch.isdigit())
    return f"https://wa.me/{digits}?text={quote(message)}"
