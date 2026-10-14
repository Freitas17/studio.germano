import "./Hero.css";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">Sobrancelhas &amp; Cílios</span>
          <h1 className="hero__title">
            Realce o seu olhar,
            <br />
            realce você.
          </h1>
          <p className="hero__text">
            Design de sobrancelhas e extensão de cílios feitos com cuidado e
            delicadeza, para valorizar a sua beleza natural.
          </p>
          <div className="hero__actions">
            <a href="#agendamento" className="btn btn--primary">
              Agendar horário
            </a>
            <a href="#servicos" className="btn btn--ghost">
              Ver serviços
            </a>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__circle hero__circle--outer" />
          <div className="hero__circle hero__circle--inner" />
          <span className="hero__monogram">G</span>
        </div>
      </div>
    </section>
  );
}
