import { imageUrl } from "../services/api.js";
import { formatBRL } from "../utils/format.js";
import { useSelection } from "../context/SelectionContext.jsx";
import "./ServicoCard.css";

const FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%23f7dde4'/></svg>";

export default function ServicoCard({ servico }) {
  const { isSelected, toggle } = useSelection();
  const selected = isSelected(servico.id);

  return (
    <article className={`card ${selected ? "card--selected" : ""}`}>
      <div className="card__media">
        <img
          src={imageUrl(servico.imagem)}
          alt={servico.nome}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK;
          }}
        />
        <span className="card__duration">{servico.duracao}</span>
      </div>

      <div className="card__body">
        <h3 className="card__title">{servico.nome}</h3>
        <p className="card__desc">{servico.descricao}</p>

        <div className="card__footer">
          <span className="card__price">{formatBRL(servico.preco)}</span>
          <button
            type="button"
            className={`card__select ${selected ? "is-selected" : ""}`}
            onClick={() => toggle(servico.id)}
            aria-pressed={selected}
          >
            {selected ? "Selecionado" : "Selecionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
