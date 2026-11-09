import { imageUrl } from "../services/api.js";
import { formatBRL } from "../utils/format.js";
import { useSelection } from "../context/SelectionContext.jsx";
import "./ServicoCard.css";

const FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='%23f7dde4'/></svg>";

export default function ServicoCard({ servico, manutencoes = [], opcoes = [] }) {
  const { isSelected, toggleExclusive } = useSelection();
  const groupIds = [
    servico.id,
    ...opcoes.map((item) => item.id),
    ...manutencoes.map((item) => item.id),
  ];
  const selected = groupIds.some((id) => isSelected(id));

  return (
    <article
      className={`card ${selected ? "card--selected" : ""} ${
        opcoes.length > 0 ? "card--options" : ""
      }`}
    >
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
          <span className="card__price">
            {opcoes.length > 0
              ? `A partir de ${formatBRL(servico.preco)}`
              : formatBRL(servico.preco)}
          </span>
          <div className="card__actions">
            {opcoes.length > 0
              ? opcoes.map((opcao) => {
                  const opcaoSelecionada = isSelected(opcao.id);
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      className={`card__select ${
                        opcaoSelecionada ? "is-selected" : ""
                      }`}
                      onClick={() => toggleExclusive(opcao.id, groupIds)}
                      aria-pressed={opcaoSelecionada}
                    >
                      {opcao.nome} · {formatBRL(opcao.preco)}
                    </button>
                  );
                })
              : (
                <button
                  type="button"
                  className={`card__select ${selected ? "is-selected" : ""}`}
                  onClick={() => toggleExclusive(servico.id, groupIds)}
                  aria-pressed={selected}
                >
                  {selected ? "Selecionado" : "Selecionar"}
                </button>
              )}
            {manutencoes.map((manutencao) => {
              const manutencaoSelecionada = isSelected(manutencao.id);
              return (
                <button
                  key={manutencao.id}
                  type="button"
                  className={`card__maintenance ${
                    manutencaoSelecionada ? "is-selected" : ""
                  }`}
                  onClick={() => toggleExclusive(manutencao.id, groupIds)}
                  aria-pressed={manutencaoSelecionada}
                >
                  {manutencaoSelecionada
                    ? "Manutenção selecionada"
                    : `Manutenção · ${formatBRL(manutencao.preco)}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
