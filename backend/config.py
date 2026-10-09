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
# [1,2,3,4,5] = Terca a Sabado.
# ---------------------------------------------------------------------------
BUSINESS_DAYS = [
    int(day) for day in os.environ.get("BUSINESS_DAYS", "1,2,3,4,5").split(",")
]
OPEN_TIME = os.environ.get("OPEN_TIME", "09:00")
CLOSE_TIME = os.environ.get("CLOSE_TIME", "19:00")
LUNCH_START = os.environ.get("LUNCH_START", "12:00")
LUNCH_END = os.environ.get("LUNCH_END", "13:00")
SLOT_INTERVAL_MIN = int(os.environ.get("SLOT_INTERVAL_MIN", "60"))
LEAD_TIME_HOURS = int(os.environ.get("LEAD_TIME_HOURS", "2"))
MAX_ADVANCE_DAYS = int(os.environ.get("MAX_ADVANCE_DAYS", "60"))
