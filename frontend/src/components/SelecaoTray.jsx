import { useSelection } from "../context/SelectionContext.jsx";
import { formatBRL } from "../utils/format.js";
import "./SelecaoTray.css";

export default function SelecaoTray({ services }) {
  const { selected, clear } = useSelection();

  if (selected.length === 0) return null;

  const chosen = services.filter((s) => selected.includes(s.id));
  const total = chosen.reduce((sum, s) => sum + s.preco, 0);

  return (
    <div className="tray">
      <div className="tray__inner">
        <div className="tray__info">
          <span className="tray__count">
            {chosen.length} serviço{chosen.length > 1 ? "s" : ""}
          </span>
          <span className="tray__total">{formatBRL(total)}</span>
        </div>

        <div className="tray__actions">
          <button type="button" className="tray__clear" onClick={clear}>
            Limpar
          </button>
          <a href="#agendamento" className="btn btn--primary">
            Agendar
          </a>
        </div>
      </div>
    </div>
  );
}
