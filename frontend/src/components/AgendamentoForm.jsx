import { useEffect, useMemo, useState } from "react";
import { useSelection } from "../context/SelectionContext.jsx";
import {
  createAppointment,
  getAvailability,
} from "../services/api.js";
import { formatBRL, formatDate } from "../utils/format.js";
import { buildMessage, buildWhatsAppLink } from "../utils/whatsapp.js";
import "./AgendamentoForm.css";

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function AgendamentoForm({ services, whatsapp }) {
  const { selected, toggle, clear } = useSelection();
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotsStatus, setSlotsStatus] = useState("idle");

  const chosen = useMemo(
    () => services.filter((s) => selected.includes(s.id)),
    [services, selected]
  );
  const total = chosen.reduce((sum, s) => sum + s.preco, 0);

  useEffect(() => {
    if (!data) {
      setSlots([]);
      setSlotsStatus("idle");
      return;
    }

    const duracaoMin = chosen.reduce((sum, s) => sum + (s.duracao_min || 0), 0);
    let cancelled = false;
    setSlotsStatus("loading");

    getAvailability(data, duracaoMin)
      .then((res) => {
        if (cancelled) return;
        const free = (res.slots || [])
          .filter((slot) => slot.disponivel)
          .map((slot) => slot.hora);
        setSlots(free);
        setHora((prev) => (free.includes(prev) ? prev : ""));
        setSlotsStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setSlotsStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [data, chosen]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    if (chosen.length === 0) {
      setStatus("error");
      setFeedback("Selecione ao menos um serviço acima.");
      return;
    }
    if (nome.trim().length < 2 || !data || !hora) {
      setStatus("error");
      setFeedback("Preencha nome, data e horário.");
      return;
    }

    setStatus("sending");

    const servicos = chosen.map((s) => ({
      id: s.id,
      nome: s.nome,
      preco: s.preco,
    }));

    let warning = "";
    try {
      await createAppointment({ nome, data, hora, observacao, servicos });
    } catch (error) {
      if (error.status) {
        setStatus("error");
        setFeedback(error.message);
        return;
      }
      warning =
        "Não conseguimos registrar no servidor, mas você pode enviar pelo WhatsApp normalmente.";
    }

    const message = buildMessage({ nome, data, hora, servicos });
    window.open(buildWhatsAppLink(whatsapp, message), "_blank", "noopener");

    setStatus("success");
    setFeedback(warning || "Pedido enviado! Continuaremos o atendimento pelo WhatsApp.");
    setNome("");
    setData("");
    setHora("");
    setObservacao("");
    clear();
  }

  return (
    <section id="agendamento" className="section section--soft agendamento">
      <div className="container">
        <div className="agendamento__head">
          <span className="eyebrow">Agendamento</span>
          <h2 className="section-title">Monte o seu pedido</h2>
          <p className="section-subtitle">
            Confira os serviços escolhidos, informe os seus dados e envie a
            mensagem para o nosso WhatsApp.
          </p>
        </div>

        <div className="agendamento__grid">
          <aside className="agendamento__summary">
            <h3>Serviços selecionados</h3>

            {chosen.length === 0 ? (
              <p className="agendamento__empty">
                Nenhum serviço selecionado ainda. Escolha acima na seção de
                serviços.
              </p>
            ) : (
              <ul className="agendamento__list">
                {chosen.map((servico) => (
                  <li key={servico.id}>
                    <div>
                      <span className="agendamento__item-name">
                        {servico.nome}
                      </span>
                      <span className="agendamento__item-price">
                        {formatBRL(servico.preco)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="agendamento__remove"
                      onClick={() => toggle(servico.id)}
                      aria-label={`Remover ${servico.nome}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="agendamento__total">
              <span>Total</span>
              <strong>{formatBRL(total)}</strong>
            </div>
          </aside>

          <form className="agendamento__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nome">Seu nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como podemos te chamar?"
                autoComplete="name"
                required
              />
            </div>

            <div className="agendamento__row">
              <div className="field">
                <label htmlFor="data">Data</label>
                <input
                  id="data"
                  type="date"
                  value={data}
                  min={todayISO()}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="hora">Horário</label>
                {slotsStatus === "loading" ? (
                  <p className="field__hint">Carregando horários...</p>
                ) : slotsStatus === "error" ? (
                  <p className="field__hint">
                    Não foi possível carregar os horários. Tente novamente.
                  </p>
                ) : slots.length === 0 ? (
                  <p className="field__hint">
                    Nenhum horário disponível para essa data.
                  </p>
                ) : (
                  <select
                    id="hora"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  >
                    <option value="">Selecione um horário</option>
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="observacao">Observação (opcional)</label>
              <textarea
                id="observacao"
                rows={3}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Alguma preferência ou informação extra?"
              />
            </div>

            {feedback && (
              <p
                className={`agendamento__feedback agendamento__feedback--${status}`}
                role="status"
              >
                {feedback}
              </p>
            )}

            {chosen.length > 0 && (
              <p className="agendamento__preview">
                Enviaremos: {chosen.map((s) => s.nome).join(", ")}
                {data && hora
                  ? ` — ${formatDate(data)} às ${hora}`
                  : ""}
              </p>
            )}

            <button
              type="submit"
              className="btn btn--primary agendamento__submit"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Enviando..."
                : "Enviar pelo WhatsApp"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
