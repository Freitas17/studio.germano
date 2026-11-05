"""Calculo de horarios disponiveis para agendamento."""

from datetime import date, datetime, time, timedelta

import config


def _to_minutes(hhmm):
    hours, minutes = str(hhmm).split(":")
    return int(hours) * 60 + int(minutes)


def _to_hhmm(minutes):
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def total_duration(servicos):
    return sum(int(servico.get("duracao_min", 0) or 0) for servico in servicos)


def _is_business_day(day):
    weekday = day.weekday()
    return weekday in config.BUSINESS_DAYS and weekday in config.BUSINESS_HOURS


def _within_range(day, today):
    if day < today:
        return False
    return day <= today + timedelta(days=config.MAX_ADVANCE_DAYS)


def _busy_intervals(appointments):
    intervals = []
    for appointment in appointments:
        start = _to_minutes(appointment["hora"])
        duration = int(appointment.get("duracao_min", 0) or 0)
        if duration <= 0:
            duration = config.SLOT_INTERVAL_MIN
        intervals.append((start, start + duration))
    return intervals


def get_available_slots(target_date, servicos, appointments):
    """Retorna a lista de slots do dia com o campo "disponivel".

    target_date: string "AAAA-MM-DD"
    servicos: lista de dicts (precisa de "duracao_min")
    appointments: lista de dicts {"hora", "duracao_min"} do mesmo dia
    """
    slots = []

    try:
        day = date.fromisoformat(target_date)
    except (ValueError, TypeError):
        return slots

    today = datetime.now().date()
    if not _is_business_day(day) or not _within_range(day, today):
        return slots

    open_time, close_time = config.BUSINESS_HOURS[day.weekday()]
    open_minutes = _to_minutes(open_time)
    close_minutes = _to_minutes(close_time)
    step = config.SLOT_INTERVAL_MIN

    duration = total_duration(servicos) or step
    busy = _busy_intervals(appointments)

    lead_limit = None
    if day == today:
        lead_limit = datetime.now() + timedelta(hours=config.LEAD_TIME_HOURS)

    cursor = open_minutes
    while cursor + duration <= close_minutes:
        end = cursor + duration
        available = True

        for busy_start, busy_end in busy:
            if cursor < busy_end and end > busy_start:
                available = False
                break

        if available and lead_limit is not None:
            slot_dt = datetime.combine(day, time(cursor // 60, cursor % 60))
            if slot_dt < lead_limit:
                available = False

        slots.append({"hora": _to_hhmm(cursor), "disponivel": available})
        cursor += step

    return slots


def is_slot_available(target_date, hora, servicos, appointments):
    for slot in get_available_slots(target_date, servicos, appointments):
        if slot["hora"] == hora:
            return slot["disponivel"]
    return False
