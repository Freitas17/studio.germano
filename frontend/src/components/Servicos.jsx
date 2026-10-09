import ServicoCard from "./ServicoCard.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import "./Servicos.css";

export default function Servicos({ services, loading, error }) {
  const { selected } = useSelection();

  return (
    <section id="servicos" className="section servicos">
      <div className="container">
        <div className="servicos__head">
          <div>
            <span className="eyebrow">Nossos serviços</span>
            <h2 className="section-title">Escolha o seu cuidado</h2>
          </div>
          <p className="section-subtitle">
            Selecione um ou mais serviços e envie o seu pedido de agendamento
            direto para o nosso WhatsApp.
          </p>
        </div>

        {loading && <p className="state">Carregando serviços...</p>}
        {error && <p className="state state--error">{error}</p>}

        {!loading && !error && (
          <div className="servicos__grid">
            {services.map((servico) => (
              <ServicoCard key={servico.id} servico={servico} />
            ))}
          </div>
        )}

        {selected.length > 0 && (
          <p className="servicos__hint">
            {selected.length} serviço{selected.length > 1 ? "s" : ""}{" "}
            selecionado{selected.length > 1 ? "s" : ""} — finalize no formulário
            abaixo.
          </p>
        )}
      </div>
    </section>
  );
}
