"""Envio da notificacao de agendamento para o WhatsApp da dona.

O provedor e escolhido por config.NOTIFIER_PROVIDER. Em desenvolvimento use
"log" (padrao): a mensagem e registrada em arquivo/console sem precisar de
credenciais. Para envio real, configure as credenciais do provedor desejado.
"""

import json
import logging
import urllib.error
import urllib.request

import config
from messages import build_message

logger = logging.getLogger("geeh.notifier")


def _post_json(url, payload, headers=None, timeout=15):
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url, data=body, method="POST")
    request.add_header("Content-Type", "application/json")
    for key, value in (headers or {}).items():
        if value:
            request.add_header(key, value)

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode("utf-8", "replace")
    except urllib.error.URLError as error:
        raise RuntimeError(f"Falha de conexao: {error.reason}") from error


def _digits(number):
    return "".join(ch for ch in str(number or "") if ch.isdigit())


def _send_log(to, message, **kwargs):
    line = f"[NOTIFICACAO -> {to}]\n{message}\n" + "-" * 50 + "\n"
    logger.info("Notificacao (log) para %s:\n%s", to, message)
    with open(config.NOTIFICATIONS_LOG, "a", encoding="utf-8") as handle:
        handle.write(line)
    return True


def _send_zapi(to, message, **kwargs):
    if not (config.ZAPI_INSTANCE_ID and config.ZAPI_TOKEN):
        raise RuntimeError("Z-API nao configurada (ZAPI_INSTANCE_ID/ZAPI_TOKEN).")

    url = (
        f"https://api.z-api.io/instances/{config.ZAPI_INSTANCE_ID}"
        f"/token/{config.ZAPI_TOKEN}/send-text"
    )
    headers = {"Client-Token": config.ZAPI_CLIENT_TOKEN}
    status, body = _post_json(url, {"phone": _digits(to), "message": message}, headers)
    if status >= 400:
        raise RuntimeError(f"Z-API respondeu {status}: {body}")
    return True


def _send_evolution(to, message, **kwargs):
    if not (config.EVOLUTION_API_URL and config.EVOLUTION_API_KEY):
        raise RuntimeError(
            "Evolution API nao configurada (EVOLUTION_API_URL/EVOLUTION_API_KEY)."
        )

    url = (
        f"{config.EVOLUTION_API_URL.rstrip('/')}"
        f"/message/sendText/{config.EVOLUTION_INSTANCE}"
    )
    headers = {"apikey": config.EVOLUTION_API_KEY}
    status, body = _post_json(url, {"number": _digits(to), "text": message}, headers)
    if status >= 400:
        raise RuntimeError(f"Evolution API respondeu {status}: {body}")
    return True


def _send_meta(to, message, **kwargs):
    raise RuntimeError(
        "Provedor 'meta' ainda nao implementado. A WhatsApp Cloud API exige "
        "template aprovado para mensagens iniciadas pela empresa."
    )


def _send_twilio(to, message, **kwargs):
    raise RuntimeError(
        "Provedor 'twilio' ainda nao implementado. Twilio exige template "
        "aprovado para mensagens iniciadas pela empresa."
    )


_PROVIDERS = {
    "log": _send_log,
    "zapi": _send_zapi,
    "evolution": _send_evolution,
    "meta": _send_meta,
    "twilio": _send_twilio,
}


def send_owner_notification(nome, data, hora, servicos, observacao=None, total=None):
    """Envia a mensagem ao dono. Retorna True se enviado com sucesso."""
    provider = (config.NOTIFIER_PROVIDER or "log").lower()
    handler = _PROVIDERS.get(provider)

    if handler is None:
        logger.warning("Provedor de notificacao desconhecido: %s", provider)
        return False

    message = build_message(
        nome=nome,
        data=data,
        hora=hora,
        servicos=servicos,
        observacao=observacao,
        total=total,
    )

    try:
        return bool(handler(config.WHATSAPP_NUMBER, message, servicos=servicos))
    except Exception as error:  # noqa: BLE001 - nao queremos derrubar o agendamento
        logger.error("Falha ao notificar via %s: %s", provider, error)
        return False
