import json
import sqlite3
from datetime import datetime, timezone

from config import DATABASE_PATH


def get_conn():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _ensure_columns(conn):
    columns = {
        row["name"] for row in conn.execute("PRAGMA table_info(appointments)")
    }
    if "duracao_min" not in columns:
        conn.execute(
            "ALTER TABLE appointments ADD COLUMN duracao_min INTEGER NOT NULL DEFAULT 0"
        )
    if "notificado" not in columns:
        conn.execute(
            "ALTER TABLE appointments ADD COLUMN notificado INTEGER NOT NULL DEFAULT 0"
        )


def init_db():
    conn = get_conn()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                data TEXT NOT NULL,
                hora TEXT NOT NULL,
                duracao_min INTEGER NOT NULL DEFAULT 0,
                servicos_json TEXT NOT NULL,
                total REAL NOT NULL,
                observacao TEXT,
                notificado INTEGER NOT NULL DEFAULT 0,
                criado_em TEXT NOT NULL
            )
            """
        )
        _ensure_columns(conn)
        conn.commit()
    finally:
        conn.close()


def create_appointment(
    nome, data, hora, servicos, total, duracao_min, observacao=None
):
    conn = get_conn()
    try:
        cursor = conn.execute(
            """
            INSERT INTO appointments
                (nome, data, hora, duracao_min, servicos_json, total,
                 observacao, notificado, criado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
            """,
            (
                nome,
                data,
                hora,
                duracao_min,
                json.dumps(servicos, ensure_ascii=False),
                total,
                observacao,
                datetime.now(timezone.utc).isoformat(timespec="seconds"),
            ),
        )
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


def mark_notified(appointment_id, notified=True):
    conn = get_conn()
    try:
        conn.execute(
            "UPDATE appointments SET notificado = ? WHERE id = ?",
            (1 if notified else 0, appointment_id),
        )
        conn.commit()
    finally:
        conn.close()


def appointments_on(data):
    conn = get_conn()
    try:
        rows = conn.execute(
            "SELECT hora, duracao_min FROM appointments WHERE data = ?",
            (data,),
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def list_appointments():
    conn = get_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM appointments ORDER BY id DESC"
        ).fetchall()
        result = []
        for row in rows:
            item = dict(row)
            item["servicos"] = json.loads(item.pop("servicos_json"))
            item["notificado"] = bool(item.get("notificado"))
            result.append(item)
        return result
    finally:
        conn.close()
