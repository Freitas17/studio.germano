import { useState } from "react";
import { imageUrl } from "../services/api.js";
import "./Contato.css";

export default function Contato({ whatsapp }) {
  const [erroLogo, setErroLogo] = useState(false);
  const digits = String(whatsapp || "").replace(/\D/g, "");
  const waLink = digits ? `https://wa.me/${digits}` : "#";

  return (
    <footer id="contato" className="contato">
      <div className="container contato__inner">
        <div className="contato__brand">
          {erroLogo ? (
            <p className="contato__logo">
              Geeh<span>.</span>
            </p>
          ) : (
            <img
              className="contato__logo-img"
              src={imageUrl("logo.png")}
              alt="Germano Estética Studio"
              loading="lazy"
              onError={() => setErroLogo(true)}
            />
          )}
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
          <p>Segunda, Sexta e Sábado</p>
          <p>08:00 — 19:00</p>
          <p>Terça a Quinta</p>
          <p>08:00 — 15:00</p>
        </div>
      </div>

      <div className="container contato__bottom">
        <span>© {new Date().getFullYear()} Geeh Estética. Todos os direitos reservados.</span>
        <a href="#inicio">Voltar ao topo</a>
      </div>
    </footer>
  );
}
