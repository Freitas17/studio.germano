import os
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

import config
from data import SERVICOS, get_servico
from db import (
    init_db,
    create_appointment,
    list_appointments,
    appointments_on,
    mark_notified,
)
from notifier import send_owner_notification
from availability import get_available_slots, is_slot_available

app = Flask(__name__, static_folder="static")
CORS(app, origins=config.CORS_ORIGINS)

init_db()


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/config")
def get_config():
    return jsonify({"whatsapp_number": config.WHATSAPP_NUMBER})


@app.get("/api/services")
def get_services():
    return jsonify(SERVICOS)


@app.post("/api/appointments")
def post_appointment():
    payload = request.get_json(silent=True) or {}

    nome = (payload.get("nome") or "").strip()
    data = (payload.get("data") or "").strip()
    hora = (payload.get("hora") or "").strip()
    observacao = (payload.get("observacao") or "").strip() or None
    servico_ids = payload.get("servicos") or []

    errors = []
    if len(nome) < 2:
        errors.append("Informe o seu nome.")
    if not data:
        errors.append("Informe a data desejada.")
    else:
        try:
            datetime.strptime(data, "%Y-%m-%d")
        except ValueError:
            errors.append("Data invalida (use AAAA-MM-DD).")
    if not hora:
        errors.append("Informe o horario desejado.")
    if not isinstance(servico_ids, list) or not servico_ids:
        errors.append("Selecione ao menos um servico.")

    servicos = []
    for servico_item in servico_ids:
        if isinstance(servico_item, dict):
            servico_id = servico_item.get("id")
        else:
            servico_id = servico_item
        servico = get_servico(servico_id)
        if servico is None:
            errors.append(f"Servico inexistente: {servico_id}")
            continue
        servicos.append(
            {
                "id": servico["id"],
                "nome": servico["nome"],
                "preco": servico["preco"],
                "duracao_min": servico["duracao_min"],
            }
        )

    if errors:
        return jsonify({"errors": errors}), 400

    occupied = appointments_on(data)
    if not is_slot_available(data, hora, servicos, occupied):
        available = [
            slot["hora"]
            for slot in get_available_slots(data, servicos, occupied)
            if slot["disponivel"]
        ]
        if available:
            errors.append("Horario indisponivel. Disponivel: " + ", ".join(available))
        else:
            errors.append("Nao ha horarios livres nessa data.")
        return jsonify({"errors": errors}), 400

    total = round(sum(s["preco"] for s in servicos), 2)
    duracao_min = sum(s["duracao_min"] for s in servicos)
    appointment_id = create_appointment(
        nome=nome,
        data=data,
        hora=hora,
        servicos=servicos,
        total=total,
        duracao_min=duracao_min,
        observacao=observacao,
    )

    if send_owner_notification(
        nome=nome,
        data=data,
        hora=hora,
        servicos=servicos,
        observacao=observacao,
        total=total,
    ):
        mark_notified(appointment_id)

    return (
        jsonify(
            {
                "id": appointment_id,
                "nome": nome,
                "data": data,
                "hora": hora,
                "servicos": servicos,
                "total": total,
                "observacao": observacao,
            }
        ),
        201,
    )


@app.get("/api/appointments")
def get_appointments():
    return jsonify(list_appointments())


@app.get("/api/availability")
def get_availability():
    target_date = (request.args.get("data") or "").strip()
    if not target_date:
        return jsonify({"errors": ["Informe a data desejada."]}), 400

    try:
        datetime.strptime(target_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"errors": ["Data invalida (use AAAA-MM-DD)."]}), 400

    try:
        duracao_min = max(0, int(request.args.get("duracao_min") or 0))
    except (TypeError, ValueError):
        duracao_min = 0
    if not duracao_min:
        duracao_min = config.SLOT_INTERVAL_MIN

    occupied = appointments_on(target_date)
    slots = get_available_slots(
        target_date, [{"duracao_min": duracao_min}], occupied
    )
    return jsonify({"data": target_date, "duracao_min": duracao_min, "slots": slots})


@app.get("/static/images/<path:filename>")
def images(filename):
    return send_from_directory("static/images", filename)


if __name__ == "__main__":
    app.run(
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", "5000")),
        debug=os.environ.get("FLASK_DEBUG", "1") == "1",
    )
