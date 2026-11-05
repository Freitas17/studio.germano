import { useEffect, useState } from "react";
import { getConfig, getServices } from "./services/api.js";
import { SelectionProvider } from "./context/SelectionContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Sobre from "./components/Sobre.jsx";
import Servicos from "./components/Servicos.jsx";
import AgendamentoForm from "./components/AgendamentoForm.jsx";
import Contato from "./components/Contato.jsx";
import SelecaoTray from "./components/SelecaoTray.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

export default function App() {
  const [services, setServices] = useState([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([getServices(), getConfig()])
      .then(([servicesData, configData]) => {
        if (!active) return;
        setServices(servicesData);
        setWhatsapp(configData.whatsapp_number);
        setSchedule({
          businessDays: configData.business_days || [0, 1, 2, 3, 4, 5],
          businessHours: configData.business_hours || {},
          maxAdvanceDays: configData.max_advance_days ?? 60,
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SelectionProvider>
      <Navbar />
      <main>
        <Hero />
        <Sobre />
        <Servicos services={services} loading={loading} error={error} />
        <AgendamentoForm
          services={services}
          whatsapp={whatsapp}
          schedule={schedule}
        />
      </main>
      <Contato whatsapp={whatsapp} />
      <SelecaoTray services={services} />
      <WhatsAppButton whatsapp={whatsapp} />
    </SelectionProvider>
  );
}
