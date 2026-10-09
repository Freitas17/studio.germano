import "./Sobre.css";

const DESTAQUES = [
  { titulo: "Atendimento personalizado", texto: "Cada olhar é único e recebido com atenção individual." },
  { titulo: "Materiais de qualidade", texto: "Produtos profissionais e técnicas atuais para um resultado delicado." },
  { titulo: "Ambiente acolhedor", texto: "Um espaço pensado para o seu conforto e bem-estar." },
];

export default function Sobre() {
  return (
    <section id="sobre" className="section section--soft sobre">
      <div className="container sobre__inner">
        <div className="sobre__intro">
          <span className="eyebrow">Sobre o estúdio</span>
          <h2 className="section-title">
            Beleza natural, feita com carinho
          </h2>
          <p className="section-subtitle">
            No estúdio Geeh acreditamos que sobrancelhas e cílios bem feitos
            transformam a expressão do olhar. Trabalhamos com técnicas
            personalizadas para realçar o que você já tem de mais bonito.
          </p>
        </div>

        <div className="sobre__cards">
          {DESTAQUES.map((item) => (
            <div key={item.titulo} className="sobre__card">
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
