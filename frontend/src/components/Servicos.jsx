import ServicoCard from "./ServicoCard.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import "./Servicos.css";

export default function Servicos({ services, loading, error }) {
  const { selected } = useSelection();

  const principais = services.filter(
    (servico) => servico.tipo !== "manutencao" && servico.tipo !== "opcao"
  );

  const manutencoesPorBase = services.reduce((map, servico) => {
    if (servico.tipo === "manutencao" && servico.base_id) {
      if (!map[servico.base_id]) map[servico.base_id] = [];
      map[servico.base_id].push(servico);
    }
    return map;
  }, {});

  const opcoesPorBase = services.reduce((map, servico) => {
    if (servico.tipo === "opcao" && servico.base_id) {
      if (!map[servico.base_id]) map[servico.base_id] = [];
      map[servico.base_id].push(servico);
    }
    return map;
  }, {});

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
            {principais.map((servico) => (
              <ServicoCard
                key={servico.id}
                servico={servico}
                manutencoes={manutencoesPorBase[servico.id] || []}
                opcoes={opcoesPorBase[servico.id] || []}
              />
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
