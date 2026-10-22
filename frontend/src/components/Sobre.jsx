import { useState } from "react";
import { imageUrl } from "../services/api.js";
import "./Sobre.css";

const DESTAQUES = [
  {
    titulo: "Lash Designer",
    texto: "Extensão de cílios e lift com técnicas atuais, fios leves e resultado natural.",
  },
  {
    titulo: "Designer de Sobrancelhas",
    texto: "Mapeamento personalizado que valoriza o formato do seu rosto e do seu olhar.",
  },
  {
    titulo: "Base em Biomedicina",
    texto: "Estudante de Biomedicina, o que amplia meu cuidado com higiene, pele e segurança.",
  },
];

const TRAJETORIA = [
  {
    periodo: "Formação",
    titulo: "Especialização",
    texto:
      "Cursos de especialização em Lash Design e Design de Sobrancelhas, sempre buscando aprimorar as técnicas.",
  },
  {
    periodo: "2025",
    titulo: "O novo caminho",
    texto:
      "Deixei o CLT para investir de verdade no meu próprio sonho e na carreira que eu sempre quis construir.",
  },
  {
    periodo: "2026",
    titulo: "Início dos atendimentos",
    texto:
      "Comecei oficialmente a receber minhas clientes e a dar os primeiros passos da minha carreira na beleza.",
  },
];

export default function Sobre() {
  const [erroFoto, setErroFoto] = useState(false);

  return (
    <section id="sobre" className="section section--soft sobre">
      <div className="container sobre__inner">
        <div className="sobre__photo">
          <span className="sobre__photo-ring" aria-hidden="true" />
          {erroFoto ? (
            <div className="sobre__photo-fallback">G</div>
          ) : (
            <img
              src={imageUrl("Germano.jpeg")}
              alt="Dona do estúdio Geeh"
              loading="lazy"
              onError={() => setErroFoto(true)}
            />
          )}
          <span className="sobre__badge">Lash Designer · Sobrancelhas</span>
        </div>

        <div className="sobre__content">
          <span className="eyebrow">Sobre mim</span>
          <h2 className="section-title">
            Beleza e autoestima,
            <br />
            cuidado em cada detalhe
          </h2>
          <p className="section-subtitle">
            Sou profissional de Lash Designer e Designer de Sobrancelhas,
            apaixonada por realçar a beleza e a autoestima de cada cliente.
          </p>

          <div className="sobre__text">
            <p>
              Minha trajetória na área da beleza começou com a realização de
              cursos de especialização em Lash Design e Design de Sobrancelhas,
              buscando sempre aprimorar minhas técnicas e oferecer um
              atendimento cada vez melhor.
            </p>
            <p>
              Em 2025, decidi sair do CLT para seguir um novo caminho
              profissional e investir no meu próprio sonho. Em 2026, comecei
              oficialmente meus atendimentos, dando os primeiros passos na
              construção da minha carreira na área da beleza.
            </p>
            <p>
              Além da minha profissão, sou estudante de Biomedicina, área que
              também contribui para o meu crescimento e conhecimento
              profissional.
            </p>
          </div>

          <div className="sobre__goal">
            <span className="sobre__goal-label">Meu objetivo</span>
            <p>
              Construir uma carreira sólida, continuar me aperfeiçoando e
              transformar cada atendimento em uma experiência de beleza, cuidado
              e autoestima.
            </p>
          </div>
        </div>
      </div>

      <div className="container sobre__timeline">
        {TRAJETORIA.map((item) => (
          <div key={item.periodo} className="sobre__step">
            <span className="sobre__step-period">{item.periodo}</span>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>

      <div className="container sobre__cards">
        {DESTAQUES.map((item) => (
          <div key={item.titulo} className="sobre__card">
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
