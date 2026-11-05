import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Numero de WhatsApp da dona no formato internacional (DDI + DDD + numero).
# Ex.: 5511999999999
WHATSAPP_NUMBER = os.environ.get("WHATSAPP_NUMBER", "5511937347334")

DATABASE_PATH = os.environ.get(
    "DATABASE_PATH", os.path.join(BASE_DIR, "appointments.db")
)

CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

# ---------------------------------------------------------------------------
# Notificacao (envio da mensagem para o WhatsApp da dona)
# Provedores suportados: "log" (somente registra), "zapi", "evolution",
# "meta", "twilio".
# ---------------------------------------------------------------------------
NOTIFIER_PROVIDER = os.environ.get("NOTIFIER_PROVIDER", "log")
NOTIFICATIONS_LOG = os.environ.get(
    "NOTIFICATIONS_LOG", os.path.join(BASE_DIR, "notifications.log")
)

# Z-API (https://www.z-api.io)
ZAPI_INSTANCE_ID = os.environ.get("ZAPI_INSTANCE_ID", "")
ZAPI_TOKEN = os.environ.get("ZAPI_TOKEN", "")
ZAPI_CLIENT_TOKEN = os.environ.get("ZAPI_CLIENT_TOKEN", "")

# Evolution API (https://github.com/EvolutionAPI/evolution-api)
EVOLUTION_API_URL = os.environ.get("EVOLUTION_API_URL", "")
EVOLUTION_API_KEY = os.environ.get("EVOLUTION_API_KEY", "")
EVOLUTION_INSTANCE = os.environ.get("EVOLUTION_INSTANCE", "")

# Meta WhatsApp Cloud API
META_PHONE_NUMBER_ID = os.environ.get("META_PHONE_NUMBER_ID", "")
META_TOKEN = os.environ.get("META_TOKEN", "")

# Twilio
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_FROM = os.environ.get("TWILIO_WHATSAPP_FROM", "")

# ---------------------------------------------------------------------------
# Regras de agenda
# BUSINESS_DAYS usa o padrao do Python (Segunda=0 ... Domingo=6).
# [0,1,2,3,4,5] = Segunda a Sabado.
# ---------------------------------------------------------------------------
BUSINESS_DAYS = [
    int(day) for day in os.environ.get("BUSINESS_DAYS", "0,1,2,3,4,5").split(",")
]

# Horario de funcionamento por dia da semana (Segunda=0 ... Domingo=6).
BUSINESS_HOURS = {
    0: ("08:00", "19:00"),  # Segunda
    1: ("08:00", "15:00"),  # Terca
    2: ("08:00", "15:00"),  # Quarta
    3: ("08:00", "15:00"),  # Quinta
    4: ("08:00", "19:00"),  # Sexta
    5: ("08:00", "19:00"),  # Sabado
}

SLOT_INTERVAL_MIN = int(os.environ.get("SLOT_INTERVAL_MIN", "60"))
LEAD_TIME_HOURS = int(os.environ.get("LEAD_TIME_HOURS", "2"))
MAX_ADVANCE_DAYS = int(os.environ.get("MAX_ADVANCE_DAYS", "60"))
