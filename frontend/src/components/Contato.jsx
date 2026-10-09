import "./Contato.css";

export default function Contato({ whatsapp }) {
  const digits = String(whatsapp || "").replace(/\D/g, "");
  const waLink = digits ? `https://wa.me/${digits}` : "#";

  return (
    <footer id="contato" className="contato">
      <div className="container contato__inner">
        <div className="contato__brand">
          <p className="contato__logo">
            Geeh<span>.</span>
          </p>
          <p className="contato__tag">
            Sobrancelhas &amp; Cílios — realce o seu olhar.
          </p>
        </div>

        <div className="contato__block">
          <h3>Contato</h3>
          <a href={waLink} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href="mailto:contato@geeh.com">contato@geeh.com</a>
          <a href="https://www.instagram.com/studio.germano/" aria-label="Instagram">
            @studio.germano
          </a>
        </div>

        <div className="contato__block">
          <h3>Horário</h3>
          <p>Terça a Sábado</p>
          <p>09:00 — 19:00</p>
        </div>
      </div>

      <div className="container contato__bottom">
        <span>© {new Date().getFullYear()} Geeh Estética. Todos os direitos reservados.</span>
        <a href="#inicio">Voltar ao topo</a>
      </div>
    </footer>
  );
}
