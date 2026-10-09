# Geeh Estética — Single Page

Single page de estúdio de sobrancelhas e cílios. A cliente seleciona um ou
mais serviços, informa nome/data/horário e o pedido é salvo no Flask e enviado
via WhatsApp para a dona.

- **Front-end:** React + Vite (JS)
- **Back-end:** Flask + SQLite
- **Estilo:** minimalista/clean com tons de rosa

## Estrutura

```
Sitegeeh/
├── backend/   # API Flask (serviços fixos + agendamentos)
└── frontend/  # SPA React
```

## Como rodar (local)

Precisa de dois terminais.

### 1) Back-end

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

Sobe em `http://127.0.0.1:5000`.

### 2) Front-end

```powershell
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173` (o Vite faz proxy de `/api` e `/static` para o
back-end).

## Configuração

- **WhatsApp da dona:** edite `WHATSAPP_NUMBER` em `backend/config.py` (ou
  defina a variável de ambiente `WHATSAPP_NUMBER`). Formato: DDI + DDD + número,
  ex.: `5511999999999`. O valor atual é um placeholder.
- **Serviços:** edite a lista `SERVICOS` em `backend/data.py`.
- **Imagens:** coloque os arquivos em `backend/static/images/` e ajuste o campo
  `imagem` do serviço. Os arquivos atuais são placeholders em SVG.

## API

| Método | Rota                 | Descrição                              |
| ------ | -------------------- | -------------------------------------- |
| GET    | `/api/health`        | Status do servidor                     |
| GET    | `/api/config`        | Número de WhatsApp configurado         |
| GET    | `/api/services`      | Lista de serviços                      |
| POST   | `/api/appointments`  | Salva um agendamento (valida conflito de horário)
| GET    | `/api/appointments`  | Lista agendamentos (admin interno)     |
| GET    | `/api/availability`  | Slots livres de uma data (`?data=AAAA-MM-DD&duracao_min=60`)

### Exemplo de POST `/api/appointments`

```json
{
  "nome": "Ana",
  "data": "2026-10-10",
  "hora": "14:00",
  "observacao": "Primeira vez",
  "servicos": ["design-sobrancelha", "volume-russo"]
}
```

## Fluxo da cliente

1. Seleciona os serviços desejados nos cards.
2. O resumo aparece numa barra fixa com o total.
3. No formulário, informa nome, data e escolhe um horário livre na lista.
4. Ao enviar: o pedido é salvo no Flask e o WhatsApp abre com a mensagem
   pré-montada.

> O back-end só aceita horários sem conflito: não permite dois agendamentos no
> mesmo horário nem quando outro cliente já está ocupando (duração do serviço
> é respeitada).

> Se o servidor estiver fora do ar, o WhatsApp ainda abre com a mensagem e um
> aviso discreto é exibido.
